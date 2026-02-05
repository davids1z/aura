// Scroll to top on page load/refresh
window.scrollTo(0, 0);
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

// Let the browser do the smoothing — native smooth scroll API
(function() {
    window.addEventListener('wheel', function(e) {
        e.preventDefault();
        window.scrollBy({ top: e.deltaY * 2, behavior: 'smooth' });
    }, { passive: false });
})();
