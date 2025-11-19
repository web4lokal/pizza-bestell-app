// --- Data ----

const produkte = [
  { id: 1, name: "Pizza Margherita", beschreibung: "Tomaten, Käse", preis: 7.50, bild: "img/pizza_magarita.png", kategorie: "Pizza" },
  { id: 2, name: "Pizza Salami", beschreibung: "Tomaten, Käse, Salami", preis: 8.50, bild: "img/pizza_salami.png", kategorie: "Pizza" },
  { id: 3, name: "Pizza Regina", beschreibung: "Tomaten, Käse, Schinken, Champignons", preis: 9.00, bild: "img/pizza_regina.png", kategorie: "Pizza" },
  { id: 4, name: "Pizza Mozzarella", beschreibung: "Tomaten, Käse, Mozzarella, Basilikum", preis: 8.90, bild: "img/pizza_mozarella.png", kategorie: "Pizza" },
  { id: 5, name: "Pizza Vegetaria", beschreibung: "Tomaten, Käse, Gemüse", preis: 9.20, bild: "img/pizza_vegetable.png", kategorie: "Pizza" },
  { id: 6, name: "Beilagensalat", beschreibung: "Gemischter Salat, Tomaten, Oliven", preis: 8.90, bild: "img/beilagensalat.png", kategorie: "Beilagen" },
  { id: 7, name: "Knoblauchbrot", beschreibung: "Baguette, Knoblauchbutter", preis: 9.50, bild: "img/knoblauchbrot.png", kategorie: "Beilagen" },
  { id: 8, name: "Tiramisu", beschreibung: "Eier, Zucker, Mascarpone, Espresso, Löffelbiskuits", preis: 4.50, bild: "img/tiramisu.png", kategorie: "Dessert" },
  { id: 9, name: "Vanilleeis", beschreibung: "Milch, Sahne, Vanillepulver, Glukose, Milchpulver", preis: 3.80, bild: "img/vanilleeis.png", kategorie: "Dessert" }
];

let warenkorb = [];
const lieferkosten = 5.00;
let aktiveKategorie = "alle";
let suchText = "";

const tabIds = [
  { id: "tab-alle",     kat: "alle" },
  { id: "tab-pizza",    kat: "Pizza" },
  { id: "tab-beilagen", kat: "Beilagen" },
  { id: "tab-dessert",  kat: "Dessert" }
];


// --- Initialize app ---

function init() {
  ladeWarenkorbAusLocalStorage();
  setKategorie("alle");
  zeigeProdukte();
  aktualisiereWarenkorb();
}


// --- Category / Search ---

function setKategorie(kat) {
  aktiveKategorie = kat;
  for (let i = 0; i < tabIds.length; i++) {
    const btn = document.getElementById(tabIds[i].id);
    if (!btn) continue;
    btn.className = "tab-button" +
      (tabIds[i].kat === kat ? " tab-button-active" : "");
  }
  zeigeProdukte();
}

function setSuche() {
  const feld = document.getElementById("search-input");
  suchText = feld.value.toLowerCase();
  zeigeProdukte();
}

function produktErlaubt(p) {
  if (aktiveKategorie !== "alle" && p.kategorie !== aktiveKategorie) {
    return false;
  }
  const t = (p.name + " " + p.beschreibung).toLowerCase();
  if (suchText && t.indexOf(suchText) === -1) {
    return false;
  }
  return true;
}


// --- Render product list ---

function baueProduktCard(p) {
  return `<div class="product-card"><img class="product-image" src="${p.bild}" alt="${p.name}"><div class="product-title">${p.name}</div><div class="product-desc">${p.beschreibung}</div><div class="product-bottom"><div class="product-price">${p.preis.toFixed(2).replace('.', ',')} €</div><button class="product-add-btn" onclick="inWarenkorb(${p.id})"><img src="img/plus.svg" alt="+"> Hinzu</button></div></div>`;
}

function zeigeProdukte() {
  const container = document.getElementById("product-list");
  let html = "";
  let gefunden = 0;
  for (let i = 0; i < produkte.length; i++) {
    const p = produkte[i];
    if (!produktErlaubt(p)) continue;
    html += baueProduktCard(p);
    gefunden++;
  }
  if (!gefunden) {
    html = "<p>Keine Produkte gefunden. Ändere die Suche oder Kategorie.</p>";
  }
  container.innerHTML = html;
}


// --- Cart functions ---

function inWarenkorb(id) {
  let gefunden = false;
  for (let i = 0; i < warenkorb.length; i++) {
    if (warenkorb[i].id === id) {
      warenkorb[i].menge++;
      gefunden = true;
      break;
    }
  }
  if (!gefunden) warenkorb.push({ id: id, menge: 1 });
  aktualisiereWarenkorb();
}

function mengePlus(id) {
  for (let i = 0; i < warenkorb.length; i++) {
    if (warenkorb[i].id === id) {
      warenkorb[i].menge++;
      break;
    }
  }
  aktualisiereWarenkorb();
}

