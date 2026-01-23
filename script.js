// ===== BACKEND API URL =====
// RAILWAY BACKEND - DO NOT CHANGE THESE URLs
const BACKEND_URL = 'https://portfolio-backened-production-3a16.up.railway.app/api/contact/send';
const HEALTH_URL = 'https://portfolio-backened-production-3a16.up.railway.app/api/health';

// ===== DOM Elements =====
const themeSwitcher = document.getElementById('theme-switcher');
const themeIcon = themeSwitcher?.querySelector('i');
const htmlElement = document.documentElement;
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelector('.nav-links');
const hamburger = document.querySelector('.hamburger');
const typingText = document.querySelector('.typing-text');
const sections = document.querySelectorAll('.section');
const skillBars = document.querySelectorAll('.skill-progress');
const resumeBtn = document.getElementById('resume-btn');
const contactForm = document.getElementById('contact-form');
const currentYear = document.getElementById('current-year');
const backToTop = document.getElementById('back-to-top');

// Contact form elements
const contactName = document.getElementById('contact-name');
const contactEmail = document.getElementById('contact-email');
const contactMessage = document.getElementById('contact-message');
const contactSubmit = document.getElementById('contact-submit');

// ===== Initialize Connection Test =====
console.log('🚀 Portfolio Frontend Initialized');
console.log('🎯 Backend URL:', BACKEND_URL);
console.log('🌐 Frontend Origin:', window.location.origin);
console.log('📱 User Agent:', navigator.userAgent);

// Test backend connection on load
window.addEventListener('load', async () => {
    try {
        console.log('🔍 Testing Railway backend connection...');
        const response = await fetch(HEALTH_URL, { 
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Backend Connection Test:', {
                status: 'SUCCESS',
                message: data.message,
                environment: data.environment,
                emailConfigured: data.emailConfigured,
                uptime: data.uptime
            });
            
            // Show connection status in UI
            if (data.emailConfigured) {
                console.log('📧 Email service: READY');
            } else {
                console.warn('⚠️ Email service: NOT CONFIGURED (messages will be logged only)');
            }
        } else {
            console.warn('⚠️ Backend responded with status:', response.status);
        }
    } catch (error) {
        console.warn('⚠️ Backend connection test failed:', error.message);
        console.log('💡 Troubleshooting:');
        console.log('1. Visit:', HEALTH_URL, 'to check if backend is running');
        console.log('2. Check Railway dashboard for deployment status');
        console.log('3. Wait 30 seconds for Railway app to wake up');
    }
});

// ===== Typing Animation =====
const typingStrings = [
    'Frontend Developer',
    'Aspiring Full Stack Developer',
    'UI/UX Enthusiast',
    'Problem Solver'
];

let stringIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    if (!typingText) return;
    
    const currentString = typingStrings[stringIndex];
    
    if (isDeleting) {
        typingText.textContent = currentString.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentString.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentString.length) {
        isDeleting = true;
        typingSpeed = 1000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        stringIndex = (stringIndex + 1) % typingStrings.length;
        typingSpeed = 500;
    }
    
    setTimeout(typeEffect, typingSpeed);
}

// ===== Theme Management =====
function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
    if (!themeIcon) return;
    
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
        themeIcon.style.color = '#FFD700';
    } else {
        themeIcon.className = 'fas fa-moon';
        themeIcon.style.color = '#10b981';
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
}

if (themeSwitcher) {
    themeSwitcher.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        
        themeSwitcher.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeSwitcher.style.transform = 'scale(1)';
        }, 150);
    });
}

// ===== Scroll Animations =====
function checkScroll() {
    const scrollPosition = window.scrollY;
    
    if (navbar) {
        if (scrollPosition > 50) {
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.boxShadow = 'var(--shadow-sm)';
        }
    }
    
    if (backToTop) {
        if (scrollPosition > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition > sectionTop - window.innerHeight + 100) {
            section.classList.add('visible');
            
            if (section.id === 'skills') {
                animateSkillBars();
            }
        }
    });
}

