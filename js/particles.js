// Efecto de partículas
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = window.innerWidth < 768 ? 15 : 30;
    const colors = [
        'rgba(106, 17, 203, 0.8)',
        'rgba(37, 117, 252, 0.8)',
        'rgba(255, 75, 31, 0.8)',
        'rgba(0, 198, 255, 0.8)'
    ];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Tamaño aleatorio entre 3px y 8px
        const size = Math.random() * 5 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Color aleatorio
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        
        // Posición aleatoria
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.bottom = `-${size}px`;
        
        // Duración de animación aleatoria
        const duration = Math.random() * 15 + 10;
        particle.style.animationDuration = `${duration}s`;
        
        // Retraso aleatorio
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        // Opacidad aleatoria
        particle.style.opacity = Math.random() * 0.5 + 0.3;
        
        // Tipo de animación (algunas girarán)
        if (Math.random() > 0.5) {
            particle.style.animationName = 'float, rotate';
        }
        
        particlesContainer.appendChild(particle);
    }
}

// Crear partículas cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', createParticles);

// Recrear partículas al cambiar el tamaño de la ventana (para ajustar cantidad)
window.addEventListener('resize', function() {
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        particlesContainer.innerHTML = '';
        createParticles();
    }
});