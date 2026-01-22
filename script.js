// ===== BACKEND API URL =====
const BACKEND_URL = 'https://portfolio-backened-dqle.onrender.com/api/contact/send';

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

// ===== Contact Form Handler =====
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        contactSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        contactSubmit.disabled = true;
        
        // Get form data
        const formData = {
            name: contactName.value.trim(),
            email: contactEmail.value.trim(),
            message: contactMessage.value.trim()
        };
        
        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            showNotification('Please fill in all fields', 'error', 3000);
            contactSubmit.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
            contactSubmit.disabled = false;
            return;
        }
        
        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showNotification('Message sent successfully!', 'success', 5000);
                contactForm.reset();
            } else {
                showNotification(data.error || 'Failed to send message', 'error', 4000);
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Network error. Please try again later.', 'error', 4000);
        } finally {
            contactSubmit.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
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
            this.style.transform = 'scale(1.1)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
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
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', function() {
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
        resumeBtn.addEventListener('click', () => {
            showNotification('Opening resume...', 'info', 2000);
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
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
