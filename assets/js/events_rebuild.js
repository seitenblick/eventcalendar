/* Imports */
// jquery, lazysizes, focuspoint - only in case it's not already included to the project
import $ from './lib/jquery';
import 'lazySizes';
import 'jquery-focuspoint/js/jquery.focuspoint';

import {DateTime} from 'luxon';
import {RRule, RRuleSet} from 'rrule';
import flatpickr from "flatpickr";
import { German } from "flatpickr/dist/l10n/de";
import {ge} from "nunjucks/src/tests";
// import handlebars from 'handlebars';
// require ("./public/assets/js/handlebarsTemplates");
// import "../../public/assets/js/handlebarsTemplates/hbstemplates";

//Variablen
let apiurl   = 'https://www.aalen.de/api/EventApiRulesTest.php'; //can be overwritten by data-url of .rruleset
let origin   = window.location.origin;
if (origin.indexOf("eventcalendar") > -1){
    var iconpath        = '/assets/img/';
}
else if (origin.indexOf("seitenblick") > -1){
    var iconpath        = '/public/assets/img/';
}
else {
    var iconpath        = '/assets/global/img/';
}
let count               = ''; //data-count aus ruleelement
let mode                = ''; /*Layout-Mode: list, grid, ...*/
let allEvents           = []; //Array with all rendered events
let allEventsResult     = []; //Array with calculated events
let allEventsResultInit = []; //Array with calculated events (inital)
let initalEventsResult  = [];
let eventsResultRangeFiltered = [];
let restoreArray        = [];

let lang                = $('html').attr('lang'); //Language for localization
let defaultDates        = []; //Alle Events für flatpickr z.B. ["2021-08-04", "2021-08-06", "2021-08-07"]
let events              = []; //Events with rules (AJAX-JSON)
let sliceStart          = ''; //Kalenderstart für Darstellung
let sliceEnd            = ''; //Kalenderende für Darstellung
let ruleelement;
// let districtSelect      = $('.event-filters .district-group select');

let data; //Data-Attribute des Ruleelements
let url; //final-url with get-parameters
let eventId;
let seriesId;
let pagecount;
let noduplicates;
let mandatorId;
let eventobj;
let rruleEvents; //erzeugte Termine nach Terminregeln


//Helper-Funktionen
function stringToDate(value) {
    // Convert string '2014-02-11T11:30:30' to date:
    let dt = DateTime.fromISO(value); //=> Tue Feb 11 2014 11:30:30
    return new Date(Date.UTC(dt.year, dt.month - 1, dt.day, dt.hour, dt.minute, dt.second));
}
function truncate(input, count) {
    if (input.length > count) {
        return input.substring(0, count) + '...';
    }
    return input;
}

/* Get JSON*/
function loadJSON(url) {
    return $.ajax({
        dataType: 'text',
        url: url
    });
}

// Check for execution only once
var executedOnce;
var onlyonce = (function() {
    executedOnce = false;
    return function() {
        if (!executedOnce) {
            executedOnce = true;
        }
    };
})();
// Check for execution only once
var initialexecutedOnce;
var initalonlyonce = (function() {
    initialexecutedOnce = false;
    return function() {
        if (!initialexecutedOnce) {
            initialexecutedOnce = true;
        }
    };
})();

// Format Date
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}



/* FUNKTIONEN */

/**
 * buildrruleset(thisobj)
 *
 * RRuleSet-Instanz unter Berücksichtiung eines Start-/Endzeitraums und ggf
 * die gewünschte Anzahl an Terminen erzeugen
 */