function animateSkillBars() {
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
    });
}

// ===== Mobile Navigation =====
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });
}

if (navLinks) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}

// ===== ENHANCED Contact Form Handler =====
if (contactForm && contactSubmit) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: contactName.value.trim(),
            email: contactEmail.value.trim(),
            message: contactMessage.value.trim()
        };
        
        console.log('📤 Form Submission:', {
            data: formData,
            backend: BACKEND_URL,
            timestamp: new Date().toISOString(),
            origin: window.location.origin
        });
        
        // Enhanced Validation
        const validationErrors = [];
        
        if (!formData.name || formData.name.length < 2) {
            validationErrors.push('Name must be at least 2 characters');
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            validationErrors.push('Please enter a valid email address');
        }
        
        if (!formData.message || formData.message.length < 10) {
            validationErrors.push('Message must be at least 10 characters');
        }
        
        if (validationErrors.length > 0) {
            showNotification(validationErrors[0], 'error', 3000);
            return;
        }
        
        // Show loading state
        const originalText = contactSubmit.innerHTML;
        contactSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        contactSubmit.disabled = true;
        
        try {
            console.log('🚀 Sending request to Railway backend...');
            
            // Create AbortController for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData),
                signal: controller.signal
                // Note: Don't set mode: 'cors' explicitly, let browser handle it
            });
            
            clearTimeout(timeoutId);
            
            console.log('📥 Response Status:', response.status, response.statusText);
            
            // Log response headers for debugging
            console.log('📥 Response Headers:', {
                'content-type': response.headers.get('content-type'),
                'access-control-allow-origin': response.headers.get('access-control-allow-origin')
            });
            
            // Handle response
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.warn('⚠️ Non-JSON response received:', text.substring(0, 200));
                
                if (response.ok) {
                    // If it's a 200 with non-JSON, assume success
                    showNotification('Message sent successfully!', 'success', 5000);
                    contactForm.reset();
                } else {
                    throw new Error(`Server error: ${response.status}`);
                }
            } else {
                const data = await response.json();
                console.log('✅ Backend Response:', data);
                
                if (response.ok && data.success) {
                    showNotification('🎉 ' + data.message, 'success', 5000);
                    contactForm.reset();
                    
                    // Clear form fields
                    if (contactName) contactName.value = '';
                    if (contactEmail) contactEmail.value = '';
                    if (contactMessage) contactMessage.value = '';
                } else {
                    showNotification('❌ ' + (data.message || 'Failed to send message'), 'error', 4000);
                    
                    // Show validation errors if any
                    if (data.errors && Array.isArray(data.errors)) {
                        console.error('Validation errors:', data.errors);
                    }
                }
            }
            
        } catch (error) {
            console.error('❌ Form Submission Error:', {
                name: error.name,
                message: error.message,
                type: error.type,
                url: BACKEND_URL,
                timestamp: new Date().toISOString()
            });
            
            // User-friendly error messages
            let userMessage = 'Failed to send message. ';
            
            if (error.name === 'AbortError') {
                userMessage += 'Request timeout. The server is taking too long to respond.';
            } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                userMessage += 'Cannot connect to server. ';
                userMessage += 'Possible issues:\n';
                userMessage += '• Railway app might be sleeping\n';
                userMessage += '• Check your internet connection\n';
                userMessage += '• Try again in 30 seconds';
            } else if (error.message.includes('CORS')) {
                userMessage += 'Cross-origin request blocked. ';
                userMessage += 'Please contact the website administrator.';
            } else {
                userMessage += error.message;
            }
            
            showNotification(userMessage, 'error', 6000);
            
            // Debug information
            console.log('🔧 Debug Information:');
            console.log('1. Backend URL:', BACKEND_URL);
            console.log('2. Frontend Origin:', window.location.origin);
            console.log('3. Error Type:', error.name);
            console.log('4. Error Message:', error.message);
            console.log('💡 Solution: Visit', HEALTH_URL, 'to wake up Railway');
            
        } finally {
            // Reset button
            contactSubmit.innerHTML = originalText;
            contactSubmit.disabled = false;
        }
    });
}

