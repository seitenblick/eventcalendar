import $ from './lib/jquery';
import {DateTime} from 'luxon';
import {RRule, RRuleSet} from 'rrule';

// var nunjucks = require('nunjucks');
var Mustache = require('mustache');

let allEvents       = []; //Array with all rendered events
let allEventsResult = []; //Array with calculated events

//Helper-Funktionen
function stringToDate(value) {
    // Convert string '2014-02-11T11:30:30' to date:
    var dt = DateTime.fromISO(value); //=> Tue Feb 11 2014 11:30:30
    return new Date(Date.UTC(dt.year, dt.month - 1, dt.day, dt.hour, dt.minute, dt.second));
}

$(document).ready(function(){
    //Event
    class Event {
        constructor(startDate, endDate, title, rrule, eventId, category, exdates, image, series, seriesUrl, canceled, ticketUrl, location, url, timevalid) {
            this.title     = title;
            this.eventId   = eventId;
            this.url       = url;
            this.image     = image;
            this.category  = category;
            this.series    = series;
            this.seriesUrl = seriesUrl;
            this.startDate = startDate;
            this.endDate   = endDate;
            this.rrule     = rrule;
            this.exdates   = exdates;
            this.canceled  = canceled;
            this.timevalid = timevalid;
            this.ticketUrl = ticketUrl;
            this.location  = location;
        }
    }

    // rruleset
    class Rruleset {
        constructor(thisObj, sliceStart, sliceEnd, count, apiUrl, mode ) {
            this.obj        = thisObj;
            this.sliceStart = sliceStart;
            this.sliceEnd   = sliceEnd;
            this.count      = count;
            this.apiUrl     = apiUrl;
            this.mode       = mode;
        }
        fetchEvents(url) {
            // Get JSON
            $.ajax({
                dataType: 'json',
                url: url
            })
            .done((data) => {
                //alert('DATA: ' + data);
                this.events = data;
                //Wiederkehrende Termine
                this.recurrency(this.sliceStart, this.sliceEnd, data, this.count);
                //Ausgabe
                console.log("Und jetzt die Ausgabe");
                // var view = {
                //     eventdate : "1.5.2022",
                //     title : "Web Developer"
                // };

                var products = Object.keys(allEventsResult).map(function (k) { return this[k] }, allEventsResult);
console.log(products);
                // document.body.innerHTML = Mustache.render('\
                //     <ul>\
                //       {{#products}}\
                //       <li>{{eventdate}} > {{title}}</li>\
                //       {{/products}}\
                //     </ul>\
                //     ', { products: products })

                $("#templates").load("views/items.html #event-widget",function(){
                    var template = document.getElementById('event-widget').innerHTML;
                    var output = Mustache.render(template, { products: products });
                    $("#test").html(output);
                });


                //this.outputCal(allEventsResult);
                //return data;
            });
            // loadJSON().done(function (output) {
            //    events =  $.parseJSON(output);
            // });
        }
        recurrency(sliceStart, sliceEnd, events, count) {
            events.forEach(function (item, index) {
                // let id    = item.id;
                // let title = item.title;
                //alert(id);
                //alert(title);
                var eventitem = new Event(item.startDate, item.endDate, item.title, item.rule, item.eventId, item.category, item.exdates, item.image, item.series, item.seriesUrl, item.canceled,item.ticketUrl, item.location, item.url, item.timeValid );
                // console.log(eventitem.title, eventitem.startDate);
                var rrulesetEvents  = [];
                var today           = stringToDate(DateTime.local());
                var sliceEndNextDay = new Date(sliceEnd.valueOf());
                sliceEndNextDay.setDate(sliceEndNextDay.getDate() + 1);

                const rruleSet = new RRuleSet();
                rruleSet.rrule(new RRule.fromString(eventitem.rrule));

                const starddate = RRule.parseString(eventitem.rrule).dtstart;
                const enddate   = RRule.parseString(eventitem.rrule).until;

                // Add a exclusion date to rruleSet
                if ( (eventitem.exdates !=='') ) {
                    eventitem.exdates.forEach(removeExdate);
                    function removeExdate(value) {
                        rruleSet.exdate(stringToDate(value));
                    }
                }

                // Slice or all events?
                if ( (sliceStart ==='') && (sliceEnd !== '') ) {
                    console.log('1');
                    rrulesetEvents[index] = rruleSet.between(today, sliceEndNextDay);
                }
                else if ( (sliceStart !=='') && (sliceEnd === '') ) {
                    console.log('2');
                    rrulesetEvents[index] = rruleSet.between(sliceStart, new Date(Date.UTC(2030, 1, 1)));
                }
                else if ( (sliceStart !=='') && (sliceEnd !== '') ) {
                    console.log('3');
                    // rrulesetEvents[index] = rruleSet.between(sliceStart, sliceEndNextDay);
                }
                else {
                    console.log('4');
                    rrulesetEvents[index] = rruleSet.between(today, new Date(Date.UTC(2030, 1, 1)));
                }

                for (var i = 0; i < rrulesetEvents[index].length; i++) {
                    allEvents.push({
                        eventdate: rrulesetEvents[index][i],
                        id: eventitem.id,
                        url:eventitem.url,
                        title: eventitem.title,
                        image: eventitem.image,
                        category: eventitem.category,
                        series: eventitem.series,
                        seriesurl: eventitem.seriesurl,
                        canceled: eventitem.canceled,
                        timeValid: eventitem.timeValid,
                        rule: eventitem.rule,
                        startdate: starddate,
                        enddate: enddate,
                        ticketurl: eventitem.ticketurl,
                        location: eventitem.location,
                    });
                }
            });
            // console.log('AllEvents: ' + allEvents);
//Sortierung
            allEvents.sort((a, b) => a.eventdate - b.eventdate);

            //How many to show - if data-count = empty --> show all within slice?
            //Anzahl der Treffer ggf. einschränken
            if (count) {
                allEventsResult = allEvents.slice(0, count);
            } else {
                allEventsResult = allEvents;
            }

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
            }
        }
        outputCal(obj) {
            console.log(obj);
            // console.log(nunjucks);
            //nunjucks.configure('views',{ autoescape: true });
            //var output = nunjucks.renderString('events: {{ events }}', obj);
            //nunjucks.render('items.html', { name: 'nunjucks' } );
            //this.obj.html(output);
            //nunjucks.configure({ autoescape: true });
            //nunjucks.renderString('Hello {{ username }}', { username: 'James' });

        }

    }

    $('.rruleset').each(function (){
        let apiUrl     = $(this).data("url");
        let thisObj    = $(this);
        let count           = ''; //data-count aus ruleelement
        let mode            = ''; /*Layout-Mode: list, grid, ...*/
        let lang            = $('html').attr('lang'); //Language for localization
        let defaultDates    = []; //Alle Events für flatpickr z.B. ["2021-08-04", "2021-08-06", "2021-08-07"]
        let sliceStart      = ''; //Kalenderstart für Darstellung
        let sliceEnd        = ''; //Kalenderende für Darstellung
        if ($(this).data("slice-start")) {
            sliceStart = stringToDate($(this).data("slice-start"));
        }
        if ($(this).data("slice-end")) {
            sliceEnd = stringToDate($(this).data("slice-end"));
        }
        if ($(this).data("count")) {
            count = parseInt($(this).data("count"));
        }
        if ($(this).data("mode")) {
            mode = $(this).data("mode");
        }


        let rruleset = new Rruleset(thisObj, sliceStart, sliceEnd, count, apiUrl, mode );



        //Termine (JSON) laden
        rruleset.fetchEvents(apiUrl);

        //rruleset.recurrency(sliceStart, sliceEnd, rruleset.events);
        //alert ('rrr '+ events);
        //


        //Termine nach Regeln erzeugen
        //recurrency(sliceStart, sliceEnd, events);
    });






});