
/* =========================================================
   MORÓN MADRID — MODALES COMPARTIDOS
   Contacto + Newsletter
   ========================================================= */

(() => {
  "use strict";

  const API_URL = "https://moron-madrid-api.moronmadrid.workers.dev";
  const NEWSLETTER_API = `${API_URL}/newsletter`;

  /* =========================================================
     EVITAR INICIALIZACIÓN DUPLICADA
     ========================================================= */

  if (window.MMModalsInitialized) return;
  window.MMModalsInitialized = true;

  /* =========================================================
     ESTILOS
     ========================================================= */

  const styles = document.createElement("style");

  styles.textContent = `
    /* NEWSLETTER */

    .custom-popup-overlay {
      position: fixed;
      inset: 0;
      display: none;
      justify-content: center;
      align-items: center;
      padding: 15px;
      background: rgba(0,0,0,.4);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      z-index: 100000;
    }

    .custom-popup-overlay.is-open {
      display: flex;
    }

    .custom-popup-container {
      position: relative;
      width: min(65vw, 650px);
      aspect-ratio: 1 / 1;
      background-image: url("https://i.ibb.co/4ZD4v21F/Stickerpopup.png");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .custom-popup-content {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .custom-popup-close {
      position: absolute;
      top: 25%;
      right: 10%;
      z-index: 10;
      border: none;
      border-radius: 20px;
      background: #f5f5f5;
      color: #333;
      font-size: 24px;
      font-weight: bold;
      line-height: 1;
      cursor: pointer;
    }

    #custom-form-wrapper {
      width: 250px;
      margin: 0 auto;
      text-align: center;
      background: transparent;
      transform: rotate(-18deg) translateY(-5px) translateX(-5px);
    }

    #custom-form {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    #custom-form input.input {
      display: block;
      width: 100%;
      margin: 18px 0 0;
      padding: 2px 0;
      border: none;
      background: transparent;
      color: #fff;
      text-align: center;
      font-size: 15px;
      font-weight: 600;
      text-transform: lowercase;
      outline: none;
      box-shadow: none;
    }

    #custom-form input::placeholder {
      color: rgba(255,255,255,.9);
      text-align: center;
    }

    .custom-submit-btn {
      display: block;
      width: auto;
      margin: 4px auto 0;
      padding: 4px 10px;
      border: none;
      background: transparent;
      color: #fff;
      font-family: Helvetica, sans-serif;
      font-size: 13px;
      font-weight: 700;
      text-align: center;
      text-transform: lowercase;
      cursor: pointer;
    }

    .custom-submit-btn:disabled {
      opacity: .6;
      cursor: wait;
    }

    .custom-response-msg {
      display: none;
      margin-top: 5px;
      color: #fff;
      font-family: Helvetica, sans-serif;
      font-size: 14px;
      font-weight: 700;
      text-transform: lowercase;
    }

    /* CONTACTO */

    .contact-modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 100001;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(0,0,0,.28);
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
      text-transform: lowercase;
      cursor: pointer;
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

    @media (max-width: 600px) {
      .custom-popup-container {
        width: min(95vw, 480px);
      }

      #custom-form-wrapper {
        width: 210px;
      }

      .contact-modal {
        padding: 38px 24px 28px;
      }
    }
  `;

  document.head.appendChild(styles);

  /* =========================================================
     INSERTAR HTML DE LOS MODALES
     ========================================================= */

  const modalMarkup = `
    <!-- NEWSLETTER -->
    <div class="custom-popup-overlay" id="heartPopup" aria-hidden="true">
      <div class="custom-popup-container">

        <button
          class="custom-popup-close"
          id="closeHeartPopup"
          type="button"
          aria-label="Cerrar"
        >&times;</button>

        <div class="custom-popup-content">
          <div id="custom-form-wrapper">

            <form id="custom-form">
              <div style="padding:0;width:100%;">
                <input
                  class="input"
                  type="email"
                  id="EMAIL"
                  name="email"
                  autocomplete="email"
                  placeholder="tu email"
                  required
                >
              </div>

              <div style="padding:0;width:100%;text-align:center;">
                <button
                  type="submit"
                  class="custom-submit-btn"
                  id="customSubmitBtn"
                >suscribite!</button>
              </div>

              <input
                type="text"
                name="website"
                value=""
                tabindex="-1"
                autocomplete="off"
                style="display:none;"
              >
            </form>

            <div
              id="status-message"
              class="custom-response-msg"
              role="status"
              aria-live="polite"
            ></div>

          </div>
        </div>
      </div>
    </div>

    <!-- CONTACTO -->
    <div
      class="contact-modal-overlay"
      id="contactModal"
      aria-hidden="true"
    >
      <section
        class="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contactModalTitle"
      >
        <button
          class="contact-modal-close"
          id="closeContactModal"
          type="button"
          aria-label="Cerrar"
        >×</button>

        <h2 id="contactModalTitle">contacto</h2>

        <form id="contactForm">

          <label for="contactName">nombre</label>
          <input
            id="contactName"
            name="name"
            type="text"
            autocomplete="name"
            maxlength="100"
            required
            placeholder="tu nombre"
          >

          <label for="contactEmail">email</label>
          <input
            id="contactEmail"
            name="email"
            type="email"
            autocomplete="email"
            maxlength="160"
            required
            placeholder="tu@email.com"
          >

          <label for="contactMessage">mensaje</label>
          <textarea
            id="contactMessage"
            name="message"
            rows="4"
            maxlength="3000"
            required
            placeholder="escribí tu mensaje..."
          ></textarea>

          <input
            class="contact-honeypot"
            type="text"
            name="website"
            tabindex="-1"
            autocomplete="off"
            aria-hidden="true"
          >

          <button
            class="contact-submit"
            id="contactSubmit"
            type="submit"
          >enviar mensaje ↗</button>

          <p
            class="contact-form-status"
            id="contactFormStatus"
            role="status"
            aria-live="polite"
          ></p>

        </form>
      </section>
    </div>
  `;

  if (!document.getElementById("heartPopup")) {
    document.body.insertAdjacentHTML("beforeend", modalMarkup);
  }

  /* =========================================================
     ELEMENTOS
     ========================================================= */

  const heartPopup = document.getElementById("heartPopup");
  const contactModal = document.getElementById("contactModal");

  const newsletterForm = document.getElementById("custom-form");
  const newsletterButton = document.getElementById("customSubmitBtn");
  const newsletterStatus = document.getElementById("status-message");

  const contactForm = document.getElementById("contactForm");
  const contactButton = document.getElementById("contactSubmit");
  const contactStatus = document.getElementById("contactFormStatus");

  /* =========================================================
     CONTROL DEL SCROLL
     ========================================================= */

  function updateBodyScroll() {
    const modalOpen =
      heartPopup.classList.contains("is-open") ||
      contactModal.classList.contains("is-open");

    document.body.style.overflow = modalOpen ? "hidden" : "";
  }

  /* =========================================================
     NEWSLETTER — ABRIR Y CERRAR
     ========================================================= */

  function openHeartPopup() {
    if (localStorage.getItem("popupSubscribed")) return;

    heartPopup.classList.add("is-open");
    heartPopup.setAttribute("aria-hidden", "false");
    updateBodyScroll();

    setTimeout(() => {
      document.getElementById("EMAIL")?.focus();
    }, 100);
  }

  function closeHeartPopup(saveDismissal = true) {
    heartPopup.classList.remove("is-open");
    heartPopup.setAttribute("aria-hidden", "true");

    if (saveDismissal) {
      localStorage.setItem("popupDismissed", "true");
    }

    updateBodyScroll();
  }

  window.closeHeartPopup = closeHeartPopup;

  document
    .getElementById("closeHeartPopup")
    .addEventListener("click", () => closeHeartPopup());

  heartPopup.addEventListener("click", event => {
    if (event.target === heartPopup) closeHeartPopup();
  });

  /* =========================================================
     NEWSLETTER — APERTURA AUTOMÁTICA SOLO EN HOME
     ========================================================= */

  const currentPath = window.location.pathname.replace(/\/+$/, "");

  const isShopHome =
    /\/shop(?:\/index\.html)?$/.test(currentPath);

  if (
    isShopHome &&
    !localStorage.getItem("popupSubscribed") &&
    !localStorage.getItem("popupDismissed")
  ) {
    setTimeout(openHeartPopup, 1200);
  }

  /* =========================================================
     NEWSLETTER — ABRIR DESDE EL FOOTER
     ========================================================= */

  document.addEventListener("click", event => {
    const link = event.target.closest(
      "#openNewsletterPopup, .newsletter-link"
    );

    if (!link) return;

    event.preventDefault();

    if (localStorage.getItem("popupSubscribed")) return;

    localStorage.removeItem("popupDismissed");
    openHeartPopup();
  });

  /* =========================================================
     NEWSLETTER — ENVÍO
     ========================================================= */

  newsletterForm.addEventListener("submit", async event => {
    event.preventDefault();

    const formData = new FormData(newsletterForm);
    const email = String(formData.get("email") || "").trim();
    const website = String(formData.get("website") || "").trim();

    if (website) return;

    newsletterButton.disabled = true;
    newsletterButton.textContent = "enviando...";
    newsletterStatus.style.display = "none";

    try {
      const response = await fetch(NEWSLETTER_API, {
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
        closeHeartPopup(false);
      }, 1000);

    } catch (error) {
      console.error("Error newsletter:", error);

      newsletterStatus.textContent =
        "no funcionó, intentá de nuevo";

      newsletterStatus.style.display = "block";
      newsletterButton.textContent = "suscribite!";
      newsletterButton.disabled = false;
    }
  });

  /* =========================================================
     CONTACTO — ABRIR Y CERRAR
     ========================================================= */

  function openContactModal(event) {
    if (event) event.preventDefault();

    contactModal.classList.add("is-open");
    contactModal.setAttribute("aria-hidden", "false");
    updateBodyScroll();

    setTimeout(() => {
      document.getElementById("contactName")?.focus();
    }, 100);
  }

  function closeContactModal() {
    contactModal.classList.remove("is-open");
    contactModal.setAttribute("aria-hidden", "true");
    updateBodyScroll();
  }

  window.openContactModal = openContactModal;
  window.closeContactModal = closeContactModal;

  document.addEventListener("click", event => {
    const link = event.target.closest(".open-contact-modal");

    if (link) {
      openContactModal(event);
    }
  });

  document
    .getElementById("closeContactModal")
    .addEventListener("click", closeContactModal);

  contactModal.addEventListener("click", event => {
    if (event.target === contactModal) {
      closeContactModal();
    }
  });

  /* =========================================================
     CONTACTO — ENVÍO DEL FORMULARIO
     ========================================================= */

  contactForm.addEventListener("submit", async event => {
    event.preventDefault();

    const formData = new FormData(contactForm);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const website = String(formData.get("website") || "").trim();

    if (website) return;

    contactButton.disabled = true;
    contactButton.textContent = "enviando...";
    contactStatus.textContent = "";

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          message,
          website
        })
      });

      const data = await response.json();

      if (!response.ok || data.success !== true) {
        throw new Error(
          data.message || "No se pudo enviar el mensaje."
        );
      }

      contactForm.reset();
      contactStatus.textContent =
        "¡mensaje enviado! gracias por escribirnos.";

      contactButton.textContent = "enviado";

      setTimeout(() => {
        closeContactModal();
        contactButton.disabled = false;
        contactButton.textContent = "enviar mensaje ↗";
        contactStatus.textContent = "";
      }, 1800);

    } catch (error) {
      console.error("Error de contacto:", error);

      contactStatus.textContent =
        "no se pudo enviar. intentá nuevamente.";

      contactButton.disabled = false;
      contactButton.textContent = "enviar mensaje ↗";
    }
  });

  /* =========================================================
     ATAJOS DE TECLADO
     ========================================================= */

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;

    if (contactModal.classList.contains("is-open")) {
      closeContactModal();
    }

    if (heartPopup.classList.contains("is-open")) {
      closeHeartPopup();
    }
  });

  /* =========================================================
     EVENTOS PARA APERTURA DESDE OTROS SCRIPTS
     ========================================================= */

  document.addEventListener("mm:open-contact", openContactModal);
  document.addEventListener("mm:open-newsletter", openHeartPopup);

})();
