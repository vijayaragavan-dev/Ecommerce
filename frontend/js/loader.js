// Simple Loading Manager - Works Immediately
const LoadingManager = {
    hide: function() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
        const css = document.createElement('style');
        css.id = 'loading-hide-css';
        if (!document.getElementById('loading-hide-css')) {
            css.innerHTML = '.loading-overlay { display: none !important; }';
            document.head.appendChild(css);
        }
    },
    show: function() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }
};

// Auto-hide loading on page load
window.addEventListener('DOMContentLoaded', function() {
    LoadingManager.hide();
});

window.addEventListener('load', function() {
    LoadingManager.hide();
});

// Fallback - force hide after 2 seconds
setTimeout(function() {
    LoadingManager.hide();
}, 2000);

// Global error handler
window.onerror = function(msg, url, line, col, error) {
    console.log('Error caught:', msg);
    LoadingManager.hide();
    return true;
};

console.log('Loading manager initialized');
