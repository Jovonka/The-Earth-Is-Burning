let isZooming = false;
let isTextFinished = false;
let lastScrollPos = 0;
let scrollSpeed = 2.5; // Adjusted for a more natural feel
let zoomTriggered = false;
let targetScroll = 0;
let isScrolling = false;

// Ensure the scroll position resets to the top when the page is refreshed
window.addEventListener('beforeunload', function () {
    window.scrollTo(0, 0);
});

// Reset scroll position after the page finishes loading
window.addEventListener('load', function () {
    window.scrollTo(0, 0);
});

// Custom scroll handler
document.addEventListener("wheel", function (event) {
    if (isZooming || isScrollingUpWhileTextAnimating()) {
        event.preventDefault();
        return;
    }

    let delta = event.deltaY > 0 ? scrollSpeed * 20 : -scrollSpeed * 20;
    targetScroll += delta;
    targetScroll = Math.max(0, Math.min(document.body.scrollHeight - window.innerHeight, targetScroll));

    if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(smoothScroll);
    }

    handleScroll();
}, { passive: false });

// Prevent jumpy scrolling when the text is animating
function isScrollingUpWhileTextAnimating() {
    const scrollPos = window.scrollY;
    const sectionTwo = document.querySelector(".parallax-section");
    const text = document.querySelector(".scroll-in-text");

    if (text && sectionTwo) {
        let sectionBottom = sectionTwo.getBoundingClientRect().bottom;
        if (scrollPos < lastScrollPos && sectionBottom <= window.innerHeight && !isTextFinished) {
            return true;
        }
    }
    return false;
}
const zoomButton = document.querySelector(".zoom-button");
if (zoomButton) {
    zoomButton.style.display = "block"; // Ensure it's always visible
    zoomButton.classList.add("visible"); // Add visibility class if needed
}

// Handle animations based on scroll
function handleScroll() {
    let scrollPos = window.scrollY;
    let scrollDirection = scrollPos > lastScrollPos ? "down" : "up";
    lastScrollPos = scrollPos;

    const scrollText = document.querySelector(".scroll-text");
    const asset3 = document.querySelector(".asset3");
    const asset2 = document.querySelector(".asset2");
    const asset1 = document.querySelector(".asset1");
    const asset202  = document.querySelector(".asset202");
    if (scrollText) scrollText.style.transform = `translateY(${scrollPos * 0.5}px)`;
    if (asset3) asset3.style.transform = `translateY(${scrollPos * -0.07}px)`;
    if (asset202) asset202.style.transform = `translateX(${scrollPos * -0.01}px)`;


    if (asset2) asset2.style.transform = `translateX(${scrollPos * -0.01}px)`;

    const text = document.querySelector(".scroll-in-text");
    const sectionTwo = document.querySelector(".parallax-section");
    const zoomButton = document.querySelector(".zoom-button");

    if (text && sectionTwo) {
        let sectionBottom = sectionTwo.getBoundingClientRect().bottom;

        if (sectionBottom <= window.innerHeight && !isTextFinished) {
            // Start the fade-in animation when text comes into view
            text.style.transition = "opacity 1s ease-out";
            text.style.opacity = "1"; // Fade in the text
            text.style.right = "100%"; // You can keep the previous logic if you still want the sliding effect.
        }

        if (sectionBottom <= window.innerHeight && !zoomButton.classList.contains("visible")) {
            zoomButton.style.display = "block";
            zoomButton.classList.add("visible");
        }
    }

    if (text && !isZooming) {
        text.addEventListener(
            "transitionend",
            function () {
                isTextFinished = true;
            },
            { once: true }
        );
    }

    // Reverse animation on scroll up
    if (scrollDirection === "up" && text && isTextFinished) {
        text.style.transition = "right 0.5s ease-in";
        text.style.right = "1%";
    }

    // Bring text back on screen when scrolling down
    if (scrollDirection === "down" && text) {
        text.style.transition = "right 0.5s ease-out";
        text.style.transitionDelay = "0.5s";
        text.style.right = "2%";
    }
}