function buildrruleset(thisobj) {
    //clear vars
    allEvents = [];
    allEventsResult = [];

    console.log("1. buildrruleset()");
    thisobj.find('#event-table').remove();
    //Get data-attributes
    ruleelement = thisobj;
    // alert("RuleElement" + ruleelement);
    // alert("SliceStart:" + ruleelement.data("slice-start"));
    if (ruleelement.data('slice-start')) {
        sliceStart = stringToDate(ruleelement.data("slice-start"));
        // alert("SliceStart" + sliceStart);
        console.log("SliceStart: " + sliceStart);
    }
    if (ruleelement.data('slice-end')) {
        sliceEnd = stringToDate(ruleelement.data("slice-end"));
        // alert("SliceEnd" + sliceEnd);
        console.log("SliceEnd: " + sliceEnd);
    }
    if (ruleelement.data('count')) {
        count = parseInt(ruleelement.data("count"));
        console.log("count: " + count);
    }
    if (ruleelement.data('pagecount')) {
        pagecount = parseInt(ruleelement.data("pagecount"));
        console.log("pagecount: " + pagecount);
    }
    if (ruleelement.data('mode')) {
        mode = ruleelement.data("mode");
        console.log("mode: " + mode);
    }
    if (ruleelement.data('noduplicates')) {
        noduplicates = ruleelement.data("noduplicates");
        console.log("noduplicates: " + noduplicates);
    }
    if (ruleelement.data('mandator')) {
        mandatorId = $('.rruleset').data('mandator');
        console.log("mandatorId: " + mandatorId);
    }

    //Termine erzeugen
    recurrency(sliceStart, sliceEnd);
    //Sortierung
    allEvents.sort((a, b) => a.eventdate - b.eventdate);
    //How many to show - if data-count = empty --> show all within slice?
    //Anzahl der Treffer ggf. einschränken

    if (count) {
        allEventsResult = allEvents.slice(0, count);
    } else {
        allEventsResult = allEvents;
    }
    if(!executedOnce) {
        // alert("RESET within executeOnce");
        allEventsResultInit = allEventsResult;
        eventsResultRangeFiltered = allEventsResultInit;
        // alert("eRRF: " + eventsResultRangeFiltered.length);
    }

    console.log("buildrruleset: allEventsResult");
    console.log(allEventsResult);

    return allEventsResult;
}

//Recurrency-Funktion - alle Termine gemäß der Wiederholungsregeln im angegebenen Zeitraum (sliceStart, sliceEnd) erzeugen
function recurrency(sliceStart, sliceEnd) {
    console.log("2. recurrency()");
    console.log("sliceStart: " + sliceStart);
    console.log("sliceEnd: " + sliceEnd);
    events.forEach(function (item, index) {
        const id              = item.id;
        const url             = item.url;
        const title           = item.title;
        const image           = item.image;
        const category        = item.category;
        const categories      = item.categories;
        const series          = item.series;
        const seriesurl       = item.seriesUrl;
        const exdates         = item.exdates;
        const rule            = item.rule;
        const canceled        = item.canceled;
        const timeValid       = item.timeValid;
        const ticketurl       = item.ticketUrl;
        const location        = item.location;
        const mandators       = item.mandators;
        const highlight       = item.highlight;
        const topevent        = item.topevent;
        const status          = item.status;
        const rrulesetEvents  = [];
        const today           = stringToDate(DateTime.local());
        const sliceEndNextDay = new Date(sliceEnd.valueOf());
        sliceEndNextDay.setDate(sliceEndNextDay.getDate() + 1);
        const rruleSet        = new RRuleSet();
        rruleSet.rrule(new RRule.fromString(rule));
        const startdate       = RRule.parseString(rule).dtstart;
        const enddate         = RRule.parseString(rule).until;


        // Add a exclusion date to rruleSet
        if ( (exdates !=='') ) {
            exdates.forEach(removeExdate);
            function removeExdate(value) {
                rruleSet.exdate(stringToDate(value));
            }
        }

        // Slice or all events?
        if ( (sliceStart ==='') && (sliceEnd !== '') ) {
            rrulesetEvents[index] = rruleSet.between(today, sliceEndNextDay);
        }
        else if ( (sliceStart !=='') && (sliceEnd === '') ) {
            rrulesetEvents[index] = rruleSet.between(sliceStart, new Date(Date.UTC(2030, 1, 1)));
        }
        else if ( (sliceStart !=='') && (sliceEnd !== '') ) {
            rrulesetEvents[index] = rruleSet.between(sliceStart, sliceEndNextDay);
        }
        else {
            rrulesetEvents[index] = rruleSet.between(today, new Date(Date.UTC(2030, 1, 1)));
        }


        for (var i = 0; i < rrulesetEvents[index].length; i++) {
            let eventdate = rrulesetEvents[index][i];
            allEvents.push({
                eventdate: eventdate,
                id: id,
                url: url,
                title: title,
                image: image,
                category: category,
                categories: categories,
                series: series,
                seriesurl: seriesurl,
                canceled: canceled,
                status: status,
                timeValid: timeValid,
                rule: rule,
                startdate: startdate,
                enddate: enddate,
                ticketurl: ticketurl,
                location: location,
                mandators: mandators,
                highlight: highlight,
                topevent: topevent,
                itemDate: eventdate, //Wed Jul 21 2021 17:00:00 GMT+0200 (Mitteleuropäische Sommerzeit)
                // itemddMMMMyyyy: DateTime.fromJSDate(eventdate).setLocale(lang).toFormat('dd. MMMM yyyy'),
                // itemDateComplete: DateTime.fromJSDate(eventdate).setLocale(lang).toFormat('dd. MMM yyyy'),
                // itemDateLong: DateTime.fromJSDate(eventdate).setLocale(lang).toFormat('dd. MMM ´yy'),
                // itemDateShort: DateTime.fromJSDate(eventdate).setLocale(lang).toFormat('dd. MM.'),
                // itemDateWeekdayDayMonth: DateTime.fromJSDate(eventdate).setLocale(lang).toFormat('ccc. dd.MM.'),
                // itemHour: eventdate.getUTCHours(),
                // itemMinutes: DateTime.fromJSDate(eventdate).toFormat('mm'),
                // itemDay: eventdate.getDate(), //21
                // itemWeekdayShort: DateTime.fromJSDate(eventdate).setLocale(lang).toFormat('ccc'), //Mi
                // itemWeekdayLong: DateTime.fromJSDate(eventdate).setLocale(lang).toFormat('cccc'), //Mittwoch
                // itemMonthNumeric: DateTime.fromJSDate(eventdate).toFormat('dd'), //6
                // itemMonthShort: DateTime.fromJSDate(eventdate).setLocale(lang).toFormat('LLL'), //Jul
                // itemMonthLong: DateTime.fromJSDate(eventdate).setLocale(lang).toFormat('LLLL'), //Juli
                // itemYear: DateTime.fromJSDate(eventdate).toFormat('yyyy'), //2021
                // itemStartDate: DateTime.fromJSDate(startdate, {zone:'UTC'}).toFormat('DD T'),
                // itemEndDate: DateTime.fromJSDate(enddate, {zone: 'UTC'}).toFormat(' - DD HH:mm'),
                // itemStartTime: DateTime.fromJSDate(startdate, {zone:'UTC'}).toFormat('HH:mm'),
                // itemEndTime: DateTime.fromJSDate(enddate, {zone:'UTC'}).toFormat('HH:mm'),
            });
        }
    });
    // console.log("allEventsWithinRecurrency: " + allEvents);
    return allEvents;
}

