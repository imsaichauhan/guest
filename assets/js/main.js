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
const whatsappContainer = document.getElementById('whatsapp-container');
const whatsappLink = document.getElementById('whatsapp-link');
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
    
    // Back to top button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
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
    
    const script = document.createElement('script');
    script.src = `${CONFIG.API_URL}?inviteCode=${inviteCode}&callback=handleInviteCodeResponse`;
    
    const timeout = setTimeout(() => {
        showLoginError('Request timed out. Please try again.');
        resetSubmitButton();
        document.body.removeChild(script);
    }, 10000);
    
    script.onload = () => clearTimeout(timeout);
    document.body.appendChild(script);
}

// Handle JSONP response for invite code validation
function handleInviteCodeResponse(data) {
    document.body.removeChild(document.querySelector('script[src*="callback=handleInviteCodeResponse"]'));
    
    if (data.error) {
        showLoginError(data.error);
        resetSubmitButton();
        return;
    }
    
    guestNameElement.textContent = data.name;
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
    
    const inviteCode = inviteCodeInput.value.trim();
    
    const script = document.createElement('script');
    script.src = `${CONFIG.API_URL}?inviteCode=${inviteCode}&rsvp=${rsvpValue}&foodPreference=${foodValue}&callback=handleRsvpResponse`;
    
    const timeout = setTimeout(() => {
        showRsvpMessage('Request timed out. Please try again.', 'error');
        resetRsvpButton();
        document.body.removeChild(script);
    }, 10000);
    
    script.onload = () => clearTimeout(timeout);
    document.body.appendChild(script);
}

// Handle JSONP response for RSVP submission
function handleRsvpResponse(data) {
    document.body.removeChild(document.querySelector('script[src*="callback=handleRsvpResponse"]'));

    if (data.error) {
        showRsvpMessage(data.error, 'error');
        resetRsvpButton();
        return;
    }

    rsvpMessage.textContent = '';
    
    // Show appropriate message based on RSVP response
    if (data.rsvp === 'Yes') {
        showRsvpMessage('Thank you for your response! Can\'t wait to celebrate together! 🎉', 'success');
    } else {
        showRsvpMessage('We\'ll miss you! If plans change, you know where to find us. 😊', 'info');
    }
    
    // Wait a moment before transitioning to the thank you section
    setTimeout(() => {
        welcomeSection.classList.remove('active');
        thankyouSection.classList.add('active');
        thankyouSection.classList.add('fade-in');
        
        // Show WhatsApp link only if attending
        if (data.rsvp === 'Yes') {
            whatsappContainer.style.display = 'block';
        } else {
            whatsappContainer.style.display = 'none';
        }
    }, 2000);
}

// Show error message
function showLoginError(message) {
    loginError.textContent = message;
}

// Show RSVP message
function showRsvpMessage(message, type) {
    rsvpMessage.textContent = message;
    rsvpMessage.className = 'message ' + type;
}

// Reset buttons
function resetSubmitButton() {
    submitCodeBtn.disabled = false;
    submitCodeBtn.textContent = 'Unlock Invitation';
}

function resetRsvpButton() {
    submitRsvpBtn.disabled = false;
    submitRsvpBtn.textContent = 'Submit RSVP';
}

// Initialize application on DOM load
document.addEventListener('DOMContentLoaded', init);
