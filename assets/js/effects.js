// effects.js
(function() {
    // DOM Elements
    const siteHeader = document.getElementById('site-header');
    const factsContainer = document.getElementById('facts-container');
    const backToTopBtn = document.getElementById('back-to-top');
    
    // Fun facts about the birthday person
    const funFacts = [
        "They can solve a Rubik's cube in under 2 minutes!",
        "Her favorite lays is yellow (controversial, we know)",
        "They've visited 15 countries and counting!",
        "They once met their favorite celebrity at a coffee shop",
        "They can recite the first 50 digits of Pi from memory"
    ];
    
    // Previous scroll position
    let lastScrollPosition = 0;
    
    // Handle scroll events
    function handleScroll() {
        const currentScrollPosition = window.pageYOffset;
        
        // Toggle header visibility
        if (currentScrollPosition > 100) {
            if (currentScrollPosition > lastScrollPosition) {
                // Scrolling down
                siteHeader.classList.add('hidden');
            } else {
                // Scrolling up
                siteHeader.classList.remove('hidden');
            }
        }
        lastScrollPosition = currentScrollPosition;
    }
    
    // Display fun facts with fade-in effect
    function displayFunFacts() {
        let currentFactIndex = 0;
        
        function showNextFact() {
            const fact = funFacts[currentFactIndex];
            
            // Create a new paragraph element to hold the fact
            const factElement = document.createElement('p');
            factElement.className = 'fact-text';
            factElement.textContent = fact;
            
            // Clear the container and add the new fact
            factsContainer.innerHTML = '';
            factsContainer.appendChild(factElement);
            
            // Prepare for next fact
            currentFactIndex = (currentFactIndex + 1) % funFacts.length;
            
            // Wait before showing the next fact
            setTimeout(showNextFact, 6000);
        }
        
        // Start the fun fact rotation
        showNextFact();
    }
    
    // Scroll to top functionality (used by the back-to-top button)
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Create balloon container function
    function createBalloonContainer() {
        // Create balloon container if it doesn't exist
        let balloonContainer = document.getElementById('balloon-container');
        if (!balloonContainer) {
            balloonContainer = document.createElement('div');
            balloonContainer.id = 'balloon-container';
            balloonContainer.style.position = 'fixed';
            balloonContainer.style.width = '100%';
            balloonContainer.style.height = '100%';
            balloonContainer.style.top = '0';
            balloonContainer.style.left = '0';
            balloonContainer.style.pointerEvents = 'none';
            balloonContainer.style.zIndex = '1';
            document.body.appendChild(balloonContainer);
        }
        return balloonContainer;
    }
    
    // Generate random balloons function
    function generateBalloons() {
        const balloonContainer = createBalloonContainer();
        const balloonCount = Math.floor(Math.random() * 5) + 8; // 8-12 balloons
        
        // Balloon colors array
        const balloonColors = [
            'radial-gradient(circle, #FFB6C1, #FF69B4)', // Pink
            'radial-gradient(circle, #ADD8E6, #1E90FF)', // Blue
            'radial-gradient(circle, #90EE90, #32CD32)', // Green
            'radial-gradient(circle, #FFFFE0, #FFFF00)', // Yellow
            'radial-gradient(circle, #FFA07A, #FF4500)', // Orange
            'radial-gradient(circle, #D8BFD8, #9370DB)'  // Purple
        ];
        
        // Create balloons
        for (let i = 0; i < balloonCount; i++) {
            createBalloon(balloonContainer, balloonColors);
        }
        
        // Add new balloons periodically
        setInterval(() => {
            // Add 1-3 new balloons every 2-5 seconds
            const newBalloons = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < newBalloons; i++) {
                createBalloon(balloonContainer, balloonColors);
            }
        }, Math.random() * 4000 + 4000);
    }
    
    // Create a single balloon with random properties
    function createBalloon(container, colors) {
        // Create balloon element
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        
        // Random position (left)
        const leftPosition = Math.random() * 90 + 5; // 5-95%
        balloon.style.left = `${leftPosition}%`;
        
        // Random size (width and height proportional)
        const size = Math.random() * 30 + 30; // 30-60px width
        balloon.style.width = `${size}px`;
        balloon.style.height = `${size * 1.5}px`; // Height is 1.5x width
        
        // Random color from color array
        const colorIndex = Math.floor(Math.random() * colors.length);
        balloon.style.background = colors[colorIndex];
        
        // Random opacity
        balloon.style.opacity = (Math.random() * 0.4 + 0.6).toFixed(2); // 0.6-1.0
        
        // Random animation duration - increased to allow balloons to travel higher
        const duration = Math.random() * 15 + 20; // 20-35 seconds for longer travel
        balloon.style.animationDuration = `${duration}s`;
        
        // Random animation delay
        const delay = 0; // No delay for instant appearance
        balloon.style.animationDelay = `${delay}s`;
        
        // Add small string to bottom of balloon
        const string = document.createElement('div');
        string.style.position = 'absolute';
        string.style.width = '1px';
        string.style.height = `${size * 0.5}px`;
        string.style.backgroundColor = '#888';
        string.style.bottom = `-${size * 0.5}px`;
        string.style.left = '50%';
        string.style.transform = 'translateX(-50%)';
        balloon.appendChild(string);
        
        // Remove balloon after animation completes
        balloon.addEventListener('animationend', function() {
            if (container.contains(balloon)) {
                container.removeChild(balloon);
            }
        });
        
        // Add balloon to container
        container.appendChild(balloon);
    }
    
    // Revised createConfetti function using a wrapper for falling and an inner element for swaying
    function createConfetti() {
        console.log("Confetti triggered"); // Debug log
        
        // Configuration
        const confettiCount = 200; // Count for first wave
        const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590', '#ff99c8', '#9b5de5'];
        
        // Create confetti container that covers the entire viewport
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = window.innerWidth + 'px';
        confettiContainer.style.height = window.innerHeight + 'px';
        confettiContainer.style.overflow = 'hidden';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '10000'; // Ensure visibility
        document.body.appendChild(confettiContainer);
        
        // Function to create one confetti piece using a wrapper for falling and inner element for swaying
        function createOneConfetti(delayMultiplier = 1) {
            // Random properties
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 10 + 5; // 5-15px
            const leftPos = Math.random() * 100; // Percentage
            const startTop = -5 - (Math.random() * 10); // Start above viewport (in %)
            const fallDuration = Math.random() * 3 + 3; // 3-6 seconds
            const swayDuration = Math.random() * 2 + 2;   // 2-4 seconds
            const delay = Math.random() * 5 * delayMultiplier; // Delay multiplier for first or second wave
            
            // Create wrapper element for falling animation
            const wrapper = document.createElement('div');
            wrapper.style.position = 'absolute';
            wrapper.style.left = `${leftPos}%`;
            wrapper.style.top = `${startTop}%`;
            // Apply falling animation
            wrapper.style.animationName = 'confetti-fall';
            wrapper.style.animationDuration = `${fallDuration}s`;
            wrapper.style.animationDelay = `${delay}s`;
            wrapper.style.animationTimingFunction = 'linear';
            wrapper.style.animationFillMode = 'forwards';
            
            // Create inner element for swaying animation
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = color;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.opacity = Math.random() + 0.5;
            // Apply swaying animation
            confetti.style.animationName = 'confetti-sway';
            confetti.style.animationDuration = `${swayDuration}s`;
            confetti.style.animationDelay = `${delay}s`;
            confetti.style.animationTimingFunction = 'ease-in-out';
            confetti.style.animationFillMode = 'forwards';
            
            // Append inner confetti to its wrapper, then wrapper to the container
            wrapper.appendChild(confetti);
            confettiContainer.appendChild(wrapper);
        }
        
        // Create first wave of confetti
        for (let i = 0; i < confettiCount; i++) {
            createOneConfetti(1);
        }
        
        // Create second wave after a delay (using half the count)
        setTimeout(() => {
            for (let i = 0; i < confettiCount / 2; i++) {
                createOneConfetti(0.4); // shorter delays for second wave
            }
        }, 1000);
        
        // Clean up the container after animations are complete
        setTimeout(() => {
            if (document.body.contains(confettiContainer)) {
                document.body.removeChild(confettiContainer);
            }
        }, 12000); // Remove after 12 seconds
    }
    
    // Initialize effects
    function initEffects() {
        // Set up scroll event listener
        window.addEventListener('scroll', handleScroll);
        
        // Set up back-to-top button
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', scrollToTop);
        }
        
        // Start fun facts display
        if (factsContainer) {
            displayFunFacts();
        }
        
        // Generate balloons
        generateBalloons();
    }
    
    // Initialize effects when DOM is ready
    document.addEventListener('DOMContentLoaded', initEffects);
    
    // Expose the confetti function globally
    window.createConfetti = createConfetti;
})();
