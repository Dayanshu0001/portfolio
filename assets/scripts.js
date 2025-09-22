/* === scripts.js (SECURE & CLEANED) === */

// Your Firebase configuration object (safe to be public with strict Firestore rules)
const firebaseConfig = {
  apiKey: "AIzaSyCJWjc6qxg-SZDaoDPtpl0hsx1PlYmIj4g",
  authDomain: "my-portfolio-contact-for-597dd.firebaseapp.com",
  projectId: "my-portfolio-contact-for-597dd",
  storageBucket: "my-portfolio-contact-for-597dd.firebasestorage.app",
  messagingSenderId: "425042401405",
  appId: "1:425042401405:web:b11db708c2f581e3523914",
  measurementId: "G-XQ02SSERWP"
};

// Declare the database variable, but don't initialize it yet
let db;

// Run after DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  // Only initialize Firebase if we are on the contact page
  if (document.getElementById("contactForm")) {
    const app = firebase.initializeApp(firebaseConfig);
    db = firebase.firestore(app);
  }

  // Run all initialization functions
  initNav();
  initFadeUps();
  initTypewriter();
  initMatrix();
  initRipple();
  initContactForm();
});

/* === Nav Active Highlight & Smooth Scroll === */
function initNav() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.href === window.location.href) {
      link.classList.add("active");
    }
  });

  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

/* === Fade-up on Scroll === */
function initFadeUps() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".fade-up").forEach((el) => {
    observer.observe(el);
  });
}

/* === Typewriter (Hacker page) === */
function initTypewriter() {
  if (!document.body.classList.contains("hacker")) return;
  const el = document.getElementById("typewriter");
  if (!el) return;

  const lines = [
    "> sudo ./welcome.sh",
    "> Welcome to my Cybersecurity Portfolio",
    "> CEH • Kali • VAPT • CTFs",
  ];

  let lineIndex = 0;
  let charIndex = 0;

  function type() {
    if (lineIndex >= lines.length) return;

    const line = lines[lineIndex];
    if (charIndex <= line.length) {
      el.textContent = line.slice(0, charIndex);
      charIndex++;
      setTimeout(type, 60);
    } else {
      lineIndex++;
      charIndex = 0;
      setTimeout(type, 800);
    }
  }

  type();
}

/* === Matrix Rain (Hacker page) === */
function initMatrix() {
  if (!document.body.classList.contains("hacker")) return;

  const canvas = document.getElementById("matrix");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const letters = "アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾタダチッヂヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤユヨラリルレロワヰヱヲン";
  const fontSize = 14;
  const columns = canvas.width / fontSize;

  const drops = Array.from({ length: columns }, () => 1);

  function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff6a";
    ctx.font = fontSize + "px monospace";

    drops.forEach((y, i) => {
      const text = letters.charAt(Math.floor(Math.random() * letters.length));
      const x = i * fontSize;
      ctx.fillText(text, x, y * fontSize);

      if (y * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    });
  }

  setInterval(draw, 40);

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

/* === Ripple Effect (Contact page button) === */
function initRipple() {
  document.querySelectorAll(".ripple").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const circle = document.createElement("span");
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - this.offsetLeft - radius}px`;
      circle.style.top = `${e.clientY - this.offsetTop - radius}px`;
      circle.classList.add("ripple-effect");

      const ripple = this.getElementsByClassName("ripple-effect")[0];
      if (ripple) ripple.remove();

      this.appendChild(circle);
    });
  });
}

/* === Contact Form Validation & Firebase Submission (Enhanced Security) === */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const msg = document.getElementById("formMsg");
  const contactsCollection = db?.collection("contacts");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      msg.textContent = "⚠ Please fill out all fields.";
      msg.style.color = "#ffcc00";
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      msg.textContent = "⚠ Please enter a valid email.";
      msg.style.color = "#ff4444";
      return;
    }

    if (!contactsCollection) {
      msg.textContent = "❌ Database not initialized.";
      msg.style.color = "#ff4444";
      return;
    }

    try {
      msg.textContent = "Sending message...";
      msg.style.color = "#ffffff";

      await contactsCollection.add({
        name,
        email,
        message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      msg.textContent = "✅ Message sent successfully!";
      msg.style.color = "#00ff6a";
      form.reset();
    } catch (error) {
      console.error("Error writing document to Firestore:", error);
      msg.textContent = "❌ Error sending message. Please try again.";
      msg.style.color = "#ff4444";
    }
  });
}
