// Configuration
const CONFIG = {
    // API endpoint to your Google Apps Script
    API_URL: 'https://script.google.com/macros/s/AKfycbwLeVzlihQ1AV-fld7UrUcOcR-fSkcxgbAdNJFIEGHclQ01w6hsud9_11vUJn9Zjk3E/exec',
    // WhatsApp group link (only visible for attendees)
    WHATSAPP_LINK: 'https://chat.whatsapp.com/EGyQOOsqYllJZRNtNDTvQ9',
    // Event details
    EVENT: {
        DATE_TIME: 'March 25, 2025 at 12:00 PM',
        VENUE: "Nice try, Sherlock, but you’ll have to wait!",
        VENUE_VIDEO: 'https://www.youtube.com/',
        GOOGLE_MAPS: 'Lost? Stay tuned, all will be revealed soon!',
        ITEMS: "A+ for effort, but no spoilers! Just bring your party energy when it’s time!",
    },
    // Countdown target date (YYYY, MM-1, DD, HH, MM, SS)
    TARGET_DATE: new Date(2025, 2, 25, 12, 0, 0), // March 25, 2025, 12:00 PM
    // New flag to control venue details reveal manually from backend
    REVEAL_VENUE: false // Set to true from backend when ready to unblur
};
