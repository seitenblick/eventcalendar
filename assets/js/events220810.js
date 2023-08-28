import $ from './lib/jquery';
import {DateTime} from 'luxon';
import {RRule, RRuleSet} from 'rrule';

//Variablen
var apiurl          = 'https://www.aalen.de/api/EventApiRules.php'; //can be overwritten by data-url of .rruleset
var origin          = window.location.origin;
if (origin.indexOf("aalen.ap") > -1){
    var iconpath    = '/mandanten/global/events/img/';
}
else if (origin.indexOf("seitenblick") > -1){
    var iconpath    = '/public/assets/global/img/';
}
else {
    var iconpath    = '/assets/global/img/';
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

//Initialize Calendar
function initCalendar(url,thisobj) {
    /* Get JSON*/
    function loadJSON(handleData) {
        // alert("loadjson");
        return $.ajax({
            dataType: 'text',
            url: url,
            success: function(data){
                handleData(data);
            }
        });
    }

    loadJSON(function (output) {
        // alert("promise");
        events = $.parseJSON(output);
        // console.log(events);
        if(events==null){
            $('#data-container').hide();
            $('.service-messages').html("Keine Treffer");
        }
        else{
            $('#data-container').show();
            $('.service-messages').html("");
            //Termine erzeugen und darstellen
            //xxxxx buildrruleset(thisobj);
            //Filter berücksichtigen
            //xxxxx eventfilter();
        }
    });
}

//EVENT
let event = {
    title:  '',
    eventId: '',
    url: '',
    image: '',
    category: '',
    series: '',
    seriesUrl: '',
    startDate: '',
    endDate: '',
    rrule: '',
    exdates: '',
    canceled: '',
    timevalid: '',
    ticketUrl: '',
    location: '',
}

//Rruleset
let rruleset = {
    id: '',
    url: '',
    eventId: '',
    seriesId: '',
    // obj: '',
    // sliceStart: '',
    // sliceEnd: '',
    // count: '',
    // apiUrl: '',
    // mode: '',
}

$(document).ready(function(){
    $('.rruleset').each(function (i){
        var url;
        var eventId;
        var seriesId;

        //Overwrite apiurl if data-url exists for .rrulest - else use default api-url (see variables)
        if ($(this).data("url")) {
            apiurl = $(this).data("url");
        }

        //****************************************************************************
        // 1. Check if special url is needed (eventId, seriesId, highlightevents, ...)
        //****************************************************************************
        //for event-detail page use only events for special id
        if ($('main').data('event-id')){
            eventId = $('main').data('event-id');
            url = apiurl + '?id=' + eventId;
        }
        //for series-events use only events with relation to series-id
        else if ($('main').data('series-id')){
            seriesId = $('main').data('series-id');
            url = apiurl + '?ser=' + seriesId;
        }
        //for highlight-widget use only highlight-events
        else if($(this).data('mode') === 'widget'){
            url = apiurl + '?hl=1';
        }
        //for highlight-teaser
        else if($(this).data('mode') === 'highlights'){
            url = apiurl + '?hl=1';
        }
        //for event-slider-teaser
        else if($(this).data('mode') === 'event-slider'){
            url = apiurl + '?hl=1';
        }
        //for topevent-teaser use only topevents
        else if($(this).data('mode') === 'topevent'){
            url = apiurl + '?te=1';
        }
        //all events - no restriction
        else{
            url = apiurl;
        }

        //****************************************************************************
        // 2. Initialize Calender
        //****************************************************************************
        initCalendar(url, $(this));

        //****************************************************************************
        // 3. Filter Events
        //****************************************************************************
        //Termine abhängig von den ausgewählten Kategorien-Filtern filtern
        // contentfilter();
    })
});