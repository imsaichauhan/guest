// Configuration
const CONFIG = {
    // API endpoint to your Google Apps Script
    API_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID_HERE/exec',
    // WhatsApp group link
    WHATSAPP_LINK: 'https://chat.whatsapp.com/YOUR_GROUP_LINK',
    // Event details
    EVENT: {
        DATE_TIME: 'August 15, 2023 at 7:00 PM',
        VENUE: 'Crystal Garden Resort',
        GOOGLE_MAPS: 'https://goo.gl/maps/YOUR_LOCATION_LINK',
        ITEMS: 'Your beautiful self, comfortable clothes, and lots of energy!',
    },
    // Countdown target date (YYYY, MM-1, DD, HH, MM, SS)
    TARGET_DATE: new Date(2023, 7, 15, 19, 0, 0)
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

// Validate invite code
async function validateInviteCode() {
    const inviteCode = inviteCodeInput.value.trim();
    
    if (!inviteCode) {
        showLoginError('Please enter your invite code');
        return;
    }
    
    try {
        submitCodeBtn.disabled = true;
        submitCodeBtn.textContent = 'Checking...';
        
        // This is a mock validation function - in real usage, you'd call your API
        // For demonstration, let's simulate a successful API call
        const response = await mockValidateCode(inviteCode);
        
        if (response.error) {
            showLoginError(response.error);
            submitCodeBtn.disabled = false;
            submitCodeBtn.textContent = 'Unlock Invitation';
            return;
        }
        
        // Success - update UI
        guestNameElement.textContent = response.name;
        
        // Transition to welcome section
        loginSection.classList.remove('active');
        welcomeSection.classList.add('active');
        welcomeSection.classList.add('fade-in');
        
    } catch (error) {
        console.error('Error validating code:', error);
        showLoginError('Something went wrong. Please try again.');
        submitCodeBtn.disabled = false;
        submitCodeBtn.textContent = 'Unlock Invitation';
    }
}

// Submit RSVP
async function submitRSVP() {
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
    
    try {
        submitRsvpBtn.disabled = true;
        submitRsvpBtn.textContent = 'Submitting...';
        
        // Get the invite code from localStorage or from input (in real app, you'd save this after validation)
        const inviteCode = inviteCodeInput.value.trim();
        
        // This is a mock submission function - in real usage, you'd call your API
        const response = await mockSubmitRSVP(inviteCode, rsvpValue, foodValue);
        
        if (response.error) {
            showRsvpMessage(response.error, 'error');
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
        
    } catch (error) {
        console.error('Error submitting RSVP:', error);
        showRsvpMessage('Something went wrong. Please try again.', 'error');
        submitRsvpBtn.disabled = false;
        submitRsvpBtn.textContent = 'Submit RSVP';
    }
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

// Mock functions for demonstration (replace these with actual API calls)
async function mockValidateCode(code) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // In real usage, this would be an API call to your Google Apps Script
            if (code === 'demo') {
                resolve({ success: true, name: 'Demo User' });
            } else {
                // This simulates an API call - in production, use fetch to call your actual API
                fetch(`${CONFIG.API_URL}?inviteCode=${code}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    console.error('Error calling API:', error);
                    resolve({ error: 'Failed to validate code' });
                });
            }
        }, 1000);
    });
}

async function mockSubmitRSVP(inviteCode, rsvp, foodPreference) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // In real usage, this would be an API call to your Google Apps Script
            if (inviteCode === 'demo') {
                resolve({ success: true });
            } else {
                // This uses the actual API call
                fetch(CONFIG.API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        inviteCode: inviteCode,
                        rsvp: rsvp,
                        foodPreference: foodPreference
                    })
                })
                .then(response => response.json())
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    console.error('Error calling API:', error);
                    resolve({ error: 'Failed to submit RSVP' });
                });
            }
        }, 1000);
    });
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
