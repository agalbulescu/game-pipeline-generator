from flask import Blueprint, request, jsonify, Response, current_app
import yaml
import requests
import os
import json
import time
from collections import defaultdict

bp = Blueprint('api', __name__, url_prefix='/api/v1')

# Configuration
GITLAB_URL = os.getenv('GITLAB_URL', 'https://gitlab.com')
GITLAB_TOKEN = os.getenv('GITLAB_TOKEN')
PROJECT_ID = os.getenv('PROJECT_ID')
MAX_CONCURRENT = 5  # Job concurrency limit

def generate_test_script(game, suites):
    """Generate pytest commands for specific game and test suites"""
    script = [f'echo "Running {game} tests"']
    pytest_commands = []
    
    for suite in suites:
        if suite == 'all':
            pytest_commands.append(f'pytest tests/{game}')
            break  # 'all' overrides other options
            
        elif suite == 'desktop':
            pytest_commands.append(f'pytest tests/{game}/desktop')
            
        elif suite == 'mobile':
            pytest_commands.append(f'pytest tests/{game}/mobile')
            
        elif suite == 'payouts':
            pytest_commands.append(f'pytest tests/{game} -k "payouts"')
            
        elif suite == 'ui':
            pytest_commands.append(f'pytest tests/{game} -m "ui"')
            
        elif suite == 'analytics':
            pytest_commands.append(f'pytest tests/{game} -m "analytics"')
            
        elif suite == 'smapp':
            pytest_commands.append(f'pytest tests/{game}/desktop -k "smapp"')
            
        elif suite.startswith('desktop_'):
            test_type = suite.split('_')[1]
            flag = '-m' if test_type in ['ui', 'analytics'] else '-k'
            pytest_commands.append(f'pytest tests/{game}/desktop {flag} "{test_type}"')
            
        elif suite.startswith('mobile_'):
            test_type = suite.split('_')[1]
            flag = '-m' if test_type in ['ui', 'analytics'] else '-k'
            pytest_commands.append(f'pytest tests/{game}/mobile {flag} "{test_type}"')

    if not pytest_commands:
        pytest_commands.append(f'pytest tests/{game}')

    script.append('echo "Running commands:"')
    for cmd in pytest_commands:
        script.append(f'{cmd} --junitxml=reports/results_{game}.xml || true')
    
    return script

def generate_pipeline_yml(selected_games, branch='main'):
    """Generate complete GitLab CI pipeline YAML"""
    parsed_games = defaultdict(list)
    for entry in selected_games:
        if not entry.strip():
            continue
        parts = entry.strip().split(':')
        game = parts[0]
        suites = parts[1:] if len(parts) > 1 else []
        parsed_games[game].extend(suites)

    pipeline = {
        'variables': {
            'SELECTED_GAMES': ','.join(selected_games),
            'TARGET_BRANCH': branch
        },
        'stages': ['notify_start', 'test', 'rerun_failed', 'notify_end']
    }

    # Generate test jobs
    test_jobs = {}
    for idx, (game, suites) in enumerate(parsed_games.items()):
        group_num = idx % MAX_CONCURRENT + 1
        job_name = f"test_{game.replace('-', '_')}"
        
        test_jobs[job_name] = {
            'stage': 'test',
            'resource_group': f"game_group_{group_num}",
            'script': generate_test_script(game, suites),
            'rules': [{
                'if': f'$SELECTED_GAMES =~ /{game}/',
                'when': 'always'
            }],
            'artifacts': {
                'when': 'always',
                'paths': [f'reports/results_{game}.xml']
            }
        }

    # Add supporting jobs
    test_jobs.update({
        'notify_start': {
            'stage': 'notify_start',
            'script': 'echo "Pipeline started"',
            'rules': [{'if': '$CI_PIPELINE_SOURCE == "web"'}]
        },
        'rerun_failed': {
            'stage': 'rerun_failed',
            'script': [
                'mkdir -p combined_reports',
                'cat reports/results_*.xml > combined_reports/all_results.xml || true',
                'failed_tests=$(xmllint --xpath "//testcase[./failure]/@name" combined_reports/all_results.xml 2>/dev/null | sed -E \'s/name=\\"([^\\"]+)\\"/\\1/g\' | tr "\\n" " ")',
                'if [ -n "$failed_tests" ]; then',
                '  pytest -k "$failed_tests" --junitxml=reports/rerun_results.xml || true',
                'else',
                '  echo "No failed tests to re-run"',
                '  touch reports/rerun_results.xml',
                'fi',
                'zip -r reports/test_results_bundle.zip reports/*.xml combined_reports/*.xml || true'
            ],
            'dependencies': list(test_jobs.keys()),
            'artifacts': {
                'when': 'always',
                'paths': ['reports/rerun_results.xml', 'reports/test_results_bundle.zip']
            }
        },
        'notify_end': {
            'stage': 'notify_end',
            'script': 'echo "Pipeline finished"',
            'rules': [{'if': '$CI_PIPELINE_SOURCE == "web"'}]
        }
    })

    pipeline.update(test_jobs)
    return yaml.dump(pipeline, sort_keys=False, width=float("inf"))

