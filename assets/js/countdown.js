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
        const now = new Date().getTime();
        const targetDate = CONFIG.TARGET_DATE.getTime();
        const timeLeft = targetDate - now;
        
        // Calculate time units
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Update DOM elements
        daysElement.textContent = days.toString().padStart(2, '0');
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Check if we need to reveal venue details (48 hours before event)
        if (timeLeft <= 48 * 60 * 60 * 1000) {
            venueDetails.classList.remove('blur-content');
            venueDetails.classList.add('revealed');
            revealMessage.classList.remove('hidden');
        }
        
        // If the countdown is over
        if (timeLeft < 0) {
            clearInterval(countdownTimer);
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            
            // Make sure venue details are revealed
            venueDetails.classList.remove('blur-content');
            venueDetails.classList.add('revealed');
            revealMessage.classList.remove('hidden');
            revealMessage.textContent = 'Event is happening now!';
        }
    }
    
    // Update countdown every second
    const countdownTimer = setInterval(updateCountdown, 1000);
    
    // Initial update
    updateCountdown();
})();