//Contentfilter
function contentfiltervalue(filterValue){
    console.log("cfv: " + filterValue);
    console.log(filterValue);

    var veranstaltungsArray = eventsResultRangeFiltered;

    console.log("veranstaltungsArray: ");
    console.log (veranstaltungsArray);

    var gesuchteKategorien   = filterValue;

    if (gesuchteKategorien != '') {
        var gefiltertesArray = veranstaltungsArray.filter(function(element) {
            if (!element.categories) return false; // Filtere Elemente ohne Kategorien

            var kategorienIds = element.categories.split(',').map(Number); // Konvertiere Kategorie-Strings in Arrays von Zahlen

            return gesuchteKategorien.some(function(gesuchteKategorie) {
                return gesuchteKategorie.some(function(id) {
                    return kategorienIds.includes(id);
                });
            });
        });

        console.log("Länge des gefilterten Arrays: " + gefiltertesArray.length);

        allEventsResult = gefiltertesArray;
        /**/
    }
    else {
        allEventsResult = eventsResultRangeFiltered;
    }

    console.log("Wert für allEventsResult nach contentfiltervalue: " + allEventsResult.length);

}

function mandatorfiltervalue(filterValue){
    console.log("mfv: " + filterValue);
    console.log(filterValue);

    var veranstaltungsArray = allEventsResult;

    console.log("veranstaltungsArray: ");
    console.log (veranstaltungsArray);

    var mandators   = filterValue;
    console.log("Mandator: ");
    console.log(mandators);

    if (mandators != '') {
        // Konvertiere mandators in ein Array von Zahlen
        var mandatorArray = mandators.split(',').map(Number);

        var gefiltertesArray = veranstaltungsArray.filter(function(element) {
            if (!element.mandators) return false; // Filtere Elemente ohne Kategorien

            var mandatorIds = element.mandators.split(',').map(Number); // Konvertiere Kategorie-Strings in Arrays von Zahlen
            console.log(mandatorIds);

            // Prüfe, ob eine der IDs in mandatorArray in mandatorIds enthalten ist
            return mandatorArray.some(function(id) {
                return mandatorIds.includes(id);
            });
        });

        console.log("Länge des gefilterten Arrays: " + gefiltertesArray.length);

        allEventsResult = gefiltertesArray;
        /**/
    }
    else {
        allEventsResult = eventsResultRangeFiltered;
    }

    console.log("Wert für allEventsResult nach contentfiltervalue: " + allEventsResult.length);
}

