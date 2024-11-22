<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Eventcalendar</title>
<!--    <script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.7/handlebars.min.js"-->
<!--            integrity="sha512-RNLkV3d+aLtfcpEyFG8jRbnWHxUqVZozacROI4J2F1sTaDqo1dPQYs01OMi1t1w9Y2FdbSCDSQ2ZVdAC8bzgAg=="-->
<!--            crossorigin="anonymous" referrerpolicy="no-referrer"></script>-->

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
            crossorigin="anonymous"></script>

    <script src="assets/js/eventCalendar.js" defer></script>
    <script src="assets/js/handlebarsTemplates/hbstemplates.js" defer></script>
    <!-- Styles -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <link rel="stylesheet" href="assets/css/events.css">
    <link rel="stylesheet" href="assets/css/extern/dashboard.css">
    <style>
        .rruleset {
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
<div class="container-fluid">
    <h1>Kalender</h1>

    <div class="event-filters">
        <a class="more-filters" style="">+ mehr anzeigen</a>
        <div class="mb-3">
            <div class="event-categories">
                <button type="button" class="category-reset badge rounded-pill" data-filter="">Alle</button>
                <button type="button" class="category badge rounded-pill" data-filter="180466">Gremien</button>
                <button type="button" class="category badge rounded-pill" data-filter="210449">Kinder und Jugend</button>
                <button type="button" class="category badge rounded-pill" data-filter="168400">Konzerte</button>
                <button type="button" class="category badge rounded-pill" data-filter="168399">Literatur</button>
                <button type="button" class="category badge rounded-pill" data-filter="180467">Messen</button>
                <button type="button" class="category badge rounded-pill" data-filter="177562">Museen und Ausstellungen</button>
                <button type="button" class="category badge rounded-pill" data-filter="168409">Sonderveranstaltungen</button>
                <button type="button" class="category badge rounded-pill" data-filter="168404">Sport</button>
                <button type="button" class="category badge rounded-pill" data-filter="180470">Stadtführungen</button>
                <button type="button" class="category badge rounded-pill" data-filter="168402">Theater</button>
                <button type="button" class="category badge rounded-pill" data-filter="180469">Vereine</button>
                <button type="button" class="category badge rounded-pill" data-filter="177563">Vorträge</button>
            </div>
        </div>
        <div class="mb-4">
            <div class="filter-group d-flex flex-wrap">
                <div class="searchval-group">
                    <input type="text" value="" id="searchval" name="search" placeholder="Suchbegriff" class="form-control"></span>
                </div>
                <div class="district-group">
                    <select class="form-select" id="districtval">
                        <option value="">Ortschaft</option>
                        <option value="209593">Aalen.de</option>
                        <option value="183547">Dewangen</option>
                        <option value="183548">Ebnat</option>
                        <option value="183549">Fachsenfeld</option>
                        <option value="183550">Hofen</option>
                        <option value="209592">Kultur</option>
                        <option value="209594">Stadtbibliothek</option>
                        <option value="183551">Unterkochen</option>
                        <option value="183552">Unterrombach - Hofherrnweiler</option>
                        <option value="183554">Waldhausen</option>
                        <option value="183553">Wasseralfingen</option>
                    </select>
                </div>
                <div class="flatpickr-group">
                    <input class="flatpickr-range form-control input" placeholder="Datum auswählen.." tabindex="0" type="text" readonly="readonly">
                </div>
            </div>
        </div>
    </div>
    <div class="service-messages"></div>
    <div class="rruleset" data-slice-start="" data-slice-end="" data-mode="table-dashboard" data-event-id=""
         data-series-id="" data-count="" data-mandator=""
         data-url="https://www.aalen.de/api/EventApiRules.php"
         data-json-url="https://eventcalendar.seitenblick.com/json/EventApiRulesTest.php.json"></div>

</div>

<ul id="pagination" class="pagination"></ul>


</body>
</html>