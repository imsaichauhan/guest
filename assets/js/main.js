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
const revealVenueBtn = document.getElementById('reveal-venue-btn');
const venueDetails = document.getElementById('venue-details');
const venueRevealControls = document.getElementById('venue-reveal-controls');
const balloonContainer = document.getElementById('balloon-container');

// Global variable to store the RSVP selection before submitting
let submittedRsvp = null;

// Create animated balloons for the login screen
function createBalloons() {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#62CBFF', '#A782FD'];
    const sizes = [40, 50, 60, 70, 80];

    for (let i = 0; i < 8; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';

        // Random styles
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const animationDuration = 8 + Math.random() * 8;
        const animationDelay = Math.random() * 5;

        balloon.style.width = `${size}px`;
        balloon.style.height = `${Math.round(size * 1.6)}px`;
        balloon.style.background = color;
        balloon.style.left = `${left}%`;
        balloon.style.animationDuration = `${animationDuration}s`;
        balloon.style.animationDelay = `${animationDelay}s`;
        balloon.style.opacity = '0.7';

        balloonContainer.appendChild(balloon);
    }
}

// Add pulse effect to the submit button
function addLoginButtonEffects() {
    submitCodeBtn.classList.add('pulse-effect');

    // Focus effect on input
    inviteCodeInput.addEventListener('focus', () => {
        inviteCodeInput.style.transition = 'all 0.3s ease';
        inviteCodeInput.style.boxShadow = '0 0 10px rgba(52, 152, 219, 0.5)';
    });

    inviteCodeInput.addEventListener('blur', () => {
        inviteCodeInput.style.boxShadow = '';
    });
}

// Fallback scroll function: tries window.scrollTo, then forces document scroll positions
function scrollToTopFallback() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}

// Initialize the application
function init() {
    // Add visual enhancements to login screen
    createBalloons();
    addLoginButtonEffects();

    // Set up event details
    eventDatetime.textContent = CONFIG.EVENT.DATE_TIME;
    eventVenue.textContent = CONFIG.EVENT.VENUE;
    mapsLink.href = CONFIG.EVENT.GOOGLE_MAPS;

    // NEW: Set the venue video link if available
    const venueVideoLink = document.getElementById('venue-video-link');
    if (venueVideoLink) {
        venueVideoLink.href = CONFIG.EVENT.VENUE_VIDEO;
    }

    eventItems.textContent = CONFIG.EVENT.ITEMS;

    // Check if venue details should be revealed from the start
    if (CONFIG.REVEAL_VENUE && venueDetails) {
        venueDetails.classList.add('revealed');
        if (venueRevealControls) {
            venueRevealControls.classList.add('hidden');
        }
    }

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

    // Allow revealing venue details if needed
    if (revealVenueBtn && venueDetails && !CONFIG.REVEAL_VENUE) {
        revealVenueBtn.addEventListener('click', () => {
            venueDetails.classList.add('revealed');
            venueRevealControls.classList.add('hidden');
        });
    }

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
        backToTopBtn.addEventListener('click', scrollToTopFallback);
    }

    // Add floating effect to login card on hover
    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
        loginCard.addEventListener('mouseenter', () => {
            loginCard.style.transform = 'translateY(-5px)';
            loginCard.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
        });

        loginCard.addEventListener('mouseleave', () => {
            loginCard.style.transform = '';
            loginCard.style.boxShadow = '';
        });
    }

    // Tooltip functionality for the blurred venue details
    if (venueDetails) {
        // Show the tooltip on hover
        venueDetails.addEventListener('mouseenter', showBlurTooltip);
        venueDetails.addEventListener('mouseleave', hideBlurTooltip);

        // Also toggle the tooltip on click (auto-hide after 3 seconds)
        venueDetails.addEventListener('click', () => {
            const existingTooltip = document.getElementById('blur-tooltip');
            if (existingTooltip) {
                hideBlurTooltip();
            } else {
                showBlurTooltip();
                setTimeout(hideBlurTooltip, 3000);
            }
        });
    }
}

// Tooltip functions for blurred event details
function showBlurTooltip() {
    // Avoid adding duplicate tooltip elements
    if (document.getElementById('blur-tooltip')) return;

    const tooltip = document.createElement('div');
    tooltip.id = 'blur-tooltip';
    tooltip.textContent = "Blurry for now… but those who inspect closely might see more. 😉";

    // Style the tooltip (feel free to adjust as needed)
    tooltip.style.position = 'absolute';
    tooltip.style.bottom = '100%';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translateX(-50%)';
    tooltip.style.background = 'rgba(0, 0, 0, 0.7)';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.zIndex = '100';
    tooltip.style.pointerEvents = 'none'; // so it doesn't block mouse events

    // Ensure the parent element is positioned relative for proper tooltip placement
    venueDetails.style.position = 'relative';
    venueDetails.appendChild(tooltip);
}

function hideBlurTooltip() {
    const tooltip = document.getElementById('blur-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Validate invite code using JSONP
function validateInviteCode() {
    const inviteCode = inviteCodeInput.value.trim();

    if (!inviteCode) {
        showLoginError('Please enter your invite code');
        shakeInput(inviteCodeInput);
        return;
    }

    submitCodeBtn.disabled = true;
    submitCodeBtn.textContent = 'Checking...';
    submitCodeBtn.classList.remove('pulse-effect');

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

// Add shake animation to element
function shakeInput(element) {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
}

// Handle JSONP response for invite code validation
function handleInviteCodeResponse(data) {
    const scriptTag = document.querySelector('script[src*="callback=handleInviteCodeResponse"]');
    if (scriptTag) {
        document.body.removeChild(scriptTag);
    }

    if (data.error) {
        showLoginError(data.error);
        shakeInput(inviteCodeInput);
        resetSubmitButton();
        return;
    }

    // Successfully validated
    submitCodeBtn.textContent = 'Welcome!';
    submitCodeBtn.style.backgroundColor = 'var(--success-color)';

    // Add success animation before switching screens
    setTimeout(() => {
        guestNameElement.textContent = data.name;
        loginSection.classList.remove('active');
        welcomeSection.classList.add('active');
        welcomeSection.classList.add('fade-in');

        // Clean up balloon container after login
        if (balloonContainer) {
            balloonContainer.innerHTML = '';
        }
    }, 800);
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
    const scriptTag = document.querySelector('script[src*="callback=handleInviteResponse"]') || 
                      document.querySelector('script[src*="callback=handleRsvpResponse"]');
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
        whatsappContainer.classList.add('fade-in');

        // Scroll to top using the fallback
        scrollToTopFallback();

        // Add delay before creating confetti for better visual effect
        setTimeout(() => {
            if (typeof createConfetti === 'function') {
                createConfetti();
            } else {
                console.warn('createConfetti function not found');
            }
        }, 500);
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
                <h1>We'll miss you!</h1>
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
    loginError.classList.add('shake');
    setTimeout(() => {
        loginError.classList.remove('shake');
    }, 500);
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
    submitCodeBtn.classList.add('pulse-effect');
}

function resetRsvpButton() {
    submitRsvpBtn.disabled = false;
    submitRsvpBtn.textContent = 'Submit RSVP';
}

// IMPORTANT: Ensure that effects.js is loaded before main.js
// Initialize application on DOM load
document.addEventListener('DOMContentLoaded', init);
