/* Imports */
import $ from './lib/jquery';
import {DateTime} from 'luxon';
import {RRule, RRuleSet} from 'rrule';
import flatpickr from "flatpickr";
import { German } from "flatpickr/dist/l10n/de";

//Variablen
var apiurl   = 'https://www.aalen.de/api/EventApiRules.php'; //can be overwritten by data-url of .rruleset
var origin   = window.location.origin;
console.log("Window.location.origin:" +origin);
if (origin.indexOf("aalen.ap") > -1){
    var iconpath        = '/mandanten/global/events/img/';
}
else if (origin.indexOf("seitenblick") > -1){
    var iconpath        = '/public/assets/global/img/';
}
else {
    var iconpath        = '/assets/global/img/';
}
var count           = ''; //data-count aus ruleelement
var mode            = ''; /*Layout-Mode: list, grid, ...*/
var allEvents       = []; //Array with all rendered events
var allEventsResult = []; //Array with calculated events
var lang            = $('html').attr('lang'); //Language for localization
var defaultDates    = []; //Alle Events für flatpickr z.B. ["2021-08-04", "2021-08-06", "2021-08-07"]
var events          = []; //Events with rules (AJAX-JSON)
var sliceStart      = ''; //Kalenderstart für Darstellung
var sliceEnd        = ''; //Kalenderende für Darstellung
var ruleelement;
var eventSearchField = $('.event-filters #searchval');
var districtSelect  = $('.event-filters .district-group select');

var url; //final-url with get-parameters
var eventId;
var seriesId;
var eventobj;
var rruleEvents; //erzeugte Termine nach Terminregeln


//Initialize Calendar
function loadEvents(url,thisobj) {
    /* Get JSON*/
    function loadJSON(handleData) {
        // alert("loadjson");
        return new Promise((resolve, reject) => {
            $.ajax({
                dataType: 'text',
                url: url,
                success: function (data) {
                    resolve(data)
                },
                error: function (error) {
                    reject(error)
                },
            })
        })
    }

    var outputfct = function(output);
    loadJSON(outputfct)
        .then((data) => {
            // alert("promise");
            events = $.parseJSON(output);
            console.log("EVENTS:" + events)
            return events;
        })
        .catch((error) => {
            console.log(error)
        })

}

//RRuleSet-Instanz unter Berücksichtiung eines Start-/Endzeitraums und ggf die gewünschte Anzahl an Terminen erzeugen
function buildrruleset(thisobj) {
    //Termine erzeugen
    recurrency(sliceStart, sliceEnd);
    console.log(allEvents);
}

//Recurrency-Funktion - alle Termine gemäß der Wiederholungsregeln im angegebenen Zeitraum (sliceStart, sliceEnd) erzeugen
function recurrency(sliceStart, sliceEnd) {
    events.forEach(function (item, index) {
        const id            = item.id;
        const url           = item.url;
        const title         = item.title;
        const image         = item.image;
        const category      = item.category;
        const series        = item.series;
        const seriesurl     = item.seriesUrl;
        const exdates       = item.exdates;
        const rule          = item.rule;
        const canceled      = item.canceled;
        const timeValid     = item.timeValid;
        const ticketurl     = item.ticketUrl;
        const location      = item.location;
        const rrulesetEvents  = [];
        const today           = stringToDate(DateTime.local());
        const sliceEndNextDay = new Date(sliceEnd.valueOf());
        sliceEndNextDay.setDate(sliceEndNextDay.getDate() + 1);
        const rruleSet = new RRuleSet();
        rruleSet.rrule(new RRule.fromString(rule));
        const starddate = RRule.parseString(rule).dtstart;
        const enddate   = RRule.parseString(rule).until;

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
            allEvents.push({
                eventdate: rrulesetEvents[index][i],
                id: id,
                url:url,
                title: title,
                image: image,
                category: category,
                series: series,
                seriesurl: seriesurl,
                canceled: canceled,
                timeValid: timeValid,
                rule: rule,
                startdate: starddate,
                enddate: enddate,
                ticketurl: ticketurl,
                location: location,
            });
        }
    });
    return allEvents;
}

/* EVENTS */
$(document).ready(function(){
    $('.rruleset').each(function (){

        //Overwrite apiurl if data-url exists for .rrulest - else use default api-url (see variables)
        if ($(this).data("url")) {
            apiurl = $(this).data("url");
        }

        //****************************************************************************
        // 1. Check if special url is needed (eventId, seriesId, highlightevents, ...)
        // + get DATA-Attributes
        //****************************************************************************
        //for event-detail page use only events for special id
        if ($(this).data('event-id')){
            eventId  = $(this).data('event-id');
            url      = apiurl + '?id=' + eventId;
        }
        //for series-events use only events with relation to series-id
        else if ($(this).data('series-id')){
            seriesId = $(this).data('series-id');
            url      = apiurl + '?ser=' + seriesId;
        }
        //for highlight-widget use only highlight-events
        else if ($(this).data('mode') === 'widget'){
            url      = apiurl + '?hl=1';
        }
        //for highlight-teaser
        else if ($(this).data('mode') === 'highlights'){
            url      = apiurl + '?hl=1';
        }
        //for event-slider-teaser
        else if ($(this).data('mode') === 'event-slider'){
            url      = apiurl + '?hl=1';
        }
        //for topevent-teaser use only topevents
        else if ($(this).data('mode') === 'topevent'){
            url      = apiurl + '?te=1';
        }
        //all events - no restriction
        else{
            url      = apiurl;
        }

        //DATA-Attributes
        if ($(this).data('slice-start')) {
            sliceStart = stringToDate($(this).data("slice-start"));
            // alert("SliceStart" + sliceStart);
        }
        if ($(this).data('slice-end')) {
            sliceEnd = stringToDate($(this).data("slice-end"));
            // alert("SliceEnd" + sliceEnd);
        }
        if ($(this).data('count')) {
            count = parseInt($(this).data("count"));
        }
        if ($(this).data('mode')) {
            mode = $(this).data("mode");
        }

        //****************************************************************************
        // 2. Initialize Calender
        //****************************************************************************
        console.log("url: " + url);
        console.log("this:" + $(this));
        events = loadEvents(url, $(this));



        console.log("Events: " + events);
        if(events) {
            rruleEvents = buildrruleset($(this));
        }

        //****************************************************************************
        // 3. Filter Events
        //****************************************************************************
        //Termine abhängig von den ausgewählten Kategorien-Filtern filtern
        // contentfilter();
    });
});