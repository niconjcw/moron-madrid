/* =========================================
   MORÓN MADRID — FOOTER COMPARTIDO
========================================= */

(() => {
  "use strict";

  const footerHTML = `
    <footer class="site-footer">
      <div class="footer-columns">

        <div class="footer-column">
          <p class="footer-heading">explorar</p>
          <a href="./">tienda</a>
          <a href="https://moronmadrid.com/#archivo">archivo</a>
        </div>

        <div class="footer-column">
          <p class="footer-heading">información</p>
          <a href="nosotros.html">nosotros</a>
          <a href="compras-envios.html">compras/envíos</a>
          <a href="devoluciones.html">devoluciones</a>
        </div>

        <div class="footer-column">
          <p class="footer-heading">contactanos</p>
          <a href="https://www.instagram.com/moronmadrid/"
             target="_blank" rel="noopener noreferrer">
            instagram ↗
          </a>
          <a href="#" class="open-newsletter-modal">
            newsletter
          </a>
          <a href="#" class="open-contact-modal">contacto</a>
        </div>

        <div class="footer-column">
          <a href="./" class="footer-heart">
            <img src="../sticker.png" alt="morón madrid">
          </a>
        </div>

      </div>

      <div class="footer-bottom">
        <span>© morón madrid — 2026</span>
        <time class="footer-clock" id="footer-clock">00:00:00</time>
      </div>
    </footer>
  `;

  function initFooter() {
    const mount = document.getElementById("shared-footer");
    if (!mount) return;

    mount.innerHTML = footerHTML;
    const clock = document.getElementById("footer-clock");

    function updateClock() {
      if (!clock) return;

      const now = new Date();

      clock.textContent = [
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      ]
        .map(value => String(value).padStart(2, "0"))
        .join(":");
    }

    updateClock();
    setInterval(updateClock, 1000);

    mount.addEventListener("click", event => {
      const contact = event.target.closest(".open-contact-modal");
      const newsletter = event.target.closest(".open-newsletter-modal");

      if (contact) {
        event.preventDefault();
        document.dispatchEvent(new CustomEvent("mm:open-contact"));
      }

      if (newsletter) {
        event.preventDefault();
        document.dispatchEvent(new CustomEvent("mm:open-newsletter"));
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFooter);
  } else {
    initFooter();
  }
})();
