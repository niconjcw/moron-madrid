
/* =========================================
   MORÓN MADRID — CHECKOUT
========================================= */

(function () {
  "use strict";

  /* =========================================
     CONFIGURACIÓN
  ========================================= */

  const API_URL = "https://moron-madrid-api.moronmadrid.workers.dev";
  const CART_KEY = "mm_cart";
  const COUPON_KEY = "mm_cart_coupon";
  const CURRENCY = "es-AR";

  let cart = [];
  let coupon = null;
  let subtotal = 0;
  let submitting = false;

  /* =========================================
     UTILIDADES
  ========================================= */

  function formatPrice(value) {
    return "$ " + Number(value || 0).toLocaleString(CURRENCY);
  }

  function getElement(id) {
    return document.getElementById(id);
  }

  function showMessage(message, type = "") {
    const element = getElement("checkout-message");
    if (!element) return;

    element.textContent = message;
    element.style.color =
      type === "error" ? "#b3261e" :
      type === "success" ? "#287a3d" :
      "#555";
  }

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  async function readResponse(response) {
    try {
      return await response.json();
    } catch {
      return {};
    }
  }

  /* =========================================
     RESUMEN DEL PEDIDO
  ========================================= */

  function renderProducts() {
    const container = getElement("checkout-products");

    if (!container) return;

    container.replaceChildren();

    cart.forEach(item => {
      const product = document.createElement("div");
      product.className = "checkout-product";

      const image = document.createElement("img");
      image.src = item.image || "";
      image.alt = item.name || "Producto";
      image.loading = "lazy";

      const info = document.createElement("div");
      info.className = "checkout-product-name";

      const name = document.createElement("strong");
      name.textContent = item.name || "Producto";

      const details = document.createElement("span");
      details.textContent =
        `${item.quantity} × ${formatPrice(item.price)}` +
        (item.variant_name ? ` · talle ${item.variant_name}` : "");

      const price = document.createElement("strong");
      price.textContent = formatPrice(
        Number(item.price) * Number(item.quantity)
      );

      info.append(name, details);
      product.append(image, info, price);
      container.appendChild(product);
    });

    subtotal = cart.reduce(
      (total, item) =>
        total + Number(item.price) * Number(item.quantity),
      0
    );

    getElement("checkout-subtotal").textContent =
      formatPrice(subtotal);

    getElement("checkout-total").textContent =
      formatPrice(subtotal);
  }

  function renderCoupon() {
    const row = getElement("checkout-coupon-row");
    const amount = getElement("checkout-coupon-discount");

    if (!row || !amount) return;

    if (!coupon) {
      row.hidden = true;
      return;
    }

    row.hidden = false;
    amount.textContent = "− " + formatPrice(coupon.discount_amount);

    getElement("checkout-total").textContent =
      formatPrice(Math.max(0, subtotal - coupon.discount_amount));
  }

  /* =========================================
     VALIDAR CUPÓN
  ========================================= */

  async function validateCoupon() {
    const code = localStorage.getItem(COUPON_KEY);

    if (!code) return;

    try {
      const response = await fetch(`${API_URL}/discounts/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code,
          items: cart.map(item => ({
            product_id: item.product_id,
            quantity: Number(item.quantity)
          }))
        })
      });

      const data = await readResponse(response);

      if (!response.ok || !data.valido) {
        localStorage.removeItem(COUPON_KEY);

        showMessage(
          "El cupón ya no está disponible y no se aplicará a esta compra.",
          "error"
        );

        return;
      }

      coupon = {
        code: data.code || code,
        discount_amount: Number(data.discount_amount) || 0
      };

      renderCoupon();

    } catch (error) {
      showMessage(
        "No se pudo verificar el cupón. Podés continuar sin él.",
        "error"
      );
    }
  }

  /* =========================================
     ACTUALIZAR MÉTODO DE PAGO
  ========================================= */

  function updatePaymentDisplay() {
    const method = document.querySelector(
      'input[name="payment_method"]:checked'
    )?.value;

    const transferRow = getElement("checkout-transfer-row");
    const transferNote = getElement("checkout-transfer-note");

    const isTransfer = method === "transferencia";

    if (transferRow) {
      transferRow.hidden = true;
    }

    if (transferNote) {
      transferNote.hidden = !isTransfer;

      if (isTransfer) {
        transferNote.textContent =
          "El 10% adicional por transferencia se calculará en el servidor después de aplicar el cupón.";
      }
    }
  }

  
/* =========================================
   HABILITAR UALÁ BIS
========================================= */

function disableUnavailablePayments() {
  const ualaInput = document.querySelector(
    'input[name="payment_method"][value="uala"]'
  );

  if (!ualaInput) return;

  ualaInput.disabled = false;

  const ualaLabel = ualaInput.closest("label");

  if (ualaLabel) {
    ualaLabel.style.opacity = "1";
    ualaLabel.style.cursor = "pointer";
    ualaLabel.title = "";
  }
}


  /* =========================================
     DATOS DEL PEDIDO
  ========================================= */

  function getCheckoutData() {
    const form = getElement("checkout-form");
    const formData = new FormData(form);

    const shippingMethod = formData.get("shipping_method");
    const paymentMethod = formData.get("payment_method");

    return {
      customer_name: String(
        formData.get("customer_name") || ""
      ).trim(),

      email: String(
        formData.get("email") || ""
      ).trim(),

      phone: String(
        formData.get("phone") || ""
      ).trim(),

      customer_dni: String(
        formData.get("customer_dni") || ""
      ).trim(),

      shipping_address: String(
        formData.get("shipping_address") || ""
      ).trim(),

      postal_code: String(
        formData.get("postal_code") || ""
      ).trim(),

      shipping_method: shippingMethod,

      shipping_note: String(
        formData.get("shipping_note") || ""
      ).trim(),

      payment_method: paymentMethod,

      items: cart.map(item => ({
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        quantity: Number(item.quantity)
      })),

      discount_code: coupon?.code || null
    };
  }

  /* =========================================
     CREAR PEDIDO
  ========================================= */

  async function createOrder(orderData) {
    const response = await fetch(`${API_URL}/checkout/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    const data = await readResponse(response);

    if (!response.ok || !data.order_id) {
      throw new Error(
        data.message ||
        data.error ||
        "No se pudo crear el pedido. Revisá los datos e intentá nuevamente."
      );
    }

    return data;
  }

  /* =========================================
     MOSTRAR TOTAL CONFIRMADO POR EL SERVIDOR
  ========================================= */

  function renderServerTotal(order) {
    if (order.total === undefined || order.total === null) {
      return;
    }

    const totalElement = getElement("checkout-total");

    if (totalElement) {
      totalElement.textContent = formatPrice(order.total);
    }
  }

  /* =========================================
     GENERAR PAGO MERCADO PAGO
  ========================================= */

  async function createPayment(orderId, method) {
    if (method !== "mercadopago") {
      throw new Error(
        "Este medio de pago todavía no está disponible."
      );
    }

    const response = await fetch(
      `${API_URL}/payments/mercadopago/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          order_id: orderId
        })
      }
    );

    const data = await readResponse(response);

    if (!response.ok) {
      throw new Error(
        data.message ||
        data.error ||
        "No se pudo iniciar el pago. El pedido quedó registrado."
      );
    }

    const checkoutUrl = data.checkout_url;

    if (!checkoutUrl) {
      throw new Error(
        "El pedido se creó, pero no recibimos el enlace de pago."
      );
    }

    return checkoutUrl;
  }

  /* =========================================
     CONFIRMAR COMPRA
  ========================================= */

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    const form = getElement("checkout-form");

    if (!form.reportValidity()) return;

    if (!cart.length) {
      showMessage("Tu carrito está vacío.", "error");
      return;
    }

    const button = getElement("checkout-submit");
    const originalText = button.textContent;

    submitting = true;
    button.disabled = true;
    button.textContent = "procesando...";
    showMessage("");

    try {
      const orderData = getCheckoutData();
      const method = orderData.payment_method;

      if (method === "uala") {
        throw new Error(
          "Ualá Bis todavía no está habilitado. Elegí otro medio de pago."
        );
      }

      const order = await createOrder(orderData);

      renderServerTotal(order);

      if (method === "mercadopago") {
        button.textContent = "conectando con Mercado Pago...";

        const checkoutUrl = await createPayment(
          order.order_id,
          method
        );

        window.location.assign(checkoutUrl);
        return;
      }

      showMessage(
        method === "transferencia"
          ? `Tu pedido ${order.order_id} fue registrado. Total confirmado: ${formatPrice(order.total)}. Te enviaremos los datos para realizar la transferencia.`
          : `Tu pedido ${order.order_id} fue registrado. Total: ${formatPrice(order.total)}. Nos comunicaremos para coordinar el pago.`,
        "success"
      );

      button.textContent = "pedido registrado";

    } catch (error) {
      showMessage(error.message, "error");

      button.disabled = false;
      button.textContent = originalText;
      submitting = false;
    }
  }

  /* =========================================
     INICIALIZACIÓN
  ========================================= */

  async function init() {
    cart = loadCart();

    if (!cart.length) {
      window.location.replace("/shop/");
      return;
    }

    renderProducts();

    await validateCoupon();

    disableUnavailablePayments();

    document.querySelectorAll(
      'input[name="payment_method"]'
    ).forEach(input => {
      input.addEventListener("change", updatePaymentDisplay);
    });

    getElement("checkout-form")
      .addEventListener("submit", handleSubmit);

    updatePaymentDisplay();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
