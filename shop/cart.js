```javascript
/* =========================================
   MORÓN MADRID — CARRITO
========================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "mm_cart";
  const COUPON_STORAGE_KEY = "mm_cart_coupon";
  const CART_CURRENCY = "es-AR";
  const API_URL = "https://moron-madrid-api.moronmadrid.workers.dev";
  const CHECKOUT_URL = "/shop/checkout.html";

  let cart = loadCart();
  let appliedCoupon = null;
  let couponLoading = false;

  /* =========================================
     UTILIDADES
  ========================================= */

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateCartCount();
  }

  function formatPrice(price) {
    return "$ " + Number(price).toLocaleString(CART_CURRENCY);
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  }

  function getItemKey(productId, variantId) {
    return `${productId}::${variantId || "unico"}`;
  }

  function getCartCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  function getSubtotal() {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  function getDiscount() {
    return appliedCoupon
      ? Number(appliedCoupon.discount_amount) || 0
      : 0;
  }

  function getTotal() {
    return Math.max(0, getSubtotal() - getDiscount());
  }

  function invalidateCoupon() {
    appliedCoupon = null;
    localStorage.removeItem(COUPON_STORAGE_KEY);
  }

  function saveCouponCode(code) {
    if (code) {
      localStorage.setItem(COUPON_STORAGE_KEY, code);
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }

  /* =========================================
     ESTILOS
  ========================================= */

  function injectStyles() {
    if (document.getElementById("mm-cart-styles")) return;

    const style = document.createElement("style");
    style.id = "mm-cart-styles";

    style.textContent = `
      .mm-cart-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.28);
        z-index: 99990;
        opacity: 0;
        visibility: hidden;
        transition: opacity .3s ease, visibility .3s ease;
      }

      .mm-cart-overlay.is-open {
        opacity: 1;
        visibility: visible;
      }

      .mm-cart-drawer {
        position: fixed;
        top: 0;
        right: 0;
        width: min(440px, 100%);
        height: 100dvh;
        background: #f5f5f5;
        color: #000;
        z-index: 99991;
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform .35s ease;
        font-family: Roboto, Arial, sans-serif;
        font-size: .8rem;
        font-weight: 300;
      }

      .mm-cart-drawer.is-open {
        transform: translateX(0);
      }

      .mm-cart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px;
        border-bottom: 1px solid #ddd;
      }

      .mm-cart-header h2 {
        margin: 0;
        font-size: .85rem;
        font-weight: 400;
        text-transform: lowercase;
      }

      .mm-cart-close {
        border: 0;
        background: none;
        font-size: 25px;
        cursor: pointer;
        padding: 0 4px;
        color: #000;
      }

      .mm-cart-items {
        flex: 1;
        overflow-y: auto;
        padding: 20px 24px;
      }

      .mm-cart-empty {
        text-align: center;
        padding: 60px 10px;
        font-size: .8rem;
      }

      .mm-cart-item {
        display: grid;
        grid-template-columns: 90px 1fr;
        gap: 16px;
        padding-bottom: 20px;
        margin-bottom: 20px;
        border-bottom: 1px solid #ddd;
      }

      .mm-cart-item img {
        width: 90px;
        aspect-ratio: 3 / 4;
        object-fit: cover;
        background: #eee;
      }

      .mm-cart-item-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 7px;
      }

      .mm-cart-item-name {
        font-size: .8rem;
        text-transform: lowercase;
      }

      .mm-cart-item-size,
      .mm-cart-item-price {
        font-size: .75rem;
      }

      .mm-cart-item-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 5px;
      }

      .mm-cart-quantity {
        display: flex;
        align-items: center;
        gap: 12px;
        border: 1px solid #ccc;
        padding: 4px 9px;
      }

      .mm-cart-quantity button,
      .mm-cart-remove {
        border: 0;
        background: none;
        color: #000;
        cursor: pointer;
        font: inherit;
      }

      .mm-cart-remove {
        text-decoration: underline;
        font-size: .7rem;
      }

      .mm-cart-footer {
        padding: 20px 24px 26px;
        border-top: 1px solid #ddd;
      }

      .mm-cart-coupon {
        margin-bottom: 18px;
      }

      .mm-cart-coupon-label {
        display: block;
        margin-bottom: 8px;
        font-size: .75rem;
      }

      .mm-cart-coupon-row {
        display: flex;
        gap: 8px;
      }

      .mm-cart-coupon-input {
        flex: 1;
        min-width: 0;
        padding: 11px;
        border: 1px solid #ccc;
        border-radius: 0;
        background: transparent;
        color: #000;
        font: inherit;
        font-size: .75rem;
        text-transform: uppercase;
      }

      .mm-cart-coupon-input:focus {
        outline: 1px solid #000;
      }

      .mm-cart-coupon-button {
        padding: 10px 14px;
        border: 1px solid #000;
        background: #000;
        color: #fff;
        font: inherit;
        font-size: .75rem;
        cursor: pointer;
      }

      .mm-cart-coupon-button:disabled {
        opacity: .5;
        cursor: wait;
      }

      .mm-cart-coupon-message {
        margin: 8px 0 0;
        font-size: .7rem;
        line-height: 1.4;
      }

      .mm-cart-coupon-message.success {
        color: #287a3d;
      }

      .mm-cart-coupon-message.error {
        color: #b3261e;
      }

      .mm-cart-coupon-applied {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        font-size: .75rem;
        margin-bottom: 18px;
      }

      .mm-cart-coupon-remove {
        border: 0;
        background: none;
        text-decoration: underline;
        cursor: pointer;
        font: inherit;
      }

      .mm-cart-summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: .8rem;
      }

      .mm-cart-summary-row.discount {
        color: #287a3d;
      }

      .mm-cart-subtotal {
        display: flex;
        justify-content: space-between;
        margin-bottom: 18px;
        font-size: .9rem;
        border-top: 1px solid #ddd;
        padding-top: 14px;
      }

      .mm-cart-note {
        font-size: .7rem;
        color: #555;
        margin: 0 0 16px;
        line-height: 1.5;
      }

      .mm-cart-checkout {
        display: block;
        width: 100%;
        padding: 15px 18px;
        border: 1px solid #000;
        background: #000;
        color: #fff;
        font-family: inherit;
        font-size: .8rem;
        font-weight: 400;
        text-align: center;
        text-transform: lowercase;
        cursor: pointer;
        transition: background .2s ease, color .2s ease;
      }

      .mm-cart-checkout:hover:not(:disabled) {
        background: transparent;
        color: #000;
      }

      .mm-cart-checkout:disabled {
        opacity: .4;
        cursor: not-allowed;
      }

      .mm-cart-count {
        position: absolute;
        top: -7px;
        right: -9px;
        min-width: 16px;
        height: 16px;
        padding: 0 4px;
        border-radius: 50%;
        background: #dcd63b;
        color: #000;
        font-size: 9px;
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 1;
      }

      .cart-icon {
        position: relative;
      }

      @media (max-width: 700px) {
        .mm-cart-drawer {
          width: 100%;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =========================================
     ESTRUCTURA DEL CARRITO
  ========================================= */

  function createCart() {
    if (document.getElementById("mm-cart-drawer")) return;

    const overlay = document.createElement("div");
    overlay.className = "mm-cart-overlay";
    overlay.id = "mm-cart-overlay";

    const drawer = document.createElement("aside");
    drawer.className = "mm-cart-drawer";
    drawer.id = "mm-cart-drawer";
    drawer.setAttribute("aria-label", "Carrito de compras");

    drawer.innerHTML = `
      <div class="mm-cart-header">
        <h2>tu carrito (<span id="mm-cart-total-count">0</span>)</h2>
        <button class="mm-cart-close" type="button" aria-label="Cerrar carrito">×</button>
      </div>

      <div class="mm-cart-items" id="mm-cart-items"></div>

      <div class="mm-cart-footer">

        <div class="mm-cart-coupon" id="mm-cart-coupon">
          <label class="mm-cart-coupon-label" for="mm-cart-coupon-input">
            ¿tenés un código de descuento?
          </label>

          <div class="mm-cart-coupon-row">
            <input
              class="mm-cart-coupon-input"
              id="mm-cart-coupon-input"
              type="text"
              placeholder="código"
              autocomplete="off"
            >
            <button
              class="mm-cart-coupon-button"
              id="mm-cart-coupon-button"
              type="button"
            >aplicar</button>
          </div>

          <p
            class="mm-cart-coupon-message"
            id="mm-cart-coupon-message"
            aria-live="polite"
          ></p>
        </div>

        <div class="mm-cart-coupon-applied" id="mm-cart-coupon-applied" hidden>
          <span id="mm-cart-coupon-applied-name"></span>
          <button
            class="mm-cart-coupon-remove"
            id="mm-cart-coupon-remove"
            type="button"
          >quitar</button>
        </div>

        <div class="mm-cart-summary-row">
          <span>subtotal</span>
          <strong id="mm-cart-subtotal">$ 0</strong>
        </div>

        <div class="mm-cart-summary-row discount" id="mm-cart-discount-row" hidden>
          <span>descuento</span>
          <strong id="mm-cart-discount">− $ 0</strong>
        </div>

        <div class="mm-cart-subtotal">
          <span>total</span>
          <strong id="mm-cart-total">$ 0</strong>
        </div>

        <p class="mm-cart-note">
          los costos de envío se calcularán al continuar con la compra.
        </p>

        <button
          class="mm-cart-checkout"
          id="mm-cart-checkout"
          type="button"
          disabled
        >continuar al pago</button>
      </div>
    `;

    document.body.append(overlay, drawer);

    overlay.addEventListener("click", closeCart);

    drawer.querySelector(".mm-cart-close")
      .addEventListener("click", closeCart);

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeCart();
    });

    drawer.querySelector("#mm-cart-items")
      .addEventListener("click", handleCartAction);

    drawer.querySelector("#mm-cart-coupon-button")
      .addEventListener("click", applyCoupon);

    drawer.querySelector("#mm-cart-coupon-input")
      .addEventListener("keydown", event => {
        if (event.key === "Enter") {
          event.preventDefault();
          applyCoupon();
        }
      });

    drawer.querySelector("#mm-cart-coupon-remove")
      .addEventListener("click", removeCoupon);

    drawer.querySelector("#mm-cart-checkout")
      .addEventListener("click", goToCheckout);
  }

  /* =========================================
     CONTINUAR AL CHECKOUT
  ========================================= */

  function goToCheckout() {
    if (!cart.length) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));

    if (appliedCoupon?.code) {
      saveCouponCode(appliedCoupon.code);
    }

    window.location.href = CHECKOUT_URL;
  }

  /* =========================================
     ABRIR Y CERRAR
  ========================================= */

  function openCart() {
    createCart();

    document.getElementById("mm-cart-overlay").classList.add("is-open");
    document.getElementById("mm-cart-drawer").classList.add("is-open");

    document.body.style.overflow = "hidden";
    renderCart();
  }

  function closeCart() {
    const overlay = document.getElementById("mm-cart-overlay");
    const drawer = document.getElementById("mm-cart-drawer");

    if (!overlay || !drawer) return;

    overlay.classList.remove("is-open");
    drawer.classList.remove("is-open");

    document.body.style.overflow = "";
  }

  /* =========================================
     CONTADOR DEL CARRITO
  ========================================= */

  function updateCartCount() {
    document.querySelectorAll(".cart-icon").forEach(icon => {
      let badge = icon.querySelector(".mm-cart-count");

      if (!badge) {
        badge = document.createElement("span");
        badge.className = "mm-cart-count";
        icon.appendChild(badge);
      }

      const count = getCartCount();

      badge.textContent = count;
      badge.hidden = count === 0;
    });

    const total = document.getElementById("mm-cart-total-count");

    if (total) total.textContent = getCartCount();
  }

  /* =========================================
     AGREGAR PRODUCTOS
  ========================================= */

  function add(product, variant = null, quantity = 1) {
    if (!product || !product.id) {
      alert("No se pudo agregar este producto.");
      return false;
    }

    const selectedVariant = variant || null;
    const variantId = selectedVariant
      ? selectedVariant.id || selectedVariant.size
      : null;

    const stock = selectedVariant
      ? Number(selectedVariant.stock)
      : Number(product.stock);

    const hasStockLimit = selectedVariant
      ? true
      : Number.isFinite(stock) && product.stock !== undefined;

    const key = getItemKey(product.id, variantId);

    const existing = cart.find(item => item.key === key);
    const currentQuantity = existing ? existing.quantity : 0;
    const newQuantity = currentQuantity + quantity;

    if (hasStockLimit && newQuantity > stock) {
      alert("No hay suficiente stock disponible.");
      return false;
    }

    if (existing) {
      existing.quantity = newQuantity;
    } else {
      cart.push({
        key,
        product_id: product.id,
        name: product.name,
        slug: product.slug || "",
        price: Number(product.price) || 0,
        image: product.image || "",
        variant_id: variantId,
        variant_name: selectedVariant
          ? selectedVariant.size || "único"
          : "",
        stock: hasStockLimit ? stock : null,
        quantity
      });
    }

    invalidateCoupon();
    saveCart();
    renderCart();
    openCart();

    return true;
  }

  /* =========================================
     MODIFICAR CANTIDADES
  ========================================= */

  function handleCartAction(event) {
    const button = event.target.closest("[data-cart-action]");
    if (!button) return;

    const key = button.dataset.key;
    const action = button.dataset.cartAction;

    const item = cart.find(product => product.key === key);
    if (!item) return;

    if (action === "remove") {
      cart = cart.filter(product => product.key !== key);
    }

    if (action === "increase") {
      if (item.stock !== null && item.quantity >= item.stock) {
        alert("No hay más unidades disponibles.");
        return;
      }

      item.quantity++;
