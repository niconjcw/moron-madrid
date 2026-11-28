
/* =====================================================
   MORÓN MADRID — MODALES COMPARTIDOS
   Contacto + Newsletter
   ===================================================== */

(() => {
  "use strict";

  const API_URL = "https://moron-madrid-api.moronmadrid.workers.dev";

  /* -----------------------------------------------------
     ESTILOS
  ----------------------------------------------------- */

  const styles = document.createElement("style");

  styles.textContent = `
    @font-face {
      font-display: block;
      font-family: Roboto;
      src: url(https://assets.brevo.com/font/Roboto/Latin/normal/normal/7529907e9eaf8ebb5220c5f9850e3811.woff2) format("woff2");
    }

    /* CONTACTO */

    .contact-modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 100000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(0, 0, 0, .28);
      backdrop-filter: blur(7px);
      -webkit-backdrop-filter: blur(7px);
    }

    .contact-modal-overlay.is-open {
      display: flex;
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

    .custom-popup-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: none;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, .4);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
    }

    .custom-popup-container {
      position: relative;
      width: 65%;
      height: 65%;
      background-image: url("https://i.ibb.co/4ZD4v21F/Stickerpopup.png");
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
      background: #f5f5f5;
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
      color: rgba(255, 255, 255, .9) !important;
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
      transition: all .2s ease !important;
      text-transform: lowercase;
      display: block !important;
      text-align: center !important;
      width: auto !important;
    }

    .custom-submit-btn:hover {
      opacity: .8;
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
        height: 75%;
      }

      #custom-form-wrapper {
        width: 210px;
      }

      .custom-popup-close {
        top: 20%;
        right: 8%;
      }
    }
  `;

  document.head.appendChild(styles);

  /* -----------------------------------------------------
     HTML DE LOS MODALES
  ----------------------------------------------------- */

  const mount = document.createElement("div");

  mount.innerHTML = `
    <div class="contact-modal-overlay" id="contactModal" aria-hidden="true">
      <section class="contact-modal" role="dialog"
        aria-modal="true" aria-labelledby="contactModalTitle">

        <button class="contact-modal-close" id="closeContactModal"
          type="button" aria-label="Cerrar">×</button>

        <h2 id="contactModalTitle">contacto</h2>

        <form id="contactForm">
          <label for="contactName">nombre</label>
          <input id="contactName" name="name" type="text"
            autocomplete="name" maxlength="100" required
            placeholder="tu nombre">

          <label for="contactEmail">email</label>
          <input id="contactEmail" name="email" type="email"
            autocomplete="email" maxlength="160" required
            placeholder="tu@email.com">

          <label for="contactMessage">mensaje</label>
          <textarea id="contactMessage" name="message"
            rows="4" maxlength="3000" required
            placeholder="escribí tu mensaje..."></textarea>

          <input class="contact-honeypot" type="text"
            name="website" tabindex="-1" autocomplete="off"
            aria-hidden="true">

          <button class="contact-submit" id="contactSubmit"
            type="submit">enviar mensaje ↗</button>

          <p class="contact-form-status" id="contactFormStatus"
            role="status" aria-live="polite"></p>
        </form>
      </section>
    </div>

    <div class="custom-popup-overlay" id="heartPopup">
      <div class="custom-popup-container">

        <button class="custom-popup-close" id="closeHeartPopup"
          type="button" aria-label="Cerrar">×</button>

        <div class="custom-popup-content">
          <div id="custom-form-wrapper">

            <form id="custom-form">
              <div style="padding:0;width:100%;">
                <input class="input" type="email" id="EMAIL"
                  name="email" autocomplete="email"
                  placeholder="tu email" required>
              </div>

              <div style="padding:0;width:100%;text-align:center;">
                <button type="submit" class="custom-submit-btn"
                  id="customSubmitBtn">suscribite!</button>
              </div>

              <input type="text" name="website" value=""
                tabindex="-1" autocomplete="off"
                style="display:none;">
            </form>

            <div id="status-message" class="custom-response-msg"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(mount);

  /* -----------------------------------------------------
     CONTROL DE APERTURA Y CIERRE
  ----------------------------------------------------- */

  const contactModal = document.getElementById("contactModal");
  const newsletterModal = document.getElementById("heartPopup");

  function openContactModal() {
    closeNewsletterModal(false);

    contactModal.classList.add("is-open");
    contactModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      document.getElementById("contactName").focus();
    }, 50);
  }

  function closeContactModal() {
    contactModal.classList.remove("is-open");
    contactModal.setAttribute("aria-hidden", "true");

    if (newsletterModal.style.display !== "flex") {
      document.body.style.overflow = "";
    }
  }

  function openNewsletterModal() {
    if (localStorage.getItem("popupSubscribed")) return;

    closeContactModal();

    localStorage.removeItem("popupDismissed");
    newsletterModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closeNewsletterModal(saveDismissal = true) {
    newsletterModal.style.display = "none";

    if (saveDismissal) {
      localStorage.setItem("popupDismissed", "true");
    }

    if (!contactModal.classList.contains("is-open")) {
      document.body.style.overflow = "";
    }
  }

  window.closeHeartPopup = closeNewsletterModal;

  document.addEventListener("click", event => {
    if (event.target.closest(".open-contact-modal")) {
      event.preventDefault();
      openContactModal();
    }

    if (
      event.target.closest(".newsletter-link") ||
      event.target.closest("#openNewsletterPopup")
    ) {
      event.preventDefault();
      openNewsletterModal();
    }
  });

  document.addEventListener("mm:open-contact", openContactModal);
  document.addEventListener("mm:open-newsletter", openNewsletterModal);

  document.getElementById("closeContactModal")
    .addEventListener("click", closeContactModal);

  document.getElementById("closeHeartPopup")
    .addEventListener("click", () => closeNewsletterModal(true));

  contactModal.addEventListener("click", event => {
    if (event.target === contactModal) closeContactModal();
  });

  newsletterModal.addEventListener("click", event => {
    if (event.target === newsletterModal) {
      closeNewsletterModal(true);
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeContactModal();

      if (newsletterModal.style.display === "flex") {
        closeNewsletterModal(true);
      }
    }
  });

  /* -----------------------------------------------------
     FORMULARIO DE CONTACTO
     Mantiene el endpoint y la respuesta originales.
  ----------------------------------------------------- */

  const contactForm = document.getElementById("contactForm");
  const contactStatus = document.getElementById("contactFormStatus");
  const contactSubmit = document.getElementById("contactSubmit");

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
        headers: {
          "Content-Type": "application/json"
        },
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

  /* -----------------------------------------------------
     FORMULARIO NEWSLETTER
  ----------------------------------------------------- */

  const newsletterForm = document.getElementById("custom-form");
  const newsletterSubmit = document.getElementById("customSubmitBtn");
  const newsletterStatus = document.getElementById("status-message");

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
      const response = await fetch(`${API_URL}/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
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

  /* -----------------------------------------------------
     APERTURA AUTOMÁTICA SOLO EN EL INICIO DE LA TIENDA
  ----------------------------------------------------- */

  const currentPath = window.location.pathname.replace(/\/+$/, "");
  const isShopHome = /\/shop$/.test(currentPath);

  if (
    isShopHome &&
    !localStorage.getItem("popupSubscribed") &&
    !localStorage.getItem("popupDismissed")
  ) {
    setTimeout(openNewsletterModal, 500);
  }

})();
