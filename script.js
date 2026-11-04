
/* =================================
   PIXELFORGE — JAVASCRIPT
   Smooth 3D showcase animation
================================= */


/* MOBILE NAVIGATION */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", isOpen);
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}


/* FOOTER YEAR */

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* =================================
   GENERAL SCROLL REVEAL
================================= */

const revealElements = document.querySelectorAll(
    ".section-heading, .project-card, .about-left, .about-right, .service-item, .process-card, .contact-content"
);

revealElements.forEach(element => {
    element.classList.add("reveal");
});

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});


/* =================================
   PIXELFORGE 3D SHOWCASE
================================= */

const showcase = document.querySelector(".scroll-showcase");
const showcaseStage = document.querySelector(".showcase-stage");

const showcaseCards = document.querySelectorAll(".showcase-card");
const showcaseWords = document.querySelectorAll(".showcase-word");
const showcaseSubtitle = document.querySelector(".showcase-subtitle");

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

let targetProgress = 0;
let currentProgress = 0;
let animationFrame = null;


/* Smooth easing */

function clamp(value, min = 0, max = 1) {
    return Math.min(Math.max(value, min), max);
}

function easeOutCubic(value) {
    return 1 - Math.pow(1 - clamp(value), 3);
}

function easeInOut(value) {
    return value < 0.5
        ? 4 * value * value * value
        : 1 - Math.pow(-2 * value + 2, 3) / 2;
}


/* Calculate how far through the showcase we are */

function calculateProgress() {
    if (!showcase) return 0;

    const rect = showcase.getBoundingClientRect();

    const scrollDistance =
        showcase.offsetHeight - window.innerHeight;

    if (scrollDistance <= 0) return 0;

    return clamp(-rect.top / scrollDistance);
}


/* =================================
   3D CARD MOVEMENT
================================= */

function animateCards(progress) {

    const isMobile = window.innerWidth < 650;

    const radiusX = isMobile ? 125 : 365;
    const radiusY = isMobile ? 115 : 215;

    // Cards emerge from darkness during the first part.
    const emergence = easeOutCubic(
        (progress - 0.015) / 0.36
    );

    // Later, the cards begin slowly orbiting.
    const orbitProgress = easeInOut(
        clamp((progress - 0.25) / 0.65)
    );

    // Cards fade into the background as the text takes over.
    const fadeOut = easeInOut(
        clamp((progress - 0.64) / 0.29)
    );

    showcaseCards.forEach((card, index) => {

        const baseAngle =
            (index / showcaseCards.length) * Math.PI * 2;

        const angle =
            baseAngle + orbitProgress * 0.9;

        // Position around the centre.
        const x = Math.cos(angle) * radiusX * emergence;
        const y = Math.sin(angle) * radiusY * emergence;

        // Grow towards the viewer.
        const scale = 0.24 + emergence * 0.82;

        // Move from deep inside the screen towards the viewer.
        const depth = -1050 * (1 - emergence);

        // Give every card a different 3D angle.
        const rotateX =
            Math.sin(angle) * (isMobile ? 9 : 14);

        const rotateY =
            Math.cos(angle) * (isMobile ? 11 : 17);

        const rotateZ =
            Math.sin(angle + 0.5) * 7;

        // Subtle floating movement.
        const float = Math.sin(
            progress * Math.PI * 4 + index * 1.4
        ) * 10 * emergence;

        const opacity = Math.min(
            emergence * 1.8,
            1
        ) * (1 - fadeOut * 0.82);

        card.style.opacity = opacity.toFixed(3);

        card.style.zIndex = Math.round(
            5 + Math.sin(angle) * 3
        );

        card.style.transform = `
            translate(-50%, -50%)
            translate3d(${x}px, ${y + float}px, ${depth}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            rotateZ(${rotateZ}deg)
            scale(${scale})
        `;

        // Slightly reduce lighting while the cards are hidden.
        card.style.filter = `
            brightness(${0.65 + emergence * 0.35})
            saturate(${0.75 + emergence * 0.25})
        `;

    });

}


/* =================================
   WORD REVEAL
================================= */

function animateWords(progress) {

    const revealPoints = [
        0.35,
        0.47,
        0.59,
        0.71
    ];

    showcaseWords.forEach((word, index) => {

        const visible = progress >= revealPoints[index];

        word.classList.toggle("visible", visible);

    });

    if (showcaseSubtitle) {
        showcaseSubtitle.classList.toggle(
            "visible",
            progress >= 0.83
        );
    }

}


/* =================================
   MAIN ANIMATION LOOP
================================= */

function renderShowcase() {

    if (!showcase || !showcaseStage) return;

    if (reducedMotion) {
        currentProgress = targetProgress;
    } else {
        // Smoothly catch up with the scroll position.
        currentProgress +=
            (targetProgress - currentProgress) * 0.105;

        if (Math.abs(targetProgress - currentProgress) < 0.0005) {
            currentProgress = targetProgress;
        }
    }

    animateCards(currentProgress);
    animateWords(currentProgress);

    showcaseStage.style.setProperty(
        "--showcase-progress",
        currentProgress
    );

    if (Math.abs(targetProgress - currentProgress) > 0.0005) {
        animationFrame = requestAnimationFrame(renderShowcase);
    } else {
        animationFrame = null;
    }

}


/* Request an animation update */

function requestShowcaseUpdate() {

    targetProgress = calculateProgress();

    if (animationFrame === null) {
        animationFrame = requestAnimationFrame(renderShowcase);
    }

}


/* Listen to scrolling and resizing */

window.addEventListener(
    "scroll",
    requestShowcaseUpdate,
    { passive: true }
);

window.addEventListener(
    "resize",
    requestShowcaseUpdate
);


/* Initial state */

if (showcase && showcaseStage) {

    showcaseCards.forEach(card => {
        card.classList.remove("arrived");
        card.style.opacity = "0";
    });

    targetProgress = calculateProgress();
    currentProgress = targetProgress;

    renderShowcase();

}
