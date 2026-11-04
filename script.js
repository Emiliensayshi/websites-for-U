/* =========================================
   PIXELFORGE — MAIN JAVASCRIPT
========================================= */

// FOOTER YEAR
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}


// MOBILE NAVIGATION
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}


// SECTION REVEALS
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12
  }
);

document.querySelectorAll(".reveal").forEach(element => {
  revealObserver.observe(element);
});


// =========================================
// DARK ORBIT SHOWCASE ANIMATION
// =========================================

const showcase = document.querySelector(".scroll-showcase");
const stage = document.querySelector(".showcase-stage");
const cards = document.querySelectorAll(".showcase-card");

const words = document.querySelectorAll(".showcase-word");
const subtitle = document.querySelector(".showcase-subtitle");

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

let showcaseProgress = 0;
let animationFrame = null;


// Smooth easing function
function smoothStep(value) {
  return value * value * (3 - 2 * value);
}


// Keep values between 0 and 1
function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}


// Calculate showcase scroll progress
function getShowcaseProgress() {
  if (!showcase) return 0;

  const rect = showcase.getBoundingClientRect();

  const scrollDistance = showcase.offsetHeight - window.innerHeight;

  if (scrollDistance <= 0) return 0;

  const travelled = -rect.top;

  return clamp(travelled / scrollDistance);
}


// Update every card's position
function updateShowcase() {
  if (!showcase || !stage) return;

  const progress = showcaseProgress;

  const isMobile = window.innerWidth <= 650;

  // Orbit dimensions
  const radiusX = isMobile ? 115 : 310;
  const radiusY = isMobile ? 95 : 190;

  cards.forEach((card, index) => {

    // Each card starts its appearance at a slightly different time
    const revealStart = 0.025 + index * 0.055;

    const revealProgress = clamp(
      (progress - revealStart) / 0.42
    );

    const reveal = smoothStep(revealProgress);

    // Cards gradually travel out from the centre
    const currentRadiusX = radiusX * (0.12 + reveal * 0.88);
    const currentRadiusY = radiusY * (0.12 + reveal * 0.88);

    // Each card has its own starting position
    const startingAngle = (index / cards.length) * Math.PI * 2;

    // Smooth full orbit as the page scrolls
    const orbitAngle =
      startingAngle +
      progress * Math.PI * 2.1;

    // Position around the centre
    const x = Math.cos(orbitAngle) * currentRadiusX;
    const y = Math.sin(orbitAngle) * currentRadiusY;

    // Gradually grow instead of jumping towards the screen
    const scale = 0.38 + reveal * 0.52;

    // Cards gently turn as they travel around the centre
    const rotation = (orbitAngle * 180 / Math.PI) + 90;

    // Gentle 3D tilt, not a dramatic forward movement
    const tiltX = Math.sin(orbitAngle) * 9;
    const tiltY = Math.cos(orbitAngle) * 11;

    // Cards slowly become clearer
    const opacity = reveal;
    const blur = (1 - reveal) * 13;
    const brightness = 0.35 + reveal * 0.65;

    card.style.opacity = opacity.toFixed(3);

    card.style.filter =
      `blur(${blur.toFixed(2)}px) brightness(${brightness.toFixed(2)})`;

    card.style.transform = `
      translate(-50%, -50%)
      translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)
      rotate(${rotation.toFixed(2)}deg)
      rotateX(${tiltX.toFixed(2)}deg)
      rotateY(${tiltY.toFixed(2)}deg)
      scale(${scale.toFixed(3)})
    `;

    // Keep cards in front of the centre as they emerge
    card.style.zIndex = String(10 + Math.round(
      (Math.sin(orbitAngle) + 1) * 5
    ));
  });


  // WORD-BY-WORD REVEAL
  const wordPoints = [0.32, 0.43, 0.54];

  words.forEach((word, index) => {
    if (progress >= wordPoints[index]) {
      word.classList.add("visible");
    } else {
      word.classList.remove("visible");
    }
  });


  // SUBTITLE
  if (progress >= 0.69) {
    subtitle?.classList.add("visible");
  } else {
    subtitle?.classList.remove("visible");
  }
}


// Request animation frame keeps scrolling smooth
function requestShowcaseUpdate() {
  if (animationFrame) return;

  animationFrame = requestAnimationFrame(() => {
    showcaseProgress = getShowcaseProgress();
    updateShowcase();
    animationFrame = null;
  });
}


// Listen for scrolling and resizing
if (showcase && !reduceMotion) {
  window.addEventListener("scroll", requestShowcaseUpdate, {
    passive: true
  });

  window.addEventListener("resize", requestShowcaseUpdate);

  requestShowcaseUpdate();
}


// Reduced-motion fallback
if (reduceMotion) {
  cards.forEach(card => {
    card.style.opacity = "1";
    card.style.filter = "none";
    card.style.transform = "translate(-50%, -50%)";
  });

  words.forEach(word => word.classList.add("visible"));
  subtitle?.classList.add("visible");
}
