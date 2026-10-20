/* ==========================================================
   script.js
   Features:
   1. Mobile hamburger menu
   2. Dark/light theme toggle (remembered between visits)
   3. Active nav link while scrolling
   4. Project filter buttons
   5. Contact form validation
   6. Back-to-top button
   7. Typing effect on the home tagline
   ========================================================== */

/* ---------- 1. Mobile hamburger menu ---------- */
function initMenu() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", function () {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the menu after a link is clicked (useful on mobile)
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- 2. Theme toggle ---------- */
function initTheme() {
  const button = document.getElementById("themeToggle");
  const root = document.documentElement; // the <html> element
  if (!button) return;

  // Load the saved theme if there is one
  try {
    const saved = localStorage.getItem("theme");
    if (saved) {
      root.setAttribute("data-theme", saved);
    }
  } catch (error) {
    // localStorage can be blocked; the site still works without it
  }

  button.addEventListener("click", function () {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (error) {
      // ignore
    }
  });
}

/* ---------- 3. Highlight the active nav link ---------- */
function initActiveLink() {
  const sections = document.querySelectorAll("main section");
  const links = document.querySelectorAll(".nav-menu a");
  if (sections.length === 0 || links.length === 0) return;

  function update() {
    let currentId = "home";

    // The last section whose top has passed the nav bar is the current one
    sections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - 100) {
        currentId = section.id;
      }
    });

    links.forEach(function (link) {
      const isCurrent = link.getAttribute("href") === "#" + currentId;
      link.classList.toggle("active", isCurrent);
    });
  }

  window.addEventListener("scroll", update);
  update();
}

/* ---------- 4. Project filter ---------- */
function initFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");
  if (buttons.length === 0) return;

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const filter = button.getAttribute("data-filter");

      // Move the active style to the clicked button
      buttons.forEach(function (b) {
        b.classList.remove("active");
      });
      button.classList.add("active");

      // Show matching cards, hide the rest
      cards.forEach(function (card) {
        const category = card.getAttribute("data-category");
        const matches = filter === "all" || category === filter;
        card.classList.toggle("hide", !matches);
      });
    });
  });
}

/* ---------- 5. Contact form validation ---------- */
function initForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  if (!form || !status || !nameInput || !emailInput || !messageInput) return;

  // Show or clear an error message under a field
  function setError(id, message) {
    const box = document.getElementById(id + "Error");
    if (box) {
      box.textContent = message;
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from reloading

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    let valid = true;

    // Reset old messages
    setError("name", "");
    setError("email", "");
    setError("message", "");
    status.textContent = "";

    if (name === "") {
      setError("name", "Please enter your name.");
      valid = false;
    }

    // Simple email pattern: text, @, text, dot, text
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("email", "Please enter a valid email address.");
      valid = false;
    }

    if (message.length < 10) {
      setError("message", "Message must be at least 10 characters.");
      valid = false;
    }

    if (valid) {
      // Front-end only: nothing is sent anywhere
      status.textContent = "Thank you, " + name + ". Your message is ready to send.";
      form.reset();
    }
  });
}

/* ---------- 6. Back-to-top button ---------- */
function initBackToTop() {
  const button = document.getElementById("backToTop");
  if (!button) return;

  // Show the button only after scrolling down a bit
  window.addEventListener("scroll", function () {
    button.hidden = window.scrollY < 300;
  });

  button.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- 7. Typing effect ---------- */
function initTyping() {
  const element = document.getElementById("tagline");
  if (!element) return;

  const fullText = element.textContent;

  // Skip the animation for users who prefer reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  element.textContent = "";
  let index = 0;

  function typeNext() {
    if (index < fullText.length) {
      element.textContent += fullText.charAt(index);
      index++;
      setTimeout(typeNext, 50);
    }
  }

  typeNext();
}

/* ---------- Start everything when the page is ready ---------- */
document.addEventListener("DOMContentLoaded", function () {
  initMenu();
  initTheme();
  initActiveLink();
  initFilter();
  initForm();
  initBackToTop();
  initTyping();
});