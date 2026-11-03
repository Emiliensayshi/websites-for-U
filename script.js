/* =================================
   PIXELFORGE — MAIN JAVASCRIPT
================================= */


/* =================================
   MOBILE NAVIGATION
================================= */

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        const isOpen = navLinks.classList.toggle("open");

        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", isOpen);
        document.body.classList.toggle("menu-open", isOpen);

    });

    navItems.forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("open");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            document.body.classList.remove("menu-open");

        });

    });

}


/* =================================
   SCROLL REVEAL ANIMATIONS
================================= */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries, observer) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("visible");
            observer.unobserve(entry.target);

        }

    });

}, {
    threshold: 0.12
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});


/* =================================
   SCROLL-DRIVEN 3D SHOWCASE
================================= */

const showcase = document.querySelector(".scroll-showcase");

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

if (showcase) {

    let showcaseTicking = false;

    function updateShowcase() {

        if (reducedMotion.matches) {
            showcase.style.setProperty("--showcase-progress", 0);
            showcaseTicking = false;
            return;
        }

        const rect = showcase.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        /*
           Progress changes as the showcase moves
           through the viewport.

           0 = beginning
           1 = end
        */

        const progress = Math.max(
            0,
            Math.min(
                1,
                (windowHeight - rect.top) /
                (windowHeight + rect.height)
            )
        );

        showcase.style.setProperty(
            "--showcase-progress",
            progress.toFixed(3)
        );

        showcaseTicking = false;

    }


    function requestShowcaseUpdate() {

        if (!showcaseTicking) {

            requestAnimationFrame(updateShowcase);
            showcaseTicking = true;

        }

    }


    window.addEventListener(
        "scroll",
        requestShowcaseUpdate,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        requestShowcaseUpdate
    );

    reducedMotion.addEventListener(
        "change",
        requestShowcaseUpdate
    );

    updateShowcase();

}


/* =================================
   3D PROJECT IMAGE SCROLL EFFECT
================================= */

const projectImages = document.querySelectorAll(".scroll-3d");

if (projectImages.length > 0) {

    let projectTicking = false;

    function updateProjectImages() {

        if (reducedMotion.matches) {

            projectImages.forEach(image => {
                image.style.setProperty("--scroll-rotate", "0deg");
                image.style.setProperty("--scroll-tilt", "0deg");
                image.style.setProperty("--scroll-lift", "0px");
            });

            projectTicking = false;
            return;

        }

        const windowHeight = window.innerHeight;

        projectImages.forEach(image => {

            const rect = image.getBoundingClientRect();

            const imageCentre = rect.top + rect.height / 2;
            const distanceFromCentre = imageCentre - windowHeight / 2;

            const normalisedDistance = Math.max(
                -1,
                Math.min(
                    1,
                    distanceFromCentre / (windowHeight / 1.5)
                )
            );

            const rotate = normalisedDistance * -3;
            const tilt = normalisedDistance * 2;
            const lift = Math.abs(normalisedDistance) * -8;

            image.style.setProperty(
                "--scroll-rotate",
                `${rotate}deg`
            );

            image.style.setProperty(
                "--scroll-tilt",
                `${tilt}deg`
            );

            image.style.setProperty(
                "--scroll-lift",
                `${lift}px`
            );

        });

        projectTicking = false;

    }


    function requestProjectUpdate() {

        if (!projectTicking) {

            requestAnimationFrame(updateProjectImages);
            projectTicking = true;

        }

    }


    window.addEventListener(
        "scroll",
        requestProjectUpdate,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        requestProjectUpdate
    );

    updateProjectImages();

}


/* =================================
   AUTOMATIC FOOTER YEAR
================================= */

const yearElement = document.querySelector("#current-year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}
