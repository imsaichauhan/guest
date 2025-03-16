// Authentication and Invite Code Validation
(function() {
    // DOM Elements
    const loginSection = document.getElementById('login-section');
    const welcomeSection = document.getElementById('welcome-section');
    const inviteCodeInput = document.getElementById('invite-code');
    const submitCodeBtn = document.getElementById('submit-code');
    const loginError = document.getElementById('login-error');
    const guestNameElement = document.getElementById('guest-name');
    
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
    
    // Show login error message with animation
    function showLoginError(message) {
        loginError.textContent = message;
        loginError.classList.add('shake');
        
        // Remove animation class after it completes
        setTimeout(() => {
            loginError.classList.remove('shake');
        }, 500);
    }
    
    // Set up event listeners
    function setupAuthListeners() {
        // Submit invite code
        submitCodeBtn.addEventListener('click', validateInviteCode);
        inviteCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') validateInviteCode();
        });
        
        // Check for stored invite code
        const storedInviteCode = localStorage.getItem('inviteCode');
        if (storedInviteCode) {
            inviteCodeInput.value = storedInviteCode;
            // Validate after a short delay to allow page to load
            setTimeout(validateInviteCode, 500);
        }
    }
    
    // Initialize authentication
    function initAuth() {
        setupAuthListeners();
    }
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', initAuth);
    
    // Export functions to global scope
    window.validateInviteCode = validateInviteCode;
    window.showLoginError = showLoginError;
})();

// Callback function for JSONP response
function handleInviteCodeResponse(data) {
    // Remove the script element
    document.body.removeChild(document.querySelector('script[src*="callback=handleInviteCodeResponse"]'));
    
    // Get DOM elements
    const submitCodeBtn = document.getElementById('submit-code');
    const loginSection = document.getElementById('login-section');
    const welcomeSection = document.getElementById('welcome-section');
    const guestNameElement = document.getElementById('guest-name');
    const inviteCodeInput = document.getElementById('invite-code');
    
    // Log the response for debugging
    console.log("API Response:", data);
    
    if (data.error) {
        window.showLoginError(data.error);
        submitCodeBtn.disabled = false;
        submitCodeBtn.textContent = 'Unlock Invitation';
        return;
    }
    
    // Store valid invite code in local storage
    localStorage.setItem('inviteCode', inviteCodeInput.value.trim());
    
    // Success - update UI
    guestNameElement.textContent = data.name;
    
    // Transition to welcome section
    loginSection.classList.remove('active');
    welcomeSection.classList.add('active');
    welcomeSection.classList.add('fade-in');
}
