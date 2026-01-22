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

// ===== Email Handler =====
function setupEmailHandler() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (navigator.clipboard && window.isSecureContext) {
                e.preventDefault();
                const email = this.href.replace('mailto:', '');
                
                navigator.clipboard.writeText(email).then(() => {
                    showNotification('Email copied to clipboard!', 'success');
                    
                    setTimeout(() => {
                        window.location.href = `mailto:${email}`;
                    }, 500);
                }).catch(err => {
                    console.error('Failed to copy email: ', err);
                });
            }
        });
    });
}

// ===== Resume Download =====
function setupResumeDownload() {
    resumeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const resumeContent = `DHINESHWARAN P
========================

OBJECTIVE
---------
Enthusiastic and proactive undergraduate with a strong academic foundation and a keen interest in Full Stack Development. Skilled in Java, HTML, CSS, JavaScript. A quick learner and effective team player, passionate about contributing to meaningful projects and gaining practical experience in a dynamic environment. Seeking an internship opportunity to apply my knowledge, develop industry-relevant skills, and deliver impactful results.

EDUCATION
---------
PSNA College of Engineering and Technology
• B.E - Computer Science and Engineering (2023 - 2027)
• GPA: 8.76/10
• Location: Dindigul, Tamil Nadu

Devangar Higher Secondary School
• Secondary Education (2022-23)
• Percentage: 88.16%
• Location: Aruppukkottai, Tamil Nadu

SKILLS
------
• Programming Languages: Java, JavaScript
• Web Technologies: HTML, CSS
• Tools: Eclipse, VS Code, GitHub

CODING PROFILES
---------------
• LeetCode: 50+ problems solved - https://leetcode.com/u/Dhineshwaran_P/
• HackerRank: 20+ problems solved, Silver Badge holder in Problem Solving - https://www.hackerrank.com/profile/apkpdhineshwaran

ACHIEVEMENTS
------------
• 🏆 ASTA'25 National Level Technical Symposium - Won First Prize at ASTA'25 organized by Selvam College of Technology
• 🚀 SIH 2025 Hackathon - Participated in Smart India Hackathon 2025 at PSNACET
• Paper presentation at PSG Institute of Technology
• Silver badge holder in Problem Solving on HackerRank
• Codeathon participant at KPR College, Coimbatore

CERTIFICATIONS
--------------
• CodeChef Certification Course: Python
• NPTEL Certification: Data Structure and Algorithm using Java
• NPTEL Certification: Fundamentals of OOPS

EXPERIENCE
----------
Frontend Developer Intern, Innomatics Research Lab
• Developed responsive user interfaces using HTML, CSS, and JavaScript as part of real-time client projects
• Collaborated with backend team for dynamic content rendering

Web Development Intern, Zidio Development
• Developed responsive Excel analytics platform using HTML, CSS, and JavaScript as part of real-time client projects

PROJECTS
--------
Coffee Shop Website
• Responsive website showcasing coffee products and information
• Live Demo: https://dhineshwaranp.github.io/innomaticsAssignment2/
• Source Code: https://github.com/dhineshwaranP/innomaticsAssignment2

Library Management System
• A simple web-based Library Management System to add, update, issue, and manage books easily using HTML, CSS, JS, Flask, and MySQL

CONTACT
-------
• Email: apkpdhinesh2005@gmail.com
• GitHub: https://github.com/dhineshwaranP
• LinkedIn: https://www.linkedin.com/in/dhineshwaran-p-050bb3298
• LeetCode: https://leetcode.com/u/Dhineshwaran_P/
• HackerRank: https://www.hackerrank.com/profile/apkpdhineshwaran

---
Last Updated: ${new Date().toLocaleDateString()}`;

        const blob = new Blob([resumeContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Dhineshwaran-P-Frontend-Developer-Resume.txt';
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            showNotification('Resume downloaded successfully!', 'success');
        }, 100);
    });
}

// ===== CONTACT FORM HANDLER (NEW - Backend Integration) =====
function setupContactForm() {
    // Backend URL configuration
    const BACKEND_URL = window.location.hostname.includes('localhost') || 
                       window.location.hostname.includes('127.0.0.1')
        ? 'http://localhost:3000/api/contact/send'
        : 'https://dhinesh-portfolio-backend.onrender.com/api/contact/send'; // Your deployed backend URL
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const name = contactName.value.trim();
        const email = contactEmail.value.trim();
        const message = contactMessage.value.trim();
        
        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }
        
        if (name.length < 2) {
            showNotification('Name must be at least 2 characters.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        if (message.length < 10) {
            showNotification('Message must be at least 10 characters.', 'error');
            return;
        }
        
        // Save original button state
        const originalButtonHTML = contactSubmit.innerHTML;
        const originalButtonText = contactSubmit.textContent;
        
        // Show loading state
        contactSubmit.disabled = true;
        contactSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Create form data
        const formData = {
            name: name,
            email: email,
            message: message
        };
        
        try {
            // Send to backend
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                mode: 'cors'
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Success
                showNotification(data.message || 'Message sent successfully! I\'ll get back to you soon.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Add success animation to form
                contactForm.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    contactForm.style.transform = 'scale(1)';
                }, 300);
                
            } else {
                // Error from backend
                showNotification(data.message || 'Failed to send message. Please try again.', 'error');
            }
            
        } catch (error) {
            console.error('Error sending message:', error);
            
            // Network error
            showNotification(
                'Unable to connect to server. Please check your internet connection and try again.', 
                'error'
            );
            
        } finally {
            // Restore button state
            contactSubmit.disabled = false;
            contactSubmit.innerHTML = originalButtonHTML;
        }
    });
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// ===== Notification System =====
function showNotification(message, type = 'success', duration = 3000) {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    
    notification.innerHTML = `
        <i class="fas fa-${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        color: var(--text-primary);
        padding: 15px 20px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: var(--shadow-lg);
        border: 1px solid ${getNotificationBorderColor(type)};
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 350px;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, duration);
}

function getNotificationBorderColor(type) {
    switch(type) {
        case 'success': return 'var(--primary-color)';
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        case 'info': return '#3b82f6';
        default: return 'var(--border-color)';
    }
}

// ===== Back to Top =====
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navHeight = navbar.offsetHeight;
            window.scrollTo({
                top: targetElement.offsetTop - navHeight - 20,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Project Link Analytics =====
function trackProjectClicks() {
    const projectLinks = document.querySelectorAll('.project-link-btn, .project-link');
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const projectName = this.closest('.project-card').querySelector('h3').textContent;
            const linkType = this.textContent.includes('Demo') ? 'Live Demo' : 'Source Code';
            
            console.log(`Clicked ${linkType} for project: ${projectName}`);
        });
    });
}

// ===== Initialize Everything =====
function init() {
    currentYear.textContent = new Date().getFullYear();
    
    initTheme();
    
    setTimeout(typeEffect, 1000);
    
    checkScroll();
    
    window.addEventListener('scroll', checkScroll);
    
    enhanceSocialLinks();
    setupEmailHandler();
    setupResumeDownload();
    setupContactForm(); // Initialize contact form handler
    trackProjectClicks();
    
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
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
    `;
    document.head.appendChild(notificationStyles);
}

document.addEventListener('DOMContentLoaded', init);