// ========================================
// THEME TOGGLE - DARK MODE
// Stackly Resort & Hotel Booking System
// ========================================

(function() {
    'use strict';

    // ======================================
    // THEME INITIALIZATION
    // ======================================

    function initTheme() {
        // Get saved theme from localStorage or default to light
        const savedTheme = localStorage.getItem('stackly_theme') || 'light';
        applyTheme(savedTheme);
    }

    // ======================================
    // APPLY THEME
    // ======================================

    function applyTheme(theme) {
        const html = document.documentElement;

        if (theme === 'dark') {
            html.setAttribute('data-theme', 'dark');
        } else {
            html.removeAttribute('data-theme');
        }

        // Update toggle button icon
        updateToggleIcon(theme);

        // Save to localStorage
        localStorage.setItem('stackly_theme', theme);
    }

    // ======================================
    // UPDATE TOGGLE ICON
    // ======================================

    function updateToggleIcon(theme) {
        const toggleBtn = document.querySelector('.theme-toggle');
        if (!toggleBtn) return;

        const icon = toggleBtn.querySelector('i');
        if (!icon) return;

        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
            toggleBtn.setAttribute('aria-label', 'Switch to light mode');
        } else {
            icon.className = 'fa-solid fa-moon';
            toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
        }
    }

    // ======================================
    // TOGGLE THEME
    // ======================================

    function toggleTheme() {
        const currentTheme = localStorage.getItem('stackly_theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        // Add transition animation
        document.documentElement.style.transition = 'background 0.3s ease, color 0.3s ease';

        applyTheme(newTheme);

        // Remove transition after animation completes
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);

        // Show toast notification
        if (typeof showSuccess === 'function') {
            const message = newTheme === 'dark' ? '🌙 Dark mode enabled' : '☀️ Light mode enabled';
            showSuccess(message);
        }
    }

    // ======================================
    // CREATE THEME TOGGLE BUTTON
    // ======================================

    function createToggleButton() {
        // Check if button already exists
        if (document.querySelector('.theme-toggle')) return;

        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.setAttribute('aria-label', 'Toggle theme');
        button.innerHTML = '<i class="fa-solid fa-moon"></i>';

        button.addEventListener('click', toggleTheme);

        document.body.appendChild(button);
    }

    // ======================================
    // INITIALIZE ON PAGE LOAD
    // ======================================

    window.addEventListener('DOMContentLoaded', () => {
        // Apply saved theme immediately
        initTheme();

        // Create toggle button
        createToggleButton();

        console.log('🎨 Theme system initialized');
    });

    // Expose toggle function globally for manual calls
    window.toggleTheme = toggleTheme;
    window.applyTheme = applyTheme;

})();
