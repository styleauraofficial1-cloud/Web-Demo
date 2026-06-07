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

function wireUiuxLab() {
  const lab = document.querySelector("[data-uiux-lab]");
  if (!lab) return;

  const modes = {
    website: {
      kicker: "Conversion website",
      title: "Luxury Website System",
      copy: "High-end landing pages with cinematic sections, lead capture, sticky conversion paths, FAQ logic, and polished mobile behavior.",
      label: "localcraft.design",
      metrics: { motion: 94, conversion: 91, responsive: 98 },
      flow: ["Visit", "Trust", "Book", "Handoff"]
    },
    saas: {
      kicker: "Product interface",
      title: "SaaS Experience Layer",
      copy: "Clean product pages and app-style screens with focused onboarding, pricing clarity, feature logic, and smooth state changes.",
      label: "product-os.app",
      metrics: { motion: 89, conversion: 95, responsive: 96 },
      flow: ["Problem", "Feature", "Proof", "Upgrade"]
    },
    dashboard: {
      kicker: "Insight dashboard",
      title: "Premium Data Dashboard",
      copy: "Executive-style dashboards with card systems, filters, animated metrics, status boards, and scannable decision views.",
      label: "insight-suite.io",
      metrics: { motion: 87, conversion: 88, responsive: 97 },
      flow: ["Track", "Filter", "Decide", "Export"]
    },
    mobile: {
      kicker: "Mobile flow",
      title: "App-Style Mobile Journey",
      copy: "Fast mobile flows for booking, inquiry, onboarding, and service discovery with clear taps, clean hierarchy, and compact motion.",
      label: "mobile-flow.pro",
      metrics: { motion: 92, conversion: 93, responsive: 99 },
      flow: ["Open", "Choose", "Confirm", "Notify"]
    }
  };

  const title = lab.querySelector("[data-uiux-title]");
  const copy = lab.querySelector("[data-uiux-copy]");
  const kicker = lab.querySelector("[data-uiux-kicker]");
  const label = lab.querySelector("[data-uiux-window-label]");
  const flowItems = lab.querySelectorAll(".uiux-flow span");

  const setMode = (modeName) => {
    const mode = modes[modeName] || modes.website;
    kicker.textContent = mode.kicker;
    title.textContent = mode.title;
    copy.textContent = mode.copy;
    label.textContent = mode.label;
    Object.entries(mode.metrics).forEach(([key, value]) => {
      const metric = lab.querySelector(`[data-uiux-metric="${key}"]`);
      const bar = lab.querySelector(`[data-uiux-bar="${key}"]`);
      if (metric) metric.textContent = `${value}%`;
      if (bar) bar.style.setProperty("--level", `${value}%`);
    });
    flowItems.forEach((item, index) => {
      item.textContent = mode.flow[index] || "";
      item.classList.toggle("active", index === 0);
    });
  };

  lab.querySelectorAll("[data-uiux-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      lab.querySelectorAll("[data-uiux-mode]").forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-selected", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-selected", "true");
      setMode(button.dataset.uiuxMode);
    });
  });

  setMode("website");
}

function wireUiuxPreviewMotion() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll("[data-uiux-preview]").forEach((preview) => {
    preview.addEventListener("pointermove", (event) => {
      const rect = preview.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      preview.style.setProperty("--ry", `${x * 5}deg`);
      preview.style.setProperty("--rx", `${y * -5}deg`);
    });
    preview.addEventListener("pointerleave", () => {
      preview.style.setProperty("--ry", "0deg");
      preview.style.setProperty("--rx", "0deg");
    });
  });
}

function wireLogicBoard() {
  const statuses = {
    "New Lead": "Lead captured and ready for handoff.",
    "Booked Call": "Discovery call request routed to the owner.",
    "Sheet Saved": "Customer details prepared for a simple CRM sheet.",
    "WhatsApp Sent": "Follow-up message is ready for WhatsApp handoff."
  };
  document.querySelectorAll("[data-logic-board]").forEach((board) => {
    const status = board.querySelector("[data-logic-status]");
    board.querySelectorAll(".logic-chip").forEach((button) => {
      button.addEventListener("click", () => {
        board.querySelectorAll(".logic-chip").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        status.textContent = statuses[button.textContent.trim()] || statuses["New Lead"];
      });
    });
  });
}

function wireCaseStudies() {
  document.querySelectorAll(".case-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isExpanded));
    });
  });
}

function wireDesignerPreviewMotion() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll("[data-designer-preview]").forEach((preview) => {
    preview.addEventListener("pointermove", (event) => {
      const rect = preview.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      preview.style.setProperty("--ry", `${x * 4}deg`);
      preview.style.setProperty("--rx", `${y * -4}deg`);
    });
    preview.addEventListener("pointerleave", () => {
      preview.style.setProperty("--ry", "0deg");
      preview.style.setProperty("--rx", "0deg");
    });
  });
}

function wireLeadDemo() {
  document.querySelectorAll("[data-lead-demo]").forEach((demo) => {
    const form = demo.querySelector("[data-lead-form]");
    const timeline = demo.querySelectorAll("[data-lead-timeline] b");
    const table = demo.querySelector("[data-lead-table]");
    const handoff = demo.querySelector("[data-lead-handoff]");
    if (!form || !table || !handoff) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const lead = {
        name: data.get("name") || "New visitor",
        service: data.get("service") || "Landing page",
        contact: data.get("contact") || "contact@example.com"
      };

      timeline.forEach((item) => item.classList.remove("active"));
      timeline.forEach((item, index) => {
        setTimeout(() => item.classList.add("active"), index * 180);
      });

      table.innerHTML = `
        <div class="lead-row">
          <strong>${lead.name}</strong>
          <span>${lead.service}</span>
          <span>${lead.contact}</span>
          <em class="status-chip">Follow-up ready</em>
        </div>
      `;
      handoff.classList.add("ready");
      handoff.querySelector("p").textContent = `WhatsApp/email handoff prepared for ${lead.name}: confirm the request, share a booking link, and mark the follow-up as ready.`;
      form.reset();
    });
  });
}