//Angeklickten eventfilter ausführen
function eventfilter() {
    /* Kategorie-Filter */
    console.log("4. eventfilter()");
    var filterValueArray = $('.category.active').map(function() {
        return [$.map($(this).data(), function(v) {
            return v;
        })];
    }).get();
    console.log("filtervalueArray:" + filterValueArray);
    contentfiltervalue(filterValueArray);

    /* Mandator-Filter */
    // console.log("4a. mandatorfilter");
    var mandatorfilter = $('#districtval').val();
    console.log(mandatorfilter);
    if(mandatorfilter) {
        mandatorfiltervalue(mandatorfilter);
    }

}

//Ausgabe
function printEventsHandlebars() {
    console.log("5. printEventsHandlebars()");
    //Keine Treffer
    if(allEventsResult==''){
        console.log("pEH: keine Treffer");
        $('.rruleset').empty();
        // $('#data-container').hide();
        $('.service-messages').html("Keine Treffer");
    }
    else {
        console.log("pEH: Treffer");
        // alert(allEventsResult.length);
        $('#data-container').show();
        $('#pagination').show();
        $('.service-messages').html("");
        //HBS-Template abhängig vom gewählten Modus (mode Parameter) auswählen

        // Definiere die Handlebars-Helper
        Handlebars.registerHelper('eq', function(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        });
        Handlebars.registerHelper('formatDate', function(eventdate, format) {
            return DateTime.fromJSDate(new Date(eventdate)).setZone('utc').setLocale(lang).toFormat(format);
        });

        let template = Hbs[mode]; //Example: let template = Hbs['flexTable'];
        let quoteData = template(allEventsResult);
        // alert(quoteData);
        // alert("STOP");
        ruleelement.empty();
        ruleelement.append(quoteData);
    }
}

function flatpickerhelper () {
    //Ersten und letzten Termin ermitteln zur Einschränkung von flatpickr (minDate, maxDate)
    var firstItemMonth = DateTime.fromJSDate(allEvents[0].eventdate).toFormat('yyyy-MM');
    var lastItemMonth = DateTime.fromJSDate(allEvents[allEvents.length - 1].eventdate).plus({month: 1}).toFormat('yyyy-MM-0');


    //Alle Termine in flatpickr eintragen
    $.each(allEvents, function( key, item, element=ruleelement ) {
        var itemDate            = item.eventdate;//Wed Jul 21 2021 17:00:00 GMT+0200 (Mitteleuropäische Sommerzeit)
        var defaultDate = '"' + (DateTime.fromJSDate(itemDate).toFormat('yyyy-MM-dd')) + '"';
        defaultDates.push(defaultDate);
    })

    //Flatpickr
    if ($(".flatpickr").length) {
        $(".flatpickr").flatpickr({
            inline: true,
            defaultDate: defaultDates,
            locale: "de",
            minDate: firstItemMonth,
            maxDate: lastItemMonth,
        });
    }
    // Flatpickr für Reihen-Detail-Seite
    if ($(".flatpickr-series").length) {
        if (executedOnce == false) {
            $(".flatpickr-series").flatpickr({
                inline: true,
                defaultDate: defaultDates,
                enable: defaultDates,
                locale: "de",
                minDate: firstItemMonth,
                maxDate: lastItemMonth,
                onClose: function(selectedDates, dateStr, instance,events,allEvents) {
                    // $('.rruleset').attr('data-slice-start',selectedDates[0]);
                    // $('.rruleset').attr('data-slice-end',selectedDates[1]);
                    // alert("onchange");
                    if(selectedDates!='') {
                        $('.rruleset').attr('data-slice-start', formatDate(selectedDates[0]));
                        // $('.rruleset').attr('data-slice-end', formatDate(selectedDates[0]));
                        $('.rruleset').data('slice-start', formatDate(selectedDates[0]));
                        // $('.rruleset').data('slice-end', formatDate(selectedDates[0]));
                    }
                    else{
                        $('.rruleset').attr('data-slice-start', '');
                        $('.rruleset').attr('data-slice-end', '');
                        $('.rruleset').data('slice-start', '');
                        $('.rruleset').data('slice-end', '');
                    }
                    //Termine erzeugen und darstellen
                    buildrruleset($('.rruleset'));
                    //Filter berücksichtigen

                    eventfilter();
                },
                onChange: function(selectedDates, dateStr, instance,events,allEvents) {
                    if(selectedDates=='') {
                        $('.rruleset').attr('data-slice-start', '');
                        $('.rruleset').attr('data-slice-end', '');
                        $('.rruleset').data('slice-start', '');
                        $('.rruleset').data('slice-end', '');
                        //Termine erzeugen und darstellen
                        buildrruleset($('.rruleset'));
                        //Filter berücksichtigen
                        eventfilter();
                    }
                }
            });
        }
    }
    //Period for Series
    if ($(".event-period").length) {
        if (executedOnce == false) {
            $('.event-period-start').html(DateTime.fromJSDate(allEvents[0].eventdate).toFormat('DD') + ' - ');
            $('.event-period-end').html(DateTime.fromJSDate(allEvents[allEvents.length - 1].eventdate).toFormat('DD'));
        }
    }
}

