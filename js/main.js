// Configuration
const CONFIG = {
    // API endpoint to your Google Apps Script
    API_URL: 'https://script.google.com/macros/s/AKfycbwLeVzlihQ1AV-fld7UrUcOcR-fSkcxgbAdNJFIEGHclQ01w6hsud9_11vUJn9Zjk3E/exec',
    // WhatsApp group link
    WHATSAPP_LINK: 'https://chat.whatsapp.com/EGyQOOsqYllJZRNtNDTvQ9',
    // Event details
    EVENT: {
        DATE_TIME: 'March 25, 2025 at 12:00 PM',
        VENUE: 'Crystal Garden Resort',
        GOOGLE_MAPS: 'https://www.google.com/maps/place/Munnar,+Kerala+685612/@10.0806496,77.0641779,15z/data=!3m1!4b1!4m6!3m5!1s0x3b0799794d099a6d:0x63250e5553c7e0c!8m2!3d10.0889333!4d77.0595248!16zL20vMDFydmpi?entry=ttu&g_ep=EgoyMDI1MDMxMi4wIKXMDSoASAFQAw%3D%3D',
        ITEMS: 'Your beautiful self, comfortable clothes, and lots of energy!',
    },
    // Countdown target date (YYYY, MM-1, DD, HH, MM, SS)
    TARGET_DATE: new Date(2025, 3, 25, 12, 0, 0)
};

// DOM Elements
const loginSection = document.getElementById('login-section');
const welcomeSection = document.getElementById('welcome-section');
const thankyouSection = document.getElementById('thankyou-section');
const inviteCodeInput = document.getElementById('invite-code');
const submitCodeBtn = document.getElementById('submit-code');
const loginError = document.getElementById('login-error');
const guestNameElement = document.getElementById('guest-name');
const rsvpInputs = document.querySelectorAll('input[name="rsvp"]');
const foodPreferenceGroup = document.getElementById('food-preference-group');
const foodInputs = document.querySelectorAll('input[name="food"]');
const submitRsvpBtn = document.getElementById('submit-rsvp');
const rsvpMessage = document.getElementById('rsvp-message');
const whatsappLink = document.getElementById('whatsapp-link');
const revealSurpriseBtn = document.getElementById('reveal-surprise');
const surpriseDetails = document.getElementById('surprise-details');
const eventDatetime = document.getElementById('event-datetime');
const eventVenue = document.getElementById('event-venue');
const mapsLink = document.getElementById('maps-link');
const eventItems = document.getElementById('event-items');

// Initialize the application
function init() {
    // Set up event details
    eventDatetime.textContent = CONFIG.EVENT.DATE_TIME;
    eventVenue.textContent = CONFIG.EVENT.VENUE;
    mapsLink.href = CONFIG.EVENT.GOOGLE_MAPS;
    eventItems.textContent = CONFIG.EVENT.ITEMS;
    whatsappLink.href = CONFIG.WHATSAPP_LINK;
    
    // Set up event listeners
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    // Submit invite code
    submitCodeBtn.addEventListener('click', validateInviteCode);
    inviteCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') validateInviteCode();
    });
    
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
    
    // Reveal surprise details
    revealSurpriseBtn.addEventListener('click', revealSurprise);
}

// Validate invite code using JSONP
function validateInviteCode() {
    const inviteCode = inviteCodeInput.value.trim();
    
    if (!inviteCode) {
        showLoginError('Please enter your invite code');
        return;
    }
    
    submitCodeBtn.disabled = true;
    submitCodeBtn.textContent = 'Checking...';
    
    // Create a script element for JSONP
    const script = document.createElement('script');
    script.src = `${CONFIG.API_URL}?inviteCode=${inviteCode}&callback=handleInviteCodeResponse`;
    
    // Add a timeout for JSONP request
    const timeout = setTimeout(() => {
        showLoginError('Request timed out. Please try again.');
        submitCodeBtn.disabled = false;
        submitCodeBtn.textContent = 'Unlock Invitation';
        document.body.removeChild(script);
    }, 10000); // 10 seconds timeout
    
    script.onload = () => {
        clearTimeout(timeout); // Clear timeout if the request succeeds
    };
    
    document.body.appendChild(script);
}

// Handle JSONP response for invite code validation
function handleInviteCodeResponse(data) {
    // Remove the script element
    document.body.removeChild(document.querySelector('script[src*="callback=handleInviteCodeResponse"]'));
    
    // Log the response for debugging
    console.log("API Response:", data);
    
    if (data.error) {
        showLoginError(data.error);
        submitCodeBtn.disabled = false;
        submitCodeBtn.textContent = 'Unlock Invitation';
        return;
    }
    
    // Success - update UI
    guestNameElement.textContent = data.name;
    
    // Transition to welcome section
    loginSection.classList.remove('active');
    welcomeSection.classList.add('active');
    welcomeSection.classList.add('fade-in');
}

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
    
    // Get the invite code from the input
    const inviteCode = inviteCodeInput.value.trim();
    
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

// Handle JSONP response for RSVP submission
function handleRsvpResponse(data) {
    // Remove the script element
    document.body.removeChild(document.querySelector('script[src*="callback=handleRsvpResponse"]'));
    
    // Log the response for debugging
    console.log("API Response:", data);
    
    if (data.error) {
        showRsvpMessage(data.error, 'error');
        submitRsvpBtn.disabled = false;
        submitRsvpBtn.textContent = 'Submit RSVP';
        return;
    }
    
    // Success - show thank you message and transition to next section
    showRsvpMessage('Thank you for your response!', 'success');
    
    // Wait for 2 seconds then transition to thank you section
    setTimeout(() => {
        welcomeSection.classList.remove('active');
        thankyouSection.classList.add('active');
        thankyouSection.classList.add('fade-in');
        
        // Create confetti effect
        createConfetti();
    }, 2000);
}

// Reveal surprise details
function revealSurprise() {
    revealSurpriseBtn.classList.add('hidden');
    surpriseDetails.classList.remove('hidden');
    surpriseDetails.classList.add('reveal');
}

// Show login error message
function showLoginError(message) {
    loginError.textContent = message;
    loginError.classList.add('shake');
    
    // Remove animation class after it completes
    setTimeout(() => {
        loginError.classList.remove('shake');
    }, 500);
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

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