function wireBookingDemo() {
  document.querySelectorAll("[data-booking-demo]").forEach((demo) => {
    const steps = [...demo.querySelectorAll(".booking-step")];
    const progress = demo.querySelector("[data-booking-progress]");
    const summary = demo.querySelector("[data-booking-summary]");
    const state = { service: "Premium landing page", time: "Tomorrow morning", name: "", email: "", notes: "" };
    let current = 0;

    const showStep = (index) => {
      current = Math.max(0, Math.min(index, steps.length - 1));
      steps.forEach((step, stepIndex) => step.classList.toggle("active", stepIndex === current));
      if (progress) progress.style.setProperty("--progress", `${((current + 1) / steps.length) * 100}%`);
    };

    const renderSummary = () => {
      if (!summary) return;
      summary.innerHTML = `
        <span>Handoff Preview</span>
        <h2>${state.service}</h2>
        <p>${state.name || "Client"} requested ${state.time}. Contact: ${state.email || "not added yet"}. Notes: ${state.notes || "No extra notes."}</p>
      `;
    };

    demo.querySelectorAll("[data-booking-value]").forEach((button) => {
      button.addEventListener("click", () => {
        if (current === 0) state.service = button.dataset.bookingValue;
        if (current === 1) state.time = button.dataset.bookingValue;
        renderSummary();
        showStep(current + 1);
      });
    });

    demo.querySelectorAll("[data-booking-next]").forEach((button) => {
      button.addEventListener("click", () => {
        const name = demo.querySelector("[data-booking-name]");
        const email = demo.querySelector("[data-booking-email]");
        const notes = demo.querySelector("[data-booking-notes]");
        if (name) state.name = name.value || state.name || "Client";
        if (email) state.email = email.value || state.email || "client@example.com";
        if (notes) state.notes = notes.value || "Website redesign request";
        renderSummary();
        showStep(current + 1);
      });
    });

    renderSummary();
    showStep(0);
  });
}

function wireChatDemo() {
  document.querySelectorAll("[data-chat-demo]").forEach((demo) => {
    const log = demo.querySelector("[data-chat-log]");
    if (!log) return;

    const addMessage = (text, type) => {
      const message = document.createElement("div");
      message.className = `message ${type}`;
      message.textContent = text;
      log.appendChild(message);
      log.scrollTop = log.scrollHeight;
    };

    demo.querySelectorAll("[data-chat-answer]").forEach((button) => {
      button.addEventListener("click", () => {
        const answer = button.dataset.chatAnswer;
        addMessage(button.textContent.trim(), "user");
        setTimeout(() => addMessage(answer, "bot"), 180);
      });
    });
  });
}

function wireAuditDemo() {
  const audits = {
    cta: {
      title: "CTA Clarity",
      before: "Weak buttons compete with headings and the visitor has no obvious next step.",
      after: "One primary booking path is visible above the fold, repeated after proof and pricing.",
      reco: "Use one dominant action, reduce secondary links, and place a benefit-focused CTA near each decision point."
    },
    mobile: {
      title: "Mobile Layout",
      before: "Images are too tall, text stacks awkwardly, and important actions fall below the first screen.",
      after: "Compact hero rhythm, stable image ratios, and 44px tap targets keep the page easy to scan.",
      reco: "Set fixed aspect ratios, tighten mobile spacing, and turn wide tables into stacked cards."
    },
    trust: {
      title: "Trust Signals",
      before: "Visitors see offers but not enough proof, process clarity, or credibility markers.",
      after: "Proof cards, service outcomes, before/after states, and a clear delivery process support the offer.",
      reco: "Add social proof, visible process steps, realistic outcomes, and a small guarantee or response-time promise."
    },
    content: {
      title: "Content Hierarchy",
      before: "The page reads like scattered information instead of a guided conversion story.",
      after: "The page moves from problem to offer, proof, service fit, FAQ, and final handoff.",
      reco: "Rewrite sections around decisions: what it is, who it helps, why trust it, and what to do next."
    },
    form: {
      title: "Form Friction",
      before: "The form asks too much too early and does not show what happens after submission.",
      after: "A short form captures the essentials and previews the follow-up workflow.",
      reco: "Ask for name, contact, service, and notes first. Show confirmation, owner handoff, and next response timing."
    }
  };

  document.querySelectorAll("[data-audit-demo]").forEach((demo) => {
    const before = demo.querySelector("[data-audit-before]");
    const after = demo.querySelector("[data-audit-after]");
    const reco = demo.querySelector("[data-audit-reco]");

    const setAudit = (key) => {
      const item = audits[key] || audits.cta;
      if (before) before.textContent = item.before;
      if (after) after.textContent = item.after;
      if (reco) {
        reco.querySelector("h2").textContent = item.title;
        reco.querySelector("p").textContent = item.reco;
      }
      demo.querySelectorAll("[data-audit]").forEach((button) => {
        button.classList.toggle("active", button.dataset.audit === key);
      });
    };

    demo.querySelectorAll("[data-audit]").forEach((button) => {
      button.addEventListener("click", () => setAudit(button.dataset.audit));
    });
    setAudit("cta");
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
wireUiuxLab();
wireUiuxPreviewMotion();
wireLogicBoard();
wireCaseStudies();
wireDesignerPreviewMotion();
wireLeadDemo();
wireBookingDemo();
wireChatDemo();
wireAuditDemo();
