import $ from './lib/jquery';
import {DateTime} from 'luxon';
import {RRule, RRuleSet} from 'rrule';
import flatpickr from "flatpickr";
import { German } from "flatpickr/dist/l10n/de";

//Variablen
var apiurl          = 'https://www.aalen.de/api/EventApiRules.php';
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

//Helper-Funktionen
function stringToDate(value) {
    // Convert string '2014-02-11T11:30:30' to date:
    var dt = DateTime.fromISO(value); //=> Tue Feb 11 2014 11:30:30
    return new Date(Date.UTC(dt.year, dt.month - 1, dt.day, dt.hour, dt.minute, dt.second));
}

//Check for execution only once
var executedOnce;
var onlyonce = (function() {
    executedOnce = false;
    return function() {
        if (!executedOnce) {
            executedOnce = true;
        }
    };
})();

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
        return true;
    }

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
    // Show the page links
    $("#event-table").show();
    showPage(1);

    // Use event delegation, as these items are recreated later
    $(document).on("click", ".pagination li.current-page:not(.active)", function () {
        return showPage(+$(this).text());
    });
    $("#next-page").on("click", function () {
        return showPage(currentPage+1);
    });

    $("#previous-page").on("click", function () {
        return showPage(currentPage-1);
    });;
}

//Anfang der Tabelle in den sichtbaren Bereich schieben nach dem Blättern über die Pagination
$(".pagination").on("click", function () {
    var tablepos = $('#event-table').offset().top;
    tablepos = tablepos - 300;
    $('html, body').animate({
        scrollTop: tablepos
    }, 'slow');
})

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
        var rrulesetEvents  = [];
        var today           = stringToDate(DateTime.local());
        var sliceEndNextDay = new Date(sliceEnd.valueOf());
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
}