//Pagination-Limitter
//https://stackoverflow.com/questions/46382109/limit-the-number-of-visible-pages-in-pagination/46385144
// Returns an array of maxLength (or less) page numbers
// where a 0 in the returned array denotes a gap in the series.
// Parameters:
//   totalPages:     total number of pages
//   page:           current page
//   maxLength:      maximum size of returned array
function getPageList(totalPages, page, maxLength) {
    if (maxLength < 5) throw "maxLength must be at least 5";

    function range(start, end) {
        return Array.from(Array(end - start + 1), (_, i) => i + start);
    }

    if (totalPages > 1) {
        $("#previous-page").remove();
        $("#next-page").remove();
        // Include the prev/next buttons:
        $(".pagination").append(
            $("<li>").addClass("page-item").attr({ id: "previous-page" }).append(
                $("<a>").addClass("page-link").attr({
                    href: "javascript:void(0)"}).text("«")
            ),
            $("<li>").addClass("page-item").attr({ id: "next-page" }).append(
                $("<a>").addClass("page-link").attr({
                    href: "javascript:void(0)"}).text("»")
            )
        );
    }

    var sideWidth = maxLength < 9 ? 1 : 2;
    var leftWidth = (maxLength - sideWidth*2 - 3) >> 1;
    var rightWidth = (maxLength - sideWidth*2 - 2) >> 1;
    if (totalPages <= maxLength) {
        // no breaks in list
        return range(1, totalPages);
    }
    if (page <= maxLength - sideWidth - 1 - rightWidth) {
        // no break on left of page
        return range(1, maxLength - sideWidth - 1)
            .concat(0, range(totalPages - sideWidth + 1, totalPages));
    }
    if (page >= totalPages - sideWidth - 1 - rightWidth) {
        // no break on right of page
        return range(1, sideWidth)
            .concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
    }
    // Breaks on both sides
    return range(1, sideWidth)
        .concat(0, range(page - leftWidth, page + rightWidth),
            0, range(totalPages - sideWidth + 1, totalPages));
}

