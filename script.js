const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const siteHeader = document.querySelector(".site-header");
const FORM_ENDPOINT = "https://formspree.io/f/xyeeqqnq";

const closeMenu = () => {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  mainNav.classList.remove("is-open");
};

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  if (isExpanded) {
    closeMenu();
    return;
  }
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close navigation");
  mainNav.classList.add("is-open");
});

mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeMenu();
  }
});

document.addEventListener("click", (event) => {
  if (!siteHeader.contains(event.target)) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuToggle.focus();
  }
});

window.matchMedia("(min-width: 761px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq-item[open]").forEach((openItem) => {
      if (openItem !== item) openItem.open = false;
    });
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();

const serviceDetails = {
  mediation: {
    title: "Debt mediation",
    content: [
      "Debt mediation is about understanding your situation clearly, then speaking with creditors in a more constructive and informed way.",
      "We help you look at the facts, explain what options may be available, and prepare for the next conversation with practical guidance.",
      "This is not a promise of a specific outcome, but a way to reduce confusion and give you a clearer path forward."
    ]
  },
  review: {
    title: "Debt removal",
    content: [
      "Debt removal is a serious decision, and it helps to understand exactly how the process works before moving forward.",
      "We can help explain what may be involved, what questions to ask, and how to assess whether this option fits your situation.",
      "Our aim is to help you make informed choices with clarity, confidence, and realistic expectations."
    ]
  },
  plan: {
    title: "A plan that feels possible",
    content: [
      "Sometimes the hardest part is not knowing where to begin. A short, honest conversation can help you sort through the pressure and identify a realistic next step.",
      "We focus on what matters most to you, what options may be available, and how to move forward without feeling rushed or overwhelmed.",
      "This is about giving you clarity, confidence, and a practical plan that fits your circumstances."
    ]
  }
};

const serviceModal = document.querySelector("#service-modal");
const serviceModalTitle = document.querySelector("#service-modal-title");
const serviceModalContent = document.querySelector("#service-modal-content");

const openServiceModal = (serviceKey) => {
  const service = serviceDetails[serviceKey];
  if (!service) return;

  serviceModalTitle.textContent = service.title;
  serviceModalContent.innerHTML = service.content.map((paragraph) => `<p>${paragraph}</p>`).join("");
  serviceModal.classList.add("is-open");
  serviceModal.setAttribute("aria-hidden", "false");
};

const closeServiceModal = () => {
  serviceModal.classList.remove("is-open");
  serviceModal.setAttribute("aria-hidden", "true");
};

document.querySelectorAll(".service-detail-trigger").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    openServiceModal(trigger.dataset.service);
  });
});

document.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeServiceModal);
});

document.querySelector(".service-modal-close").addEventListener("click", closeServiceModal);
document.querySelector(".service-modal-cta").addEventListener("click", () => {
  closeServiceModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && serviceModal.classList.contains("is-open")) {
    closeServiceModal();
  }
});

const scrollToTop = () => {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
};

document.querySelectorAll(".back-top, .wordmark, .footer-wordmark").forEach((element) => {
  element.addEventListener("click", (event) => {
    event.preventDefault();
    scrollToTop();
  });
});

document.querySelector("#contact-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector("#form-status");
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  status.textContent = "Sending your message...";

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Form submission failed with status ${response.status}`);
    }

    form.reset();
    status.textContent = "Thanks for reaching out. Your message has been sent.";
    window.alert("Your message has been sent.");
  } catch (error) {
    console.error("Contact form submission failed:", error);
    status.textContent = "We couldn't send your message. Please try again in a moment.";
  } finally {
    submitButton.disabled = false;
  }
});