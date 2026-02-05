// Smooth Scroll with Glide Effect
(function() {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    // Smooth scroll variables
    let targetY = 0;
    let currentY = 0;
    let ease = 0.08; // Lower = more glide (0.05-0.15 range)
    let rafId = null;
    let isScrolling = false;

    // Initialize
    function init() {
        currentY = window.scrollY;
        targetY = currentY;
    }

    // Lerp function for smooth interpolation
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Animation loop
    function smoothScroll() {
        currentY = lerp(currentY, targetY, ease);

        // Stop animation when close enough
        if (Math.abs(targetY - currentY) < 0.5) {
            currentY = targetY;
            window.scrollTo(0, currentY);
            isScrolling = false;
            rafId = null;
            return;
        }

        window.scrollTo(0, currentY);
        rafId = requestAnimationFrame(smoothScroll);
    }

    // Handle wheel event
    function onWheel(e) {
        e.preventDefault();

        // Calculate new target position
        const delta = e.deltaY * 1.2; // Scroll speed multiplier
        targetY += delta;

        // Clamp to page bounds
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        targetY = Math.max(0, Math.min(targetY, maxScroll));

        // Start animation if not already running
        if (!isScrolling) {
            isScrolling = true;
            rafId = requestAnimationFrame(smoothScroll);
        }
    }

    // Handle keyboard scrolling
    function onKeydown(e) {
        const scrollAmount = window.innerHeight * 0.8;

        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            targetY += scrollAmount;
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            targetY -= scrollAmount;
        } else if (e.key === 'Home') {
            e.preventDefault();
            targetY = 0;
        } else if (e.key === 'End') {
            e.preventDefault();
            targetY = document.documentElement.scrollHeight - window.innerHeight;
        } else if (e.key === ' ') {
            e.preventDefault();
            targetY += e.shiftKey ? -scrollAmount : scrollAmount;
        } else {
            return;
        }

        // Clamp
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        targetY = Math.max(0, Math.min(targetY, maxScroll));

        if (!isScrolling) {
            isScrolling = true;
            rafId = requestAnimationFrame(smoothScroll);
        }
    }

    // Sync on touch/click scroll
    function onScroll() {
        if (!isScrolling) {
            currentY = window.scrollY;
            targetY = currentY;
        }
    }

    // Initialize and attach events
    init();

    // Only apply smooth scroll on desktop (not touch devices)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('keydown', onKeydown);
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Handle resize
    window.addEventListener('resize', function() {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        targetY = Math.max(0, Math.min(targetY, maxScroll));
        currentY = Math.max(0, Math.min(currentY, maxScroll));
    });
})();
