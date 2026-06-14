const DEMOS = {
  gym: {
    label: "Gym / Trainer",
    brand: "PulseForge Training",
    eyebrow: "Fitness conversion demo",
    title: "Turn trial-class interest into booked training sessions.",
    lead: "A high-energy website for gyms, trainers, bootcamps, and transformation programs with trial booking, goal capture, class proof, and coach handoff.",
    image: "../assets/generated/gym_hero.png",
    accent: "#13f2a4",
    action: "Book Trial Session",
    secondary: "Ask Coach",
    stats: [["5", "Lead fields"], ["3", "Plan paths"], ["1", "Coach brief"]],
    marquee: ["Trial booking", "Goal quiz", "Class schedule", "Coach handoff", "Membership follow-up"],
    services: [
      ["Trial Class", "Capture first-time visitors and route them to a coach."],
      ["Transformation Plan", "Show program outcomes, training focus, and next steps."],
      ["Membership Inquiry", "Qualify schedule, goal, and preferred contact path."]
    ],
    proof: ["Goal-first lead capture", "Trial CTA above the fold", "Coach follow-up summary", "Mobile-ready class inquiry"],
    gallery: ["Trial funnel", "Coach profile", "Class proof", "Membership CTA"],
    reviews: ["The trial flow makes joining feel easy.", "Goal questions make follow-up stronger.", "This looks like a serious fitness business."],
    formType: "Trial session",
    faq: [
      ["Can this collect trial bookings?", "Yes. It captures goal, schedule, plan interest, and contact details."],
      ["Can memberships be quote-based?", "Yes. The page can avoid fixed prices and route people to a custom reply."],
      ["Can one trainer use this?", "Yes. It works for solo coaches, bootcamps, and gyms."]
    ]
  },
  saas: {
    label: "SaaS / App",
    brand: "LaunchGrid App",
    eyebrow: "SaaS launch demo",
    title: "Explain the product, then route serious users into demos.",
    lead: "A polished SaaS/app website for demo requests, waitlists, onboarding, product FAQs, and founder-ready lead summaries.",
    image: "../assets/generated/saas_hero.png",
    accent: "#61d9ff",
    action: "Request Demo",
    secondary: "Join Waitlist",
    stats: [["4", "Use cases"], ["2", "CTA paths"], ["1", "Founder alert"]],
    marquee: ["Demo request", "Waitlist", "Use case capture", "Onboarding email", "Product FAQ"],
    services: [
      ["Product Overview", "Explain the app without drowning visitors in features."],
      ["Demo Request", "Capture use case, team size, timeline, and email."],
      ["Waitlist Route", "Let early buyers register before the full launch."]
    ],
    proof: ["Clear value proposition", "Waitlist and demo CTAs", "Founder handoff", "FAQ objection handling"],
    gallery: ["Dashboard preview", "Feature grid", "Use case cards", "Launch CTA"],
    reviews: ["This makes the app feel launch-ready.", "The demo request is clean and serious.", "The FAQ answers what buyers ask first."],
    formType: "Product demo",
    faq: [
      ["Can this collect demo requests?", "Yes. It captures use case, team size, timeline, and contact details."],
      ["Can it be a waitlist?", "Yes. The CTA can be demo-first, waitlist-first, or both."],
      ["Can it include onboarding?", "Yes. The handoff can include onboarding email copy and summary fields."]
    ]
  },
  "car-dealer": {
    label: "Car Dealership",
    brand: "Apex Auto Gallery",
    eyebrow: "Dealership funnel demo",
    title: "Qualify car buyers before the sales team calls.",
    lead: "A premium dealership website for inventory, finance intent, trade-in notes, test-drive booking, and CRM-ready handoff.",
    image: "../assets/generated/car_dealer_hero.png",
    accent: "#ff7b2f",
    action: "Book Test Drive",
    secondary: "Ask Finance",
    stats: [["6", "Inventory cards"], ["4", "Lead fields"], ["1", "Sales alert"]],
    marquee: ["Inventory", "Finance lead", "Trade-in note", "Test drive", "Sales handoff"],
    services: [
      ["Vehicle Inquiry", "Capture model, budget, phone, and buyer intent."],
      ["Finance Route", "Ask finance status before sales follow-up."],
      ["Test Drive", "Turn interest into a scheduled appointment."]
    ],
    proof: ["Inventory presentation", "Finance qualification", "Test-drive CTA", "Sales brief"],
    gallery: ["SUV highlight", "Finance route", "Test-drive CTA", "Trade-in card"],
    reviews: ["The test-drive path is serious.", "It filters casual browsers quickly.", "Inventory feels premium and easy to scan."],
    formType: "Test drive",
    faq: [
      ["Can this collect test drives?", "Yes. It captures model, budget, finance intent, and preferred time."],
      ["Can inventory change?", "Yes. Inventory cards can be edited manually or connected later."],
      ["Can it route finance leads?", "Yes. The demo includes finance intent and sales handoff."]
    ]
  },
  "car-retail": {
    label: "Car Retail / Parts",
    brand: "TorqueParts Market",
    eyebrow: "Auto parts demo",
    title: "Turn parts questions into quote-ready WhatsApp leads.",
    lead: "A product-focused page for accessories, fitment checks, stock questions, quote requests, and WhatsApp ordering.",
    image: "../assets/generated/car_retail_hero.png",
    accent: "#4fd8ff",
    action: "Request Quote",
    secondary: "Check Fitment",
    stats: [["8", "Product cards"], ["3", "Fitment fields"], ["1", "Quote brief"]],
    marquee: ["Product cards", "Fitment check", "Stock request", "WhatsApp quote", "Order status"],
    services: [
      ["Accessory Quote", "Capture product need and preferred contact path."],
      ["Fitment Check", "Collect vehicle model, year, and part details."],
      ["Order Handoff", "Give the retailer a clean reply brief."]
    ],
    proof: ["Product clarity", "Fitment details", "Stock check route", "WhatsApp-ready quote"],
    gallery: ["Lighting kit", "Interior accessory", "Fitment form", "Stock status"],
    reviews: ["This saves so many repeated DMs.", "Fitment fields make quoting easier.", "The product cards feel cleaner than catalog screenshots."],
    formType: "Parts quote",
    faq: [
      ["Can this check compatibility?", "It collects model/year and product need so the owner can confirm fitment."],
      ["Can it show stock?", "Yes. Stock labels can be manual or connected later."],
      ["Can it send WhatsApp orders?", "Yes. The quote path can produce a WhatsApp-ready message."]
    ]
  },
  "real-estate": {
    label: "Real Estate",
    brand: "Northline Properties",
    eyebrow: "Property lead demo",
    title: "Qualify buyers and renters before the viewing.",
    lead: "A polished real estate website for property cards, budget filtering, area preference, viewing requests, and agent handoff.",
    image: "../assets/generated/real_estate_hero.png",
    accent: "#f3cc74",
    action: "Book Viewing",
    secondary: "Send Requirements",
    stats: [["6", "Listings"], ["4", "Buyer fields"], ["1", "Agent brief"]],
    marquee: ["Listings", "Budget filter", "Viewing request", "Area match", "Agent handoff"],
    services: [
      ["Buyer Inquiry", "Capture budget, area, property type, and timeline."],
      ["Viewing Booking", "Move qualified visitors toward a visit request."],
      ["Rental Route", "Support renters with timeline and location filters."]
    ],
    proof: ["Property cards", "Budget filter", "Viewing CTA", "Agent-ready summary"],
    gallery: ["Apartment card", "Villa feature", "Area filter", "Viewing CTA"],
    reviews: ["The viewing request is clear on mobile.", "Budget filtering saves agent time.", "The listings feel premium and trustworthy."],
    formType: "Viewing request",
    faq: [
      ["Can this collect viewing requests?", "Yes. It captures budget, location, property type, and preferred time."],
      ["Can this work for rentals?", "Yes. The same structure works for rentals, purchases, and commercial property."],
      ["Can listings change?", "Yes. Cards can be edited manually or connected later to inventory."]
    ]
  },
  freelancer: {
    label: "Freelancer / Agency",
    brand: "ScopeCraft Studio",
    eyebrow: "Project intake demo",
    title: "Turn vague DMs into quote-ready project briefs.",
    lead: "A sharp freelancer/agency website for services, portfolio proof, scope capture, proposal handoff, and fast custom quotes.",
    image: "../assets/generated/freelancer_hero.png",
    accent: "#7d7cff",
    action: "Start Project Brief",
    secondary: "See Services",
    stats: [["5", "Scope fields"], ["3", "Service paths"], ["1", "Proposal brief"]],
    marquee: ["Service menu", "Scope form", "Portfolio proof", "Proposal handoff", "Fast quote"],
    services: [
      ["Project Intake", "Collect goal, platform, deadline, and assets."],
      ["Proposal Route", "Turn form answers into a clean brief."],
      ["Portfolio Proof", "Show examples without making the page cluttered."]
    ],
    proof: ["Clear service menu", "Scope capture", "Quote brief", "Portfolio trust"],
    gallery: ["Service cards", "Brief form", "Proof grid", "Proposal CTA"],
    reviews: ["This makes a freelancer feel like a studio.", "The intake form saves discovery time.", "The quote brief is clean enough to use directly."],
    formType: "Project brief",
    faq: [
      ["Can this collect project briefs?", "Yes. It captures goal, deadline, platform, and assets."],
      ["Can agencies use this?", "Yes. It works for freelancers, agencies, studios, and consultants."],
      ["Can it connect to Notion?", "The public demo is simulated, but a private build can map fields to Notion, Sheets, or email."]
    ]
  },
  commercials: {
    label: "Commercials / Video Funnel",
    brand: "SignalCut Campaigns",
    eyebrow: "Video funnel demo",
    title: "Give every ad a landing page that captures the lead.",
    lead: "A cinematic campaign page for video ads, launch offers, lead capture, campaign source tagging, and follow-up handoff.",
    image: "../assets/demo-cover-commercials.svg",
    accent: "#ff7b2f",
    action: "Capture Campaign Lead",
    secondary: "Watch Offer Flow",
    stats: [["1", "Video CTA"], ["4", "Lead fields"], ["1", "Sales brief"]],
    marquee: ["Video ad", "Landing page", "Lead form", "Campaign source", "Follow-up"],
    services: [
      ["Ad Landing Page", "Match the video CTA with a focused landing page."],
      ["Lead Capture", "Collect offer intent and contact details."],
      ["Campaign Handoff", "Send source and intent to the business owner."]
    ],
    proof: ["Video hero", "Offer CTA", "Lead form", "Campaign tag"],
    gallery: ["Video hero", "Offer section", "Lead form", "Campaign proof"],
    reviews: ["This turns views into actual leads.", "The video finally has a destination.", "The source tag makes follow-up smarter."],
    formType: "Campaign lead",
    faq: [
      ["Can this connect to a video ad?", "Yes. It can match the exact CTA from a reel, short, or commercial."],
      ["Can it track source?", "Yes. The demo shows source tagging for later backend setup."],
      ["Can editing and web be sold together?", "Yes. This positions video plus landing funnel as a stronger offer."]
    ]
  }
};

