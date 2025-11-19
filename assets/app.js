// Produkte als einfache Objekte
var produkte = [
    { id: 1, name: "Pizza Margherita", beschreibung: "Tomaten, Käse", preis: 7.50, bild: "img/pizza_magarita.png", kategorie: "Pizza" },
    { id: 2, name: "Pizza Salami", beschreibung: "Tomaten, Käse, Salami", preis: 8.50, bild: "img/pizza_salami.png", kategorie: "Pizza" },
    { id: 3, name: "Pizza Regina", beschreibung: "Tomaten, Käse, Schinken, Champignons", preis: 9.00, bild: "img/pizza_regina.png", kategorie: "Pizza" },
    { id: 4, name: "Pizza Mozzarella", beschreibung: "Tomaten, Käse, Mozzarella, Basilikum", preis: 8.90, bild: "img/pizza_mozarella.png", kategorie: "Pizza" },
    { id: 5, name: "Pizza Vegetaria", beschreibung: "Tomaten, Käse, Gemüse", preis: 9.20, bild: "img/pizza_vegetable.png", kategorie: "Pizza" },

    // Beilagen
    { id: 6, name: "Beilagensalat", beschreibung: "Gemischter Salat, Tomaten, Oliven", preis: 8.90, bild: "img/beilagensalat.png", kategorie: "Beilagen" },
    { id: 7, name: "Knoblauchbrot", beschreibung: "Baguette, Knoblauchbutter", preis: 9.50, bild: "img/knoblauchbrot.png", kategorie: "Beilagen" },

    // Desserts
    { id: 8, name: "Tiramisu", beschreibung: "Eier, Zucker, Mascarpone, Espresso, Löffelbiskuits", preis: 4.50, bild: "img/tiramisu.png", kategorie: "Dessert" },
    { id: 9, name: "Vanilleeis", beschreibung: "Milch, Sahne, Vanillepulver, Glukose, Milchpulver", preis: 3.80, bild: "img/vanilleeis.png", kategorie: "Dessert" }
];

// Warenkorb als Array
var warenkorb = [];
var lieferkosten = 5.00;

// Filter
var aktiveKategorie = "alle";
var suchText = "";

// Startfunktion
function init() {
    ladeWarenkorbAusLocalStorage();
    setKategorie("alle");
    zeigeProdukte();
    aktualisiereWarenkorb();
}

// Kategorie setzen (Tabs)
function setKategorie(kat) {
    aktiveKategorie = kat;
    // Tabs optisch setzen
    var tabAlle = document.getElementById("tab-alle");
    var tabPizza = document.getElementById("tab-pizza");
    var tabBeilagen = document.getElementById("tab-beilagen");
    var tabDessert = document.getElementById("tab-dessert");

    // alle Klassen löschen
    tabAlle.className = "tab-button";
    tabPizza.className = "tab-button";
    tabBeilagen.className = "tab-button";
    tabDessert.className = "tab-button";

    if (kat === "alle") {
        tabAlle.className = "tab-button tab-button-active";
    } else if (kat === "Pizza") {
        tabPizza.className = "tab-button tab-button-active";
    } else if (kat === "Beilagen") {
        tabBeilagen.className = "tab-button tab-button-active";
    } else if (kat === "Dessert") {
        tabDessert.className = "tab-button tab-button-active";
    }

    zeigeProdukte();
}

// Suchtext setzen
function setSuche() {
    var feld = document.getElementById("search-input");
    suchText = feld.value.toLowerCase();
    zeigeProdukte();
}

// Produkte anzeigen (mit Filter)
function zeigeProdukte() {
    var html = "";
    var anzahlGefunden = 0;

    for (var i = 0; i < produkte.length; i++) {
        var p = produkte[i];

        // Filter Kategorie
        var erlaubtKategorie = false;
        if (aktiveKategorie === "alle") {
            erlaubtKategorie = true;
        } else if (p.kategorie === aktiveKategorie) {
            erlaubtKategorie = true;
        }

        // Filter Suche
        var erlaubtSuche = false;
        var nameKlein = p.name.toLowerCase();
        var beschreibungKlein = p.beschreibung.toLowerCase();

        if (suchText === "") {
            erlaubtSuche = true;
        } else if (nameKlein.indexOf(suchText) !== -1 || beschreibungKlein.indexOf(suchText) !== -1) {
            erlaubtSuche = true;
        }

        if (!erlaubtKategorie || !erlaubtSuche) {
            continue;
        }

        anzahlGefunden++;

        html += ""
            + "<div class='product-card'>"
            + "  <img class='product-image' src='" + p.bild + "'>"
            + "  <div class='product-title'>" + p.name + "</div>"
            + "  <div class='product-desc'>" + p.beschreibung + "</div>"
            + "  <div class='product-bottom'>"
            + "      <div class='product-price'>" + p.preis.toFixed(2).replace('.', ',') + " €</div>"
            + "      <button class='product-add-btn' onclick='inWarenkorb(" + p.id + ")'>"
            + "          <img src='img/plus.svg'> Hinzu"
            + "      </button>"
            + "  </div>"
            + "</div>";
    }

    if (anzahlGefunden === 0) {
        html = "<p>Keine Produkte gefunden. Ändere die Suche oder Kategorie.</p>";
    }

    document.getElementById("product-list").innerHTML = html;
}

