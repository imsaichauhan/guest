// Configuration
const CONFIG = {
    // API endpoint to your Google Apps Script
    API_URL: 'https://script.google.com/macros/s/AKfycbwLeVzlihQ1AV-fld7UrUcOcR-fSkcxgbAdNJFIEGHclQ01w6hsud9_11vUJn9Zjk3E/exec',
    // WhatsApp group link (only visible for attendees)
    WHATSAPP_LINK: 'https://chat.whatsapp.com/EGyQOOsqYllJZRNtNDTvQ9',
    // Event details
    EVENT: {
        DATE_TIME: 'March 25, 2025 at 11:30 AM',
        VENUE: "Barefoot Bay Villa, ECR",
        VENUE_VIDEO: 'https://drive.google.com/file/d/14UyMH_1BoVJEhveb0byma1sLM1RwKNcP/view?usp=sharing', 
        GOOGLE_MAPS: 'https://goo.gl/maps/HvZ8W8VJFQF8vo7c7',
        ITEMS: "Questionable moves? Check. Poolside essentials? Check. 24-hour party mode? Double check!",
    },
    // Countdown target date (YYYY, MM-1, DD, HH, MM, SS)
    TARGET_DATE: new Date(2025, 2, 25, 11, 30, 0), // March 25, 2025, 11:30 AM
    // New flag to control venue details reveal manually from backend
    REVEAL_VENUE: true // Set to true from backend when ready to unblur
};