// Zoom effect when button is clicked
document.querySelector(".zoom-button")?.addEventListener("click", function () {
    applyZoomEffect();
});

function applyZoomEffect() {
    const sectionZoom = document.querySelector(".zoom-section");
    const assets = sectionZoom ? sectionZoom.querySelectorAll("*") : [];
    const asset1 = document.querySelector(".asset1"); // Select asset1
    const body = document.body;

    if (sectionZoom && !isZooming) {
        isZooming = true;

        // Temporarily disable mix-blend-mode on asset1 to prevent visual oddities during zoom
        if (asset1) {
            asset1.style.mixBlendMode = "normal"; // Disable color-dodge blending
        }

        // Apply zoom effect from the left side, with bloom effect starting at 50% brightness
        sectionZoom.style.transition = "background-color 3s ease, transform 6s ease, filter 6s ease"; // Slow down zoom and filter transition
        sectionZoom.style.backgroundColor = "white"; // Fade background to white
        sectionZoom.style.transform = "scale(7)";
        sectionZoom.style.transformOrigin = "left center"; // Zoom from the left side
        sectionZoom.style.filter = "brightness(5)"; // Start with 50% brightness

        // Fade all assets inside the zoom-section to white
        assets.forEach((asset) => {
            asset.style.transition = "opacity 9s ease"; // Smooth fade for each asset (slower)
            asset.style.opacity = "0"; // Fade assets to transparent
        });

        // Apply body background transition to white as well
        body.style.transition = "background-color 3s ease";
        body.style.backgroundColor = "white"; // Start fading the body to white

        document.body.style.overflow = "hidden";
        let interval = setInterval(() => {
            window.scrollBy(0, 2);
        }, 16);

        setTimeout(() => {
            // Increase brightness to simulate bloom effect
            sectionZoom.style.filter = "brightness(5)"; // Increase brightness for bloom effect

            clearInterval(interval);
            document.body.style.overflow = "auto";
        }, 3000); // Wait until zoom transition is complete
    }
}

// Reverse zoom effect function
function reverseZoomEffect() {
    const sectionZoom = document.querySelector(".zoom-section");
    if (sectionZoom) {
        sectionZoom.style.transition = "transform 1s ease";
        sectionZoom.style.transform = "scale(1)";

        setTimeout(() => {
            document.body.style.overflow = "auto";
            isZooming = false;
        }, 1000);
    }
}

// Scroll listener to animate assets on scroll
document.addEventListener("scroll", function () {
    let scrollPos = window.scrollY;

    // Animate asset01 to move right on scroll down
    const asset01 = document.querySelector(".asset01");
    if (asset01) {
        let asset01Translate = (scrollPos * 0.02); // Move to the right on scroll down
        asset01.style.transform = `translateX(${2 + asset01Translate}%)`;
    }

    // Animate asset02 to move left on scroll down
    const asset02 = document.querySelector(".asset02");
    if (asset02) {
        let asset02Translate = (scrollPos * -0.02); // Move to the left on scroll down
        asset02.style.transform = `translateX(${asset02Translate}%)`;
    }

    // When scrolling up, reset assets to their original positions
    if (scrollPos < lastScrollPos) {
        if (asset01) {
            asset01.style.transform = `translateX(100%)`;
        }

        if (asset02) {
            asset02.style.transform = `translateX(-100%)`;
        }
    }

    lastScrollPos = scrollPos; // Update the last scroll position
});

document.querySelector(".zoom-button")?.addEventListener("click", function () {
    this.classList.add("clicked"); // Stop flashing on click
});

document.getElementById("zoomBtn").addEventListener("click", function() {
    let section = document.getElementById("zoomSection");
    section.style.visibility = "visible"; // Make it visible
    section.style.opacity = "0.5"; // Fade in
    section.style.transform = "scale(5)"; // Normal size
});
document.getElementById("zoomBtn").addEventListener("click", function() {
    document.body.style.transition = "opacity 5s ease-in-out"; 
    document.body.style.opacity = "0"; // Fade out effect

    setTimeout(() => {
        window.location.href = "section2.html"; // Redirect to new page after fade-out
    }, 700); // Matches the fade-out duration
});
