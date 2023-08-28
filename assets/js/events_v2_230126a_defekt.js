/* Imports */
import $ from './lib/jquery';
import {DateTime} from 'luxon';
import {RRule, RRuleSet} from 'rrule';
import flatpickr from "flatpickr";
import { German } from "flatpickr/dist/l10n/de";

//Variablen
var apiurl   = 'https://www.aalen.de/api/EventApiRules.php'; //can be overwritten by data-url of .rruleset
var origin   = window.location.origin;
// console.log("Window.location.origin:" +origin);
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
var data; //Data-Attribute des Ruleelements
var eventSearchField = $('.event-filters #searchval');
var districtSelect  = $('.event-filters .district-group select');

var url; //final-url with get-parameters
var eventId;
var seriesId;
var eventobj;
var rruleEvents; //erzeugte Termine nach Terminregeln

//Helper-Funktionen
function stringToDate(value) {
    // Convert string '2014-02-11T11:30:30' to date:
    var dt = DateTime.fromISO(value); //=> Tue Feb 11 2014 11:30:30
    return new Date(Date.UTC(dt.year, dt.month - 1, dt.day, dt.hour, dt.minute, dt.second));
}
function truncate(input, count) {
    if (input.length > count) {
        return input.substring(0, count) + '...';
    }
    return input;
}

//Initialize Calendar
function initCalendar(url,thisobj) {
    loadJSON(url);
}
/* Get JSON*/
function loadJSON(url) {
    // alert("loadjson");
    return $.ajax({
        dataType: 'text',
        url: url,
        // success: function(data){
        //     handleData(data);
        // }
    });
}

//RRuleSet-Instanz unter Berücksichtiung eines Start-/Endzeitraums und ggf die gewünschte Anzahl an Terminen erzeugen
function buildrruleset(thisobj) {
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
}

//Recurrency-Funktion - alle Termine gemäß der Wiederholungsregeln im angegebenen Zeitraum (sliceStart, sliceEnd) erzeugen
function recurrency(sliceStart, sliceEnd) {
    console.log("recurrencyfct ...");

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
        const highlight     = item.highlight;
        const topevent      = item.topevent;
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
                highlight: highlight,
                topevent: topevent,
                itemWeekdayLong: DateTime.fromJSDate(rrulesetEvents[index][i]).setLocale(lang).toFormat('cccc'),
                itemDate: DateTime.fromJSDate(rrulesetEvents[index][i]).setLocale(lang).toFormat('dd. MMM ´yy'),
            });
        }
    });
    // console.log("allEventsWithinRecurrency: " + allEvents);
    return allEvents;
}

