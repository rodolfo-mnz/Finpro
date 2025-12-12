// Main JavaScript file - Navigation and UI interactions

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupSmoothScrolling();
    setupEventListeners();
}

function setupNavigation() {
    // Highlight active navigation link
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function setupSmoothScrolling() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function setupEventListeners() {
    // Register button click handlers
    const registerBtn = document.getElementById('register-btn');
    const heroRegisterBtn = document.getElementById('hero-register-btn');
    
    if (registerBtn) {
        registerBtn.addEventListener('click', scrollToRegistration);
    }
    
    if (heroRegisterBtn) {
        heroRegisterBtn.addEventListener('click', scrollToRegistration);
    }
    
    // Add loading state to form submission
    const form = document.getElementById('registration-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.classList.add('loading');
            submitBtn.innerHTML = 'Processando...';
            
            // Remove loading state after processing (handled in form-handler.js)
        });
    }
    
    // Setup password visibility toggle
    setupPasswordToggle();
}

function setupPasswordToggle() {
    // Get all toggle password buttons
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            
            if (passwordInput) {
                // Toggle password visibility
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    this.classList.add('active');
                    this.setAttribute('aria-label', 'Ocultar senha');
                } else {
                    passwordInput.type = 'password';
                    this.classList.remove('active');
                    this.setAttribute('aria-label', 'Mostrar senha');
                }
            }
        });
    });
}

function scrollToRegistration() {
    const registrationSection = document.getElementById('registration');
    if (registrationSection) {
        registrationSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Focus on first input field
        const firstInput = registrationSection.querySelector('input');
        if (firstInput) {
            setTimeout(() => {
                firstInput.focus();
            }, 500);
        }
    }
}

// Utility functions
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        color: white;
        background-color: ${type === 'success' ? '#10b981' : '#ef4444'};
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}