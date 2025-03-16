// Countdown Timer Functionality
(function() {
    // DOM Elements
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const venueDetails = document.getElementById('venue-details');
    const revealMessage = document.getElementById('reveal-message');
    
    // Update countdown timer
    function updateCountdown() {
        // Check if CONFIG is available
        if (!window.CONFIG || !window.CONFIG.TARGET_DATE) {
            console.error('CONFIG or TARGET_DATE not found');
            return;
        }
        
        const now = new Date().getTime();
        const targetDate = window.CONFIG.TARGET_DATE.getTime();
        const timeLeft = targetDate - now;
        
        // Calculate time units
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Check if elements exist before updating
        if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
        if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
        if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
        if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Check if we need to reveal venue details (48 hours before event)
        if (venueDetails && timeLeft <= 48 * 60 * 60 * 1000) {
            venueDetails.classList.remove('blur-content');
            venueDetails.classList.add('revealed');
            if (revealMessage) revealMessage.classList.remove('hidden');
        }
        
        // If the countdown is over
        if (timeLeft < 0) {
            clearInterval(countdownTimer);
            if (daysElement) daysElement.textContent = '00';
            if (hoursElement) hoursElement.textContent = '00';
            if (minutesElement) minutesElement.textContent = '00';
            if (secondsElement) secondsElement.textContent = '00';
            
            // Make sure venue details are revealed
            if (venueDetails) {
                venueDetails.classList.remove('blur-content');
                venueDetails.classList.add('revealed');
            }
            
            if (revealMessage) {
                revealMessage.classList.remove('hidden');
                revealMessage.textContent = 'Event is happening now!';
            }
        }
    }
    
    // Wait for CONFIG to be available before starting countdown
    function initCountdown() {
        if (window.CONFIG && window.CONFIG.TARGET_DATE) {
            // Update countdown every second
            const countdownTimer = setInterval(updateCountdown, 1000);
            
            // Initial update
            updateCountdown();
        } else {
            // Wait a bit and try again
            setTimeout(initCountdown, 100);
        }
    }
    
    // Start initialization
    initCountdown();
})();