// Below is an example use of the above function.
function initPagination() {
    $(".pagination").empty();
    console.log("initPagination");
    // $("#event-table tr.showcontent").removeClass('showme');
    $("#event-table .event-item.showcontent").removeClass('showme');
    // Number of items and limits the number of items per page
    // var numberOfItems = $("#event-table tr.showcontent").length;
    var numberOfItems = $("#event-table .event-item.showcontent").length;
    // alert(numberOfItems);
    var limitPerPage = 10;
    // Total pages rounded upwards
    var totalPages = Math.ceil(numberOfItems / limitPerPage);
    // Number of buttons at the top, not counting prev/next,
    // but including the dotted buttons.
    // Must be at least 5:
    var paginationSize = 7;
    var currentPage;

    function showPage(whichPage) {
        if (whichPage < 1 || whichPage > totalPages) return false;
        currentPage = whichPage;
        // $("#event-table tr.showcontent").removeClass('showme')
        $("#event-table .event-item.showcontent").removeClass('showme')
            .slice((currentPage-1) * limitPerPage,
                currentPage * limitPerPage).addClass('showme');
        // Replace the navigation items (not prev/next):
        $(".pagination li").slice(1, -1).remove();
        getPageList(totalPages, currentPage, paginationSize).forEach( item => {
            $("<li>").addClass("page-item")
                .addClass(item ? "current-page" : "disabled")
                .toggleClass("active", item === currentPage).append(
                $("<a>").addClass("page-link").attr({
                    href: "javascript:void(0)"}).text(item || "...")
            ).insertBefore("#next-page");
        });
        // Disable prev/next when at first/last page:
        $("#previous-page").toggleClass("disabled", currentPage === 1);
        $("#next-page").toggleClass("disabled", currentPage === totalPages);

        $("#next-page").on("click", function () {
            return showPage(currentPage+1);
        });
        $("#previous-page").on("click", function () {
            return showPage(currentPage-1);
        });
        return true;
    }


    // Show the page links
    $("#event-table").show();
    showPage(1);

    // Use event delegation, as these items are recreated later
    $(document).on("click", ".pagination li.current-page:not(.active)", function () {
        return showPage(+$(this).text());
    });
}

//Anfang der Tabelle in den sichtbaren Bereich schieben nach dem Blättern über die Pagination
$(".pagination").on("click", function () {
    var tablepos = $('#event-table').offset().top;
    tablepos = tablepos - 300;
    $('html, body').animate({
        scrollTop: tablepos
    }, 'slow');
})

//Initialize Calendar
function initCalendar(url,thisobj) {
    console.log("initCalendar()");

    $.when(loadJSON(url)).done(function (response) {
        events = $.parseJSON(response);
        buildrruleset(thisobj); //liefert "alleventsresult" zurück

        //****************************************************************************
        // 3. Filter Events
        //****************************************************************************
        //Termine abhängig von den ausgewählten Kategorien-Filtern filtern
        console.log("Call eventfilter()");
        eventfilter();

        //****************************************************************************
        // 4. Ausgabe
        //****************************************************************************
        printEventsHandlebars();
        if (allEventsResult.length > 0) {
            flatpickerhelper();
            initPagination();
        }


        if(!executedOnce) {
            eventsResultRangeFiltered = allEventsResultInit;
             console.log("eRRF: " + eventsResultRangeFiltered.length);
            initalEventsResult = allEventsResultInit;
             console.log("iER: " + initalEventsResult.length);
        }
        onlyonce();
        if(!initialexecutedOnce) {
            restoreArray = allEventsResult;
            // alert(restoreArray.length);
        }
        initalonlyonce();

    });
}



/* EVENTS */
$(document).ready(function() {
    $('.rruleset').each(function (){
        ruleelement = $(this);
        //Get data-Attributes of ruleelement
        data         = ruleelement.data();
        url          = data.url;
        count        = parseInt(data.count);
        eventId      = data.eventId;
        seriesId     = data.seriesId;
        mode         = data.mode;
        sliceEnd     = data.sliceEnd;
        sliceStart   = data.sliceStart;
        pagecount    = parseInt(data.pagecount);
        noduplicates = data.noduplicates;
        mandatorId   = data.mandator;
        if (sliceStart) {
            sliceStart = stringToDate(sliceStart);
        }
        if (sliceEnd) {
            sliceEnd = stringToDate(sliceEnd);
        }

        //Overwrite apiurl if data-url exists for .rrulest - else use default api-url (see variables)
        if (url) {
            apiurl = ruleelement.data("url");
        }

        //****************************************************************************
        // 1. Check if special url is needed (eventId, seriesId, highlightevents, ...)
        // + get DATA-Attributes
        //****************************************************************************
        apiurl = new URL(apiurl);

        //for mandatorId
        if (mandatorId){
            // url      = apiurl + '?id=' + eventId;
            apiurl.searchParams.set('md', mandatorId);
        }
        //for event-detail page use only events for special id
        if (eventId){
            // url      = apiurl + '?id=' + eventId;
            apiurl.searchParams.set('id', eventId);
        }
        //for series-events use only events with relation to series-id
        else if (seriesId){
            // url      = apiurl + '?ser=' + seriesId;
            apiurl.searchParams.set('ser', seriesId);
        }
        //for highlight-widget,highlight-teaser,event-slider use only highlight-events
        else if ((mode === 'widget') || (mode === 'highlights') || (mode === 'event-slider')){
            // url      = apiurl + '?hl=1';
            apiurl.searchParams.set('hl', 1);
        }
        //for topevent-teaser use only topevents
        else if (mode === 'topevent'){
            // url      = apiurl + '?te=1';
            apiurl.searchParams.set('te', 1);
        }
        // //all events - no restriction
        // else{
        url      = apiurl;
        // }


        //****************************************************************************
        // 2. Initialize Calender
        //****************************************************************************
        initCalendar(url,$(this));


    });

});

