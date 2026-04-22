/**
 * navbar.js
 * Automatically loads navbar.html into #navbar-placeholder and highlights the active link.
 */

document.addEventListener('DOMContentLoaded', function () {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    fetch('navbar.html')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load navbar.html');
            return response.text();
        })
        .then(html => {
            placeholder.innerHTML = html;
            highlightActiveLink();
        })
        .catch(error => {
            console.error('Navbar error:', error);
            // Fallback in case fetch fails
            placeholder.innerHTML = '<div style="padding:10px; color:red; border:1px solid red; margin:10px; border-radius:8px;">Navbar failed to load.</div>';
        });
});

/**
 * Detects the current page and adds the .active class to the corresponding nav link.
 */
function highlightActiveLink() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    // Find the link that matches the current page
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(li => {
        const dataPage = li.getAttribute('data-page');
        if (dataPage === page) {
            li.classList.add('active');
        } else {
            li.classList.remove('active');
        }
    });
}
