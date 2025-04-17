document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    
    generateBtn.addEventListener('click', async () => {
        const branch = document.getElementById('branch-select').value;
        const selectedGames = getSelectedGames(); // Implement this based on your HTML
        
        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    games: selectedGames,
                    branch: branch
                })
            });
            
            const data = await response.json();
            // Handle pipeline generation response
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

function getSelectedGames() {
    // Implement based on your game selection logic
    return [];
}