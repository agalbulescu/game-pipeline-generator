from flask import Blueprint, render_template, session, request, jsonify
from .utils import login_required
from .pipeline import PipelineGenerator

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    if 'username' not in session:
        return render_template('login.html')
    return render_template('dashboard.html')

@bp.route('/login')
def login():
    # This is just to handle the redirect if someone tries to access /login directly
    return redirect(url_for('main.index'))

@bp.route('/generate', methods=['POST'])
@login_required
def generate():
    data = request.json
    generator = PipelineGenerator()
    pipeline = generator.generate(
        data['games'],
        data.get('branch', 'main')
    )
    return jsonify({'pipeline': pipeline})