// ===== Notification System =====
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Icons for different notification types
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    
    notification.innerHTML = `
        <i class="fas fa-${icons[type] || 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : 
                     type === 'error' ? '#ef4444' : 
                     type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        min-width: 300px;
        max-width: 400px;
        font-family: 'Segoe UI', system-ui, sans-serif;
    `;
    
    // Close button styling
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.7;
        transition: opacity 0.2s ease;
        padding: 0;
        font-size: 16px;
    `;
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.opacity = '1';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.opacity = '0.7';
    });
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}

// ===== Backend Health Check =====
async function checkBackendHealth() {
    try {
        const response = await fetch(HEALTH_URL, { 
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Backend Health Check:', {
                status: 'HEALTHY',
                message: data.message,
                environment: data.environment,
                uptime: data.uptime
            });
            return true;
        }
        return false;
    } catch (error) {
        console.warn('⚠️ Backend health check failed:', error.message);
        return false;
    }
}

// ===== Social Links Enhancement =====
function enhanceSocialLinks() {
    document.querySelectorAll('a[href*="github"], a[href*="linkedin"], a[href*="mailto"], a[href*="leetcode"], a[href*="hackerrank"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.href;
            let platform = 'External Link';
            
            if (href.includes('github')) platform = 'GitHub';
            else if (href.includes('linkedin')) platform = 'LinkedIn';
            else if (href.includes('mailto')) platform = 'Email';
            else if (href.includes('leetcode')) platform = 'LeetCode';
            else if (href.includes('hackerrank')) platform = 'HackerRank';
            
            if (platform !== 'Email') {
                showNotification(`Opening ${platform}...`, 'info', 2000);
            }
        });
    });
    
    document.querySelectorAll('.social-icon, .social-link, .footer-social a').forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏁 DOM Content Loaded - Initializing Portfolio...');
    
    // Start typing animation
    if (typingText) {
        typeEffect();
    }
    
    // Initialize theme
    initTheme();
    
    // Set current year in footer
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    // Initialize scroll effects
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Initial check
    
    // Resume button
    if (resumeBtn) {
        resumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Opening resume...', 'info', 2000);
            // Replace with your actual resume URL
            window.open('https://drive.google.com/file/d/your-resume-id/view?usp=sharing', '_blank');
        });
    }
    
    // Back to top button
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Enhance social links
    enhanceSocialLinks();
    
    // Check backend health on load
    setTimeout(() => {
        checkBackendHealth().then(isHealthy => {
            if (!isHealthy) {
                console.warn('⚠️ Backend appears to be offline or misconfigured');
                console.log('💡 Recommended actions:');
                console.log('1. Visit:', HEALTH_URL, 'to wake up Railway');
                console.log('2. Check Railway dashboard for deployment status');
                console.log('3. Wait 30 seconds and try again');
                
                // Show warning to user
                if (contactForm) {
                    showNotification('Backend connection unstable. Messages may not be delivered.', 'warning', 5000);
                }
            }
        });
    }, 2000);
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { 
                transform: translateX(100%); 
                opacity: 0; 
            }
            to { 
                transform: translateX(0); 
                opacity: 1; 
            }
        }
        @keyframes slideOut {
            from { 
                transform: translateX(0); 
                opacity: 1; 
            }
            to { 
                transform: translateX(100%); 
                opacity: 0; 
            }
        }
        
        .notification-close:hover {
            opacity: 1 !important;
        }
        
        /* Loading spinner animation */
        .fa-spinner {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Smooth transitions */
        .section {
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .section.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // Log final initialization
    console.log('✅ Portfolio Frontend Fully Initialized');
    console.log('📧 Contact Form Ready');
    console.log('🌐 Backend URL:', BACKEND_URL);
    console.log('🎨 Theme System: Active');
    console.log('📱 Responsive Navigation: Active');
});