function mengeMinus(id) {
  for (let i = 0; i < warenkorb.length; i++) {
    if (warenkorb[i].id === id) {
      warenkorb[i].menge--;
      if (warenkorb[i].menge <= 0) warenkorb.splice(i, 1);
      break;
    }
  }
  aktualisiereWarenkorb();
}

function entfernen(id) {
  for (let i = 0; i < warenkorb.length; i++) {
    if (warenkorb[i].id === id) {
      warenkorb.splice(i, 1);
      break;
    }
  }
  aktualisiereWarenkorb();
}

function findeProdukt(id) {
  for (let i = 0; i < produkte.length; i++) {
    if (produkte[i].id === id) return produkte[i];
  }
  return null;
}


// --- Cart rendering helpers ---

function baueWarenkorbZeile(p, e, gesamt) {
  return `<tr><td>${p.name}</td><td><div class="cart-qty-controls"><button class="icon-btn" onclick="mengeMinus(${p.id})"><img src="img/minus.svg" alt="-"></button><span class="cart-qty">${e.menge}</span><button class="icon-btn" onclick="mengePlus(${p.id})"><img src="img/plus2.svg" alt="+"></button></div></td><td>${gesamt.toFixed(2).replace('.', ',')} €</td><td><button class="icon-btn" onclick="entfernen(${p.id})"><img src="img/trash.svg" alt="X"></button></td></tr>`;
}

function berechneWarenkorb() {
  let html = "", summe = 0, anzahl = 0;
  for (let i = 0; i < warenkorb.length; i++) {
    const e = warenkorb[i];
    const p = findeProdukt(e.id);
    if (!p) continue;
    const gesamt = p.preis * e.menge;
    summe += gesamt;
    anzahl += e.menge;
    html += baueWarenkorbZeile(p, e, gesamt);
  }
  return { html, zwischensumme: summe, artikelAnzahl: anzahl };
}

function renderCartRows(html) {
  const tbody = document.getElementById("cart-items");
  tbody.innerHTML = html;
}

function updateSummen(summe) {
  const subtotalEl = document.getElementById("cart-subtotal");
  const deliveryEl = document.getElementById("cart-delivery");
  const totalEl = document.getElementById("cart-total");
  subtotalEl.textContent = summe.toFixed(2).replace('.', ',') + " €";
  deliveryEl.textContent = lieferkosten.toFixed(2).replace('.', ',') + " €";
  let total = summe;
  if (warenkorb.length > 0) total += lieferkosten;
  totalEl.textContent = total.toFixed(2).replace('.', ',') + " €";
}

function updateCartCount(anzahl) {
  const num = document.getElementById("cart-count-number");
  const box = document.getElementById("cart-count");
  if (!num || !box) return;
  num.textContent = anzahl;
  box.style.visibility = anzahl > 0 ? "visible" : "hidden";
}

function toggleEmptyText() {
  const empty = document.getElementById("cart-empty-text");
  if (!empty) return;
  empty.style.display = warenkorb.length === 0 ? "block" : "none";
}


// --- Render cart & totals (main) ---

function aktualisiereWarenkorb() {
  const daten = berechneWarenkorb();
  renderCartRows(daten.html);
  updateSummen(daten.zwischensumme);
  updateCartCount(daten.artikelAnzahl);
  toggleEmptyText();
  speichereWarenkorbInLocalStorage();
}


// --- LocalStorage ---

function speichereWarenkorbInLocalStorage() {
  const text = JSON.stringify(warenkorb);
  localStorage.setItem("avantiWarenkorb", text);
}

function ladeWarenkorbAusLocalStorage() {
  const text = localStorage.getItem("avantiWarenkorb");
  if (text) warenkorb = JSON.parse(text);
}


// --- Order & popup ---

function bestellen() {
  if (warenkorb.length === 0) {
    alert("Bitte zuerst etwas in den Warenkorb legen!");
    return;
  }
  const daten = berechneWarenkorb();
  const gesamt = daten.zwischensumme + lieferkosten;
  const text = "Du hast " + daten.artikelAnzahl +
    " Artikel für insgesamt " +
    gesamt.toFixed(2).replace('.', ',') + " € bestellt.";
  document.getElementById("order-popup-text").textContent = text;
  document.getElementById("order-popup").classList.add("active");
}

function popupSchliessen() {
  document.getElementById("order-popup").classList.remove("active");
  warenkorb = [];
  aktualisiereWarenkorb();
}


// --- Mobile: Expand/collapse shopping cart ---

function toggleWarenkorbMobile() {
  const box  = document.getElementById("cart-box");
  const icon = document.getElementById("cart-toggle-icon");
  const collapsed = box.classList.toggle("cart-collapsed");
  icon.src = collapsed ? "img/arrow-up.svg" : "img/arrow-down.svg";
}


