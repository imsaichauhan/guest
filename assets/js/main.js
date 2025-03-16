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
    TARGET_DATE: new Date(2025, 2, 25, 12, 0, 0)  // Note: Month is 0-indexed (2 = March)
};

// DOM Elements
const loginSection = document.getElementById('login-section');
const welcomeSection = document.getElementById('welcome-section');
const thankyouSection = document.getElementById('thankyou-section');
const inviteCodeInput = document.getElementById('invite-code');
const submitCodeBtn = document.getElementById('submit-code');
const loginError = document.getElementById('login-error');
const guestNameElement = document.getElementById('guest-name');
const revealSurpriseBtn = document.getElementById('reveal-surprise');
const surpriseDetails = document.getElementById('surprise-details');
const eventDatetime = document.getElementById('event-datetime');
const eventVenue = document.getElementById('event-venue');
const mapsLink = document.getElementById('maps-link');
const eventItems = document.getElementById('event-items');
const backToTopBtn = document.getElementById('back-to-top');

// Initialize the application
function init() {
    // Set up event details
    eventDatetime.textContent = CONFIG.EVENT.DATE_TIME;
    eventVenue.textContent = CONFIG.EVENT.VENUE;
    mapsLink.href = CONFIG.EVENT.GOOGLE_MAPS;
    eventItems.textContent = CONFIG.EVENT.ITEMS;
    
    // Set up additional event listeners
    setupMainEventListeners();
    
    // Check if user is on a mobile device and adjusting styling
    checkMobileDevice();
}

// Set up event listeners
function setupMainEventListeners() {
    // Reveal surprise details
    revealSurpriseBtn.addEventListener('click', revealSurprise);
    
    // Back to top button
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Links in the navigation
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Reveal surprise details
function revealSurprise() {
    revealSurpriseBtn.classList.add('hidden');
    surpriseDetails.classList.remove('hidden');
    surpriseDetails.classList.add('reveal');
}

// Check if user is on a mobile device
function checkMobileDevice() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.body.classList.add('mobile-device');
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