const imgMap = {
  "gym": [
    "neon_lit_gym_with_kettlebells.png",
    "futuristic_fitness_dashboard_in_dark_gym.png",
    "hardened_athletics_in_the_ring.png",
    "futuristic_gym_with_city_skyline.png",
    "futuristic_gym_with_city_skyline_backdrop.png",
    "neon_lit_gym_with_kettlebells.png",
    "futuristic_fitness_dashboard_in_dark_gym.png"
  ],
  "saas": [
    "futuristic_tech_in_a_server_rack.png",
    "futuristic_business_dashboard_interface.png",
    "futuristic_server_corridor_with_neon_accents.png",
    "tech_haven_with_neon_code_ambiance.png",
    "illuminated_keys_and_focused_hands.png",
    "futuristic_motherboard_with_holographic_security_l.png",
    "cybernetic_data_highways_and_rising_growth.png"
  ],
  "car-dealer": [
    "lamborghini_steering_wheel_close_up_detail.png",
    "futuristic_car_interior_with_digital_contract.png",
    "elite_motors_showroom_at_night.png",
    "futuristic_supercar_in_red_haze.png",
    "luxury_suv_in_neon_lit_alley.png",
    "elite_motors_showroom_at_night.png",
    "lamborghini_steering_wheel_close_up_detail.png"
  ],
  "car-retail": [
    "sleek_headlight_in_modern_garage_workshop.png",
    "high_tech_automotive_diagnostics_setup.png",
    "futuristic_car_showroom_with_neon_accents.png",
    "high_end_racing_wheel_in_studio_lighting.png",
    "high_performance_tires_in_spotlight.png",
    "sleek_headlight_in_modern_garage_workshop.png",
    "high_performance_tires_in_spotlight.png"
  ],
  "real-estate": [
    "futuristic_architectural_studio_at_night.png",
    "golden_keys_on_polished_marble_countertop.png",
    "modern_terrace_with_city_skyline_view.png",
    "modern_luxury_apartment_at_night.png",
    "modern_mansion_by_the_cliff_at_dusk.png",
    "modern_terrace_with_city_skyline_view.png",
    "golden_keys_on_polished_marble_countertop.png"
  ],
  "freelancer": [
    "nighttime_desk_with_city_view.png",
    "futuristic_ux_ui_design_mockup.png",
    "creative_workspace_with_neon_accents.png",
    "dark_coding_workspace_with_neon_accents.png",
    "creative_night_workspace_with_digital_art.png",
    "cinematic_creative_studio_at_night.png",
    "nighttime_desk_with_city_view.png"
  ],
  "commercials": [
    "cinematic_post_production_studio_close_up.png",
    "cinematic_camera_lens_with_neon_reflections.png",
    "cinematic_car_reveal_in_industrial_studio.png",
    "futuristic_color_grading_control_panel.png",
    "cinematic_streaming_studio_vibes.png",
    "cinematic_camera_lens_with_neon_reflections.png",
    "cinematic_post_production_studio_close_up.png"
  ]
};

