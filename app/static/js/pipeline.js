class PipelineManager {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('generate-pipeline')?.addEventListener('click', () => {
            this.handlePipelineGeneration();
        });
    }

    async handlePipelineGeneration() {
        const branch = document.getElementById('branch-select').value;
        const selectedGames = this.getSelectedGames();
        
        if (!selectedGames.length) {
            this.showStatus('Please select at least one game', 'error');
            return;
        }

        try {
            this.showStatus('Generating pipeline...', 'info');
            
            // Step 1: Generate pipeline config
            const generateResponse = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken()
                },
                body: JSON.stringify({
                    games: selectedGames,
                    branch: branch
                })
            });

            if (!generateResponse.ok) {
                throw new Error('Failed to generate pipeline');
            }

            const pipelineConfig = await generateResponse.json();
            
            // Step 2: Trigger pipeline
            this.showStatus('Triggering pipeline...', 'info');
            const triggerResponse = await fetch('/trigger', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken()
                },
                body: JSON.stringify({
                    config: pipelineConfig,
                    branch: branch
                })
            });

            if (!triggerResponse.ok) {
                throw new Error('Failed to trigger pipeline');
            }

            const result = await triggerResponse.json();
            this.showStatus(`Pipeline #${result.pipeline_id} started!`, 'success');
            this.monitorPipeline(result.pipeline_id);
            
        } catch (error) {
            console.error('Pipeline error:', error);
            this.showStatus(`Error: ${error.message}`, 'error');
        }
    }

    getSelectedGames() {
        const outputText = document.getElementById('output-text').value;
        return outputText.split(',')
            .filter(entry => entry.trim())
            .map(entry => entry.trim());
    }

    getCSRFToken() {
        return document.querySelector('meta[name="csrf-token"]')?.content || '';
    }

    showStatus(message, type = 'info') {
        const statusElement = document.getElementById('pipeline-status');
        statusElement.innerHTML = `<div class="status-${type}">${message}</div>`;
        statusElement.scrollIntoView({ behavior: 'smooth' });
    }

    monitorPipeline(pipelineId) {
        const eventSource = new EventSource(`/pipeline-status/${pipelineId}`);
        
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.updatePipelineStatus(data);
        };

        eventSource.onerror = () => {
            this.showStatus('Pipeline status connection lost', 'warning');
            eventSource.close();
        };
    }

    updatePipelineStatus(data) {
        const statusElement = document.getElementById('pipeline-status');
        
        if (data.status === 'running') {
            statusElement.innerHTML = `
                <div class="status-info">
                    Pipeline ${data.id} is running
                    <div class="progress-bar">
                        <div class="progress" style="width: ${data.progress}%"></div>
                    </div>
                </div>
            `;
        }
        // Add other status cases (success, failed, etc.)
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PipelineManager();
});