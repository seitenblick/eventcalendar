import $ from './lib/jquery';
import { DateTime } from 'luxon';
import flatpickr from "flatpickr";
import { German } from "flatpickr/dist/l10n/de";
import { RRule, RRuleSet } from 'rrule';
// import Handlebars from 'handlebars';


//Helper-Funktionen

//Datumsformatierung (utc)
function stringToDate(value) {
    // ISO-String in Luxon-Objekt umwandeln
    let dt = DateTime.fromISO(value, { zone: 'utc' });
    return dt.toJSDate(); // Konvertiert DateTime zu einem UTC JavaScript Date
}

//Handlebars
let lang = $('html').attr('lang');
// Handlebars-Helper registrieren
Handlebars.registerHelper('eq', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper('formatDate', function(eventdate, format) {
    return DateTime.fromJSDate(new Date(eventdate)).setZone('utc').setLocale(lang).toFormat(format);
});



class EventCalendar {
    constructor(container) {
        this.container = $(container); // Referenz auf das HTML-Element
        this.data = [];                // Das JSON-Dataset
        this.events = [];              // Array für berechnete Ereignisse
        this.activeCategoryFilters = []; //Array für Button-Filter (categories)
        this.searchTerm = ""; // Variable für den aktuellen Suchbegriff
        this.activeDistrictFilter = ""; // Hinzufügen einer Variable für den Distriktfilter

        // Attribute (data-Attribute) aus dem HTML-Container lesen
        this.sliceStart = this.container.data("slice-start") || null;
        this.sliceEnd = this.container.data("slice-end") || null;
        this.mode = this.container.data("mode") || "list";  // Standard-Modus auf "list" setzen
        this.mandator = this.container.data("mandator") || "";
        this.eventId = String(this.container.data("event-id") || ""); // Konvertierung in String
        this.seriesId = this.container.data("series-id") || "";

        const countValue = this.container.data("count");
        this.totalCount = (countValue === undefined || countValue === "") ? null : parseInt(countValue); // null, um "Alle" anzuzeigen

        this.currentPage = 1;
        this.limitPerPage = 10; // Anzahl der Listenelelemente pro Seite

        this.flatpickrRange = null; // Variable für die Flatpickr-Instanz



        // Initialisierung
        this.loadData();
        this.setupFilterButtons();
        this.setupSearchField();
        this.setupDistrictSelect(); // Aufruf der neuen Methode zur Einrichtung des Distriktfilters
        this.setupDateRangePicker(); // Datumsbereichsfilter einrichten
    }

    // Filter-Setup: Event-Listener für Filter-Buttons einrichten
    setupFilterButtons() {
        $(".event-categories button").on("click", (event) => {
            const filterValue = $(event.currentTarget).data("filter").toString();

            if (filterValue === "") {
                // Reset für alle Kategorien
                this.activeCategoryFilters = [];
                $(".event-categories button").removeClass("active");
                $(event.currentTarget).addClass("active");

                // Zurücksetzen von Suchfeld und Distrikt-Filter
                $("#searchval").val(""); // Suchtextfilter zurücksetzen
                $("#districtval").val(""); // Distriktfilter zurücksetzen
                this.activeDistrictFilter = ""; // Distriktfilter zurücksetzen

                // Flatpickr-Range zurücksetzen
                this.flatpickrRange.clear(); // Das Flatpickr-Range-Feld zurücksetzen

                // Rücksetzen der Datumsfilterwerte
                this.dateRangeStart = null;
                this.dateRangeEnd = null;

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
                    $(event.currentTarget).addClass("active");
                } else {
                    // Filter entfernen
                    this.activeCategoryFilters.splice(index, 1);
                    $(event.currentTarget).removeClass("active");
                }

                // Entfernen der "Alle"-Option
                $(".event-categories button[data-filter='']").removeClass("active");
            }

            // Lade die gefilterten Events neu und zeige sie an
            this.loadEvents();
            this.render();
            this.setupPagination();
        });
    }


    // Methode: Suchfeld-Setup, um bei Eingabe ab 3 Zeichen eine API-Anfrage zu starten
    setupSearchField() {
        $("#searchval").on("input", (event) => {
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

        // Optionale: Button zum Löschen des Suchbegriffs
        $(".clear").on("click", () => {
            $("#searchval").val("");
            this.searchTerm = "";
            this.loadData(); // Lade alle Events ohne Filter
        });
    }

    // Methode zur Einrichtung des Districtfilters
    setupDistrictSelect() {
        $("#districtval").on("change", (event) => {
            this.activeDistrictFilter = $(event.currentTarget).val(); // Wert des ausgewählten Distrikts speichern
            this.loadData(); // Daten neu laden, um Events mit dem neuen Distriktfilter anzuzeigen
        });
    }

    // Methode zur Einrichtung des Datumsbereichs-Filters
    setupDateRangePicker() {
        this.flatpickrRange = $(".flatpickr-range").flatpickr({
            mode: "range",
            locale: "de",
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "d.m.Y",
            onClose: (selectedDates) => {
                console.log("flatpickr onClose()");

                if (selectedDates.length !== 0) {
                    this.dateRangeStart = selectedDates[0];
                    this.dateRangeEnd = selectedDates[1];

                    $('.rruleset').data('slice-start', this.formatDate(selectedDates[0]));
                    $('.rruleset').data('slice-end', this.formatDate(selectedDates[1]));

                    // Ladeanzeige anzeigen
                    this.showLoadingMessage();

                    // Daten mit dem neuen Datumsbereich neu laden
                    this.loadData();
                } else {
                    this.dateRangeStart = null;
                    this.dateRangeEnd = null;

                    $('.rruleset').data('slice-start', '');
                    $('.rruleset').data('slice-end', '');
                    // Daten ohne Filter neu laden
                    this.loadData();
                }
            }
        });

        // Clear-Button für das Datumsbereichsfeld
        $(".flatpickr-range").on('keyup input', function() {
            if ($(this).val()) {
                $(".flatpickr-group .clear").addClass("show");
            } else {
                $(".flatpickr-group .clear").removeClass("show");
            }
        });

        // Clear-Button Click-Handler
        $(".flatpickr-group .clear").on('click', () => {
            flatpickrRange.clear(); // Clear das Flatpickr
            this.dateRangeStart = null;
            this.dateRangeEnd = null;

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
        this.container.html('<div class="loading-message">Daten werden geladen...</div>');
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

            const flatpickrCal = $(".flatpickr");
            if (!flatpickrCal.length) {
                console.error("Flatpickr input element not found.");
                return;
            }

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
                        // console.log("onDayCreate aufgerufen");

                        // Zugriff auf das Datum über dayElem.dateObj
                        const dateObj = dayElem.dateObj;
                        // console.log("dateObj:", dateObj);  // Logge das dateObj

                        // Sicherstellen, dass dateObj ein gültiges Datum ist
                        if (dateObj instanceof Date && !isNaN(dateObj)) {
                            // console.log("Valid dateObj:", dateObj);

                            // Formatieren des Datums für den Vergleich
                            const dateStr = fp.formatDate(dateObj, "Y-m-d");
                            // console.log("Formatiertes Datum für Vergleich:", dateStr);

                            // Überprüfen, ob dieses Datum in den eventDates enthalten ist
                            if (dateArray.some(d => d.toISOString().split('T')[0] === dateStr)) {
                                // console.log("Markiere Tag:", dateStr);
                                dayElem.classList.add("selected");
                            } else {
                                dayElem.classList.remove("flatpickr-disabled");
                                // console.log("Tag nicht markiert:", formattedDate);
                            }
                        }
                    }
                });
            } else {
                this.flatpickrInstance.set("minDate", minDate);
                this.flatpickrInstance.set("maxDate", maxDate);
            }
        } else {
            console.error("eventDates ist kein gültiger Array oder leer:", eventDates);
        }
    }



















    // Daten laden und Events berechnen
    loadData() {
        const baseUrl = "https://www.aalen.de/api/EventApiRulesTest.php";
        const searchParams = new URLSearchParams();

        // Wenn ein Suchbegriff eingegeben wurde und mindestens 3 Zeichen lang ist
        const searchVal = $("#searchval").length ? $("#searchval").val().trim() : "";
        if (searchVal.length >= 3) {
            searchParams.append("search", searchVal);
        }

        // Wenn ein Distrikt ausgewählt wurde
        if (this.activeDistrictFilter) {
            searchParams.append("di", this.activeDistrictFilter);
        }

        // API-URL zusammenstellen
        const apiUrl = `${baseUrl}?${searchParams.toString()}`;

        // Ladeanzeige anzeigen
        this.showLoadingMessage();

        // API-Abruf
        $.getJSON(apiUrl, (data) => {
            this.data = data || []; // Sicherstellen, dass data ein Array ist
            this.loadEvents();
            this.render();
            this.setupPagination();
        }).fail(() => {
            // Bei einem Fehler eine Fehlermeldung anzeigen
            this.container.html('<div class="error-message">Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.</div>');
        });
    }


