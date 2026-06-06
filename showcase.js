function animateWordmarks() {
  document.querySelectorAll(".wordmark").forEach((el) => {
    const text = el.textContent.trim();
    el.textContent = "";
    text.split(" ").forEach((word, index) => {
      const span = document.createElement("span");
      span.textContent = word;
      span.style.animationDelay = `${index * 60}ms`;
      el.appendChild(span);
      if (index < text.split(" ").length - 1) {
        el.appendChild(document.createTextNode(" "));
      }
    });
  });
}

function wireProgress() {
  const fill = document.querySelector(".progress-fill");
  if (!fill) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    fill.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function wireCursorGlow() {
  window.addEventListener(
    "pointermove",
    (event) => {
      document.body.style.setProperty("--mx", `${event.clientX}px`);
      document.body.style.setProperty("--my", `${event.clientY}px`);
    },
    { passive: true }
  );
}

function revealOnScroll() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.14 }
  );
  document.querySelectorAll(".reveal").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("visible");
    }
    observer.observe(el);
  });
}

function wireTilt() {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function wireSpotlight() {
  document.querySelectorAll(".hero-image, .feature-photo, .gallery-main, .demo-thumb").forEach((el) => {
    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    });
  });
}

function wireMagneticButtons() {
  document.querySelectorAll(".button").forEach((button) => {
    button.classList.add("magnetic");
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });
    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
}

function wireCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.done) return;
      entry.target.dataset.done = "true";
      const target = Number(entry.target.dataset.count);
      const suffix = entry.target.dataset.suffix || "";
      const duration = 900;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        entry.target.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  });
  counters.forEach((counter) => observer.observe(counter));
}

function wireGallery() {
  document.querySelectorAll("[data-gallery]").forEach((gallery) => {
    const main = gallery.querySelector("[data-gallery-main]");
    const buttons = gallery.querySelectorAll("[data-gallery-src]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        main.style.opacity = "0";
        setTimeout(() => {
          main.src = button.dataset.gallerySrc;
          main.alt = button.dataset.galleryAlt || "";
          main.style.opacity = "1";
        }, 140);
      });
    });
  });
}

function wireForms() {
  document.querySelectorAll("[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const success = document.querySelector(form.dataset.successTarget);
      if (success) success.style.display = "block";
      form.reset();
    });
  });
}

function wireFilters() {
  document.querySelectorAll("[data-filter-control]").forEach((row) => {
    const cards = document.querySelectorAll("[data-category]");
    row.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        row.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        const filter = button.dataset.filter;
        cards.forEach((card) => {
          card.classList.toggle("is-hidden", filter !== "all" && card.dataset.category !== filter);
        });
      });
    });
  });
}

function wireBeforeAfter() {
  document.querySelectorAll("[data-before-after]").forEach((slider) => {
    const input = slider.querySelector("input");
    if (!input) return;
    const update = () => slider.style.setProperty("--split", `${input.value}%`);
    input.addEventListener("input", update);
    update();
  });
}

function wireFaq() {
  document.querySelectorAll("[data-faq]").forEach((dock) => {
    const panel = dock.querySelector(".faq-panel");
    const answer = dock.querySelector(".faq-answer");
    dock.querySelector(".faq-toggle").addEventListener("click", () => {
      panel.classList.toggle("closed");
    });
    dock.querySelectorAll("[data-answer]").forEach((button) => {
      button.addEventListener("click", () => {
        answer.textContent = button.dataset.answer;
      });
    });
  });
}

wireProgress();
wireCursorGlow();
animateWordmarks();
revealOnScroll();
wireTilt();
wireSpotlight();
wireMagneticButtons();
wireCounters();
wireGallery();
wireForms();
wireFilters();
wireBeforeAfter();
wireFaq();
