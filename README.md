# Personalized Event Invitation System

This project creates a personalized event invitation system with password protection, RSVP functionality, and surprise reveal features. Guests enter a unique invite code to access their personalized invitation, where they can RSVP and select their food preference.

## Features

- **Password Protection**: Each guest has a unique invite code
- **RSVP System**: Guests can confirm their attendance and select food preferences
- **WhatsApp Group Link**: Revealed after the guest accepts the invitation
- **Surprise Details**: Event details are revealed in a fun, interactive way
- **Email Notifications**: You receive an email when a guest RSVPs
- **Responsive Design**: Works on mobile and desktop devices

## Setup Instructions

### 1. Google Sheets Setup

1. Create a new Google Sheet named "RSVP Responses"
2. Add the following columns:
   - Name
   - Invite Code
   - RSVP
   - Food Preference
   - Timestamp
3. Populate the sheet with your guests' names and unique invite codes

### 2. Google Apps Script Setup

1. Open your Google Sheet, go to Extensions > Apps Script
2. Replace the code with the Google Apps Script code provided in this repository
3. Deploy the script as a web app:
   - Click Deploy > New deployment
   - Select "Web app" as the deployment type
   - Set "Execute as" to "Me"
   - Set "Who has access" to "Anyone"
   - Click "Deploy"
4. Copy the deployment URL

### 3. Website Configuration

1. Open `js/main.js` and update the following configuration:
   - Replace `YOUR_DEPLOYMENT_ID_HERE` with your Google Apps Script deployment URL
   - Update the WhatsApp group link
   - Update the event details (date, venue, etc.)
   - Update the countdown target date

### 4. GitHub Pages Setup

1. Push this repository to GitHub
2. Go to Settings > Pages
3. Select the "main" branch and click "Save"
4. Your website will be live at `https://[your-username].github.io/invite`

## Usage

1. Share the invitation website URL with your guests
2. Separately provide each guest with their unique invite code
3. Track responses in your Google Sheet
4. Receive email notifications when guests RSVP

## Customization

- **Colors**: Edit `css/styles.css` to change the color scheme
- **Animations**: Modify `css/animations.css` to change the animations
- **Event Details**: Update the event details in `js/main.js`

## Contributing

Feel free to fork this repository and make your own modifications. If you have any improvements or suggestions, please submit a pull request.