// Methode - Lädt die Events und berechnet die Wiederholungstermine
    loadEvents() {
        const futureEventDates = []; // Array für zukünftige Event-Daten
        this.events = [];

        // Überprüfen, ob spezifische Filter für Event-ID oder Serien-ID gesetzt sind
        const isSpecificEventId = this.eventId && this.eventId.trim() !== ""; // trim() nur auf String anwenden
        const isSpecificSeriesId = this.seriesId && this.seriesId.trim() !== ""; // trim() nur auf String anwenden

        this.data.forEach(event => {
            // Kategorien und Serien in Arrays umwandeln (falls kommasepariert als String vorliegend)
            const eventCategories = event.categories ? event.categories.split(',') : [];
            const eventSeries = event.series ? event.series.split(',') : [];

            // Prüfen, ob das Event in eine der aktiven Kategorien passt (oder keine Kategorie aktiviert ist)
            const matchesCategory = this.activeCategoryFilters.length === 0 ||
                eventCategories.some(category => this.activeCategoryFilters.includes(category));

            if (matchesCategory) {
                // Prüfen, ob eine Event-ID vorgegeben ist - dann nur diesen Termin berechnen
                if (!isSpecificEventId || event.id === this.eventId) {
                    // Berechne Wiederholungstermine für das Event
                    const occurrences = this.calculateOccurrences(event);

                    occurrences.forEach(occurrence => {
                        const eventDate = new Date(occurrence.eventdate); // Sicherstellen, dass es ein Date-Objekt ist

                        // Füge das Datum für die Flatpickr-Befüllung hinzu
                        futureEventDates.push(eventDate.toISOString().split("T")[0]);

                        // Prüfen, ob das Datum im gewählten Bereich liegt
                        const isInDateRange = (!this.dateRangeStart || eventDate >= new Date(this.dateRangeStart)) &&
                            (!this.dateRangeEnd || eventDate < new Date(this.dateRangeEnd));

                        // Prüfen, ob Event-ID und/oder Serien-ID passen
                        const matchesEventId = !isSpecificEventId || event.id === this.eventId;
                        const matchesSeriesId = !isSpecificSeriesId || eventSeries.includes(this.seriesId);

                        // Wenn alle aktiven Filterbedingungen erfüllt sind, das Event zur Liste hinzufügen
                        if (isInDateRange && matchesEventId && matchesSeriesId) {
                            this.events.push(occurrence);
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
            this.setupFlatpickr(futureEventDates);
        }
    }



    // Methode: Ausgabe der Events mit Handlebars
    render() {
        // Wähle das Template anhand des `data-mode` aus
        const template = Hbs[this.mode]

        // Überprüfen, ob Events vorhanden sind
        if (!this.events.length) {
            this.container.html("<p class='no-events'>Keine passende Veranstaltung gefunden.</p>");
            $(".pagination").hide();  // Paginierung ausblenden
            return;
        }

        // Falls kein Template existiert, Hinweis im Console-Log
        if (!template) {
            console.warn(`Template für Modus ${this.mode} wurde nicht gefunden.`);
            return;
        }

        const paginatedEvents = this.getPaginatedEvents();

        // Rendern des Templates und Einfügen in den Container
        this.container.html(template(paginatedEvents));
        $(".pagination").show();  // Paginierung einblenden
    }

    setupPagination() {
        // Überprüfen, ob mehr Events vorhanden sind als limitPerPage
        if (this.events.length <= this.limitPerPage) {
            // Wenn nicht, Pagination ausblenden
            $(".pagination").hide();
            return;
        } else {
            // Wenn ja, sicherstellen, dass die Pagination sichtbar ist
            $(".pagination").show();
        }

        console.log("Setting up pagination"); // Debug-Ausgabe

        // Sicherstellen, dass das Pagination-Element existiert
        const paginationContainer = $(".pagination");

        if (paginationContainer.length === 0) {
            console.warn("Pagination-Element ist nicht vorhanden.");
            return;
        }

        // Leeren der Pagination
        $(".pagination").empty();

        // Previous-Button hinzufügen
        $(".pagination").append(
            $("<li>").addClass("control-item").attr({ id: "previous-page" }).append(
                $("<a>").addClass("page-link").attr({ href: "javascript:void(0)" }).text("«")
            )
        );

        // Next-Button hinzufügen
        $(".pagination").append(
            $("<li>").addClass("control-item").attr({ id: "next-page" }).append(
                $("<a>").addClass("page-link").attr({ href: "javascript:void(0)" }).text("»")
            )
        );

        // Ermitteln der Gesamtseiten
        const totalPages = Math.ceil(this.events.length / this.limitPerPage);

        // Zeige die erste Seite initial an
        this.showPage(1);

        // Event-Listener für die Seitenwechsel-Buttons
        $(document).off("click", ".pagination li.current-page:not(.active)").on("click", ".pagination li.current-page:not(.active)", (event) => {
            const page = +$(event.target).text();
            this.showPage(page);
        });

        // Event-Listener für `previous` und `next`
        $("#next-page").off("click").on("click", () => this.showPage(this.currentPage + 1));
        $("#previous-page").off("click").on("click", () => this.showPage(this.currentPage - 1));
    }

    createPaginationControls(totalPages, maxLength) {
        // Entferne alte Seitenzahlen und disabled-Elemente
        $(".pagination li.current-page, .pagination li.page-item.disabled").remove();

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
        getPageList(totalPages, this.currentPage, maxLength).forEach(item => {
            const pageItem = $("<li>")
                .addClass("page-item")
                .toggleClass("disabled", item === 0) // "disabled" für Ellipsen
                .toggleClass("current-page", item !== 0) // "current-page" für echte Seitenzahlen
                .toggleClass("active", item === this.currentPage)
                .append(
                    $("<a>").addClass("page-link").attr({ href: "javascript:void(0)" }).text(item || "...")
                );

            pageItem.insertBefore("#next-page"); // Vor dem Next-Button einfügen
        });


        // Hier setzen wir den Status des Previous-Buttons
        $("#previous-page").toggleClass("disabled", this.currentPage === 1);
        $("#next-page").toggleClass("disabled", this.currentPage === totalPages);
    }

    showPage(page) {
        const totalPages = Math.ceil(this.events.length / this.limitPerPage);
        if (page < 1 || page > totalPages) return false;

        this.currentPage = page;
        this.render(); // Funktion zum Rendern der aktuellen Seite
        this.createPaginationControls(totalPages, 7); // Aktualisiere die Seitenzahlen bei jedem Seitenwechsel

        // Deaktivierung von `previous` und `next`, wenn auf erster oder letzter Seite
        $("#previous-page").toggleClass("disabled", this.currentPage === 1);
        $("#next-page").toggleClass("disabled", this.currentPage === totalPages);

        const tablePos = $('#event-table').offset().top - 300;
        $('html, body').animate({ scrollTop: tablePos }, 'slow');

        return true;
    }




    getPaginatedEvents() {
        const start = (this.currentPage - 1) * this.limitPerPage;
        return this.events.slice(start, start + this.limitPerPage);
    }

    // Methode - Berechnet die Wiederholungstermine und berücksichtigt Ausnahmetermine
    calculateOccurrences(event) {
        const occurrences = [];
        const today = new Date(); // Aktuelles Datum und Uhrzeit
        today.setHours(0, 0, 0, 0); // Setzt die Uhrzeit auf 00:00 für Vergleich ab Tagesbeginn

        // Erstelle die Wiederholungsregel aus dem `rule`-Feld
        const rule = RRule.fromString(event.rule);

        // Ausnahme-Termine als UTC-Zeiten in ein Set speichern
        const exdateSet = new Set(event.exdates.map(date => stringToDate(date).getTime()));

        // RRuleSet verwenden, um Wiederholungstermine zu berechnen
        const rruleSet = new RRuleSet();
        rruleSet.rrule(rule);

        // Alle Vorkommen der Regel berechnen
        const eventDates = rruleSet.all();

        // Füge nur die Daten hinzu, die nicht in `exdates` enthalten sind und in der Zukunft liegen
        eventDates.forEach(date => {
            const eventDate = new Date(date);
            const utcDate = stringToDate(date.toISOString()).getTime();  // Sicherstellen, dass auch berechnete Termine in UTC-Zeit vorliegen

            if (!exdateSet.has(utcDate) && eventDate >= today) {
                occurrences.push({
                    id: event.id,
                    title: event.title,
                    eventdate: eventDate,
                    eventdateTimestamp: eventDate.getTime(), // Speichere den Timestamp direkt (wird für die schnellere Sortierung benötigt)
                    location: event.location,
                    url: event.url,
                    image: event.image.thumb_100px,
                    ...event // Optionale zusätzliche Felder hinzufügen
                });
            }
        });

        return occurrences;
    }

}


// Beispiel: EventCalendar-Instanz für die rruleset-Container erstellen
$(document).ready(function() {
    $(".rruleset").each(function() {
        new EventCalendar(this);
    });
});