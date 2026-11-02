
/* =================================
   PIXELFORGE — INTERACTIONS
================================= */

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");


// MOBILE NAVIGATION

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", isOpen);
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});


// REDUCED MOTION

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;


// SCROLL REVEALS

const revealElements = document.querySelectorAll(".reveal");

if (reduceMotion) {
  revealElements.forEach(element => {
    element.classList.add("visible");
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
}


// WORD-BY-WORD TEXT REVEALS

const textElements = document.querySelectorAll(".word-reveal");

textElements.forEach(element => {
  const parts = element.innerHTML.split(/(<br\s*\/?>)/gi);

  element.innerHTML = parts.map(part => {
    if (/^<br/i.test(part)) {
      return part;
    }

    return part.split(/(\s+)/).map(word => {
      if (!word.trim()) {
        return word;
      }

      return `
        <span class="word">
          <span class="word-inner">${word}</span>
        </span>
      `;
    }).join("");
  }).join("");
});


if (reduceMotion) {
  textElements.forEach(element => {
    element.classList.add("visible");
  });
} else {
  const textObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const words = entry.target.querySelectorAll(
            ".word-inner"
          );

          words.forEach((word, index) => {
            word.style.transitionDelay = `${index * 85}ms`;
          });

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2
    }
  );

  textElements.forEach(element => {
    textObserver.observe(element);
  });
}


// GENTLE PROJECT IMAGE PARALLAX

if (!reduceMotion) {
  const projectImages = document.querySelectorAll(".project-image img");

  let ticking = false;

  function updateParallax() {
    projectImages.forEach(image => {
      const rect = image.getBoundingClientRect();

      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        return;
      }

      const progress =
        (window.innerHeight - rect.top) /
        (window.innerHeight + rect.height);

      const movement = (progress - 0.5) * 12;

      image.style.setProperty(
        "--parallax-y",
        `${movement}px`
      );
    });

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  updateParallax();
}


// PAGE LOAD

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
