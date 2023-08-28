import $ from './lib/jquery';
import {DateTime} from 'luxon';
import {RRule, RRuleSet} from 'rrule';

// var nunjucks = require('nunjucks');
var Mustache = require('mustache');
var lang            = $('html').attr('lang'); //Language for localization
var defaultDates    = []; //Alle Events für flatpickr z.B. ["2021-08-04", "2021-08-06", "2021-08-07"]

let allEvents       = []; //Array with all rendered events
let allEventsResult = []; //Array with calculated events

//Helper-Funktionen
function stringToDate(value) {
    // Convert string '2014-02-11T11:30:30' to date:
    var dt = DateTime.fromISO(value); //=> Tue Feb 11 2014 11:30:30
    return new Date(Date.UTC(dt.year, dt.month - 1, dt.day, dt.hour, dt.minute, dt.second));
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
                // this.events = data;
                //Wiederkehrende Termine
                var finalresult = this.recurrency(this.sliceStart, this.sliceEnd, data, this.count);
                //Ausgabe
                console.log("Und jetzt die Ausgabe");
                alert(finalresult);

                /*Ausgabe*/
                //List-Wrapper
                var mode = this.mode;
                var ruleelement = this.obj;

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


//                 var products = Object.keys(allEventsResult).map(function (k) { return this[k] }, allEventsResult);
// console.log(products);
//
//                 $("#templates").load("views/items.html #event-widget",function(){
//                     var template = document.getElementById('event-widget').innerHTML;
//                     var output = Mustache.render(template, { products: products });
//                     $("#test").html(output);
//                 });


                //this.outputCal(allEventsResult);
                //return data;
            });
            // loadJSON().done(function (output) {
            //    events =  $.parseJSON(output);
            // });
        }
        recurrency(sliceStart, sliceEnd, events, count) {
            events.forEach(function (item, index) {
                var eventitem = new Event(item.startDate, item.endDate, item.title, item.rule, item.eventId, item.category, item.exdates, item.image, item.series, item.seriesUrl, item.canceled,item.ticketUrl, item.location, item.url, item.timeValid );
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
            return allEventsResult;
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