// RSVP Functionality
(function() {
    // DOM Elements
    const rsvpInputs = document.querySelectorAll('input[name="rsvp"]');
    const foodPreferenceGroup = document.getElementById('food-preference-group');
    const foodInputs = document.querySelectorAll('input[name="food"]');
    const submitRsvpBtn = document.getElementById('submit-rsvp');
    const rsvpMessage = document.getElementById('rsvp-message');
    const welcomeSection = document.getElementById('welcome-section');
    const thankyouSection = document.getElementById('thankyou-section');
    const whatsappLink = document.getElementById('whatsapp-link');
    
    // Submit RSVP using JSONP
    function submitRSVP() {
        const rsvpValue = document.querySelector('input[name="rsvp"]:checked')?.value;
        let foodValue = 'N/A';
        
        if (!rsvpValue) {
            showRsvpMessage('Please select whether you\'ll be attending', 'error');
            return;
        }
        
        if (rsvpValue === 'Yes') {
            foodValue = document.querySelector('input[name="food"]:checked')?.value;
            if (!foodValue) {
                showRsvpMessage('Please select your food preference', 'error');
                return;
            }
        }
        
        submitRsvpBtn.disabled = true;
        submitRsvpBtn.textContent = 'Submitting...';
        
        // Get the invite code from storage or input
        const inviteCode = localStorage.getItem('inviteCode') || document.getElementById('invite-code').value.trim();
        
        // Create a script element for JSONP
        const script = document.createElement('script');
        script.src = `${CONFIG.API_URL}?inviteCode=${inviteCode}&rsvp=${rsvpValue}&foodPreference=${foodValue}&callback=handleRsvpResponse`;
        
        // Add a timeout for JSONP request
        const timeout = setTimeout(() => {
            showRsvpMessage('Request timed out. Please try again.', 'error');
            submitRsvpBtn.disabled = false;
            submitRsvpBtn.textContent = 'Submit RSVP';
            document.body.removeChild(script);
        }, 10000); // 10 seconds timeout
        
        script.onload = () => {
            clearTimeout(timeout); // Clear timeout if the request succeeds
        };
        
        document.body.appendChild(script);
    }
    
    // Show RSVP message
    function showRsvpMessage(message, type) {
        rsvpMessage.textContent = message;
        rsvpMessage.className = 'message';
        rsvpMessage.classList.add(type);
    }
    
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
    
    // Setup RSVP event listeners
    function setupRsvpListeners() {
        // RSVP selection
        rsvpInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                if (e.target.value === 'Yes') {
                    foodPreferenceGroup.classList.remove('hidden');
                    foodPreferenceGroup.classList.add('fade-in');
                } else {
                    foodPreferenceGroup.classList.add('hidden');
                }
            });
        });
        
        // Submit RSVP
        submitRsvpBtn.addEventListener('click', submitRSVP);
    }
    
    // Initialize RSVP functionality
    function initRsvp() {
        setupRsvpListeners();
        
        // Set WhatsApp link
        whatsappLink.href = CONFIG.WHATSAPP_LINK;
    }
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', initRsvp);
    
    // Export functions to global scope
    window.submitRSVP = submitRSVP;
    window.showRsvpMessage = showRsvpMessage;
    window.createConfetti = createConfetti;
})();

// Callback function for JSONP response
function handleRsvpResponse(data) {
    // Remove the script element
    document.body.removeChild(document.querySelector('script[src*="callback=handleRsvpResponse"]'));
    
    // Get DOM elements
    const submitRsvpBtn = document.getElementById('submit-rsvp');
    const welcomeSection = document.getElementById('welcome-section');
    const thankyouSection = document.getElementById('thankyou-section');
    
    // Log the response for debugging
    console.log("API Response:", data);
    
    if (data.error) {
        window.showRsvpMessage(data.error, 'error');
        submitRsvpBtn.disabled = false;
        submitRsvpBtn.textContent = 'Submit RSVP';
        return;
    }
    
    // Success - show thank you message
    window.showRsvpMessage('Thank you for your response!', 'success');
    
    // Wait for 2 seconds then transition to thank you section
    setTimeout(() => {
        welcomeSection.classList.remove('active');
        thankyouSection.classList.add('active');
        thankyouSection.classList.add('fade-in');
        
        // Create confetti effect
        window.createConfetti();
    }, 2000);
}