// Produkt in den Warenkorb
function inWarenkorb(id) {
    var vorhanden = false;

    for (var i = 0; i < warenkorb.length; i++) {
        if (warenkorb[i].id === id) {
            warenkorb[i].menge = warenkorb[i].menge + 1;
            vorhanden = true;
            break;
        }
    }

    if (!vorhanden) {
        warenkorb.push({ id: id, menge: 1 });
    }

    aktualisiereWarenkorb();
}

// Menge +1
function mengePlus(id) {
    for (var i = 0; i < warenkorb.length; i++) {
        if (warenkorb[i].id === id) {
            warenkorb[i].menge = warenkorb[i].menge + 1;
            break;
        }
    }
    aktualisiereWarenkorb();
}

// Menge -1
function mengeMinus(id) {
    for (var i = 0; i < warenkorb.length; i++) {
        if (warenkorb[i].id === id) {
            warenkorb[i].menge = warenkorb[i].menge - 1;
            if (warenkorb[i].menge <= 0) {
                warenkorb.splice(i, 1);
            }
            break;
        }
    }
    aktualisiereWarenkorb();
}

// Artikel komplett entfernen
function entfernen(id) {
    for (var i = 0; i < warenkorb.length; i++) {
        if (warenkorb[i].id === id) {
            warenkorb.splice(i, 1);
            break;
        }
    }
    aktualisiereWarenkorb();
}

// Hilfsfunktion, um Produkt zu finden
function findeProdukt(id) {
    for (var i = 0; i < produkte.length; i++) {
        if (produkte[i].id === id) {
            return produkte[i];
        }
    }
    return null;
}

// Warenkorb anzeigen + Summen
function aktualisiereWarenkorb() {
    var html = "";
    var zwischensumme = 0;

    if (warenkorb.length === 0) {
        document.getElementById("cart-empty-text").style.display = "block";
    } else {
        document.getElementById("cart-empty-text").style.display = "none";
    }

    for (var i = 0; i < warenkorb.length; i++) {
        var e = warenkorb[i];
        var p = findeProdukt(e.id);

        var gesamt = p.preis * e.menge;
        zwischensumme = zwischensumme + gesamt;

        html += ""
            + "<tr>"
            + "  <td>" + p.name + "</td>"
            + "  <td>"
            + "    <div class='cart-qty-controls'>"
            + "      <button class='icon-btn' onclick='mengeMinus(" + p.id + ")'><img src='img/minus.svg' alt='-'></button>"
            + "      <span class='cart-qty'>" + e.menge + "</span>"
            + "      <button class='icon-btn' onclick='mengePlus(" + p.id + ")'><img src='img/plus2.svg' alt='+'></button>"
            + "    </div>"
            + "  </td>"
            + "  <td>" + gesamt.toFixed(2).replace('.', ',') + " €</td>"
            + "  <td><button class='icon-btn' onclick='entfernen(" + p.id + ")'><img src='img/trash.svg' alt='X'></button></td>"
            + "</tr>";
    }

    document.getElementById("cart-items").innerHTML = html;

    document.getElementById("cart-subtotal").innerHTML =
        zwischensumme.toFixed(2).replace('.', ',') + " €";

    document.getElementById("cart-delivery").innerHTML =
        lieferkosten.toFixed(2).replace('.', ',') + " €";

    var gesamtPreis = zwischensumme;
    if (warenkorb.length > 0) {
        gesamtPreis = gesamtPreis + lieferkosten;
    }

    document.getElementById("cart-total").innerHTML =
        gesamtPreis.toFixed(2).replace('.', ',') + " €";

    speichereWarenkorbInLocalStorage();
}

// LocalStorage: Warenkorb speichern
function speichereWarenkorbInLocalStorage() {
    var text = JSON.stringify(warenkorb);
    localStorage.setItem("avantiWarenkorb", text);
}

// LocalStorage: Warenkorb laden
function ladeWarenkorbAusLocalStorage() {
    var text = localStorage.getItem("avantiWarenkorb");
    if (text) {
        warenkorb = JSON.parse(text);
    }
}

// Bestellung
function bestellen() {
    if (warenkorb.length === 0) {
        document.getElementById("order-message").style.color = "red";
        document.getElementById("order-message").innerHTML =
            "Bitte zuerst etwas in den Warenkorb legen!";
        return;
    }

    // Anzahl und Gesamtpreis für Popup-Text berechnen
    var anzahl = 0;
    var summe = 0;
    for (var i = 0; i < warenkorb.length; i++) {
        var e = warenkorb[i];
        var p = findeProdukt(e.id);
        anzahl = anzahl + e.menge;
        summe = summe + (p.preis * e.menge);
    }
    var gesamt = summe + lieferkosten;

    var text = "Du hast " + anzahl + " Artikel für insgesamt "
        + gesamt.toFixed(2).replace('.', ',') + " € bestellt.";

    document.getElementById("order-popup-text").innerHTML = text;
    document.getElementById("order-popup").style.display = "flex";

    document.getElementById("order-message").style.color = "green";
    document.getElementById("order-message").innerHTML =
        "Bestellung im Demo-System gespeichert.";

}

function toggleWarenkorbMobile() {
    var box = document.getElementById("cart-box");
    var icon = document.getElementById("cart-toggle-icon");

    var collapsed = box.classList.toggle("cart-collapsed");

    if (collapsed) {
        icon.src = "img/arrow-up.svg";      
    } else {
        icon.src = "img/arrow-down.svg";    
    }
}

// Popup schließen
function popupSchliessen() {
    document.getElementById("order-popup").style.display = "none";
}

