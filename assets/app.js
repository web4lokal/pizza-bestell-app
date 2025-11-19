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

    // Set active tab visually
    const tabIds = [
        { id: "tab-alle",     kat: "alle" },
        { id: "tab-pizza",    kat: "Pizza" },
        { id: "tab-beilagen", kat: "Beilagen" },
        { id: "tab-dessert",  kat: "Dessert" }
    ];

    for (let i = 0; i < tabIds.length; i++) {
        const btn = document.getElementById(tabIds[i].id);
        if (!btn) continue;
        btn.className = "tab-button" + (tabIds[i].kat === kat ? " tab-button-active" : "");
    }

    zeigeProdukte();
}

function setSuche() {
    const feld = document.getElementById("search-input");
    suchText = feld.value.toLowerCase();
    zeigeProdukte();
}


// --- Render product list ----

function zeigeProdukte() {
    const container = document.getElementById("product-list");
    let html = "";
    let anzahlGefunden = 0;

    for (let i = 0; i < produkte.length; i++) {
        const p = produkte[i];

        // Category filter
        if (aktiveKategorie !== "alle" && p.kategorie !== aktiveKategorie) {
            continue;
        }

        // Search filter
        const gesamtText = (p.name + " " + p.beschreibung).toLowerCase();
        if (suchText && gesamtText.indexOf(suchText) === -1) {
            continue;
        }

        anzahlGefunden++;

        html += `
            <div class="product-card">
                <img class="product-image" src="${p.bild}" alt="${p.name}">
                <div class="product-title">${p.name}</div>
                <div class="product-desc">${p.beschreibung}</div>
                <div class="product-bottom">
                    <div class="product-price">${p.preis.toFixed(2).replace('.', ',')} €</div>
                    <button class="product-add-btn" onclick="inWarenkorb(${p.id})">
                        <img src="img/plus.svg" alt="+"> Hinzu
                    </button>
                </div>
            </div>
        `;
    }

    if (anzahlGefunden === 0) {
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

    if (!gefunden) {
        warenkorb.push({ id: id, menge: 1 });
    }

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
            if (warenkorb[i].menge <= 0) {
                warenkorb.splice(i, 1);
            }
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
        if (produkte[i].id === id) {
            return produkte[i];
        }
    }
    return null;
}


// --- Render cart & totals ---

function aktualisiereWarenkorb() {
    const tbody      = document.getElementById("cart-items");
    const emptyText  = document.getElementById("cart-empty-text");
    const subtotalEl = document.getElementById("cart-subtotal");
    const deliveryEl = document.getElementById("cart-delivery");
    const totalEl    = document.getElementById("cart-total");

    // Show/hide empty-cart text
    emptyText.style.display = warenkorb.length === 0 ? "block" : "none";

    let html = "";
    let zwischensumme = 0;

    for (let i = 0; i < warenkorb.length; i++) {
        const e = warenkorb[i];
        const p = findeProdukt(e.id);
        if (!p) continue;

        const gesamt = p.preis * e.menge;
        zwischensumme += gesamt;

        html += `
            <tr>
                <td>${p.name}</td>
                <td>
                    <div class="cart-qty-controls">
                        <button class="icon-btn" onclick="mengeMinus(${p.id})">
                            <img src="img/minus.svg" alt="-">
                        </button>
                        <span class="cart-qty">${e.menge}</span>
                        <button class="icon-btn" onclick="mengePlus(${p.id})">
                            <img src="img/plus2.svg" alt="+">
                        </button>
                    </div>
                </td>
                <td>${gesamt.toFixed(2).replace('.', ',')} €</td>
                <td>
                    <button class="icon-btn" onclick="entfernen(${p.id})">
                        <img src="img/trash.svg" alt="X">
                    </button>
                </td>
            </tr>
        `;
    }

    tbody.innerHTML = html;

    subtotalEl.textContent = zwischensumme.toFixed(2).replace('.', ',') + " €";
    deliveryEl.textContent = lieferkosten.toFixed(2).replace('.', ',') + " €";

    let gesamtPreis = zwischensumme;
    if (warenkorb.length > 0) {
        gesamtPreis += lieferkosten;
    }
    totalEl.textContent = gesamtPreis.toFixed(2).replace('.', ',') + " €";

    speichereWarenkorbInLocalStorage();
}


// --- LocalStorage ---

function speichereWarenkorbInLocalStorage() {
    const text = JSON.stringify(warenkorb);
    localStorage.setItem("avantiWarenkorb", text);
}

function ladeWarenkorbAusLocalStorage() {
    const text = localStorage.getItem("avantiWarenkorb");
    if (text) {
        warenkorb = JSON.parse(text);
    }
}


// --- Order & popup ---

function bestellen() {
    if (warenkorb.length === 0) {
        alert("Bitte zuerst etwas in den Warenkorb legen!");
        return;
    }

    let anzahl = 0;
    let summe = 0;

    for (let i = 0; i < warenkorb.length; i++) {
        const e = warenkorb[i];
        const p = findeProdukt(e.id);
        if (!p) continue;

        anzahl += e.menge;
        summe  += p.preis * e.menge;
    }

    const gesamt = summe + lieferkosten;

    document.getElementById("order-popup-text").textContent =
        "Du hast " + anzahl + " Artikel für insgesamt " +
        gesamt.toFixed(2).replace('.', ',') + " € bestellt.";

    // Show popup
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


