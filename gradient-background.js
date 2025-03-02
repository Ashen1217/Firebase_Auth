/**
 * Enhanced background gradient effects
 * This provides a subtle animated background without particles
 */

document.addEventListener('DOMContentLoaded', function() {
    // Update gradient colors based on theme
    const updateGradient = (isDark) => {
        const body = document.body;
        if (isDark) {
            body.style.background = `linear-gradient(135deg, 
                var(--dark-bg), 
                #0d1b40, 
                #182550, 
                #111a33, 
                #1c2645)`;
        } else {
            body.style.background = `linear-gradient(135deg, 
                var(--light-bg), 
                #e8eeff, 
                #f5f8ff, 
                #edf1fd, 
                #ffffff)`;
        }
        body.style.backgroundSize = "400% 400%";
    };
    
    // Initialize based on current theme
    updateGradient(document.body.classList.contains('dark-theme'));
    
    // Listen for theme changes
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
        themeSwitch.addEventListener('change', () => {
            const isDark = !themeSwitch.checked;
            updateGradient(isDark);
        });
    }
    
    // Enhance shape animations
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        // Add subtle translate movements based on mouse position
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const offsetX = (mouseX - 0.5) * 15 * (index + 1);
            const offsetY = (mouseY - 0.5) * 15 * (index + 1);
            
            shape.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
    });
});