//Ausgabe
function printEventsHandlebars() {
    // var template = Handlebars.compile("Handlebars {{doeswhat}}");
    // console.log(template({doeswhat: "rocks!"}));


        // // Get the text for the Handlebars template from the script element.
        // var templateText = $("#event-table-template").html();
        //
        // // Compile the Handlebars template.
        // var eventTemplate = Handlebars.compile(templateText);
        //
        // // Evaluate the template with an array of people.
        // var html = eventTemplate({item: allEventsResult});
        //
        // // Take the HTML that was created with the Handlebars template and
        // // append the HTML to the #inputGroupSelect01 select element.
        // ruleelement.append(html);

    if (mode === 'flextable'){
        var template = Hbs['flexTable'];
        console.log(allEventsResult);
        var quoteData = template(allEventsResult);
        console.log(quoteData);
        ruleelement.append(quoteData);
    }

}
function printEvents() {
    console.log("printevents...");
    //Keine Treffer
    if(allEventsResult==''){
        $('#data-container').hide();
        $('.service-messages').html("Keine Treffer");
        // $('#pagination').hide();
    }
    else {
        $('#data-container').show();
        $('#pagination').show();
        $('.service-messages').html("");

        /*Ausgabe*/
        //List-Wrapper
        console.log("Mode: " + mode);
        if (mode === 'flextable'){
            console.log("Ruleelement: " + ruleelement);
            ruleelement.append("<div class='flex-table'><div id='event-table' class='events' data-toggle=\"table\" data-pagination=\"true\"><div class=\"event-items\"></div></div></div>");
        }

        //Listenelemente
        $.each(allEventsResult, function( key, item, element=ruleelement ) {
            //Ausgabevariablen für formatiertes Datum
            var itemDate            = item.eventdate;//Wed Jul 21 2021 17:00:00 GMT+0200 (Mitteleuropäische Sommerzeit)
            var itemDay             = itemDate.getDate(); //21
            // var itemWeekdayShort = itemDate.toLocaleString('default', { weekday: 'short' }); //Mi
            var itemWeekdayShort    = DateTime.fromJSDate(itemDate).setLocale(lang).toFormat('ccc');
            // var itemWeekdayLong  = itemDate.toLocaleString('default', { weekday: 'long' }); //Mittwoch
            var itemWeekdayLong     = DateTime.fromJSDate(itemDate).setLocale(lang).toFormat('cccc');
            // var itemMonthNumeric = itemDate.toLocaleString('default', { month: 'numeric' }); //6
            var itemMonthNumeric    = DateTime.fromJSDate(itemDate).toFormat('dd');
            // var itemMonthShort   = itemDate.toLocaleString('default', { month: 'short' }); //Jul
            var itemMonthShort      = DateTime.fromJSDate(itemDate).setLocale(lang).toFormat('LLL');
            //var itemMonthLong     = itemDate.toLocaleString('default', { month: 'short' }) //Juli
            var itemMonthLong       = DateTime.fromJSDate(itemDate).setLocale(lang).toFormat('LLLL');
            // var itemYear         = itemDate.toLocaleString('default', { year: 'numeric' }); //2021
            var itemYear            = DateTime.fromJSDate(itemDate).toFormat('yyyy');
            var itemHour            = itemDate.getUTCHours();
            var itemMinutes         = DateTime.fromJSDate(itemDate).toFormat('mm');
            var itemStartDate       = DateTime.fromJSDate(item.startdate, {zone:'UTC'}).toFormat('DD T');
            var itemEndDate         = DateTime.fromJSDate(item.enddate, {zone: 'UTC'}).toFormat(' - DD HH:mm');

        if (mode === 'flextable'){
                element.find('.event-items').append('<div class="event-item showcontent" data-tags="' + item.category.id + '">\n' +
                    '                            <a href="' + item.url + '">\n' +
                    '                                <div class="event-item-date">\n' +
                    '                                    <div class="smallertext">' + itemWeekdayLong + '</div><div class="event-date">' + DateTime.fromJSDate(itemDate).setLocale(lang).toFormat('dd. MMM \´yy') + '</div>\n' +
                    '                                </div>\n' +
                    '                                <div class="event-item-info">\n' +
                    '                                    <div class="event-item-title">\n' +
                    '                                        <div class="event-title">' + item.title + '</div>\n' +
                    '                                    </div><div>' + `${item.timeValid ? '<span class="event-time"><time>' + itemHour + ':' + itemMinutes + ' Uhr</time></span>' : ''}` + '<span class="event-location">' + item.location + '</span></div>\n' +
                    '                                </div>\n' +
                    '                            </a>\n' +
                    '                            <div class="event-item-links">\n' +
                    '                                ' + `${item.canceled ? '<div class="rotation-wrapper-outer"><div class="buttonlink canceledevent rotation-wrapper-inner"><span class="linktext element-to-rotate">Abgesagt</span></div></div>\n' : ''}`  + `${item.ticketurl ? '<a href="' + item.ticketurl + '" class="rotation-wrapper-outer"><div class="buttonlink ticket rotation-wrapper-inner"><span class="linktext element-to-rotate">Tickets</span></div></a>' : ''}` +
                    '                            </div>\n' +
                    '                        </div>');
            }
        })
    }
}

/* EVENTS */
$(document).ready(function(){
    $('.rruleset').each(function (){
        ruleelement = $(this);
        //Get data-Attributes of ruleelement
        data       = ruleelement.data();
        url        = data.url;
        count      = parseInt(data.count);
        eventId    = data.eventId;
        seriesId   = data.seriesId;
        mode       = data.mode;
        sliceEnd   = stringToDate(data.sliceEnd);
        sliceStart = stringToDate(data.sliceStart);


        //Overwrite apiurl if data-url exists for .rrulest - else use default api-url (see variables)
        if (url) {
            apiurl = (url);
        }

        //****************************************************************************
        // 1. Check if special url is needed (eventId, seriesId, highlightevents, ...)
        // + get DATA-Attributes
        //****************************************************************************
        //for event-detail page use only events for special id
        if (eventId){
            url      = apiurl + '?id=' + eventId;
        }
        //for series-events use only events with relation to series-id
        else if (seriesId){
            url      = apiurl + '?ser=' + seriesId;
        }
        //for highlight-widget,highlight-teaser,event-slider use only highlight-events
        else if ((mode === 'widget') || (mode === 'highlights') || (mode === 'event-slider')){
            url      = apiurl + '?hl=1';
        }
        //for topevent-teaser use only topevents
        else if (mode === 'topevent'){
            url      = apiurl + '?te=1';
        }
        //all events - no restriction
        else{
            url      = apiurl;
        }


        //****************************************************************************
        // 2. Initialize Calender
        //****************************************************************************
        // console.log("url: " + url);
        // console.log("this:" + $(this));
        // events = loadJSON(url);
        $.when(loadJSON(url)).done(function (resp1) {
            events = $.parseJSON(resp1);
            console.log("EVENTS:" + events)
            buildrruleset($(this));


            console.log(count);
            console.log("allEventsResult: " + allEventsResult);

            //****************************************************************************
            // 4. Ausgabe
            //****************************************************************************
            //printEvents();
            printEventsHandlebars();

        });

        //****************************************************************************
        // 3. Filter Events
        //****************************************************************************
        //Termine abhängig von den ausgewählten Kategorien-Filtern filtern
        // contentfilter();


    });
});