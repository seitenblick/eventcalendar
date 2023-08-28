

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




//Recurrency-Funktion - alle Termine gemäß der Wiederholungsregeln im angegebenen Zeitraum (sliceStart, sliceEnd) erzeugen
function recurrency(sliceStart, sliceEnd, noduplicates) {
    events.forEach(function (item, index) {
        const id            = item.id;
        const url           = item.url;
        const title         = item.title;
        const image         = item.image;
        const category      = item.category;
        const categories    = item.categories;
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
        const organiser     = item.organiser;
        const status        = item.status;
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
                categories: categories,
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
                organiser: organiser,
                status: status,
            });
        }

        // Remove noduplicates if data-noduplicates is false (for example: no multiple events for highlight-teaser)
        if ( noduplicates ) {
            var allEventsReversed = allEvents.slice(0).reverse();
            allEvents = [...new Map(allEventsReversed.map((m) => [m.id, m])).values()];
            //https://www.javascripttutorial.net/array/javascript-remove-noduplicates-from-array/
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


    //Keine Treffer
    if(allEventsResult==''){
        $('#data-container').hide();
        $('.service-messages').html("Aktuell keine Veranstaltung.");
        // $('#pagination').hide();
    }
    else{
        $('#data-container').show();
        $('#pagination').show();
        $('.service-messages').html("");

        /*Ausgabe*/








        initPagination();
    }
    onlyonce();

    //clear vars
    count = '';
    // pagecount = '';
    mode = '';
    noduplicates = '';
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
        $('.service-messages').html("Keine passende Veranstaltung gefunden.");
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
            $('.service-messages').html("Keine passende Veranstaltung gefunden.");
        }
    }
}

//Angeklickten Content-Filter aktivieren und Filterung (eventfilter) ausführen
function contentfilter( options ) {
    $('[data-filter]').on('click', function() {
        $(this).toggleClass('active');


        if ($(this).attr("aria-checked") === "true") {
            $(this).attr("aria-checked", "false");
        } else {
            $(this).attr("aria-checked", "true");
        }

        eventfilter();
    });
}

$(document).ready(function(){











//Reset Event Filter
    $(".event-categories .category-reset").on('click', function(){
        $('#data-container').show();
        $('.service-messages').html("");
        $('.event-filters #searchval').val('');
        $('.event-categories button').removeClass('active');
        $('.event-categories .category').attr("aria-checked", "false");
        $('.district-group select option').prop('selected', function() {
            return this.defaultSelected;
        });
        flatpickrRange.clear();

        $(".searchval-group .clear").removeClass("show");
        var url = apiurl;
        if ($(this).closest('.event-filters').next('.break').find('.rruleset').data('mandator')){
            var mandatorId = $(this).closest('.event-filters').next('.break').find('.rruleset').data('mandator');
            url = apiurl + '?md=' + mandatorId;
        }
        setTimeout(
            function()
            {
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
    //     apiurl = apiurl + '?md=' + mandatorId;
    var url = new URL(apiurl);

    eventSearchField.keyup(delay(function(){
        var mandatorId = $('.rruleset').data('mandator');
        url = new URL(apiurl + '?md=' + mandatorId);
        if(eventSearchField.val().length >= 3){
            url.searchParams.set('search', eventSearchField.val());
        }
        else if(eventSearchField.val().length == 0){
            url.searchParams.delete('search');
        }
        initCalendar(url, $('.rruleset'));
    },500));
//district filter
    districtSelect.on('change', function() {
        url.searchParams.set('di', this.value );
        initCalendar(url, $('.rruleset'));
    });

//Clear Searchfield if clear-button is clicked
    $('.searchval-group .clear').on('click', function(){
        $('.event-filters #searchval').val('');
        $(".searchval-group .clear").removeClass("show");
        url.searchParams.delete('search');
        initCalendar(url, $('.rruleset'));
    });

//Clear Flatpickr if clear-button is clicked
    $('.flatpickr-group .clear').on('click', function(){
        flatpickrRange.clear();
        initCalendar(url, $('.rruleset'));
    });

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
            $('.service-messages').html("Aktuell keine Veranstaltung.");
            $('.event-slider-new').hide(); //bei Aalen Startseite VA-Block ausblenden,
        }
        else{
            $('#data-container').show();
            $('.service-messages').html("");
            //Termine erzeugen und darstellen
            buildrruleset(thisobj);
            //Filter berücksichtigen
            eventfilter();
            /** Ausgabe für Datatable für VA-Export **/
            if($('.rruleset').data('mode') === 'datatable'){

                $('#data-table').DataTable({
                    // dom: 'Blfrtip',
                    // buttons: [
                    //     'excel'
                    // ],
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
            /** Ende Ausgabe für Datatable VA-Export**/
        }
    });
}


$(document).ready(function(){
    $('.rruleset').each(function (){
        var url;
        var eventId;
        var seriesId;
        var mandatorId;
        var org;
        var ven;

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
        else if ($(this).data('event-id')){
            eventId = $(this).data('event-id');
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
        //only events of mandator
        else if ($(this).data('mandator')){
            mandatorId = $(this).data('mandator');
            url = apiurl + '?md=' + mandatorId;
        }
        //only events of organizer
        else if ($(this).data('org')){
            org = $(this).data('org');
            url = apiurl + '?org=' + org;
        }
        //only events of venue (VA-Ort)
        else if ($(this).data('ven')){
            ven = $(this).data('ven');
            url = apiurl + '?ven=' + ven;
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