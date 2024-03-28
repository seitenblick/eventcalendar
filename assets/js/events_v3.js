/* EVENTS */
import $ from "./lib/jquery";
import {DateTime} from "luxon";

$(document).ready(function(){
    //Variablen
    let ruleset = [];
    let rulesetItem = [];
    let ruleelement;

    //Helper-Funktionen
    function stringToDate(value) {
        // Convert string '2014-02-11T11:30:30' to date:
        if (value){
            let dt = DateTime.fromISO(value); //=> Tue Feb 11 2014 11:30:30
            return new Date(Date.UTC(dt.year, dt.month - 1, dt.day, dt.hour, dt.minute, dt.second));
        }
    }
    function addItemToArray(array, item) {
        array.push(item);
    }

    $('.rruleset').each(function () {
        ruleelement = $(this);
        rulesetItem = [
            {
                sliceStart: stringToDate(ruleelement.data('slice-start')),
                sliceEnd: stringToDate(ruleelement.data('sliceEnd')),
                mode: ruleelement.data('mode'),
                eventId: ruleelement.data('event-id'),
                seriesId: ruleelement.data('series-id'),
                mandatorId: ruleelement.data('mandator'),
                url: ruleelement.data('url'),
                count: ruleelement.data('count'),
                pagecount: ruleelement.data('pagecount'),
                noduplicates: ruleelement.data('noduplicates'),
            }
        ];

        if (rulesetItem.sliceStart) {
            rulesetItem.sliceStart = stringToDate(rulesetItem.sliceStart);
        }
        if (rulesetItem.sliceEnd) {
            rulesetItem.sliceEnd = stringToDate(rulesetItem.sliceEnd);
        }

        //Overwrite apiurl if data-url exists for .rrulest - else use default api-url (see variables)
        if (rulesetItem.url) {
            rulesetItem.apiurl = ruleelement.data("url");
        }

        addItemToArray(ruleset, rulesetItem);

    });
    console.log(ruleset);
});