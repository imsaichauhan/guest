// Animation helper functions

// Create confetti effect
function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Random position, color and delay
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.animationDelay = Math.random() + 's';
        
        document.body.appendChild(confetti);
        
        // Remove confetti element after animation completes
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Get random color for confetti
function getRandomColor() {
    const colors = ['#ff6b6b', '#4ecdc4', '#ffbe0b', '#a786df', '#38b000'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Add floating animation to elements
function addFloatingAnimation(element) {
    if (!element) return;
    
    element.style.animation = 'float 3s ease-in-out infinite';
    element.style.position = 'relative';
}

// Add pulse animation to elements
function addPulseAnimation(element) {
    if (!element) return;
    
    element.classList.add('pulse-animation');
}

// Add fade-in animation to elements
function addFadeInAnimation(element, delay = 0) {
    if (!element) return;
    
    element.style.opacity = '0';
    element.style.animation = `fadeIn 1s ease forwards ${delay}s`;
}

// Add sequenced animations to multiple elements
function addSequenceAnimation(elements, animationClass, delay = 0.2) {
    if (!elements || elements.length === 0) return;
    
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add(animationClass);
        }, index * (delay * 1000));
    });
}

// Initialize animations when sections become visible
document.addEventListener('DOMContentLoaded', () => {
    // Add pulse animation to reveal button
    const revealButton = document.getElementById('reveal-surprise');
    if (revealButton) {
        addPulseAnimation(revealButton);
    }
    
    // Add event listener for surprise button click
    if (revealButton) {
        revealButton.addEventListener('click', () => {
            const detailItems = document.querySelectorAll('.detail-item');
            addSequenceAnimation(detailItems, 'fade-in', 0.3);
        });
    }
});
