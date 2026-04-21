// =========================
// CARRITO (estado global)
// =========================

let cart = [];
// Array donde se guardan los productos seleccionados

// =========================
// AGREGAR PRODUCTO
// =========================

function addToCart(name, price) {
  // función que recibe nombre y precio

  let item = cart.find(p => p.name === name);
  // busca si el producto ya está en el carrito

  if (item) {
    // si existe, aumenta cantidad
    item.qty++;
  } else {
    // si no existe, lo agrega nuevo
    cart.push({ name, price, qty: 1 });
  }

  renderCart();
  // actualiza la interfaz
}

// =========================
// MOSTRAR CARRITO
// =========================

function renderCart() {

  const list = document.getElementById("cart-list");
  // obtiene lista HTML

  const totalEl = document.getElementById("total");
  // obtiene elemento del total

  list.innerHTML = "";
  // limpia la lista antes de dibujar

  let total = 0;
  // variable acumuladora

  cart.forEach((item, index) => {

    let subtotal = item.price * item.qty;
    // calcula subtotal

    total += subtotal;
    // suma al total general

    let li = document.createElement("li");
    // crea elemento HTML

    li.innerHTML = `
      ${item.name} x${item.qty} - $${subtotal}
      <button onclick="changeQty(${index}, 1)">+</button>
      <button onclick="changeQty(${index}, -1)">-</button>
      <button onclick="removeItem(${index})">🗑</button>
    `;
    // contenido del item

    list.appendChild(li);
    // lo agrega a la lista

  });

  totalEl.textContent = "Total: $" + total.toFixed(2);
  // muestra total final
}

// =========================
// CAMBIAR CANTIDAD
// =========================

function changeQty(index, change) {

  cart[index].qty += change;
  // aumenta o disminuye cantidad

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
    // elimina si llega a 0
  }

  renderCart();
  // actualiza vista
}

// =========================
// ELIMINAR PRODUCTO
// =========================

function removeItem(index) {
  cart.splice(index, 1);
  // elimina producto del array

  renderCart();
  // actualiza vista
}

// =========================
// ABRIR MODAL
// =========================

function openPayment() {

  if (cart.length === 0) {
    alert("Carrito vacío");
    return;
  }

  document.getElementById("payment-modal").style.display = "block";
  // muestra modal
}

// =========================
// CERRAR MODAL
// =========================

function closePayment() {
  document.getElementById("payment-modal").style.display = "none";
  // oculta modal
}

// =========================
// PROCESAR PAGO (SIMULADO)
// =========================

function processPayment() {

  const status = document.getElementById("payment-status");
  // mensaje de estado

  let number = document.getElementById("card-number").value;
  // obtiene tarjeta

  if (!number || number.length < 12) {
    status.textContent = "❌ Tarjeta inválida";
    return;
  }

  status.textContent = "⏳ Procesando...";
  // simulación

  setTimeout(() => {

    status.textContent = "✅ Pago aprobado";

    setTimeout(() => {

      closePayment();
      // cierra modal

      generateTicket();
      // genera PDF

      cart = [];
      // vacía carrito

      renderCart();
      // actualiza UI

    }, 1000);

  }, 2000);
}

// =========================
// GENERAR FACTURA PDF
// =========================

function generateTicket() {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  // crea documento PDF

  let y = 60;
  let total = 0;

  doc.text("FACTURA DE COMPRA", 105, 20, { align: "center" });
  // título

  doc.text("Tech Market Chile", 14, 30);
  // empresa

  doc.text("Producto", 14, y);
  doc.text("Cant", 100, y);
  doc.text("Subtotal", 160, y);

  y += 10;

  cart.forEach(item => {

    let subtotal = item.price * item.qty;
    total += subtotal;

    doc.text(item.name, 14, y);
    doc.text(String(item.qty), 100, y);
    doc.text("$" + subtotal, 160, y);

    y += 10;
  });

  y += 10;

  doc.text("TOTAL: $" + total.toFixed(2), 160, y);
  // total final

  doc.save("factura.pdf");
  // descarga archivo
}