
/* =========================================
   MORÓN MADRID — MODALES COMPARTIDOS
   Contacto + Newsletter
========================================= */

(() => {
  "use strict";

  const API_URL = "https://moron-madrid-api.moronmadrid.workers.dev";
  const NEWSLETTER_API = `${API_URL}/newsletter`;

  /* =========================================
     ESTILOS DE LOS MODALES
  ========================================= */

  const styles = `
    .mm-modal-overlay {
      position: fixed;
      inset: 0;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      z-index: 100000;
    }

    .mm-modal-overlay.is-open {
      display: flex;
    }

    .contact-modal-overlay {
      background: rgba(0,0,0,.28);
      backdrop-filter: blur(7px);
      -webkit-backdrop-filter: blur(7px);
    }

    .contact-modal {
      position: relative;
      width: min(100%, 460px);
      max-height: 90vh;
      overflow-y: auto;
      padding: 42px 36px 34px;
      background: #fff;
      color: #000;
      font-family: Roboto, Arial, sans-serif;
    }

    .contact-modal-close {
      position: absolute;
      top: 12px;
      right: 16px;
      padding: 0;
      border: 0;
      background: transparent;
      color: #000;
      font: inherit;
      font-size: 27px;
      line-height: 1;
      cursor: pointer;
    }

    .contact-modal h2 {
      margin: 0 0 10px;
      font-size: 24px;
      font-weight: 400;
      text-transform: lowercase;
    }

    .contact-modal form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 24px;
    }

    .contact-modal label {
      margin-top: 8px;
      font-size: 12px;
      text-transform: lowercase;
    }

    .contact-modal input,
    .contact-modal textarea {
      width: 100%;
      padding: 10px 0;
      border: 0;
      border-bottom: 1px solid #999;
      border-radius: 0;
      outline: none;
      background: transparent;
      color: #000;
      font: inherit;
      font-size: 13px;
      resize: vertical;
    }

    .contact-modal input:focus,
    .contact-modal textarea:focus {
      border-bottom-color: #000;
    }

    .contact-submit {
      align-self: flex-start;
      margin-top: 18px;
      padding: 11px 18px;
      border: 0;
      background: #dcd63b;
      color: #000;
      font: inherit;
      font-size: 12px;
      cursor: pointer;
      text-transform: lowercase;
    }

    .contact-submit:disabled {
      opacity: .55;
      cursor: wait;
    }

    .contact-form-status {
      min-height: 16px;
      margin: 8px 0 0;
      font-size: 12px;
    }

    .contact-honeypot {
      position: absolute !important;
      left: -9999px !important;
      width: 1px !important;
      height: 1px !important;
      opacity: 0 !important;
    }

    /* NEWSLETTER */

    .newsletter-modal-overlay {
      background: rgba(0,0,0,.4);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      z-index: 99999;
    }

    .custom-popup-container {
      position: relative;
      width: 65%;
      height: 65%;
      background-image: url('https://i.ibb.co/4ZD4v21F/Stickerpopup.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .custom-popup-close {
      position: absolute;
      top: 25%;
      right: 10%;
      background: #F5F5F5;
      border-radius: 20px;
      border: none;
      font-size: 24px;
      font-weight: bold;
      color: #333;
      cursor: pointer;
      z-index: 10;
      line-height: 1;
    }

    .custom-popup-content {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    #custom-form-wrapper {
      background: transparent !important;
      transform: rotate(-18deg) translateY(-5px) translateX(-5px);
      width: 250px;
      margin: 0 auto !important;
      text-align: center !important;
    }

    #custom-form {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      width: 100% !important;
    }

    #custom-form input.input {
      background: transparent !important;
      border: none !important;
      color: #fff !important;
      text-align: center !important;
      font-size: 15px !important;
      font-weight: 600 !important;
      width: 100% !important;
      padding: 2px 0 !important;
      outline: none !important;
      box-shadow: none !important;
      text-transform: lowercase;
      margin: 18px 0 auto !important;
      display: block !important;
    }

    #custom-form input::placeholder {
      color: rgba(255,255,255,.9) !important;
      text-align: center !important;
    }

    .custom-submit-btn {
      background: transparent !important;
      border: 0 !important;
      color: #fff !important;
      font-family: Helvetica, sans-serif !important;
      font-size: 13px !important;
      font-weight: 700 !important;
      padding: 4px 10px !important;
      cursor: pointer !important;
      margin: 4px auto 0 !important;
      text-transform: lowercase;
      display: block !important;
      text-align: center !important;
    }

    .custom-submit-btn:disabled {
      opacity: .6;
      cursor: wait !important;
    }

    .custom-response-msg {
      font-family: Helvetica, sans-serif;
      font-size: 14px;
      color: #fff;
      font-weight: 700;
      margin-top: 5px;
      display: none;
      text-transform: lowercase;
    }

    @media (max-width: 600px) {
      .contact-modal {
        padding: 38px 24px 28px;
      }

      .custom-popup-container {
        width: 100%;
        height: 70%;
      }

      .custom-popup-close {
        top: 17%;
        right: 7%;
      }

      #custom-form-wrapper {
        width: 210px;
      }
    }
  `;

  /* =========================================
     HTML DE LOS MODALES
  ========================================= */

  const modalHTML = `
    <!-- CONTACTO -->

    <div class="mm-modal-overlay contact-modal-overlay"
      id="contactModal" aria-hidden="true">

      <section class="contact-modal" role="dialog"
        aria-modal="true" aria-labelledby="contactModalTitle">

        <button class="contact-modal-close"
          id="closeContactModal" type="button"
          aria-label="Cerrar">×</button>

        <h2 id="contactModalTitle">contacto</h2>

        <form id="contactForm">
          <label for="contactName">nombre</label>
          <input id="contactName" name="name" type="text"
            autocomplete="name" maxlength="100"
            required placeholder="tu nombre">

          <label for="contactEmail">email</label>
          <input id="contactEmail" name="email" type="email"
            autocomplete="email" maxlength="160"
            required placeholder="tu@email.com">

          <label for="contactMessage">mensaje</label>
          <textarea id="contactMessage" name="message"
            rows="4" maxlength="3000" required
            placeholder="escribí tu mensaje..."></textarea>

          <input class="contact-honeypot" type="text"
            name="website" tabindex="-1"
            autocomplete="off" aria-hidden="true">

          <button class="contact-submit" id="contactSubmit"
            type="submit">enviar mensaje ↗</button>

          <p class="contact-form-status"
            id="contactFormStatus" role="status"
            aria-live="polite"></p>
        </form>
      </section>
    </div>

    <!-- NEWSLETTER -->

    <div class="mm-modal-overlay newsletter-modal-overlay"
      id="heartPopup">

      <div class="custom-popup-container">

        <button class="custom-popup-close"
          id="closeNewsletterPopup" type="button"
          aria-label="Cerrar">×</button>

        <div class="custom-popup-content">
          <div id="custom-form-wrapper">

            <form id="custom-form">
              <div style="padding:0;width:100%;">
                <input class="input" type="email"
                  id="EMAIL" name="email"
                  autocomplete="email"
                  placeholder="tu email" required>
              </div>

              <div style="padding:0;width:100%;text-align:center;">
                <button type="submit"
                  class="custom-submit-btn"
                  id="customSubmitBtn">
                  suscribite!
                </button>
              </div>

              <input type="text" name="website"
                value="" tabindex="-1"
                autocomplete="off" style="display:none;">
            </form>

            <div id="status-message"
              class="custom-response-msg"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  function initModals() {
    if (document.getElementById("contactModal")) return;

    const style = document.createElement("style");
    style.id = "mm-modal-styles";
    style.textContent = styles;
    document.head.appendChild(style);

    const mount = document.createElement("div");
    mount.id = "mm-shared-modals";
    mount.innerHTML = modalHTML;
    document.body.appendChild(mount);

    const contactModal = document.getElementById("contactModal");
    const contactForm = document.getElementById("contactForm");
    const contactStatus = document.getElementById("contactFormStatus");
    const contactSubmit = document.getElementById("contactSubmit");

    const newsletterModal = document.getElementById("heartPopup");
    const newsletterForm = document.getElementById("custom-form");
    const newsletterStatus = document.getElementById("status-message");
    const newsletterSubmit = document.getElementById("customSubmitBtn");

    /* CONTACTO */

    function openContactModal() {
      contactModal.classList.add("is-open");
      contactModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      document.getElementById("contactName").focus();
    }

    function closeContactModal() {
      contactModal.classList.remove("is-open");
      contactModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    document.addEventListener("mm:open-contact", openContactModal);

    document.addEventListener("click", event => {
      if (event.target.closest(".open-contact-modal")) {
        event.preventDefault();
        openContactModal();
      }
    });

    document.getElementById("closeContactModal")
      .addEventListener("click", closeContactModal);

    contactModal.addEventListener("click", event => {
      if (event.target === contactModal) closeContactModal();
    });

    contactForm.addEventListener("submit", async event => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const message = String(formData.get("message") || "").trim();
      const website = String(formData.get("website") || "").trim();

      if (website) return;

      contactSubmit.disabled = true;
      contactSubmit.textContent = "enviando...";
      contactStatus.textContent = "";

      try {
        const response = await fetch(`${API_URL}/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message, website })
        });

        const data = await response.json();

        if (!response.ok || data.success !== true) {
          throw new Error(data.message || "No se pudo enviar el mensaje.");
        }

        contactForm.reset();
        contactStatus.textContent =
          "¡mensaje enviado! gracias por escribirnos.";
        contactSubmit.textContent = "enviado";

        setTimeout(() => {
          closeContactModal();
          contactSubmit.disabled = false;
          contactSubmit.textContent = "enviar mensaje ↗";
          contactStatus.textContent = "";
        }, 1800);

      } catch (error) {
        console.error("Error de contacto:", error);
        contactStatus.textContent =
          "no se pudo enviar. intentá nuevamente.";
        contactSubmit.disabled = false;
        contactSubmit.textContent = "enviar mensaje ↗";
      }
    });

    /* NEWSLETTER */

    function openNewsletterModal() {
      if (localStorage.getItem("popupSubscribed")) return;

      newsletterModal.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function closeNewsletterModal(dismiss = true) {
      if (dismiss) {
        localStorage.setItem("popupDismissed", "true");
      }

      newsletterModal.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    window.closeHeartPopup = closeNewsletterModal;

    document.addEventListener("mm:open-newsletter", () => {
      localStorage.removeItem("popupDismissed");
      openNewsletterModal();
    });

    document.addEventListener("click", event => {
      if (event.target.closest(".open-newsletter-modal") ||
          event.target.closest("#openNewsletterPopup")) {
        event.preventDefault();
        localStorage.removeItem("popupDismissed");
        openNewsletterModal();
      }
    });

    document.getElementById("closeNewsletterPopup")
      .addEventListener("click", () => closeNewsletterModal(true));

    newsletterModal.addEventListener("click", event => {
      if (event.target === newsletterModal) {
        closeNewsletterModal(true);
      }
    });

    newsletterForm.addEventListener("submit", async event => {
      event.preventDefault();

      const formData = new FormData(newsletterForm);
      const email = String(formData.get("email") || "").trim();
      const website = String(formData.get("website") || "").trim();

      if (website) return;

      newsletterSubmit.textContent = "enviando...";
      newsletterSubmit.disabled = true;
      newsletterStatus.style.display = "none";

      try {
        const response = await fetch(NEWSLETTER_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (!response.ok || data.suscripcion !== "correcta") {
          throw new Error(data.mensaje || "Error al suscribirse");
        }

        localStorage.setItem("popupSubscribed", "true");
        localStorage.setItem("popupDismissed", "true");

        newsletterForm.style.display = "none";
        newsletterStatus.textContent = "listo!";
        newsletterStatus.style.display = "block";

        setTimeout(() => {
          closeNewsletterModal(false);
        }, 1000);

      } catch (error) {
        console.error("Error newsletter:", error);
        newsletterStatus.textContent =
          "no funcionó, intentá de nuevo";
        newsletterStatus.style.display = "block";

        newsletterSubmit.textContent = "suscribite!";
        newsletterSubmit.disabled = false;
      }
    });

    /* APERTURA AUTOMÁTICA SOLO EN LA HOME DE LA TIENDA */

    const currentPath = window.location.pathname.replace(/\/+$/, "");
    const isShopHome = currentPath === "/shop";

    if (
      isShopHome &&
      !localStorage.getItem("popupSubscribed") &&
      !localStorage.getItem("popupDismissed")
    ) {
      setTimeout(openNewsletterModal, 500);
    }

    /* CERRAR CON ESCAPE */

    document.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;

      if (contactModal.classList.contains("is-open")) {
        closeContactModal();
      }

      if (newsletterModal.classList.contains("is-open")) {
        closeNewsletterModal(true);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initModals);
  } else {
    initModals();
  }
})();
