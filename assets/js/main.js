// main.js

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

// Global variable to store the RSVP selection before submitting
let submittedRsvp = null;

// Initialize the application
function init() {
    // Set up event details
    eventDatetime.textContent = CONFIG.EVENT.DATE_TIME;
    eventVenue.textContent = CONFIG.EVENT.VENUE;
    mapsLink.href = CONFIG.EVENT.GOOGLE_MAPS;
    eventItems.textContent = CONFIG.EVENT.ITEMS;
    
    // Ensure WhatsApp link is properly set
    if (CONFIG.WHATSAPP_LINK) {
        whatsappLink.href = CONFIG.WHATSAPP_LINK;
        console.log('WhatsApp link initialized:', CONFIG.WHATSAPP_LINK);
    } else {
        console.error('WhatsApp link configuration missing');
    }
    
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
    
    // RSVP selection: Show food preference only if "Yes" is chosen
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
    const scriptTag = document.querySelector('script[src*="callback=handleInviteCodeResponse"]');
    if (scriptTag) {
        document.body.removeChild(scriptTag);
    }
    
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
    submittedRsvp = rsvpValue; // store the user's selection
    
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
    const scriptTag = document.querySelector('script[src*="callback=handleRsvpResponse"]');
    if (scriptTag) {
        document.body.removeChild(scriptTag);
    }
    
    console.log("RSVP Response received:", data);
    
    if (data.error) {
        showRsvpMessage(data.error, 'error');
        resetRsvpButton();
        return;
    }
    
    // Clear any previous messages
    rsvpMessage.textContent = '';
    
    // Use the submitted RSVP value (instead of the echoed value) to decide the branch
    const isAttending = submittedRsvp && normalizeRsvpResponse(submittedRsvp);
    console.log(`RSVP normalized from submitted: "${submittedRsvp}" → ${isAttending ? "Yes" : "No"}`);
    
    // Clean up any existing sections
    cleanupSections();
    
    // Process the response after a brief delay
    setTimeout(() => {
        welcomeSection.classList.remove('active');
        
        if (isAttending) {
            handleAttendingResponse();
        } else {
            handleDecliningResponse();
        }
    }, 1000);
}

// Helper function to normalize RSVP responses
function normalizeRsvpResponse(rsvp) {
    if (!rsvp) return false;
    
    const normalized = String(rsvp).trim().toLowerCase();
    return normalized === 'yes' || normalized === 'true' || normalized === '1';
}

// Handle "Yes" RSVP response
function handleAttendingResponse() {
    console.log("Handling 'Yes' response");
    
    showRsvpMessage('Thank you for your response! Can\'t wait to celebrate together! 🎉', 'success');
    
    // Show thank you section
    welcomeSection.classList.remove('active');
    thankyouSection.classList.add('active');
    thankyouSection.classList.add('fade-in');
    
    // Show WhatsApp container and launch confetti if available
    if (whatsappContainer) {
        whatsappContainer.classList.remove('hidden');
        createConfetti && createConfetti();
    }
}

// Handle "No" RSVP response
function handleDecliningResponse() {
    console.log("Handling 'No' response");
    
    showRsvpMessage('We\'ll miss you! If plans change, you can always update your response.', 'info');
    
    const declineSection = document.createElement('section');
    declineSection.id = 'decline-section';
    declineSection.className = 'section active fade-in';
    declineSection.innerHTML = `
        <div class="container">
            <div class="thankyou-card">
                <h1>We’ll miss you!</h1>
                <p>If your plans change, feel free to update your RSVP.</p>
                <button id="back-to-rsvp" class="btn">Change Response</button>
            </div>
        </div>
    `;
    
    document.body.insertBefore(declineSection, thankyouSection.nextSibling);
    thankyouSection.classList.remove('active');
    
    const backToRsvpBtn = document.getElementById('back-to-rsvp');
    if (backToRsvpBtn) {
        backToRsvpBtn.addEventListener('click', () => {
            declineSection.remove();
            welcomeSection.classList.add('active');
            resetRsvpButton();
        });
    }
}

// Clean up sections before showing new ones
function cleanupSections() {
    const existingDeclineSection = document.getElementById('decline-section');
    if (existingDeclineSection) {
        existingDeclineSection.remove();
    }
    
    // Reset thank you section state
    thankyouSection.classList.remove('active');
}

// Show error message for login
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
