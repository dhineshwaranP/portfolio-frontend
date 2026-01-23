// ===== BACKEND API URL =====
// YOUR EXACT RAILWAY URL - DO NOT CHANGE THIS
const API_URL = 'https://portfolio-backened-production-3a16.up.railway.app/api';

// ===== DOM Elements =====
const themeSwitcher = document.getElementById('theme-switcher');
const themeIcon = themeSwitcher.querySelector('i');
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
console.log('🌐 Frontend Host:', window.location.hostname);

// Test backend connection on load
window.addEventListener('load', async () => {
    try {
        const healthUrl = BACKEND_URL.replace('/api/contact/send', '/api/health');
        const response = await fetch(healthUrl, { timeout: 5000 });
        const data = await response.json();
        console.log('✅ Backend Connection Test:', data);
        
        if (data.resendConfigured) {
            console.log('📧 Email service: READY');
        } else {
            console.warn('⚠️ Email service: RESEND_API_KEY not configured');
        }
    } catch (error) {
        console.warn('⚠️ Backend connection test failed:', error.message);
        console.log('💡 Check: 1. Railway URL  2. CORS settings  3. Backend deployment');
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

themeSwitcher.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    themeSwitcher.style.transform = 'scale(0.9)';
    setTimeout(() => {
        themeSwitcher.style.transform = 'scale(1)';
    }, 150);
});

// ===== Scroll Animations =====
function checkScroll() {
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 50) {
        navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
        navbar.style.boxShadow = 'var(--shadow-sm)';
    }
    
    if (scrollPosition > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
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
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// ===== ENHANCED Contact Form Handler =====
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        const originalText = contactSubmit.innerHTML;
        contactSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        contactSubmit.disabled = true;
        
        // Get form data
        const formData = {
            name: contactName.value.trim(),
            email: contactEmail.value.trim(),
            message: contactMessage.value.trim()
        };
        
        console.log('📤 Form Submission:', {
            data: formData,
            url: BACKEND_URL,
            timestamp: new Date().toISOString()
        });
        
        // Enhanced Validation
        if (!formData.name || formData.name.length < 2) {
            showNotification('Name must be at least 2 characters', 'error', 3000);
            resetButton(originalText);
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            showNotification('Please enter a valid email address', 'error', 3000);
            resetButton(originalText);
            return;
        }
        
        if (!formData.message || formData.message.length < 10) {
            showNotification('Message must be at least 10 characters', 'error', 3000);
            resetButton(originalText);
            return;
        }
        
        try {
            console.log('🚀 Sending request to backend...');
            
            // Add timeout to prevent hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData),
                signal: controller.signal,
                mode: 'cors'
            });
            
            clearTimeout(timeoutId);
            
            console.log('📥 Response Status:', response.status, response.statusText);
            
            // Handle non-JSON responses
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('❌ Non-JSON response:', text);
                throw new Error('Server returned non-JSON response');
            }
            
            const data = await response.json();
            console.log('✅ Backend Response:', data);
            
            if (response.ok && data.success) {
                showNotification('🎉 ' + (data.message || 'Message sent successfully!'), 'success', 5000);
                contactForm.reset();
                
                // Clear floating labels
                contactName.value = '';
                contactEmail.value = '';
                contactMessage.value = '';
            } else {
                showNotification('❌ ' + (data.message || data.error || 'Failed to send message'), 'error', 4000);
            }
            
        } catch (error) {
            console.error('❌ Form Submission Error:', {
                name: error.name,
                message: error.message,
                url: BACKEND_URL
            });
            
            // Specific error messages
            if (error.name === 'AbortError') {
                showNotification('⏰ Request timeout. Please try again.', 'error', 4000);
            } else if (error.message.includes('Failed to fetch')) {
                showNotification('🌐 Cannot connect to server. Check your internet connection.', 'error', 4000);
            } else if (error.message.includes('CORS')) {
                showNotification('🔒 CORS error. Please contact website administrator.', 'error', 5000);
            } else if (error.message.includes('NetworkError')) {
                showNotification('📡 Network error. Please check your connection.', 'error', 4000);
            } else {
                showNotification('❌ ' + error.message, 'error', 4000);
            }
            
        } finally {
            resetButton(originalText);
        }
        
        function resetButton(text) {
            contactSubmit.innerHTML = text;
            contactSubmit.disabled = false;
        }
    });
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
        const baseUrl = BACKEND_URL.replace('/api/contact/send', '/api/health');
        const response = await fetch(baseUrl, { 
            timeout: 5000,
            mode: 'cors'
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Backend Health:', data);
            return true;
        }
        return false;
    } catch (error) {
        console.warn('⚠️ Backend health check failed:', error.message);
        return false;
    }
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏁 DOM Loaded - Initializing Portfolio...');
    
    // Start typing animation
    typeEffect();
    
    // Initialize theme
    initTheme();
    
    // Set current year in footer
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    // Initialize scroll effects
    window.addEventListener('scroll', checkScroll);
    checkScroll();
    
    // Resume button
    if (resumeBtn) {
        resumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Opening resume...', 'info', 2000);
            // Add your resume URL here
            window.open('https://drive.google.com/your-resume-link', '_blank');
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
                console.log('💡 Check:');
                console.log('1. Visit:', 'https://portfolio-backened-production-26be.up.railway.app/api/health');
                console.log('2. Check Railway logs');
                console.log('3. Verify CORS settings in server.js');
            }
        });
    }, 1000);
    
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
    `;
    document.head.appendChild(style);
    
    // Log final initialization
    console.log('✅ Portfolio Frontend Fully Initialized');
    console.log('📧 Contact Form Ready - URL:', BACKEND_URL);
});



