(function() {
    // Skip on mobile - already has native momentum scrolling
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return;

    var target = window.scrollY;
    var current = window.scrollY;
    var animating = false;
    var ease = 0.075;

    window.addEventListener('wheel', function(e) {
        e.preventDefault();
        var delta = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY;
        target += delta;
        var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (target < 0) target = 0;
        if (target > maxScroll) target = maxScroll;
        if (!animating) {
            animating = true;
            requestAnimationFrame(step);
        }
    }, { passive: false });

    function step() {
        current += (target - current) * ease;
        if (Math.abs(target - current) < 0.5) {
            current = target;
            animating = false;
        }
        window.scrollTo(0, current);
        if (animating) requestAnimationFrame(step);
    }

    // Sync when scrolling via keyboard or scrollbar drag
    window.addEventListener('scroll', function() {
        if (!animating) {
            target = window.scrollY;
            current = window.scrollY;
        }
    });
})();
