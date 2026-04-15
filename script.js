// =======================
// AOS INIT
// =======================
document.addEventListener("DOMContentLoaded", function () {
  AOS.init({
    duration: 1000,
    once: false,
    offset: 120
  });
});

// =======================
// NAVBAR & HAMBURGER
// =======================
let lastScroll = 0;
const navbar = document.getElementById("navbar");
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
let menuOpen = false;

// MOBILE MENU TOGGLE
menuBtn.addEventListener("click", () => {
  menuOpen = !menuOpen;
  mobileMenu.style.maxHeight = menuOpen ? mobileMenu.scrollHeight + "px" : "0px";
});

// CLOSE MENU ON LINK CLICK
document.querySelectorAll(".mobile-link").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.style.maxHeight = "0px";
    menuOpen = false;
  });
});

// HIDE/SHOW NAVBAR + HAMBURGER ON SCROLL
window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 50) {
    navbar.style.opacity = "1";
    navbar.style.transform = "translateY(0)";
    menuBtn.style.opacity = "1";
    menuBtn.style.transform = "translateY(0)";
  } else if (currentScroll > lastScroll) {
    navbar.style.opacity = "0";
    navbar.style.transform = "translateY(-100%)";
    menuBtn.style.opacity = "0";
    menuBtn.style.transform = "translateY(-100%)";
  } else {
    navbar.style.opacity = "1";
    navbar.style.transform = "translateY(0)";
    menuBtn.style.opacity = "1";
    menuBtn.style.transform = "translateY(0)";
  }
  lastScroll = currentScroll;
});

// =======================
// SKILLS ACCORDION
// =======================
document.querySelectorAll(".accordion-btn").forEach(button => {
  button.addEventListener("click", () => {
    const content = button.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      document.querySelectorAll(".accordion-content").forEach(c => c.style.maxHeight = null);
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

// =======================
// PARTICLES.JS
// =======================
particlesJS("particles-js", {
  particles: {
    number: { value: 70 },
    size: { value: 3 },
    move: { speed: 1.2 },
    line_linked: { enable: true }
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "repulse" // or "grab", "bubble"
      },
      onclick: {
        enable: true,
        mode: "push"
      }
    },
    modes: {
      repulse: {
        distance: 100,
        duration: 0.4
      },
      grab: {
        distance: 140,
        line_linked: { opacity: 1 }
      },
      bubble: {
        distance: 200,
        size: 6,
        duration: 2
      },
      push: {
        particles_nb: 4
      }
    }
  }
});

//BLOGS
async function loadBlogPreview() {
  try {
    const res = await fetch('./blog/index.json');
    const posts = await res.json();

    const container = document.getElementById('blog-preview');
    container.innerHTML = "";

    posts
      .slice(0, 6) // ✅ limit to 6
      .forEach(post => {
        const card = document.createElement('a');

        card.href = `./blog/post.html?id=${post.id}`;
        card.className =
          "block p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-teal-500 transition";

        card.innerHTML = `
          <h3 class="text-lg font-semibold hover:text-teal-400">
            ${post.title}
          </h3>

          <p class="text-sm text-slate-400 mt-2">
            ${post.summary || ""}
          </p>
        `;

        container.appendChild(card);
      });

  } catch (err) {
    console.error("Blog preview error:", err);
  }
}


//TOOLS
async function loadToolsPreview() {
  try {
    const res = await fetch('./tools/index.json');
    const tools = await res.json();

    const container = document.getElementById('tools-preview');
    container.innerHTML = "";

    tools
      .slice(0, 6)
      .forEach(tool => {
        const card = document.createElement('a');

        card.href = `./tools/item.html?id=${tool.id}`;
        card.className =
          "block p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-teal-500 transition";

        // fallback logic
        const text = tool.summary || tool.description || "";
        const shortText = text.length > 120
          ? text.slice(0, 120) + "..."
          : text;

        card.innerHTML = `
          <h3 class="text-lg font-semibold hover:text-teal-400">
            ${tool.title}
          </h3>

          <p class="text-xs text-slate-500 mt-1 capitalize">
            ${tool.type || ""} ${tool.category ? "• " + tool.category : ""}
          </p>

          <p class="text-sm text-slate-400 mt-2">
            ${shortText}
          </p>
        `;

        container.appendChild(card);
      });

  } catch (err) {
    console.error("Tools preview error:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadBlogPreview();
  loadToolsPreview();
});