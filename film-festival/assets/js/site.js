const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "Menu";
      toggle.focus();
    }
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "Menu";
    }
  });
}

const filters = document.querySelector("[data-filters]");
if (filters) {
  const cards = [...document.querySelectorAll("[data-genre]")];
  const status = document.querySelector("[data-filter-status]");
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    const value = button.dataset.filter;
    for (const item of filters.querySelectorAll("button")) {
      const on = item === button;
      item.classList.toggle("is-on", on);
      item.setAttribute("aria-pressed", String(on));
    }
    let shown = 0;
    for (const card of cards) {
      const match = value === "all" || card.dataset.genre === value;
      card.hidden = !match;
      if (match) shown += 1;
    }
    if (status) {
      const label = value === "all" ? "films" : `${value.toLowerCase()} films`;
      status.textContent = `Showing ${shown} ${label}`;
    }
  });
}

const form = document.querySelector("[data-reserve]");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const pass = String(data.get("pass") || "").trim();
    const quantity = String(data.get("quantity") || "1").trim();
    const note = String(data.get("note") || "").trim();
    const status = form.querySelector("[data-status]");
    if (status) {
      status.hidden = false;
      status.textContent = `Ready, ${name}. Your email app should open with a request for ${quantity} × ${pass}. If it does not, write to ${form.dataset.email}.`;
    }
    const lines = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Pass: ${pass}`,
      `Quantity: ${quantity}`,
      note ? `Note: ${note}` : "",
    ].filter(Boolean);
    const href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(`Baroda Film Festival Shorts 2.0 pass request: ${pass}`)}&body=${encodeURIComponent(lines.join("\n"))}`;
    window.location.href = href;
  });
}

const viewer = document.querySelector(".concept-viewer");
const viewerImage = viewer?.querySelector("img");
const viewerClose = viewer?.querySelector(".concept-viewer-close");

if (viewer && viewerImage) {
  for (const link of document.querySelectorAll("[data-fullsize]")) {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const image = link.querySelector("img");
      viewerImage.src = link.href;
      viewerImage.alt = image?.alt || "";
      viewer.showModal();
    });
  }

  viewerClose?.addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener("close", () => {
    viewerImage.removeAttribute("src");
  });
}

for (const idea of document.querySelectorAll("[data-idea-carousel]")) {
  const slides = [...idea.querySelectorAll(".idea-slide")];
  const count = idea.querySelector("[data-idea-count]");
  let index = 0;
  const show = (next) => {
    slides[index].classList.remove("is-on");
    index = (next + slides.length) % slides.length;
    slides[index].classList.add("is-on");
    if (count) count.textContent = `${index + 1} / ${slides.length}`;
  };
  idea.querySelector("[data-idea-prev]")?.addEventListener("click", () => show(index - 1));
  idea.querySelector("[data-idea-next]")?.addEventListener("click", () => show(index + 1));
}

const rotator = document.querySelector("[data-rotator]");
if (rotator) {
  const frame = rotator.querySelector(".photo-rotator-frame");
  const slides = [...rotator.querySelectorAll("img")];
  let index = slides.findIndex((slide) => slide.classList.contains("is-on"));
  if (index < 0) index = 0;

  const fit = (slide) => {
    const apply = () => {
      if (frame && slide.naturalWidth) {
        frame.style.aspectRatio = `${slide.naturalWidth} / ${slide.naturalHeight}`;
      }
    };
    if (slide.complete && slide.naturalWidth) apply();
    else slide.addEventListener("load", apply, { once: true });
  };

  fit(slides[index]);

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.setInterval(() => {
      slides[index].classList.remove("is-on");
      index = (index + 1) % slides.length;
      slides[index].classList.add("is-on");
      fit(slides[index]);
    }, 4000);
  }
}
