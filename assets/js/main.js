// West High Science Olympiad — shared site behavior

document.addEventListener("DOMContentLoaded", () => {
  /* Mobile nav toggle */
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  if (header && toggle) {
    toggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    header.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => header.classList.remove("open"));
    });
  }

  /* Highlight active nav link based on current page */
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = (link.getAttribute("href") || "").toLowerCase();
    if (href === current || (current === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  /* Back-to-top button */
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("visible", window.scrollY > 500);
    });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Countdown to next competition — set data-target="YYYY-MM-DDTHH:mm:ss" on .countdown */
  const countdown = document.querySelector(".countdown[data-target]");
  if (countdown) {
    const target = new Date(countdown.dataset.target).getTime();
    const els = {
      days: countdown.querySelector(".cd-days"),
      hours: countdown.querySelector(".cd-hours"),
      mins: countdown.querySelector(".cd-mins"),
      secs: countdown.querySelector(".cd-secs"),
    };
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        countdown.innerHTML = "<div style='grid-column: 1 / -1;'><strong>It's competition day!</strong><span>Good luck, Warriors</span></div>";
        clearInterval(timer);
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (els.days) els.days.textContent = String(d);
      if (els.hours) els.hours.textContent = String(h).padStart(2, "0");
      if (els.mins) els.mins.textContent = String(m).padStart(2, "0");
      if (els.secs) els.secs.textContent = String(s).padStart(2, "0");
    };
    tick();
    const timer = setInterval(tick, 1000);
  }

  /* Contact form — submits via FormSubmit.co (forwards to the team Gmail), no backend of our own needed */
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = document.querySelector("#form-note");
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      if (note) {
        note.textContent = "Sending…";
        note.style.color = "var(--color-ink-500)";
      }
      fetch(contactForm.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(contactForm),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Request failed");
          if (note) {
            note.textContent = "Thanks! Your message has been sent — we'll get back to you soon.";
            note.style.color = "var(--color-gold-600)";
          }
          contactForm.reset();
        })
        .catch(() => {
          if (note) {
            note.textContent = "Something went wrong sending that. Please email us directly using the address on this page.";
            note.style.color = "var(--color-gold-600)";
          }
        })
        .finally(() => {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  /* Set current year in footer */
  document.querySelectorAll(".current-year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* Rotating word — set data-words="a,b,c" on a .rotate-word span */
  document.querySelectorAll(".rotate-word").forEach((el) => {
    const words = (el.dataset.words || el.textContent).split(",").map((w) => w.trim());
    if (words.length < 2) return;
    let i = 0;
    setInterval(() => {
      i = (i + 1) % words.length;
      el.style.opacity = "0";
      setTimeout(() => {
        el.textContent = words[i];
        el.style.opacity = "1";
      }, 250);
    }, 2200);
  });
});