$(document).ready(function() {
    //Click on more-filters to show all filter-buttons
    var showallcategories = false;
    $('.more-filters').on('click', function () {
        showallcategories = true;
        $(this).hide();
        $('.event-categories').css('height', 'auto');
        $('.event-categories button').removeClass('hide');
    });
    $('[data-filter]').on('click', function () {
        $(this).toggleClass('active');
        console.log("Call eventfilter");
        console.log("eventsResultRangeFiltered: ");
        console.log(eventsResultRangeFiltered);
        allEventsResult = eventsResultRangeFiltered;

        eventfilter();
        // alert("Filter");
        printEventsHandlebars();
        initPagination();
    });

//Category-Filters: More-Button only,if more buttons than one line
    function categoryMoreButton() {
        console.log("categoryMoreButton()");
        var firstElementPos;
        var lastElementPos;
        var categoriebuttons = $('.event-categories button').length;
        $('.event-categories button').each(function(index, obj) {
            if (index === 0){
                firstElementPos = obj.getBoundingClientRect().top;
            }
            if (index === categoriebuttons -1) {
                lastElementPos = obj.getBoundingClientRect().top;
            }
        });
        if (firstElementPos === lastElementPos){
            $('.more-filters').hide();
        }
    }
    categoryMoreButton();
    window.onresize = function() {
        if (showallcategories == false){
            $('.more-filters').show();
            categoryMoreButton();
        }
    }

//Close-Button for flatpickr-range
    $(".flatpickr-range").after('<span class="clearspace"><img src=" '+ iconpath  + 'icon_event_close.svg" class="clear" title="clear" /></span>');
//Flatpickr for date-range-field
    const flatpickrRange = $(".flatpickr-range").flatpickr({
        mode: "range",
        locale: "de",
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "d.m.Y",
        onClose: function(selectedDates, dateStr, instance,events,allEvents) {
            console.log("flatpickr onClose()");

            if(selectedDates.length !== 0) {
                $('.rruleset').attr('data-slice-start', formatDate(selectedDates[0]));
                $('.rruleset').attr('data-slice-end', formatDate(selectedDates[1]));
                $('.rruleset').data('slice-start', formatDate(selectedDates[0]));
                $('.rruleset').data('slice-end', formatDate(selectedDates[1]));

                console.log("new slice start: " + formatDate(selectedDates[0]));
                console.log("new slice end: " + formatDate(selectedDates[1]));

                //show/hide Close-Button for flatpickr-range
                $(".flatpickr-range").on('keyup input',function(){
                    if ($(this).val()) {
                        $(".flatpickr-group .clear").addClass("show");
                    } else {
                        $(".flatpickr-group .clear").removeClass("show");
                    }
                });
            }
            else{
                $('.rruleset').attr('data-slice-start', '');
                $('.rruleset').attr('data-slice-end', '');
                $('.rruleset').data('slice-start', '');
                $('.rruleset').data('slice-end', '');
            }
            //Termine erzeugen und darstellen
            buildrruleset($('.rruleset'));
            eventsResultRangeFiltered = allEventsResult;
            // alert("fpr: " + eventsResultRangeFiltered.length);

            //Filter berücksichtigen
            eventfilter();
            console.log("Array-Lenght: " + allEventsResult.length);
            printEventsHandlebars();
            initPagination();

            console.log("fp: allEventsResult");
            console.log(allEventsResult);


            /* VA-Export refresh Datatable*/
            if($('.rruleset').data('mode') === 'datatable') {
                // $('#data-table').DataTable().ajax.reload();
                $('#data-table').DataTable({
                    dom: "<'row'<'col-sm-12 text-end'B>>" +
                        "<'row'<'col-sm-6'l><'col-sm-6'f>>" +
                        "<'row'<'col-sm-12'tr>>" +
                        "<'row'<'col-sm-5'i><'col-sm-7'p>>",
                    buttons: [
                        {
                            extend: 'excel',
                            text: 'Excel-Export',
                            className: 'btn btn-default btn-primary data-table-button btn-xlsx'
                        }
                    ],
                    language: {
                        url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/de-DE.json',
                    },
                    lengthMenu: [[10, 20, -1], [10, 20, 'Alle']]
                });
            }
        },
        onChange: function(selectedDates, dateStr, instance,events,allEvents) {
            if(selectedDates=='') {
                console.log("flatpickr onChange()");
                $('.rruleset').attr('data-slice-start', '');
                $('.rruleset').attr('data-slice-end', '');
                $('.rruleset').data('slice-start', '');
                $('.rruleset').data('slice-end', '');

                eventsResultRangeFiltered = restoreArray;
                eventfilter();
                printEventsHandlebars();
                flatpickerhelper();
                initPagination();
            }
        }
    });




//Reset Event Filter
    $('.event-categories .category-reset').on('click', function(){
        console.log("reset start");
        $('#data-container').show();
        $('.service-messages').html("");
        $('.event-filters #searchval').val('');
        $('.event-categories button').removeClass('active');
        $('.district-group select option').prop('selected', function() {
            return this.defaultSelected;
        });
        flatpickrRange.clear();
        sliceEnd     = "";
        sliceStart   = "";

        $(".searchval-group .clear").removeClass("show");
        var url = apiurl;
        url.searchParams.delete('search');
         console.log("reset url");
         console.log(url);
        setTimeout(
            function()
            {
                console.log("initCalendar within RESET");
                executedOnce = false;
                initCalendar(url, $('.rruleset'));
            }, 500);
    });

    //Show ClearButton for Search-Feld if searchval contains characters
    $(".event-filters #searchval").after('<span class="clearspace"><img src=" '+ iconpath  + 'icon_event_close.svg" class="clear" title="clear" /></span>');
    $(".event-filters #searchval").on('keyup input',function(){
        if ($(this).val()) {
            $(".searchval-group .clear").addClass("show");
        } else {
            $(".searchval-group .clear").removeClass("show");
        }
    });

    /*https://stackoverflow.com/questions/1909441/how-to-delay-the-keyup-handler-until-the-user-stops-typing*/
    function delay(fn, ms) {
        let timer = 0
        return function(...args) {
            clearTimeout(timer)
            timer = setTimeout(fn.bind(this, ...args), ms || 0)
        }
    }

//Searchval-Field: if char>3 in searchfield - get new events from api
    url = apiurl;
    var eventSearchField = $('#searchval');
    eventSearchField.keyup(delay(function(){

        // url = new URL(apiurl + '?md=' + mandatorId);
        if(eventSearchField.val().length >= 3){
            url.searchParams.set('search', eventSearchField.val());
        }
        else if(eventSearchField.val().length == 0){
            url.searchParams.delete('search');
        }
        // alert(url);
        executedOnce = false;
        initCalendar(url, $('.rruleset'));
    },500));

//district filter
//     districtSelect.on('change', function() {
    $('.event-filters .district-group select').on('change', function() {
        // url.searchParams.set('di', this.value );
        // url.searchParams.set('md', this.value );
        // executedOnce = false;
        // initCalendar(url, $('.rruleset'));
        eventfilter();
        printEventsHandlebars();
        initPagination();
    });

//Clear Searchfield if clear-button is clicked
    $('.searchval-group .clear').on('click', function(){
        $('.event-filters #searchval').val('');
        $(".searchval-group .clear").removeClass("show");
        url.searchParams.delete('search');
        executedOnce = false;
        initalEventsResult = restoreArray;
        initCalendar(url, $('.rruleset'));
    });

//Clear Flatpickr if clear-button is clicked
    $('.flatpickr-group .clear').on('click', function(){
        console.log("flatpickr clear");
        flatpickrRange.clear();
        sliceEnd     = "";
        sliceStart   = "";
    });
});