//RRuleSet-Instanz unter Berücksichtiung eines Start-/Endzeitraums und ggf die gewünschte Anzahl an Terminen erzeugen
function buildrruleset(thisobj) {
    // console.log(thisobj, url);
    //alert("buildrruleset");

    thisobj.find('.table-responsive').remove();
    thisobj.find('.event-table-wrap').remove();//Dashboard
    thisobj.find('.flex-table').remove();//flex-table
    // alert("remove ready");
    //Get data-attributes
    ruleelement = thisobj;
    // alert("RuleElement" + ruleelement);
    // alert("SliceStart:" + ruleelement.data("slice-start"));
    if (ruleelement.data('slice-start')) {
        sliceStart = stringToDate(ruleelement.data("slice-start"));
        // alert("SliceStart" + sliceStart);
    }
    if (ruleelement.data('slice-end')) {
        sliceEnd = stringToDate(ruleelement.data("slice-end"));
        // alert("SliceEnd" + sliceEnd);
    }
    if (ruleelement.data('count')) {
        count = parseInt(ruleelement.data("count"));
    }
    if (ruleelement.data('mode')) {
        mode = ruleelement.data("mode");
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

    //Keine Treffer
    if(allEventsResult==''){
        $('#data-container').hide();
        $('.service-messages').html("Keine Treffer");
        // $('#pagination').hide();
    }
    else{
        $('#data-container').show();
        $('#pagination').show();
        $('.service-messages').html("");

        /*Ausgabe*/
        //List-Wrapper
        if (mode === 'list') {
            ruleelement.append("<ul class=\"event-list\"></ul>");
        }
        else if ((mode === 'grid') || (mode === 'tiles')){
            ruleelement.append("<div class=\"row\"></div>");
        }
        else if (mode === 'aalenevent'){
            ruleelement.append("<div class=\"row\"><div class=\"col-xs-12\"><div class=\"content-block\"><div class=\"slick-events\"></div></div></div>");
        }
        else if (mode === 'table'){
            ruleelement.append("<div class='table-responsive'><table id='event-table' class='events table' data-toggle=\"table\" data-pagination=\"true\"><thead><tr><th>Datum</th><th aria-label='status'></th></th><th>Titel</th><th>Weitere Infos</th></tr></thead><tbody></tbody></table></div>");
        }
        else if (mode === 'table-dashboard'){
            ruleelement.append(
                "<div class=\"event-table-wrap\">\n" +
                "    <div id=\"event-table\" class=\"event-table\">" +
                "        <div class=\"table-head d-flex\">\n" +
                "            <div class=\"col-date\">Datum</div>\n" +
                "            <div class=\"d-flex flex-fill\">\n" +
                "                <div class=\"col-title\">Titel</div>\n" +
                "                <div class=\"col-location\">Veranstaltungsort</div>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "        <div class=\"table-body\">\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</div>"
            );
        }
        else if (mode === 'flextable'){
            ruleelement.append("<div class='flex-table'><div id='event-table' class='events' data-toggle=\"table\" data-pagination=\"true\"><div class=\"event-items\"></div></div></div>");
        }
        else if (mode === 'table-edit'){
            ruleelement.append("<div class='table-responsive'><table id='event-table' class='events table' data-toggle=\"table\" data-pagination=\"true\"><thead><tr><th style='width: 150px;'>Datum</th><th aria-label='status'></th></th><th>Titel</th><th aria-label='edit' style='width: 30px;'></th></tr></thead><tbody></tbody></table></div>");
        }
        else if (mode === 'widget'){
            ruleelement.append("<div class=\"event-widget\"><div class=\"row\"></div></div>");
        }
        else if (mode === 'topevent'){
            ruleelement.append("<div class=\"event-col\"></div>");
        }
        else if (mode === 'highlights'){
            ruleelement.append("<div class=\"event-col\"></div>");
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


            //Listenelemente abhängig vom eingestellten mode
            if (mode === 'list') {
                element.find('.event-list').append('<li><time datetime="' + itemDate + '"><span class="weekday">' + itemWeekdayLong + '</span><span class="day">' + itemDay + '</span><span class="month">' + itemMonthShort +'</span><span class="year">' + itemYear + '</span></time><div class="info"><div class="kicker">' + item.category + '</div><h2 class="title">' + item.title + '</h2><p class="desc">Uhrzeit: ' + item.eventdate.getUTCHours() + ':' + (item.eventdate.getMinutes() < 10 ? '0' : '') + item.eventdate.getMinutes() + '</p><p class="desc">Zeitraum: ' + itemStartDate + itemEndDate +'</p></div></li>');
            }
            else if (mode === 'grid'){
                element.find('.row').append(' <div class="col-12 col-sm-6"><article class="card"><section class="date"><time datetime="' + itemDate + '"><span>' + itemDay + '</span><span>' + itemMonthShort +'</span></time></section><section class="card-cont"><small>' + item.category + '</small><div class="event-series">' + item.series + '</div><h3>' + item.title + '</h3><div class="even-date"><time>' + itemWeekdayLong + ', '+ itemDay + '.' + itemMonthNumeric + '.' + itemYear + ' - Uhrzeit: ' + itemHour + ':' + itemMinutes + '</time></div><div class="even-info"></div><a href="#">tickets</a></section></article></div>');
            }
            else if (mode === 'tiles'){
                element.find('.row').append(' <div class="col-12 col-sm-4"><div class="tiles-event-day smallertext">' + itemWeekdayLong + '</div><div class="tiles-event-date">' + DateTime.fromJSDate(itemDate).setLocale(lang).toFormat('dd. MMMM yyyy') + '</div></div>');
            }
            else if (mode === 'table'){
                element.find('tbody').append('<tr class="showcontent" data-tags="' + item.category.id + '"><td><div class="smallertext">' + itemWeekdayLong + '</div><div class="event-date">' + DateTime.fromJSDate(itemDate).setLocale(lang).toFormat('dd. MMM \´yy') + '</div></td><td class="canceled_bg canceled' + item.canceled + '"><div class="canceled">' + `${item.canceled ? '<span>Abgesagt</span>' : ''}` + '</div></td><td><a href="' + item.seriesurl + '" class="series">' + item.series + '</a><span class="event-title">' + item.title + '</span><div><span class="event-location">' + item.location + '</span></div></td><td><a href="' + item.url + '" class="more-link">Details</a>' + `${item.ticketurl ? '<a href="' + item.ticketurl + '" class="more-link">Tickets</a>' : ''}` + '</td></tr>');
            }
            else if (mode === 'table-dashboard'){
                element.find('.table-body').append(
                    '<div class="d-flex event-item showcontent" data-tags="' + item.category.id + '">' +
                    '   <a class="simple-ajax-popup event-link d-flex col" href="event_detail.php">' +
                    '       <div class="col-date">' +
                    '           <div>' + DateTime.fromJSDate(itemDate).setLocale(lang).toFormat('dd. MMM \yyyy') + '</div>' +
                    '           <div>' + `${item.timeValid ? '<time>' + itemHour + ':' + itemMinutes + ' Uhr</time>' : ''}` + '</div>' +
                    '       </div>' +
                    '       <div class="d-flex flex-fill">\n' +
                    '           <div class="col-title">' + item.title + '</div>\n' +
                    '           <div class="col-location">' + item.location + '</div>\n' +
                    '       </div>' +
                    '   </a>' +
                    '</div>'
                );
            }
            else if (mode === 'flextable'){
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
            else if (mode === 'table-edit'){
                element.find('tbody').append('<tr class="showcontent" data-tags="' + item.category.id + '"><td><div class="smallertext">' + itemWeekdayLong + '</div><div class="event-date">' + DateTime.fromJSDate(itemDate).setLocale(lang).toFormat('dd. MMM \´yy') + '</div></td><td class="canceled_bg canceled' + item.canceled + '"><div class="canceled">' + `${item.canceled ? '<span>Abgesagt</span>' : ''}` + '</div></td><td><a href="' + item.seriesurl + '" class="series">' + item.series + '</a><span class="event-title">' + item.title + '</span><div><span class="event-location">' + item.location + '</span></div></td><td><a href="' + item.url + '" style="text-decoration: none;">✎</a>' + `${item.ticketurl ? '<a href="' + item.ticketurl + '" class="more-link">Tickets</a>' : ''}` + '</td></tr>');
            }
            else if (mode === 'aalenevent'){
                element.find('.slick-events').append('              <div>\n' +
                    '                <a href="#">\n' +
                    '                  <div class="event-date">' + itemWeekdayShort + ' ' + itemDay + '. ' + itemMonthShort + ' </div>\n' +
                    '                  <img\n' +
                    ' src="' + item.image.thumb_200px +'"\n' +
                    ' class="lazyload img-responsive"\n' +
                    ' title="' + item.image.titleTag + '"\n' +
                    ' alt="' + item.image.altTag + '"\n' +
                    ' data-sizes="auto"\n' +
                    ' data-srcset="' + item.image.thumb_200px +' 200w,\n' +
                    ' ' + item.image.thumb_200px +' 250w,\n' +
                    ' ' + item.image.thumb_300px +' 300w,\n' +
                    ' ' + item.image.thumb_350px +' 350w,\n' +
                    ' ' + item.image.thumb_365px +' 365w,\n' +
                    ' ' + item.image.thumb_500px +' 500w" />\n' +
                    '                  <div class="slider-overlay">\n' +
                    '                    <div class="btn-overlay"><img src="/mandanten/global/i/chevron_circle_up_bg.png" /></div>\n' +
                    '                    <div class="headline">' + item.title + '</div>\n' +
                    '                    <div class="slider-caption">\n' +
                    '                        <p>\n' +
                    '                          19.30 bis 22.00 Uhr<br />\n' +
                    '                          Schloss Wasseralfingen\n' +
                    '                        </p>\n' +
                    '                    </div>\n' +
                    '                  </div>\n' +
                    '                </a>\n' +
                    '              </div>');
            }
            else if (mode === 'widget'){
                var compareStart = DateTime.fromJSDate(item.startdate, {zone:'UTC'}).toFormat('DD');
                var compareEnd = DateTime.fromJSDate(item.enddate, {zone:'UTC'}).toFormat('DD');
                element.find('.event-widget').append('            <div class="col-12 col-sm-4">\n' +
                    '                <a href="' + item.url +'" class="event-item">\n' +
                    '                    <div class="event-image">\n' +
                    '                  <img\n' +
                    ' src="' + item.image.thumb_200px +'"\n' +
                    ' class="lazyload img-responsive"\n' +
                    ' title="' + item.image.titleTag + '"\n' +
                    ' alt="' + item.image.altTag + '"\n' +
                    ' data-sizes="auto"\n' +
                    ' data-srcset="' + item.image.thumb_200px +' 200w,\n' +
                    ' ' + item.image.thumb_200px +' 250w,\n' +
                    ' ' + item.image.thumb_300px +' 300w,\n' +
                    ' ' + item.image.thumb_350px +' 350w,\n' +
                    ' ' + item.image.thumb_365px +' 365w,\n' +
                    ' ' + item.image.thumb_500px +' 500w" />\n' +
                    '                        <div class="event-date">\n' +
                    '                            <div class="event-date__day">' + DateTime.fromJSDate(itemDate).setLocale(lang).toFormat('cccc') + '</div>\n' +
                    '                            <div class="event-date__date">' + DateTime.fromJSDate(itemDate).setLocale(lang).toFormat('dd. MMM') + '</div>\n' +
                    '                        </div>\n' +
                    '                    </div>\n' +
                    '                    <div class="event-text">\n' +
                    '                        <div class="event-kicker">\n' +
                    item.category + ' ' + `${(item.series && item.category) ? ' | ' : ''}` + ' ' + item.series +
                    '                        </div>\n' +
                    '                        <div class="event-title">\n' +
                    '                            ' + item.title + '\n' +
                    '                        </div>\n' +
                    '                        <div class="event-info' + `${item.canceled ? ' canceled' : ''}` + '">\n' +
                    '                            ' + `${item.canceled ? 'Abgesagt' : ''}` + ' ' + DateTime.fromJSDate(item.startdate).setLocale(lang).toFormat('dd. MMM') +  `${(compareStart === compareEnd) ? ' ' : ' - ' + DateTime.fromJSDate(item.enddate).setLocale(lang).toFormat('dd. MMM')}` + ', ' + itemHour + ':' + itemMinutes + ' Uhr' +
                    '                        </div>\n' +
                    '\n' +
                    '                    </div>\n' +
                    '                </a>\n' +
                    '            </div>');
            }
            else if (mode === 'topevent'){
                var compareStart = DateTime.fromJSDate(item.startdate, {zone:'UTC'}).toFormat('DD');
                var compareEnd = DateTime.fromJSDate(item.enddate, {zone:'UTC'}).toFormat('DD');
                element.find('.event-col').append('<a href="' + item.url +'" class="event-item top-event">\n' +
                    '                        <div class="row">\n' +
                    '                            <div class="col-12 col-md-5 col-lg-12">\n' +
                    '                                <div class="event-image">\n' +
                    '                                    <div class="ratio_topevent">\n' +
                    '                                        <div class="focuspoint"\n' + item.image.focuspoint_data + '>\n' +
                    '                                            <img\n' +
                    '                                             src="' + item.image.thumb_100px +'"\n' +
                    '                                             class="lazyload img-responsive"\n' +
                    '                                             title="' + item.image.titleTag + '"\n' +
                    '                                             alt="' + item.image.altTag + '"\n' +
                    '                                             data-sizes="auto"\n' +
                    '                                             data-srcset="' + item.image.thumb_100px +' 100w,\n' +
                    ' ' + item.image.thumb_300px +' 300w,\n' +
                    ' ' + item.image.thumb_450px +' 450w,\n' +
                    ' ' + item.image.thumb_600px +' 600w,\n' +
                    ' ' + item.image.thumb_920px +' 920w,\n' +
                    ' ' + item.image.thumb_1230px +' 1230w" />\n' +
                    '                                        </div>\n' +
                    '                                    </div>\n' +
                    '                                    <div class="event-date">\n' +
                    '                                      <div class="event-date__day">' + DateTime.fromJSDate(itemDate).setLocale(lang).toFormat('cccc') + '</div>\n' +
                    '                                      <div class="event-date__date">' + DateTime.fromJSDate(itemDate).setLocale(lang).toFormat('dd. MM') + '</div>\n' +
                    '                                    </div>\n' +
                    '                                </div>\n' +
                    '                            </div>\n' +
                    '                            <div class="col-12 col-md-7 col-lg-12 topevent-overlay">\n' +
                    '                                <div class="event-text">\n' +
                    '                                    <div class="event-kicker">\n' +
                    item.category.title + ' ' + `${(item.series && item.category.title) ? ' | ' : ''}` + ' ' + item.series +
                    '                                   </div>\n' +
                    '                                    <div class="event-title">\n' +
                    '                                     ' + item.title + '\n' +
                    '                                    </div>\n' +
                    '                                    <div class="event-info' + `${item.canceled ? ' canceled' : ''}` + '">\n' +
                    '                                     ' + `${item.canceled ? 'Abgesagt' : ''}` + ' ' + DateTime.fromJSDate(item.startdate).setLocale(lang).toFormat('dd. MMM') +  `${(compareStart === compareEnd) ? ' ' : ' - ' + DateTime.fromJSDate(item.enddate).setLocale(lang).toFormat('dd. MMM')}` + ',<br /> ' + `${item.timeValid ?  + itemHour + ':' + itemMinutes + ' Uhr' : ''}` +
                    '                                    </div>\n' +
                    '\n' +
                    '                                </div>\n' +
                    '                            </div>\n' +
                    '                        </div>\n' +
                    '                    </a>');
                $('.focuspoint').focusPoint();
            }
            else if (mode === 'highlights'){
                var compareStart = DateTime.fromJSDate(item.startdate, {zone:'UTC'}).toFormat('DD');
                var compareEnd = DateTime.fromJSDate(item.enddate, {zone:'UTC'}).toFormat('DD');
                element.find('.event-col').append('<a href="' + item.url +'" class="event-item">\n' +
                    '                        <div class="row">\n' +
                    '                            <div class="col-12 col-md-5 col-lg-12 col-xl-5">\n' +
                    '                                <div class="event-image">\n' +
                    '                                    <div class="ratio_events">\n' +
                    '                                        <div class="focuspoint"\n' + item.image.focuspoint_data + '>\n' +
                    '                                            <img\n' +
                    '                                             src="' + item.image.thumb_100px +'"\n' +
                    '                                             class="lazyload img-responsive"\n' +
                    '                                             title="' + item.image.titleTag + '"\n' +
                    '                                             alt="' + item.image.altTag + '"\n' +
                    '                                             data-sizes="auto"\n' +
                    '                                             data-srcset="' + item.image.thumb_100px +' 100w,\n' +
                    ' ' + item.image.thumb_300px +' 300w,\n' +
                    ' ' + item.image.thumb_450px +' 450w,\n' +
                    ' ' + item.image.thumb_600px +' 600w,\n' +
                    ' ' + item.image.thumb_920px +' 920w,\n' +
                    ' ' + item.image.thumb_1230px +' 1230w" />\n' +
                    '                                        </div>\n' +
                    '                                    </div>\n' +
                    '                                    <div class="event-date">\n' +
                    '                                      <div class="event-date__day d-md-none d-lg-block d-xl-none d-xxl-none">' + DateTime.fromJSDate(itemDate).setLocale(lang).toFormat('cccc') + '</div>\n' +
                    '                                      <div class="event-date__date">' + DateTime.fromJSDate(itemDate).setLocale(lang).toFormat('dd. MM') + '</div>\n' +
                    '                                    </div>\n' +
                    '                                </div>\n' +
                    '                            </div>\n' +
                    '                            <div class="col-12 col-md-7">\n' +
                    '                                <div class="event-text">\n' +
                    '                                    <div class="event-kicker">\n' +
                    item.category.title + ' ' + `${(item.series && item.category.title) ? ' | ' : ''}` + ' ' + item.series +
                    '                                   </div>\n' +
                    '                                    <div class="event-title">\n' +
                    '                                     ' + item.title + '\n' +
                    '                                    </div>\n' +
                    '                                    <div class="event-info' + `${item.canceled ? ' canceled' : ''}` + '">\n' +
                    '                                     ' + `${item.canceled ? 'Abgesagt' : ''}` + ' ' + DateTime.fromJSDate(item.startdate).setLocale(lang).toFormat('dd. MMM') +  `${(compareStart === compareEnd) ? ' ' : ' - ' + DateTime.fromJSDate(item.enddate).setLocale(lang).toFormat('dd. MMM')}` + ',<br /> ' + `${item.timeValid ?  + itemHour + ':' + itemMinutes + ' Uhr' : ''}` +
                    '                                    </div>\n' +
                    '\n' +
                    '                                </div>\n' +
                    '                            </div>\n' +
                    '                        </div>\n' +
                    '                    </a>');
                $('.focuspoint').focusPoint();
            }
            else {
                element.append('<div>' + itemWeekdayShort + ' - ' + item.id + ' - ' + 'Datum: ' + itemDay + '.' + itemMonthNumeric + '.' + itemYear + ' Uhrzeit: ' + itemHour + ':' + itemMinutes + ' - ' + item.title + '</div>');
            }
        })

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

        initPagination();
    }
    onlyonce();

    //clear vars
    count = '';
    mode = '';
    sliceStart = '';
    sliceEnd = '';
    allEvents = [];
    allEventsResult = [];
}



//Contentfilter
var showClass = 'showcontent';
function contentfiltervalue(filterValue){
    $('[data-tags]').each(function() {
        var tags = $(this).attr('data-tags');
        var tofilter = Array();
        var valid = false;

        if (tags) {
            //alert("Tags: " + tags);
            tofilter = tags.split(',');
            //alert("tofilter1: " + tofilter);
        } else {
            tofilter.push($(this).html());
            // settings.subString = true;
            //alert("tofilter2: " + tofilter);
        }

        tofilter = tofilter.map(v => v.toLowerCase());

        findCommonElement(tofilter,filterValue);
        //alert(valid);

        function findCommonElement(array1, array2) {
            // Loop for array1
            for(let i = 0; i < array1.length; i++) {
                // Loop for array2
                for(let j = 0; j < array2.length; j++) {
                    // Compare the element of each and
                    // every element from both of the
                    // arrays
                    //alert ("Array1:" + array1[i]);
                    //alert ("Array2:" + array2[j]);
                    if(array1[i] == array2[j]) {
                        // Return if common element found
                        valid = true;
                        //alert("valid" + valid);
                        return valid;
                    }
                }
            }
            // Return if no common element exist
            return false;
        }
        if (valid) {
            $(this).addClass(showClass);
        } else {
            $(this).removeClass(showClass);
        }
    });
    //Keine Treffer
    if(($('#event-table .showcontent').length)==0){
        $('#data-container').hide();
        $('.service-messages').html("Keine Treffer");
    }
    else{
        $('#data-container').show();
        $('.service-messages').html("");
    }
}

function eventfilter() {
    var filterValueArray = $('.category.active').map(function() {
        return [$.map($(this).data(), function(v) {
            return v;
        })];
    }).get();

    //alert(filterValueArray);
    if (filterValueArray!='') {
        contentfiltervalue(filterValueArray);
        initPagination();
    }
    else {
        // $("#event-table tr.showcontent").removeClass('showme');
        $("#event-table .event-item.showcontent").removeClass('showme');
        $('[data-tags]').addClass(showClass);
        initPagination();
        $('#data-container').show();
        $('.service-messages').html("");
        //No hits for selected date-range?
        if(($('#event-table .showcontent').length)==0){
            $('#data-container').hide();
            $('.service-messages').html("Keine Treffer");
        }
    }
}

//Angeklickten Content-Filter aktivieren und Filterung (eventfilter) ausführen
function contentfilter( options ) {
    $('[data-filter]').on('click', function() {
        $(this).toggleClass('active');
        eventfilter();
    });
}

//Flatpickr for date-range-field
const flatpickrRange = $(".flatpickr-range").flatpickr({
    mode: "range",
    locale: "de",
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "d.m.Y",
    onClose: function(selectedDates, dateStr, instance,events,allEvents) {
        // $('.rruleset').attr('data-slice-start',selectedDates[0]);
        // $('.rruleset').attr('data-slice-end',selectedDates[1]);
        // alert("onclose");
        if(selectedDates!=='') {
            $('.rruleset').attr('data-slice-start', formatDate(selectedDates[0]));
            $('.rruleset').attr('data-slice-end', formatDate(selectedDates[1]));
            $('.rruleset').data('slice-start', formatDate(selectedDates[0]));
            $('.rruleset').data('slice-end', formatDate(selectedDates[1]));
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

//Click on more-filters to show all filter-buttons
$(".more-filters").on('click', function(){
    $(this).hide();
    $('.event-categories').css('height', 'auto');
    $('.event-categories button').removeClass('hide');
});

//Reset Event Filter
$(".event-categories .category-reset").on('click', function(){
    $('#data-container').show();
    $('.service-messages').html("");
    $('.event-filters #searchval').val('');
    $('.event-categories button').removeClass('active');
    flatpickrRange.clear();

    $(".clear").removeClass("show");
    var url = apiurl;
    setTimeout(
        function()
        {
            initCalendar(url, $('.rruleset'));
        }, 500);
});

//Show ClearButton for Search-Feld if searchval contains characters
$(".event-filters #searchval").after('<span class="clearspace"><img src="/public/assets/global/img/icon_event_close.svg" class="clear" title="clear" /></span>');
$(".event-filters #searchval").on('keyup input',function(){
    if ($(this).val()) {
        $(".clear").addClass("show");
    } else {
        $(".clear").removeClass("show");
    }
});

//Clear Searchfield if clear-button is clicked
$('.clear').on('click', function(){
    $('.event-filters #searchval').val('');
    $(".clear").removeClass("show");
    var url = apiurl + eventSearchField.val() ;
    initCalendar(url, $('.rruleset'));
});

//Searchval-Field: if char>3 in searchfield - get new events from api
eventSearchField.keyup(function(){
    if(eventSearchField.val().length >= 3){
        var url = apiurl + "?search=" + eventSearchField.val() ;
        initCalendar(url, $('.rruleset'));
    }
    else if(eventSearchField.val().length == 0){
        var url = apiurl + eventSearchField.val() ;
        initCalendar(url, $('.rruleset'));
    }
});

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
            buildrruleset(thisobj);
            //Filter berücksichtigen
            eventfilter();
        }
    });
}


$(document).ready(function(){
    $('.rruleset').each(function (){
        var url;
        var eventId;
        var seriesId;

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
        contentfilter();
    });
});