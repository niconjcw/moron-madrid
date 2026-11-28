
/* =====================================================
   MORÓN MADRID — HEADER COMPARTIDO
   ===================================================== */

(() => {
  const API_URL = "https://moron-madrid-api.moronmadrid.workers.dev";

  function renderHeader() {
    const isCatalogPage = Boolean(document.getElementById("catalog"));

    const categoryAll = isCatalogPage
      ? `<button type="button" class="category-filter active" data-category="all">ver todo</button>`
      : `<a href="./">ver todo</a>`;

    const mobileCategoryAll = isCatalogPage
      ? `<button type="button" class="mobile-category active" data-category="all">ver todo</button>`
      : `<a href="./">ver todo</a>`;

    const header = `
      <div class="announcement-bar">
        <marquee>3 cuotas sin interés / -5% por transferencia / envíos a todo el país /</marquee>
      </div>

      <header class="site-header">
        <div class="header-left">
          <a href="./">inicio</a>

          <div class="nav-group">
            <button type="button" class="nav-button" id="products-toggle" aria-expanded="false">
              productos <i class="fas fa-angle-down"></i>
            </button>

            <div class="header-dropdown" id="products-dropdown" hidden>
              ${categoryAll}
              <div id="dynamic-categories"></div>
            </div>
          </div>
        </div>

        <a href="./" class="logo" aria-label="Morón Madrid — Inicio">
          <img src="../sticker.png" alt="morón madrid">
        </a>

        <div class="header-right">
          <div class="nav-group">
            <button type="button" class="nav-button" id="info-toggle" aria-expanded="false">
              información <i class="fas fa-angle-down"></i>
            </button>

            <div class="header-dropdown" id="info-dropdown" hidden>
              <a href="nosotros.html">nosotros</a>
              <a href="compras-envios.html">compras / envíos</a>
              <a href="devoluciones.html">devoluciones</a>
            </div>
          </div>

          <a href="#" class="open-contact-modal">contacto</a>

          <a href="#" class="cart-icon" title="Carrito" aria-label="Carrito">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.4L22 8H6"/>
              <circle cx="10" cy="20" r="1"/>
              <circle cx="18" cy="20" r="1"/>
            </svg>
          </a>
        </div>

        <div class="mobile-header">
          <button type="button" class="mobile-menu-button" id="mobile-menu-toggle"
            aria-label="Abrir menú" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>

          <a href="./" class="mobile-logo" aria-label="Morón Madrid">
            <img src="../sticker.png" alt="morón madrid">
          </a>

          <a href="#" class="cart-icon mobile-cart" title="Carrito" aria-label="Carrito">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.4L22 8H6"/>
              <circle cx="10" cy="20" r="1"/>
              <circle cx="18" cy="20" r="1"/>
            </svg>
          </a>
        </div>
      </header>

      <nav class="mobile-panel" id="mobile-panel" hidden>
        <button type="button" class="mobile-close" id="mobile-close"
          aria-label="Cerrar menú">×</button>

        <a href="./">inicio</a>

        <button type="button" class="mobile-section-button"
          id="mobile-products-toggle" aria-expanded="false">
          productos <i class="fas fa-angle-down"></i>
        </button>

        <div class="mobile-submenu" id="mobile-categories">
          ${mobileCategoryAll}
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

    const mount = document.getElementById("site-header");
    if (mount) mount.innerHTML = header;

    initializeMenu();
    if (!isCatalogPage) loadCategoryLinks();
  }

  async function loadCategoryLinks() {
    try {
      const response = await fetch(`${API_URL}/categories`);
      if (!response.ok) throw new Error("No se pudieron cargar las categorías.");

      const data = await response.json();
      const categories = Array.isArray(data.categories) ? data.categories : [];

      const desktop = document.getElementById("dynamic-categories");
      const mobile = document.getElementById("mobile-categories");

      if (!desktop || !mobile) return;

      categories.forEach(category => {
        const href = `./?category=${encodeURIComponent(category.id)}`;

        const desktopLink = document.createElement("a");
        desktopLink.href = href;
        desktopLink.textContent = category.name.toLowerCase();

        const mobileLink = document.createElement("a");
        mobileLink.href = href;
        mobileLink.textContent = category.name.toLowerCase();

        desktop.appendChild(desktopLink);
        mobile.appendChild(mobileLink);
      });
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  }

  function initializeMenu() {
    const productsToggle = document.getElementById("products-toggle");
    const infoToggle = document.getElementById("info-toggle");
    const productsDropdown = document.getElementById("products-dropdown");
    const infoDropdown = document.getElementById("info-dropdown");

    const mobilePanel = document.getElementById("mobile-panel");
    const mobileMenuButton = document.getElementById("mobile-menu-toggle");

    if (productsToggle && infoToggle) {
      productsToggle.addEventListener("click", () => {
        const opening = productsDropdown.hidden;
        productsDropdown.hidden = !opening;
        infoDropdown.hidden = true;

        productsToggle.setAttribute("aria-expanded", String(opening));
        infoToggle.setAttribute("aria-expanded", "false");
      });

      infoToggle.addEventListener("click", () => {
        const opening = infoDropdown.hidden;
        infoDropdown.hidden = !opening;
        productsDropdown.hidden = true;

        infoToggle.setAttribute("aria-expanded", String(opening));
        productsToggle.setAttribute("aria-expanded", "false");
      });

      document.addEventListener("click", event => {
        if (!event.target.closest(".nav-group")) {
          productsDropdown.hidden = true;
          infoDropdown.hidden = true;
          productsToggle.setAttribute("aria-expanded", "false");
          infoToggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    function closeMobileMenu() {
      if (!mobilePanel || !mobileMenuButton) return;

      mobilePanel.classList.remove("is-open");
      mobileMenuButton.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";

      setTimeout(() => {
        if (!mobilePanel.classList.contains("is-open")) {
          mobilePanel.hidden = true;
        }
      }, 350);
    }

    window.closeMobileMenu = closeMobileMenu;

    function openMobileMenu() {
      if (!mobilePanel || !mobileMenuButton) return;

      mobilePanel.hidden = false;
      requestAnimationFrame(() => mobilePanel.classList.add("is-open"));

      mobileMenuButton.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    mobileMenuButton?.addEventListener("click", openMobileMenu);
    document.getElementById("mobile-close")
      ?.addEventListener("click", closeMobileMenu);

    function toggleMobileSection(buttonId, submenuId) {
      const button = document.getElementById(buttonId);
      const submenu = document.getElementById(submenuId);

      if (!button || !submenu) return;

      button.addEventListener("click", () => {
        const opening = !submenu.classList.contains("is-open");
        submenu.classList.toggle("is-open", opening);
        button.setAttribute("aria-expanded", String(opening));
      });
    }

    toggleMobileSection("mobile-products-toggle", "mobile-categories");
    toggleMobileSection("mobile-info-toggle", "mobile-info-links");

    document.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;

      closeMobileMenu();

      if (productsDropdown) productsDropdown.hidden = true;
      if (infoDropdown) infoDropdown.hidden = true;

      productsToggle?.setAttribute("aria-expanded", "false");
      infoToggle?.setAttribute("aria-expanded", "false");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderHeader);
  } else {
    renderHeader();
  }
})();
