
/* =====================================================
   MORÓN MADRID — FOOTER COMPARTIDO
   Pie de página + reloj + accesos a modales
   ===================================================== */

(() => {
  "use strict";

  function renderFooter() {
    const mount = document.getElementById("shared-footer");

    if (!mount) {
      console.warn("No se encontró el contenedor #shared-footer.");
      return;
    }

    mount.innerHTML = `
      <footer class="site-footer">

        <div class="footer-columns">

          <div class="footer-column">
            <p class="footer-heading">explorar</p>
            <a href="./">tienda</a>
            <a href="nosotros.html">nosotros</a>
            <a href="https://moronmadrid.com/#archivo">archivo</a>
          </div>

          <div class="footer-column">
            <p class="footer-heading">información</p>
            <a href="compras-envios.html">compras / envíos</a>
            <a href="devoluciones.html">devoluciones</a>
            <a href="#" class="open-contact-modal">contacto</a>
          </div>

          <div class="footer-column">
            <p class="footer-heading">seguinos</p>
            <a href="https://www.instagram.com/moronmadrid/"
               target="_blank" rel="noopener noreferrer">
              instagram ↗
            </a>
            <a href="#newsletter" class="newsletter-link">newsletter</a>
          </div>

          <div class="footer-column footer-logo-column">
            <a href="./" class="footer-heart" aria-label="Volver al inicio">
              <img src="../sticker.png" alt="morón madrid">
            </a>
          </div>

        </div>

        <div class="footer-bottom">
          <span>© morón madrid — 2026</span>
          <time id="footer-clock" class="footer-clock">00:00:00</time>
        </div>

      </footer>
    `;

    initializeClock();
  }

  /* =====================================================
     RELOJ
     ===================================================== */

  function initializeClock() {
    const clock = document.getElementById("footer-clock");

    if (!clock) return;

    function updateClock() {
      const now = new Date();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      clock.textContent = `${hours}:${minutes}:${seconds}`;
    }

    updateClock();
    window.setInterval(updateClock, 1000);
  }

  /* =====================================================
     INICIO
     ===================================================== */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderFooter);
  } else {
    renderFooter();
  }

})();