@bp.route('/generate', methods=['POST'])
def handle_generate():
    try:
        data = request.get_json()
        if not data or 'games' not in data:
            return jsonify({'error': 'Missing games data'}), 400
            
        pipeline_yml = generate_pipeline_yml(
            data['games'],
            data.get('branch', 'main')
        )
        return jsonify({
            'status': 'success',
            'pipeline': pipeline_yml
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@bp.route('/trigger', methods=['POST'])
def handle_trigger():
    try:
        data = request.get_json()
        if not data or 'pipeline' not in data:
            return jsonify({'error': 'Missing pipeline data'}), 400

        response = requests.post(
            f"{GITLAB_URL}/api/v4/projects/{PROJECT_ID}/pipeline",
            headers={"PRIVATE-TOKEN": GITLAB_TOKEN},
            json={
                'ref': data.get('branch', 'main'),
                'variables': [{
                    'key': 'SELECTED_GAMES',
                    'value': data['pipeline']['variables']['SELECTED_GAMES']
                }]
            }
        )

        if response.status_code != 201:
            return jsonify({
                'status': 'error',
                'message': f"GitLab API error: {response.text}"
            }), 400

        return jsonify({
            'status': 'success',
            'pipeline_id': response.json()['id'],
            'web_url': response.json()['web_url']
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@bp.route('/status/<int:pipeline_id>')
def pipeline_status(pipeline_id):
    def generate_events():
        try:
            while True:
                # Get pipeline status
                pipeline_res = requests.get(
                    f"{GITLAB_URL}/api/v4/projects/{PROJECT_ID}/pipelines/{pipeline_id}",
                    headers={"PRIVATE-TOKEN": GITLAB_TOKEN}
                )
                
                if pipeline_res.status_code != 200:
                    yield 'data: {"error": "Pipeline not found"}\n\n'
                    break
                
                # Get jobs status
                jobs_res = requests.get(
                    f"{GITLAB_URL}/api/v4/projects/{PROJECT_ID}/pipelines/{pipeline_id}/jobs",
                    headers={"PRIVATE-TOKEN": GITLAB_TOKEN}
                )
                
                jobs = jobs_res.json() if jobs_res.status_code == 200 else []
                completed = sum(1 for j in jobs if j['status'] in ['success', 'failed'])
                progress = int((completed / len(jobs)) * 100) if jobs else 0
                
                status_data = {
                    'id': pipeline_id,
                    'status': pipeline_res.json()['status'],
                    'progress': progress,
                    'web_url': pipeline_res.json()['web_url']
                }
                yield f"data: {json.dumps(status_data)}\n\n"
                
                if pipeline_res.json()['status'] in ['success', 'failed', 'canceled']:
                    break
                
                time.sleep(5)
        except Exception as e:
            yield f'data: {{"error": "{str(e)}"}}\n\n'
    
    return Response(generate_events(), mimetype='text/event-stream')