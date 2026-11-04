/* =================================
   PIXELFORGE — JAVASCRIPT
================================= */


/* =================================
   MOBILE NAVIGATION
================================= */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
        });
    });
}


/* =================================
   FOOTER YEAR
================================= */

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* =================================
   SCROLL REVEAL
================================= */

const revealElements = document.querySelectorAll(
    ".section-heading, .project-card, .about-left, .about-right, .service-item, .process-card, .contact-content"
);

revealElements.forEach(element => {
    element.classList.add("reveal");
});

const revealObserver = new IntersectionObserver((entries) => {
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
   PINNED SCROLL SHOWCASE
================================= */

const showcase = document.querySelector(".scroll-showcase");
const showcaseStage = document.querySelector(".showcase-stage");

const showcaseCards = document.querySelectorAll(".showcase-card");
const showcaseWords = document.querySelectorAll(".showcase-word");
const showcaseSubtitle = document.querySelector(".showcase-subtitle");

let showcaseProgress = 0;
let showcaseFrame = null;


/* Cards animate into position */

window.addEventListener("load", () => {

    showcaseCards.forEach((card, index) => {

        setTimeout(() => {
            card.classList.add("arrived");
        }, 350 + index * 180);

    });

});


/* Calculate showcase scroll progress */

function updateShowcase() {

    if (!showcase || !showcaseStage) return;

    const rect = showcase.getBoundingClientRect();

    const totalScrollDistance =
        showcase.offsetHeight - window.innerHeight;

    const distanceTravelled = -rect.top;

    showcaseProgress = Math.min(
        Math.max(distanceTravelled / totalScrollDistance, 0),
        1
    );


    /* Reveal words progressively */

    showcaseWords.forEach((word, index) => {

        const revealPoint = 0.12 + index * 0.19;

        if (showcaseProgress >= revealPoint) {
            word.classList.add("visible");
        } else {
            word.classList.remove("visible");
        }

    });


    /* Reveal subtitle */

    if (showcaseProgress >= 0.78) {
        showcaseSubtitle.classList.add("visible");
    } else {
        showcaseSubtitle.classList.remove("visible");
    }


    /* Move cards around the centre */

    const angle = showcaseProgress * Math.PI * 2;

    showcaseCards.forEach((card, index) => {

        const cardAngle =
            angle + (index * (Math.PI * 2 / showcaseCards.length));

        const radiusX = window.innerWidth < 650 ? 135 : 360;
        const radiusY = window.innerWidth < 650 ? 120 : 210;

        const x = Math.cos(cardAngle) * radiusX;
        const y = Math.sin(cardAngle) * radiusY;

        const rotation = showcaseProgress * 360 + index * 35;

        const scale = 0.85 + Math.sin(cardAngle) * 0.12;

        card.style.transform = `
            translate(-50%, -50%)
            translate(${x}px, ${y}px)
            rotate(${rotation}deg)
            scale(${scale})
        `;

    });


    /* Subtle orbit movement */

    showcaseStage.style.setProperty(
        "--showcase-progress",
        showcaseProgress
    );

}


/* Avoid running the scroll calculation excessively */

function requestShowcaseUpdate() {

    if (showcaseFrame !== null) return;

    showcaseFrame = requestAnimationFrame(() => {
        updateShowcase();
        showcaseFrame = null;
    });

}

window.addEventListener("scroll", requestShowcaseUpdate, {
    passive: true
});

window.addEventListener("resize", requestShowcaseUpdate);

updateShowcase();


/* =================================
   SHOWCASE INTRO
================================= */

if (showcase) {

    const showcaseObserver = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                showcaseCards.forEach((card, index) => {

                    setTimeout(() => {
                        card.classList.add("arrived");
                    }, index * 150);

                });
            }

        });

    }, {
        threshold: 0.15
    });

    showcaseObserver.observe(showcase);

}
