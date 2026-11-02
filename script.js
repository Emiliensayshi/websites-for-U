
/* =================================
   PIXELFORGE — INTERACTIONS
================================= */

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");


// MOBILE NAVIGATION

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("open");

  menuToggle.setAttribute(
    "aria-expanded",
    nav.classList.contains("open")
  );
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});


// CHECK REDUCED MOTION PREFERENCE

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;


// SCROLL REVEALS

const revealElements = document.querySelectorAll(
  ".reveal"
);

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


// WORD-BY-WORD TEXT REVEALS

const textElements = document.querySelectorAll(
  ".text-reveal"
);

textElements.forEach(element => {
  const originalText = element.innerHTML;
  const parts = originalText.split(/(<br\s*\/?>)/gi);

  element.innerHTML = parts.map(part => {
    if (/^<br/i.test(part)) {
      return part;
    }

    return part.trim().split(/\s+/).filter(Boolean).map(word => {
      return `
        <span class="word">
          <span class="word-inner">${word}</span>
        </span>
      `;
    }).join(" ");
  }).join("");
});

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


// LASER ANIMATION

if (!reduceMotion) {

  const canvas = document.createElement("canvas");
  canvas.id = "laserCanvas";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  let width = 0;
  let height = 0;
  let pixelRatio = 1;

  let animations = [];
  let lastLaserTime = 0;

  const laserColour = "217,164,119";


  // CANVAS SIZE

  function resizeCanvas() {
    pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    ctx.setTransform(
      pixelRatio, 0,
      0, pixelRatio,
      0, 0
    );
  }

  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);


  // CREATE A NEW LASER EVENT

  function createLaserBurst() {
    const now = performance.now();

    // Prevent too many bursts at once
    if (now - lastLaserTime < 1600) {
      return;
    }

    lastLaserTime = now;

    animations.push({
      start: now,
      duration: 1050,
      x: width / 2,
      y: height * 0.48
    });
  }


  // TRIGGER WHEN SECTIONS ENTER VIEW

  const laserSections = document.querySelectorAll(
    ".work, .about, .services, .contact"
  );

  const laserObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          createLaserBurst();
        }
      });
    },
    {
      threshold: 0.3
    }
  );

  laserSections.forEach(section => {
    laserObserver.observe(section);
  });


  // EASING

  function easeOut(value) {
    return 1 - Math.pow(1 - value, 3);
  }


  // DRAW LASERS

  function drawLaser(animation, now) {
    const progress = Math.min(
      (now - animation.start) / animation.duration,
      1
    );

    const x = animation.x;
    const y = animation.y;

    const approach = easeOut(
      Math.min(progress / 0.38, 1)
    );

    const burstProgress = Math.max(
      0,
      (progress - 0.38) / 0.62
    );

    const alpha = 1 - burstProgress;

    ctx.save();

    ctx.lineCap = "round";

    // TWO BEAMS MOVING TOWARDS THE CENTRE

    if (progress < 0.38) {
      const leftStart = x - width * 0.55 * (1 - approach);
      const rightStart = x + width * 0.55 * (1 - approach);

      ctx.strokeStyle = `rgba(${laserColour},0.75)`;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "#D9A477";
      ctx.shadowBlur = 16;

      ctx.beginPath();

      ctx.moveTo(leftStart, y);
      ctx.lineTo(x, y);

      ctx.moveTo(rightStart, y);
      ctx.lineTo(x, y);

      ctx.stroke();
    }


    // CENTRAL FLASH

    if (progress >= 0.3 && progress < 0.65) {
      const flashProgress = Math.min(
        (progress - 0.3) / 0.35,
        1
      );

      const radius = 5 + flashProgress * 30;

      const gradient = ctx.createRadialGradient(
        x, y, 0,
        x, y, radius
      );

      gradient.addColorStop(
        0,
        "rgba(255,235,213,0.9)"
      );

      gradient.addColorStop(
        0.4,
        "rgba(217,164,119,0.4)"
      );

      gradient.addColorStop(
        1,
        "rgba(217,164,119,0)"
      );

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }


    // LIGHT SHOOTS OUTWARDS

    if (progress > 0.38) {
      const distance = easeOut(burstProgress) * 190;

      ctx.strokeStyle =
        `rgba(${laserColour},${alpha * 0.8})`;

      ctx.lineWidth = 1.2;
      ctx.shadowColor = "#D9A477";
      ctx.shadowBlur = 12;

      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;

        const startDistance = 12 + distance * 0.2;
        const endDistance = 30 + distance;

        const startX =
          x + Math.cos(angle) * startDistance;

        const startY =
          y + Math.sin(angle) * startDistance;

        const endX =
          x + Math.cos(angle) * endDistance;

        const endY =
          y + Math.sin(angle) * endDistance;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }

    ctx.restore();

    return progress < 1;
  }


  // ANIMATION LOOP

  function animate(now) {
    ctx.clearRect(0, 0, width, height);

    animations = animations.filter(animation => {
      return drawLaser(animation, now);
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

}


// INITIAL PAGE LOAD

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
