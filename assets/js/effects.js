// Visual Effects and Animations
(function() {
    // DOM Elements
    const siteHeader = document.getElementById('site-header');
    const factsContainer = document.getElementById('facts-container');
    const backToTopBtn = document.getElementById('back-to-top');
    
    // Fun facts about the birthday person
    const funFacts = [
        "They can solve a Rubik's cube in under 2 minutes!",
        "Their favorite food is pizza with pineapple (controversial, we know)",
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
    
    // Display fun facts with typewriter effect
    function displayFunFacts() {
        let currentFactIndex = 0;
        
        function showNextFact() {
            const fact = funFacts[currentFactIndex];
            factsContainer.innerHTML = `<p class="typewriter-text">${fact}</p>`;
            
            // Prepare for next fact
            currentFactIndex = (currentFactIndex + 1) % funFacts.length;
            
            // Wait for the typewriter animation to complete (3s) plus some extra time
            setTimeout(showNextFact, 6000);
        }
        
        // Start the fun fact rotation
        showNextFact();
    }
    
    // Scroll to top functionality
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Initialize effects
    function initEffects() {
        // Set up scroll event listener
        window.addEventListener('scroll', handleScroll);
        
        // Set up back to top button
        backToTopBtn.addEventListener('click', scrollToTop);
        
        // Start fun facts display
        displayFunFacts();
    }
    
    // Initialize effects when DOM is ready
    document.addEventListener('DOMContentLoaded', initEffects);
})();