const demo = DEMOS[document.body.dataset.demoId] || DEMOS.gym;
document.documentElement.style.setProperty("--accent", demo.accent);
document.title = `${demo.brand} | Shadow Riser Demo`;

function esc(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[char]));
}

function render() {
  const root = document.querySelector("#demo-root");
  root.innerHTML = `
    <div class="progress-bar"><span class="progress-fill"></span></div>
    <header class="wrap nav">
      <a class="brand" href="../portfolio-index.html#showroom"><img src="../assets/shadow-riser-logo.png" alt="Shadow Riser logo"><span>Shadow Riser demo</span>${esc(demo.brand)}</a>
      <nav class="navlinks"><a href="#offer">Offer</a><a href="#proof">Proof</a><a href="#inquiry">Inquiry</a></nav>
      <a class="button primary" href="#inquiry">${esc(demo.action)}</a>
    </header>

    <main>
      <section class="wrap hero">
        <div class="reveal">
          <p class="eyebrow">${esc(demo.eyebrow)}</p>
          <h1>${esc(demo.title)}</h1>
          <p class="lead">${esc(demo.lead)}</p>
          <div class="hero-actions"><a class="button primary" href="#inquiry">${esc(demo.action)}</a><a class="button" href="#proof">${esc(demo.secondary)}</a></div>
        </div>
        <div class="hero-visual reveal">
          <img src="${demo.image}" alt="${esc(demo.label)} hero visual">
          <div class="floating-proof">${demo.stats.map(([a, b]) => `<div><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join("")}</div>
        </div>
      </section>

      <div class="marquee"><div class="marquee-track">${[...demo.marquee, ...demo.marquee].map((item) => `<span>${esc(item)}</span>`).join("")}</div></div>

      <section class="wrap section" id="offer">
        <div class="section-head reveal"><p class="eyebrow">Website offer</p><h2>Sections that sell the next step.</h2><p>Each block is designed to show value, build trust, and capture a useful inquiry without hardcoded public pricing.</p></div>
        <div class="service-grid">${demo.services.map(([title, text], i) => {
          const demoId = document.body.dataset.demoId;
          const imgs = imgMap[demoId] || imgMap.gym;
          return `<article class="service-card reveal"><img src="../assets/generated/${imgs[i] || imgs[0]}" alt=""><div class="service-body"><h3>${esc(title)}</h3><p>${esc(text)}</p></div></article>`;
        }).join("")}</div>
      </section>

      <section class="wrap section split" id="proof">
        <div class="panel reveal"><p class="eyebrow">Conversion proof</p><h2>What this demo proves.</h2><p>This sample page is built to feel like a real business asset, not a placeholder template.</p><div class="mini-grid">${demo.proof.map((item) => `<div><b>${esc(item)}</b><span>Included in the demo flow</span></div>`).join("")}</div></div>
        <div class="panel reveal"><p class="eyebrow">Sample reviews</p><div class="review-grid">${demo.reviews.map((quote) => `<article class="review-card"><p>"${esc(quote)}"</p><b>Demo buyer reaction</b></article>`).join("")}</div></div>
      </section>

      <section class="wrap section">
        <div class="section-head reveal"><p class="eyebrow">Gallery</p><h2>Click through the sales story.</h2><p>These cards represent the modules a real client page would customize with their own assets.</p></div>
        <div class="gallery reveal" data-gallery>
          <div class="gallery-main"><img data-gallery-main src="../assets/generated/${(imgMap[document.body.dataset.demoId] || imgMap.gym)[3]}" alt="${esc(demo.gallery[0])}"></div>
          <div class="gallery-list">${demo.gallery.map((item, index) => {
            const demoId = document.body.dataset.demoId;
            const imgs = imgMap[demoId] || imgMap.gym;
            return `<button class="gallery-btn ${index === 0 ? "active" : ""}" data-gallery-label="${esc(item)}" data-img="../assets/generated/${imgs[index + 3] || imgs[3]}"><img src="../assets/generated/${imgs[index + 3] || imgs[3]}" alt=""><span><b>${esc(item)}</b><span>Show this part of the funnel.</span></span></button>`;
          }).join("")}</div>
        </div>
      </section>

      <section class="wrap section split" id="inquiry">
        <div class="panel reveal">
          <p class="eyebrow">Lead capture</p>
          <h2>${esc(demo.formType)} request.</h2>
          <p class="success" id="demo-success">Inquiry received. This public demo simulates the handoff only.</p>
          <form class="form" data-demo-form>
            <input required placeholder="Name">
            <input required type="tel" placeholder="Phone or WhatsApp">
            <select><option>${esc(demo.formType)}</option><option>Website + automation</option><option>AI FAQ widget</option><option>Voice agent demo</option></select>
            <textarea placeholder="What do you need?"></textarea>
            <button class="button primary" type="submit">Send Demo Request</button>
          </form>
        </div>
        <div class="panel reveal">
          <p class="eyebrow">Shadow Riser handoff</p>
          <h2>Owner receives a cleaner brief.</h2>
          <p>The real build can route this to email, Sheets, CRM, Notion, WhatsApp, or another approved private tool.</p>
          <div class="card-actions"><a class="button primary" href="../portfolio-index.html#order">Request Custom Quote</a><a class="button" href="https://wa.me/923219116001">WhatsApp Saim</a></div>
        </div>
      </section>
    </main>

    <div class="faq-dock" data-faq>
      <button class="faq-toggle">Ask the ${esc(demo.label)} Assistant</button>
      <div class="faq-panel closed">
        ${demo.faq.map(([q, a]) => `<button class="faq-question" data-answer="${esc(a)}">${esc(q)}</button>`).join("")}
        <div class="faq-answer">Choose a question to preview the FAQ widget.</div>
      </div>
    </div>
    <footer class="wrap footer">${esc(demo.brand)} is a Shadow Riser sample website demo. Public forms are simulated.</footer>
  `;
}

function wire() {
  const progress = document.querySelector(".progress-fill");
  const revealItems = [...document.querySelectorAll(".reveal")];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.16 });
  revealItems.forEach((item) => observer.observe(item));

  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.setProperty("--scroll", `${Math.max(0, Math.min(100, (scrollY / max) * 100))}%`);
  }, { passive: true });

  document.querySelector("[data-gallery]")?.addEventListener("click", (event) => {
    const button = event.target.closest(".gallery-btn");
    if (!button) return;
    document.querySelectorAll(".gallery-btn").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const mainImg = document.querySelector("[data-gallery-main]");
    mainImg.alt = button.dataset.galleryLabel || "Demo gallery image";
    if (button.dataset.img) {
      mainImg.src = button.dataset.img;
    }
  });

  document.querySelector("[data-demo-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelector("#demo-success")?.classList.add("show");
  });

  document.querySelector(".faq-toggle")?.addEventListener("click", () => {
    document.querySelector(".faq-panel")?.classList.toggle("closed");
  });

  document.querySelector(".faq-panel")?.addEventListener("click", (event) => {
    const button = event.target.closest(".faq-question");
    if (!button) return;
    document.querySelector(".faq-answer").textContent = button.dataset.answer;
  });
}

render();
wire();
