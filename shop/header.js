
/* =========================================
   MORÓN MADRID — HEADER COMPARTIDO
   Genera el encabezado y el menú mobile.
========================================= */

(() => {
  "use strict";

  const API_URL = "https://moron-madrid-api.moronmadrid.workers.dev";
  const LOGO_URL = "../sticker.png";

  const headerHTML = `
    <header class="site-header">

      <div class="header-left">
        <a href="./">inicio</a>

        <div class="nav-group">
          <button type="button" class="nav-button"
            id="products-toggle" aria-expanded="false">
            productos <i class="fas fa-angle-down"></i>
          </button>

          <div class="header-dropdown" id="products-dropdown" hidden>
            <a href="./">ver todo</a>
            <div id="dynamic-categories"></div>
          </div>
        </div>
      </div>

      <a href="./" class="logo" aria-label="Morón Madrid — Inicio">
        <img src="${LOGO_URL}" alt="morón madrid">
      </a>

      <div class="header-right">
        <div class="nav-group">
          <button type="button" class="nav-button"
            id="info-toggle" aria-expanded="false">
            información <i class="fas fa-angle-down"></i>
          </button>

          <div class="header-dropdown" id="info-dropdown" hidden>
            <a href="nosotros.html">nosotros</a>
            <a href="compras-envios.html">compras / envíos</a>
            <a href="devoluciones.html">devoluciones</a>
          </div>
        </div>

        <a href="#" class="open-contact-modal">contacto</a>

        <a href="#" class="cart-icon" title="Carrito"
          aria-label="Carrito">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.4L22 8H6"/>
            <circle cx="10" cy="20" r="1"/>
            <circle cx="18" cy="20" r="1"/>
          </svg>
        </a>
      </div>

      <div class="mobile-header">
        <button type="button" class="mobile-menu-button"
          id="mobile-menu-toggle" aria-label="Abrir menú"
          aria-expanded="false">
          <span></span><span></span><span></span>
        </button>

        <a href="./" class="mobile-logo" aria-label="Morón Madrid">
          <img src="${LOGO_URL}" alt="morón madrid">
        </a>

        <a href="#" class="cart-icon mobile-cart"
          title="Carrito" aria-label="Carrito">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.4L22 8H6"/>
            <circle cx="10" cy="20" r="1"/>
            <circle cx="18" cy="20" r="1"/>
          </svg>
        </a>
      </div>

    </header>

    <nav class="mobile-panel" id="mobile-panel" hidden>
      <button type="button" class="mobile-close"
        id="mobile-close" aria-label="Cerrar menú">×</button>

      <a href="./">inicio</a>

      <button type="button" class="mobile-section-button"
        id="mobile-products-toggle" aria-expanded="false">
        productos <i class="fas fa-angle-down"></i>
      </button>

      <div class="mobile-submenu" id="mobile-categories">
        <a href="./">ver todo</a>
      </div>

      <button type="button" class="mobile-section-button"
        id="mobile-info-toggle" aria-expanded="false">
        información <i class="fas fa-angle-down"></i>
      </button>

      <div class="mobile-submenu" id="mobile-info-links">
        <a href="nosotros.html">nosotros</a>
        <a href="compras-envios.html">compras / envíos</a>
        <a href="devoluciones.html">devoluciones</a>
      </div>

      <a href="#" class="open-contact-modal">contacto</a>
    </nav>
  `;

  function initHeader() {
    const mount = document.getElementById("shared-header");
    if (!mount) return;

    mount.innerHTML = headerHTML;

    const productsToggle = document.getElementById("products-toggle");
    const infoToggle = document.getElementById("info-toggle");
    const productsDropdown = document.getElementById("products-dropdown");
    const infoDropdown = document.getElementById("info-dropdown");

    const mobilePanel = document.getElementById("mobile-panel");
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const mobileClose = document.getElementById("mobile-close");

    /* MENÚ DESKTOP */

    function closeDesktopMenus() {
      productsDropdown.hidden = true;
      infoDropdown.hidden = true;
      productsToggle.setAttribute("aria-expanded", "false");
      infoToggle.setAttribute("aria-expanded", "false");
    }

    productsToggle.addEventListener("click", () => {
      const opening = productsDropdown.hidden;
      closeDesktopMenus();
      productsDropdown.hidden = !opening;
      productsToggle.setAttribute("aria-expanded", String(opening));
    });

    infoToggle.addEventListener("click", () => {
      const opening = infoDropdown.hidden;
      closeDesktopMenus();
      infoDropdown.hidden = !opening;
      infoToggle.setAttribute("aria-expanded", String(opening));
    });

    document.querySelectorAll(".site-header .nav-group").forEach(group => {
      group.addEventListener("mouseenter", () => {
        if (!window.matchMedia("(min-width: 701px)").matches) return;
        closeDesktopMenus();
        const dropdown = group.querySelector(".header-dropdown");
        const button = group.querySelector(".nav-button");
        dropdown.hidden = false;
        button.setAttribute("aria-expanded", "true");
      });

      group.addEventListener("mouseleave", () => {
        if (!window.matchMedia("(min-width: 701px)").matches) return;
        const dropdown = group.querySelector(".header-dropdown");
        const button = group.querySelector(".nav-button");
        dropdown.hidden = true;
        button.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", event => {
      if (!event.target.closest(".site-header .nav-group")) {
        closeDesktopMenus();
      }
    });

    /* MENÚ MOBILE */

    function openMobileMenu() {
      mobilePanel.hidden = false;

      requestAnimationFrame(() => {
        mobilePanel.classList.add("is-open");
      });

      mobileMenuToggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    function closeMobileMenu() {
      mobilePanel.classList.remove("is-open");
      mobileMenuToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";

      setTimeout(() => {
        if (!mobilePanel.classList.contains("is-open")) {
          mobilePanel.hidden = true;
        }
      }, 350);
    }

    mobileMenuToggle.addEventListener("click", openMobileMenu);
    mobileClose.addEventListener("click", closeMobileMenu);

    function toggleMobileSection(buttonId, submenuId) {
      const button = document.getElementById(buttonId);
      const submenu = document.getElementById(submenuId);

      button.addEventListener("click", () => {
        const opening = !submenu.classList.contains("is-open");
        submenu.classList.toggle("is-open", opening);
        button.setAttribute("aria-expanded", String(opening));
      });
    }

    toggleMobileSection("mobile-products-toggle", "mobile-categories");
    toggleMobileSection("mobile-info-toggle", "mobile-info-links");

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeDesktopMenus();
        closeMobileMenu();
      }
    });

    /* CATEGORÍAS DINÁMICAS */

    async function loadCategories() {
      try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error("Error al cargar categorías");

        const data = await response.json();
        const categories = Array.isArray(data.categories)
          ? data.categories
          : [];

        const desktop = document.getElementById("dynamic-categories");
        const mobile = document.getElementById("mobile-categories");

        desktop.replaceChildren();

        mobile.replaceChildren();

        const allMobile = document.createElement("a");
        allMobile.href = "./";
        allMobile.textContent = "ver todo";
        mobile.appendChild(allMobile);

        categories.forEach(category => {
          const href = `./?category=${encodeURIComponent(category.id)}`;

          const desktopLink = document.createElement("a");
          desktopLink.href = href;
          desktopLink.textContent = String(category.name).toLowerCase();

          const mobileLink = document.createElement("a");
          mobileLink.href = href;
          mobileLink.textContent = String(category.name).toLowerCase();

          desktop.appendChild(desktopLink);
          mobile.appendChild(mobileLink);
        });
      } catch (error) {
        console.error("No se pudieron cargar las categorías:", error);
      }
    }

    loadCategories();

    /* CONTACTO: el modal compartido manejará este evento */

    mount.addEventListener("click", event => {
      const contactLink = event.target.closest(".open-contact-modal");
      if (contactLink) {
        event.preventDefault();
        document.dispatchEvent(new CustomEvent("mm:open-contact"));
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeader);
  } else {
    initHeader();
  }
})();
