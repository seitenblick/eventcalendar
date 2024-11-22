// import $ from './lib/jquery';
import { DateTime } from 'luxon';
import flatpickr from "flatpickr";
import { German } from "flatpickr/dist/l10n/de";
import { RRule, RRuleSet } from 'rrule';
import Handlebars from 'handlebars';
window.Handlebars = Handlebars; // Macht Handlebars global verfügbar


//Helper-Funktionen

//Datumsformatierung (utc)
function stringToDate(value) {
    // ISO-String in Luxon-Objekt umwandeln
    let dt = DateTime.fromISO(value, { zone: 'utc' });
    return dt.toJSDate(); // Konvertiert DateTime zu einem UTC JavaScript Date
}

//Handlebars
let lang = document.documentElement.getAttribute("lang");
// Handlebars-Helper registrieren
Handlebars.registerHelper('eq', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper('formatDate', function(eventdate, format) {
    if (!eventdate) return ''; // Falls kein Datum vorhanden ist, gibt es einen leeren String zurück
    return DateTime
        .fromJSDate(new Date(eventdate)) // Konvertiere das Datum in Luxon's DateTime-Objekt
        .setLocale(lang) // Setze die gewünschte Sprache
        .toFormat(format); // Formatiere das Datum
});

Handlebars.registerHelper('isSingleDayEvent', function(startdate, enddate) {
    // Erstelle DateTime-Objekte aus den gegebenen Start- und Enddaten
    const start = DateTime.fromJSDate(new Date(startdate), { zone: 'utc' }).startOf('day'); // Nur Datum, keine Uhrzeit
    const end = DateTime.fromJSDate(new Date(enddate), { zone: 'utc' }).startOf('day'); // Nur Datum, keine Uhrzeit

    // Vergleiche nur das Datum, ohne die Uhrzeit zu berücksichtigen
    return start.equals(end);  // Gibt true zurück, wenn Start- und Enddatum gleich sind
});




class EventCalendar {
    constructor(container) {
        this.container = container instanceof HTMLElement ? container : document.querySelector(container);
        // Wenn `this.container` nicht gefunden wird, eine Fehlermeldung ausgeben
        if (!this.container) {
            console.error("Container element not found:", container);
            return;
        }
        this.data = [];                // Das JSON-Dataset
        this.events = [];              // Array für berechnete Ereignisse
        this.activeCategoryFilters = []; //Array für Button-Filter (categories)
        this.searchTerm = ""; // Variable für den aktuellen Suchbegriff
        this.activeDistrictFilter = ""; // Hinzufügen einer Variable für den Distriktfilter

        // Attribute (data-Attribute) aus dem HTML-Container lesen
        this.sliceStart = this.container.getAttribute("data-slice-start") || null;
        this.sliceEnd = this.container.getAttribute("data-slice-end") || null;
        this.mode = this.container.getAttribute("data-mode") || "list";  // Standard-Modus auf "list" setzen
        this.mandator = this.container.getAttribute("data-mandator") || "";
        this.eventId = String(this.container.getAttribute("data-event-id") || ""); // Konvertierung in String
        // Wenn im Container keine Event-ID vorhanden ist, im <main> Element suchen
        if (!this.eventId) {
            const mainElement = document.querySelector("main[data-event-id]");
            this.eventId = mainElement ? String(mainElement.getAttribute("data-event-id")) : "";
        }
        this.seriesId = this.container.getAttribute("data-series-id") || "";
        this.dataUrl = this.container.getAttribute("data-url") || null; // benutzerdefinierte Daten-URL
        this.jsonDataUrl = container.getAttribute("data-json-url") || null; // Neue URL für das statische JSON, falls angegeben
        this.noduplicates = this.container.getAttribute("data-noduplicates") || 'false';

        const countValue = this.container.getAttribute("data-count");
        this.totalCount = (countValue === undefined || countValue === "") ? null : parseInt(countValue); // null, um "Alle" anzuzeigen

        this.currentPage = 1;
        this.limitPerPage = 10; // Anzahl der Listenelelemente pro Seite

        this.districtSelect = document.querySelector("#districtval");
        this.flatpickrRange = null; // Variable für die Flatpickr-Instanz
        this.allowPastEvents = false; // Standardmäßig keine vergangenen Termine zulassen



        // Initialisierung
        this.loadData();
        this.setupFilterButtons();
        this.setupSearchField();
        this.setupDistrictSelect(); // Aufruf der neuen Methode zur Einrichtung des Distriktfilters
        this.setupDateRangePicker(); // Datumsbereichsfilter einrichten
    }

    // Filter-Setup: Event-Listener für Filter-Buttons einrichten
    setupFilterButtons() {
        // Alle Filter-Buttons auswählen
        const filterButtons = document.querySelectorAll(".event-categories button");
        filterButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                const filterValue = event.currentTarget.dataset.filter.toString();

                if (filterValue === "") {
                    // Reset für alle Kategorien
                    this.activeCategoryFilters = [];
                    filterButtons.forEach(btn => btn.classList.remove("active"));
                    event.currentTarget.classList.add("active");

                    // Zurücksetzen von Suchfeld und Clear-Button ausblenden
                    document.getElementById("searchval").value = ""; // Suchtextfilter zurücksetzen
                    document.querySelector(".clearspace .clear").classList.remove("show");  // Clear-Button ausblenden

                    // document.getElementById("districtval").value = ""; // Distriktfilter zurücksetzen
                    if (this.districtSelect) {
                        this.districtSelect.value = ""; // Distriktfilter zurücksetzen
                    }
                    this.activeDistrictFilter = ""; // Distriktfilter zurücksetzen

                    // Flatpickr-Range zurücksetzen
                    this.flatpickrRange.clear(); // Das Flatpickr-Range-Feld zurücksetzen

                    // Rücksetzen der Datumsfilterwerte
                    this.dateRangeStart = null;
                    this.dateRangeEnd = null;
                    this.allowPastEvents = false;

                    // Ladeanzeige anzeigen
                    this.showLoadingMessage();

                    // Daten neu laden ohne Filter
                    // Verzögerung hinzufügen, bevor loadData aufgerufen wird, damit loading-message angezeigt wird
                    setTimeout(() => {
                        this.loadData();
                    }, 10);

                } else {
                    // Hinzufügen oder Entfernen des Filters
                    const index = this.activeCategoryFilters.indexOf(filterValue);
                    if (index === -1) {
                        // Filter hinzufügen
                        this.activeCategoryFilters.push(filterValue);
                        event.currentTarget.classList.add("active");
                    } else {
                        // Filter entfernen
                        this.activeCategoryFilters.splice(index, 1);
                        event.currentTarget.classList.remove("active");
                    }

                    // Entfernen der "Alle"-Option
                    document.querySelector(".event-categories button[data-filter='']").classList.remove("active");
                }

                // Lade die gefilterten Events neu und zeige sie an
                this.loadEvents();
                this.render();
                this.setupPagination();
            });
        });

        // Click-Handler für den "Mehr anzeigen"-Button
        let showAllCategories = false;
        const moreFiltersButton = document.querySelector(".more-filters");
        const eventCategoriesContainer = document.querySelector(".event-categories");

        if (moreFiltersButton) {
            moreFiltersButton.addEventListener("click", () => {
                showAllCategories = true;
                moreFiltersButton.style.display = "none"; // Versteckt den "Mehr anzeigen"-Button
                eventCategoriesContainer.style.height = "auto"; // Setzt die Höhe auf "auto"
                filterButtons.forEach(btn => btn.classList.remove("hide")); // Entfernt die "hide"-Klasse von den Buttons
            });
        }
    }



    // Methode: Suchfeld-Setup, um bei Eingabe ab 3 Zeichen eine API-Anfrage zu starten
    setupSearchField() {
        // Event-Listener für die Eingabe im Suchfeld hinzufügen
        const searchInput = document.querySelector("#searchval");
        if (!searchInput) {
            console.warn("Suchfeld #searchval nicht gefunden. setupSearchField wird übersprungen.");
            return;
        }
        searchInput.addEventListener("input", (event) => {
            const newSearchTerm = event.target.value.trim();

            // Falls Suchterm >= 3 Zeichen und nicht gleich dem aktuellen
            if (newSearchTerm.length >= 3 && newSearchTerm !== this.searchTerm) {
                this.searchTerm = newSearchTerm;
                this.loadData();
            } else if (newSearchTerm.length < 3 && this.searchTerm) {
                // Falls Suchterm < 3 Zeichen, leere die Suche und lade alle Events
                this.searchTerm = "";
                this.loadData();
            }
        });

        // Optional: Button zum Löschen des Suchbegriffs hinzufügen
        const clearButtonContainer = document.createElement("span");
        clearButtonContainer.className = "clearspace";

        const clearButton = document.createElement("img");
        clearButton.src = "/assets/global/img/icon_event_close.svg";
        clearButton.className = "clear";
        clearButton.title = "clear";

        clearButtonContainer.appendChild(clearButton);
        searchInput.parentNode.insertBefore(clearButtonContainer, searchInput.nextSibling);

        // Click-Event für den Clear-Button hinzufügen
        clearButton.addEventListener("click", () => {
            searchInput.value = "";
            this.searchTerm = "";
            this.loadData(); // Lade alle Events ohne Filter
            clearButton.classList.remove("show"); // Clear-Button ausblenden
        });

        // Überwacht die Eingabe im Suchfeld und zeigt den Clear-Button an, wenn das Feld nicht leer ist
        searchInput.addEventListener("input", () => {
            if (searchInput.value) {
                clearButton.classList.add("show"); // Clear-Button anzeigen
            } else {
                clearButton.classList.remove("show"); // Clear-Button ausblenden
            }
        });
    }


    // Methode zur Einrichtung des Districtfilters
    setupDistrictSelect() {
        // Überprüfen, ob das Element mit der ID "districtval" existiert
        this.districtSelect = document.querySelector("#districtval");

        if (this.districtSelect) {
            // Event-Listener für Änderungen im District-Select-Feld
            this.districtSelect.addEventListener("change", (event) => {
                this.activeDistrictFilter = event.currentTarget.value; // Wert des ausgewählten Distrikts speichern
                this.loadData(); // Daten neu laden, um Events mit dem neuen Distriktfilter anzuzeigen
            });
        }
    }


    setupDateRangePicker() {
        // Überprüfen, ob ein Element mit der Klasse .flatpickr-range existiert
        const flatpickrRangeElement = document.querySelector(".flatpickr-range");
        if (!flatpickrRangeElement) {
            console.warn("Kein .flatpickr-range-Element gefunden. setupDateRangePicker wird übersprungen.");
            return; // Beende die Funktion, falls das Element nicht existiert
        }

        // Initiiere den DateRange Picker mit flatpickr
        this.flatpickrRange = flatpickr(".flatpickr-range", {
            mode: "range",
            locale: "de",
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "d.m.Y",
            onClose: (selectedDates) => {
                console.log("flatpickr onClose()");

                if (selectedDates.length > 0) {
                    // Wenn nur ein Datum ausgewählt wurde, setze Start- und Enddatum gleich
                    if (selectedDates.length === 1) {
                        selectedDates[1] = selectedDates[0]; // Das gleiche Datum als Enddatum setzen
                    }

                    // Manuelle Anpassung an UTC-Zeit
                    this.dateRangeStart = new Date(Date.UTC(selectedDates[0].getFullYear(), selectedDates[0].getMonth(), selectedDates[0].getDate()));
                    this.dateRangeEnd = new Date(Date.UTC(selectedDates[1].getFullYear(), selectedDates[1].getMonth(), selectedDates[1].getDate(), 23, 59, 59, 999));

                    // Konsolenausgabe zur Überprüfung des Datums in UTC-Format
                    console.log("Startdatum in UTC (ISO):", this.dateRangeStart.toISOString());
                    console.log("Enddatum in UTC (ISO):", this.dateRangeEnd.toISOString());

                    // Überprüfen, ob der Benutzer einen Bereich in der Vergangenheit ausgewählt hat
                    const now = new Date();
                    this.allowPastEvents = this.dateRangeStart < now; // Setze das Flag, wenn das Startdatum in der Vergangenheit liegt
                    console.log("Vergangene Termine zulassen:", this.allowPastEvents);

                    // Setze die Daten im .rruleset-Element für den Datumsbereich
                    const rruleset = document.querySelectorAll('.rruleset');
                    rruleset.forEach((element) => {
                        element.dataset.sliceStart = this.formatDate(this.dateRangeStart);
                        element.dataset.sliceEnd = this.formatDate(this.dateRangeEnd);
                    });

                    // Ladeanzeige anzeigen
                    this.showLoadingMessage();

                    // Daten mit dem neuen Datumsbereich neu laden
                    this.loadData();
                } else {
                    this.dateRangeStart = null;
                    this.dateRangeEnd = null;
                    this.allowPastEvents = false; // Standardmäßig keine vergangenen Termine zulassen

                    const rruleset = document.querySelectorAll('.rruleset');
                    rruleset.forEach((element) => {
                        element.dataset.sliceStart = '';
                        element.dataset.sliceEnd = '';
                    });

                    // Daten ohne Filter neu laden
                    this.loadData();
                }
            }
        });

        // Clear-Button für das Datumsbereichsfeld hinzufügen
        const flatpickrRange = document.querySelector(".flatpickr-range");
        const clearButtonWrapper = document.createElement("span");
        clearButtonWrapper.className = "clearspace";

        const clearButton = document.createElement("img");
        clearButton.src = "/assets/global/img/icon_event_close.svg";
        clearButton.className = "clear";
        clearButton.title = "clear";

        clearButtonWrapper.appendChild(clearButton);
        flatpickrRange.parentNode.insertBefore(clearButtonWrapper, flatpickrRange.nextSibling);

        // Event-Listener für Eingabe im Datumsfeld hinzufügen
        flatpickrRange.addEventListener('keyup', handleInput);
        flatpickrRange.addEventListener('input', handleInput);

        function handleInput() {
            const flatpickrGroupClear = document.querySelector(".flatpickr-group .clear");
            if (flatpickrRange.value) {
                flatpickrGroupClear.classList.add("show");
            } else {
                flatpickrGroupClear.classList.remove("show");
            }
        }

        // Clear-Button Click-Handler
        clearButton.addEventListener("click", () => {
            this.flatpickrRange.clear(); // Clear das Flatpickr
            this.dateRangeStart = null;
            this.dateRangeEnd = null;
            this.allowPastEvents = false;

            // Ladeanzeige anzeigen
            this.showLoadingMessage();

            // Lade alle Events ohne Filter
            this.loadData();
        });
    }


    // Ladeanzeige anzeigen
    showLoadingMessage() {
        console.log("loading message...")
        // Blende die Liste aus und zeige die Ladeanzeige an
        this.container.innerHTML = '<div class="loading-message">Daten werden geladen...</div>';
    }

    // Formatierungsfunktion für das Datum
    formatDate(date) {
        return DateTime.fromJSDate(date).toFormat('yyyy-MM-dd'); // Das Format anpassen, falls notwendig
    }

    // Funktion zur Sortierung nach Datum aufsteigend
    sortEventsByDate(events) {
        return events.sort((a, b) => new Date(a.eventdateTimestamp) - new Date(b.eventdateTimestamp));
    }

    setupFlatpickr(eventDates) {
        console.log("Gefilterte Events:", eventDates);

        if (Array.isArray(eventDates) && eventDates.length > 0) {
            const dateArray = eventDates.map(date => new Date(date));
            console.log("Converted dateArray:", dateArray);

            const minDate = new Date(Math.min(...dateArray));
            const maxDate = new Date(Math.max(...dateArray));

            // Das Element für den Flatpickr (ohne jQuery)
            const flatpickrCal = document.querySelectorAll(".flatpickr");

            if (flatpickrCal.length === 0) {
                console.error("Flatpickr input element not found.");
                return;
            }

            // Falls keine Instanz vorhanden ist, erstellen wir sie
            if (!this.flatpickrInstance) {
                this.flatpickrInstance = flatpickr(flatpickrCal[0], {
                    dateFormat: "Y-m-d",
                    locale: "de",
                    inline: true,
                    minDate: minDate,
                    maxDate: maxDate,
                    onChange: (selectedDates, dateStr) => {
                        this.applyDateFilter(selectedDates);
                    },
                    onDayCreate: (dObj, dStr, fp, dayElem) => {
                        // Zugriff auf das Datum über dayElem.dateObj
                        const dateObj = dayElem.dateObj;

                        // Sicherstellen, dass dateObj ein gültiges Datum ist
                        if (dateObj instanceof Date && !isNaN(dateObj)) {
                            const formattedDate = fp.formatDate(dateObj, "Y-m-d");

                            // Überprüfen, ob dieses Datum in den eventDates enthalten ist
                            if (dateArray.some(d => d.toISOString().split('T')[0] === formattedDate)) {
                                // Markiere den Tag
                                dayElem.classList.add("selected");
                            } else {
                                dayElem.classList.remove("flatpickr-disabled");
                            }
                        }
                    }
                });
            } else {
                // Wenn die Instanz schon existiert, aktualisieren wir minDate und maxDate
                this.flatpickrInstance.set("minDate", minDate);
                this.flatpickrInstance.set("maxDate", maxDate);
            }
        } else {
            console.error("eventDates ist kein gültiger Array oder leer:", eventDates);
        }
    }




    // Daten laden und Events berechnen
    async loadData() {
        // Hole die baseUrl aus dem data-url Attribut des Containers (wenn vorhanden), sonst verwende die Default-URL
        const baseUrl = this.container.getAttribute("data-url") || "https://www.aalen.de/api/EventApiRules.php";
        // Hole die staticDataUrl aus dem json-data-url Attribut des Containers (wenn vorhanden), ansonsten auf NULL setzen
        const staticDataUrl = this.jsonDataUrl || null;
        console.log("Statische URL:", staticDataUrl);

        const searchParams = new URLSearchParams();

        // Wenn ein Suchbegriff eingegeben wurde und mindestens 3 Zeichen lang ist
        const searchVal = document.querySelector("#searchval") ? document.querySelector("#searchval").value.trim() : "";
        if (searchVal.length >= 3) {
            searchParams.append("search", searchVal);
        }

        // Wenn ein Mandant vorgegeben ist über das rruleset
        if (this.mandator) {
            searchParams.append("md", this.mandator);
        }

        // Filterkriterien prüfen, die eine dynamische Abfrage erfordern (nur bei Suchbegriff)
        const requiresApiRequest = searchParams.has("search") || !staticDataUrl;

        // API-URL zusammenstellen
        const apiUrl = `${baseUrl}?${searchParams.toString()}`;

        // Bestimme die Datenquelle:
        // - Wenn ein Suchparameter gesetzt ist oder keine statische URL existiert, wird die API (baseUrl) verwendet.
        // - Ansonsten, falls staticDataUrl vorhanden ist, wird diese verwendet.
        const dataSourceUrl = requiresApiRequest ? apiUrl : staticDataUrl || baseUrl;
        console.log("Verwendete URL:", dataSourceUrl);

        // Ladeanzeige anzeigen
        this.showLoadingMessage();

        try {
            // API-Abruf mit fetch
            const response = await fetch(dataSourceUrl);
            console.log("Response:", response); // Debugging

            if (!response.ok) {
                console.error("Fehler beim Abrufen der Daten:", response.status, response.statusText);
                throw new Error('Fehler beim Laden der Daten');
            }

            const data = await response.json();
            console.log("Geladene Daten:", data); // Debugging

            // Stellen Sie sicher, dass die Daten die erwartete Struktur haben
            if (!Array.isArray(data)) {
                throw new Error("Unerwartete Datenstruktur");
            }

            this.data = data || []; // Sicherstellen, dass data ein Array ist
            this.loadEvents();
            this.render();
            this.setupPagination();
        } catch (error) {
            // Bei einem Fehler eine Fehlermeldung anzeigen
            console.error("Fehler:", error); // Zusätzliche Fehlerdetails in der Konsole
            this.container.innerHTML = '<div class="error-message">Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.</div>';
        }
    }



    // Methode - Lädt die Events und berechnet die Wiederholungstermine
    loadEvents() {
        const now = new Date();
        const allEventDates = []; // Array für alle Event-Daten (Vergangenheit und Zukunft)
        this.events = [];
        const seenEventIds = new Set();  // Set zum Speichern bereits hinzugefügter Event-IDs

        // Überprüfen, ob spezifische Filter für Event-ID oder Serien-ID gesetzt sind
        const isSpecificEventId = this.eventId && this.eventId.trim() !== ""; // trim() nur auf String anwenden
        const isSpecificSeriesId = this.seriesId && this.seriesId.trim() !== ""; // trim() nur auf String anwenden
        const isHighlightMode = this.mode === 'highlights';
        const isTopeventMode = this.mode === 'topevent';
        const isNoDuplicates = this.noduplicates === "true";

        this.data.forEach(event => {
            // Kategorien und Serien in Arrays umwandeln (falls kommasepariert als String vorliegend)
            const eventCategories = event.categories ? event.categories.split(',') : [];
            const eventSeries = event.series ? event.series.split(',') : [];

            // Prüfen, ob der Distrikt-Filter gesetzt ist und ob das Event in diesen Distrikt fällt
            const matchesDistrict = !this.activeDistrictFilter ||
                (event.dictrict && event.dictrict.split(',').includes(this.activeDistrictFilter));


            // Prüfen, ob das Event in eine der aktiven Kategorien passt (oder keine Kategorie aktiviert ist)
            const matchesCategory = this.activeCategoryFilters.length === 0 ||
                eventCategories.some(category => this.activeCategoryFilters.includes(category));

            // Prüfen, ob das Event den Modus erfüllt
            const matchesMode = (!isHighlightMode || event.highlight) && (!isTopeventMode || event.topevent);

            if (matchesCategory && matchesDistrict  && matchesMode) {
                // Prüfen, ob eine Event-ID vorgegeben ist - dann nur diesen Termin berechnen
                if (!isSpecificEventId || event.id === this.eventId) {
                    // Berechne Wiederholungstermine für das Event
                    const occurrences = this.calculateOccurrences(event);

                    occurrences.forEach(occurrence => {
                        const eventDate = new Date(occurrence.eventdate); // Sicherstellen, dass es ein Date-Objekt ist

                        // Prüfen, ob vergangene Termine zugelassen sind
                        if (this.allowPastEvents || eventDate >= now) {
                            // Füge das Datum für die Flatpickr-Befüllung hinzu
                            allEventDates.push(eventDate.toISOString().split("T")[0]);

                            // Prüfen, ob das Datum im gewählten Bereich liegt
                            const isInDateRange = (!this.dateRangeStart || eventDate >= new Date(this.dateRangeStart)) &&
                                (!this.dateRangeEnd || eventDate < new Date(this.dateRangeEnd));

                            // Prüfen, ob Event-ID und/oder Serien-ID passen
                            const matchesEventId = !isSpecificEventId || event.id === this.eventId;
                            const matchesSeriesId = !isSpecificSeriesId || eventSeries.includes(this.seriesId);

                            // Wenn alle aktiven Filterbedingungen erfüllt sind, das Event zur Liste hinzufügen
                            if (isInDateRange && matchesEventId && matchesSeriesId) {
                                if (isNoDuplicates) {
                                    // Überprüfen, ob das Event bereits anhand der `eventId` in der Liste vorhanden ist
                                    if (!seenEventIds.has(event.id)) {
                                        seenEventIds.add(event.id); // Event-ID zum Set hinzufügen
                                        this.events.push(occurrence); // Ereignis zur Liste hinzufügen
                                    }
                                } else {
                                    // Wenn keine Duplikate gewünscht sind, füge das Event ohne Prüfung hinzu
                                    this.events.push(occurrence);
                                }
                            }
                        }
                    });
                }
            }
        });

        // Die Events nach Datum aufsteigend sortieren
        this.sortEventsByDate(this.events);

        // Anzahl der Events basierend auf totalCount begrenzen
        if (this.totalCount !== null) {
            this.events = this.events.slice(0, this.totalCount);
        }

        console.log("Gefilterte Events:", this.events);  // Ausgabe der gefilterten Events

        // Pagination ein- oder ausblenden je nach Anzahl der Events
        const paginationElement = document.getElementById('pagination');
        if (paginationElement) {
            if (this.events.length > this.limitPerPage) {
                paginationElement.style.display = 'flex';
            } else {
                paginationElement.style.display = 'none';
            }
        }

        // Pagination auf Basis der events und limitPerPage einrichten
        this.setupPagination();

        // Befülle Flatpickr mit zukünftigen Event-Terminen
        if (isSpecificEventId) {
            this.setupFlatpickr(allEventDates);
        }
    }



    // Methode: Ausgabe der Events mit Handlebars
    render() {
        console.log("Render-Methode wird ausgeführt ...");
        // Wähle das Template anhand des `data-mode` aus
        const template = Hbs[this.mode];

        if (!template) {
            console.warn(`Kein Template für Modus ${this.mode} gefunden.`);
            return;
        }
        console.log("Modus:", this.mode);
        console.log('Verwendetes Template:', template);
        console.log('Daten für Template:', this.events);


        // Überprüfen, ob Events vorhanden sind
        if (!this.events || !this.events.length) {
            this.container.innerHTML = "<p class='no-events'>Keine passende Veranstaltung gefunden.</p>";

            // Paginierung ausblenden (Kein jQuery, nur DOM)
            const pagination = document.querySelector(".pagination");
            if (pagination) {
                pagination.style.display = "none";
            }
            return;
        }

        // Falls kein Template existiert, Hinweis im Console-Log
        if (!template) {
            console.warn(`Template für Modus ${this.mode} wurde nicht gefunden.`);
            return;
        }

        const paginatedEvents = this.getPaginatedEvents();
        console.log('Paginated Events:', paginatedEvents); // Überprüfe, was hier ausgegeben wird
        console.log('Paginated Events:', JSON.stringify(paginatedEvents, null, 2));



        // Generiere das HTML mit dem Template und den Events
        const htmlOutput = template(paginatedEvents);

        // Debugging: Überprüfe das generierte HTML
        console.log('Generiertes HTML:', htmlOutput);


        // Rendern des Templates und Einfügen in den Container
        this.container.innerHTML = template(paginatedEvents);


        // Paginierung einblenden (Kein jQuery, nur DOM)
        const paginationElement = document.querySelector(".pagination");
        if (paginationElement) {
            paginationElement.style.display = "flex";
        }

        // FocusPoint-Initialisierung
        this.container.querySelectorAll('.focuspoint').forEach(element => {
            // console.log("Gefundenes Element mit .focuspoint:", element);

            // Umwandeln des Elements in ein jQuery-Objekt und Aufruf der Funktion
            if (window.jQuery && typeof jQuery(element).focusPoint === 'function') {
                jQuery(element).focusPoint();
                // console.log("focusPoint wurde für das Element aufgerufen.");
            } else {
                console.warn("focusPoint ist nicht als Funktion verfügbar für dieses Element:", element);
            }
        });
    }


    setupPagination() {
        console.log("setupPagination Methode wird ausgeführt ...");

        // Pagination-Container holen oder überprüfen
        const paginationContainer = document.querySelector(".pagination");
        if (!paginationContainer) {
            console.warn("Pagination-Element ist nicht vorhanden.");
            return;
        }

        // Überprüfen, ob Pagination nötig ist
        if (this.events.length <= this.limitPerPage) {
            paginationContainer.style.display = "none";
            return;
        } else {
            paginationContainer.style.display = "flex";
        }

        // Entferne alte Pagination-Inhalte
        paginationContainer.innerHTML = "";

        // Previous-Button hinzufügen
        const previousPageItem = document.createElement("li");
        previousPageItem.classList.add("control-item");
        previousPageItem.id = "previous-page";
        const previousPageLink = document.createElement("a");
        previousPageLink.classList.add("page-link");
        previousPageLink.href = "javascript:void(0)";
        previousPageLink.textContent = "«";
        previousPageItem.appendChild(previousPageLink);
        paginationContainer.appendChild(previousPageItem);

        // Event-Listener für `previous`
        previousPageLink.addEventListener("click", () => {
            if (this.currentPage > 1) {
                this.showPage(this.currentPage - 1);
            }
        });

        // Next-Button hinzufügen
        const nextPageItem = document.createElement("li");
        nextPageItem.classList.add("control-item");
        nextPageItem.id = "next-page";
        const nextPageLink = document.createElement("a");
        nextPageLink.classList.add("page-link");
        nextPageLink.href = "javascript:void(0)";
        nextPageLink.textContent = "»";
        nextPageItem.appendChild(nextPageLink);
        paginationContainer.appendChild(nextPageItem);

        // Event-Listener für `next`
        nextPageLink.addEventListener("click", () => {
            const totalPages = Math.ceil(this.events.length / this.limitPerPage);
            if (this.currentPage < totalPages) {
                this.showPage(this.currentPage + 1);
            }
        });

        // Gesamtseiten ermitteln und Seitenzahlen erstellen
        const totalPages = Math.ceil(this.events.length / this.limitPerPage);
        this.createPaginationControls(totalPages, 7); // Beispiel: maxLength = 7
    }




    createPaginationControls(totalPages, maxLength) {
        // Entferne alte Seitenzahlen und disabled-Elemente
        const paginationContainer = document.querySelector(".pagination");
        if (paginationContainer) {
            const currentPageItems = paginationContainer.querySelectorAll("li.current-page, li.page-item.disabled");
            currentPageItems.forEach(item => item.remove());
        }

        const getPageList = (totalPages, page, maxLength) => {
            if (maxLength < 5) throw "maxLength must be at least 5";
            const range = (start, end) => Array.from(Array(end - start + 1), (_, i) => i + start);
            const sideWidth = maxLength < 9 ? 1 : 2;
            const leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
            const rightWidth = (maxLength - sideWidth * 2 - 2) >> 1;

            if (totalPages <= maxLength) return range(1, totalPages);
            if (page <= maxLength - sideWidth - 1 - rightWidth)
                return range(1, maxLength - sideWidth - 1).concat(0, range(totalPages - sideWidth + 1, totalPages));
            if (page >= totalPages - sideWidth - 1 - rightWidth)
                return range(1, sideWidth).concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));

            return range(1, sideWidth)
                .concat(0, range(page - leftWidth, page + rightWidth), 0, range(totalPages - sideWidth + 1, totalPages));
        };

        // Generiere die Seitenzahlen für die aktuelle Seite
        const pageList = getPageList(totalPages, this.currentPage, maxLength);
        const nextPageButton = document.querySelector("#next-page");
        pageList.forEach(item => {
            const pageItem = document.createElement("li");
            pageItem.classList.add("page-item");
            if (item === 0) {
                pageItem.classList.add("disabled"); // "disabled" für Ellipsen
            } else {
                pageItem.classList.add("current-page"); // "current-page" für echte Seitenzahlen
                if (item === this.currentPage) {
                    pageItem.classList.add("active");
                }
            }

            const pageLink = document.createElement("a");
            pageLink.classList.add("page-link");
            pageLink.href = "javascript:void(0)";
            pageLink.textContent = item || "...";

            pageItem.appendChild(pageLink);

            if (nextPageButton) {
                paginationContainer.insertBefore(pageItem, nextPageButton); // Vor dem Next-Button einfügen
            }

            // Event-Listener für Seitenzahlen
            if (item !== 0) { // Ellipsen ("...") haben keinen Event-Listener
                pageLink.addEventListener("click", () => this.showPage(item));
            }
        });

        // Hier setzen wir den Status des Previous-Buttons
        const previousPageButton = document.querySelector("#previous-page");
        if (previousPageButton) {
            previousPageButton.classList.toggle("disabled", this.currentPage === 1);
        }

        // Hier setzen wir den Status des Next-Buttons
        if (nextPageButton) {
            nextPageButton.classList.toggle("disabled", this.currentPage === totalPages);
        }
    }



    showPage(page) {
        const totalPages = Math.ceil(this.events.length / this.limitPerPage);
        if (page < 1 || page > totalPages) return false;

        this.currentPage = page;
        this.render(); // Funktion zum Rendern der aktuellen Seite
        this.createPaginationControls(totalPages, 7); // Aktualisiere die Seitenzahlen bei jedem Seitenwechsel

        // Deaktivierung von `previous` und `next`, wenn auf erster oder letzter Seite
        const previousPageButton = document.querySelector("#previous-page");
        const nextPageButton = document.querySelector("#next-page");

        if (previousPageButton) {
            previousPageButton.classList.toggle("disabled", this.currentPage === 1);
        }

        if (nextPageButton) {
            nextPageButton.classList.toggle("disabled", this.currentPage === totalPages);
        }

        // Scrollen zum Event-Table (ohne jQuery)
        const table = document.querySelector('#event-table');
        if (table) {
            const tablePos = table.offsetTop - 300;
            window.scrollTo({
                top: tablePos,
                behavior: 'smooth' // Diese Methode sorgt für ein sanftes Scrollen
            });
        }

        return true;
    }

    getPaginatedEvents() {
        const start = (this.currentPage - 1) * this.limitPerPage;
        return this.events.slice(start, start + this.limitPerPage);
    }

    // Methode - Berechnet die Wiederholungstermine und berücksichtigt Ausnahmetermine
    calculateOccurrences(event) {
        const occurrences = [];
        const now = new Date();
        // const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())); // 00:00 in UTC
        // Heute in UTC mit der exakten Zeit (keine Mitternacht)
        const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()); // genaue UTC-Zeit


        // Erstelle die Wiederholungsregel aus dem `rule`-Feld
        const rule = RRule.fromString(event.rule);

        // Ausnahme-Termine als UTC-Zeiten in ein Set speichern
        const exdateSet = new Set(event.exdates.map(date => stringToDate(date).getTime()));

        // Start- und Enddatum aus der RRule ableiten
        const startDate = rule.options.dtstart ? new Date(rule.options.dtstart) : null; // Startdatum der RRule
        const endDate = rule.options.until ? new Date(rule.options.until) : startDate; // Enddatum au

        // RRuleSet verwenden, um Wiederholungstermine zu berechnen
        const rruleSet = new RRuleSet();
        rruleSet.rrule(rule);

        // Alle Vorkommen der Regel berechnen
        const eventDates = rruleSet.all();

        // Füge nur die Daten hinzu, die nicht in `exdates` enthalten sind und in der Zukunft liegen
        eventDates.forEach(date => {
            const eventDate = new Date(date);
            if (event.timeStart) {
                const [hours, minutes] = event.timeStart.split(":").map(Number);
                eventDate.setUTCHours(hours, minutes);
            }

            // UTC-Timestamp für Vergleich
            const eventTimestampUTC = eventDate.getTime();

            // if (!exdateSet.has(utcDate) && eventDate >= today) {
            if (
                !exdateSet.has(eventTimestampUTC) &&
                (this.allowPastEvents || eventDate >= now) // Vergangene Termine nur, wenn erlaubt
            ) {
                occurrences.push({
                    id: event.id,
                    title: event.title,
                    startdate: startDate, // Startdatum aus der RRule
                    enddate: endDate, // Enddatum aud UNTIL der RRule
                    eventdate: eventDate, // der berechnete Termin
                    eventdateTimestamp: eventTimestampUTC, // Speichere den Timestamp direkt (wird für die schnellere Sortierung benötigt)
                    location: event.location,
                    url: event.url,
                    image: event.image.thumb_100px,
                    timeStart: event.timeStart,     // Startzeit aus JSON
                    timeEnd: event.timeEnd,         // Endzeit aus JSON
                    timeValid: event.timeValid,     // Gültigkeit der Zeitangabe
                    ticketUrl: event.ticketUrl,
                    ...event // Optionale zusätzliche Felder hinzufügen
                });
            }
        });

        return occurrences;
    }

}


// Beispiel: EventCalendar-Instanz für die rruleset-Container erstellen
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".rruleset").forEach(function(container) {
        new EventCalendar(container); // 'container' ist hier das native DOM-Element
    });
});