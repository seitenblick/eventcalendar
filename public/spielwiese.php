<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Eventcalendar</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.7/handlebars.min.js"
            integrity="sha512-RNLkV3d+aLtfcpEyFG8jRbnWHxUqVZozacROI4J2F1sTaDqo1dPQYs01OMi1t1w9Y2FdbSCDSQ2ZVdAC8bzgAg=="
            crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="assets/js/handlebarsTemplates/hbstemplates.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
            crossorigin="anonymous"></script>
<!--    <script src="assets/js/events_v2_new.js"></script>-->
<!--    <script src="assets/js/events_v2.js"></script>-->
    <script src="assets/js/events_rebuild.js"></script>
    <!-- Styles -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <link rel="stylesheet" href="assets/css/events.css">
<!--    <link rel="stylesheet" href="assets/css/extern/dashboard.css">-->
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
        <a class="more-filters">+ mehr anzeigen</a>
        <div class="mb-10">
            <div class="event-categories">
                <button class="category-reset" data-filter="" aria-label="Alle Filter zurücksetzen">Alle</button>
                <button class="category" data-filter="177563" aria-checked="false" role="switch">Vorträge</button>
                <button class="category" data-filter="180469" aria-checked="false" role="switch">Vereine</button>
                <button class="category" data-filter="168402" aria-checked="false" role="switch">Theater</button>
                <button class="category" data-filter="180470" aria-checked="false" role="switch">Stadtführungen</button>
                <button class="category" data-filter="168404" aria-checked="false" role="switch">Sport</button>
                <button class="category" data-filter="168409" aria-checked="false" role="switch">Sonderveranstaltungen</button>
                <button class="category" data-filter="177562" aria-checked="false" role="switch">Museen und Ausstellungen</button>
                <button class="category" data-filter="180467" aria-checked="false" role="switch">Messen</button>
                <button class="category" data-filter="168399" aria-checked="false" role="switch">Literatur</button>
                <button class="category" data-filter="168400" aria-checked="false" role="switch">Konzerte</button>
                <button class="category" data-filter="210449" aria-checked="false" role="switch">Kinder und Jugend</button>
                <button class="category" data-filter="180466" aria-checked="false" role="switch">Gremien</button>
            </div>
        </div>
        <div class="break">
            <div class="filter-group">
                <div class="searchval-group">
                    <input type="text" value="" id="searchval" name="search" placeholder="Suchbegriff"
                           class="form-control">
                </div>
                <div class="district-group">
                    <select class="form-select" id="districtval">
                        <option value="">Mandaten/Kalender</option>
                        <option value="25">Aalen.de</option>
                        <option value="260">Dewangen</option>
                        <option value="261">Ebnat</option>
                        <option value="262">Fachsenfeld</option>
                        <option value="263">Hofen</option>
                        <option value="168407">Kultur</option>
                        <option value="242">Stadtbibliothek</option>
                        <option value="264">Unterkochen</option>
                        <option value="265">Unterrombach - Hofherrnweiler</option>
                        <option value="266">Waldhausen</option>
                        <option value="267">Wasseralfingen</option>
                    </select>
                </div>
                <div class="flatpickr-group">
                    <input class="flatpickr-range form-control" type="text" placeholder="Datum auswählen.."
                           data-id="range">
                </div>
            </div>
        </div>
    </div>
    <div class="service-messages"></div>
    <div class="rruleset" data-slice-start="" data-slice-end="" data-mode="flexTable" data-event-id=""
         data-series-id="" data-count="" data-mandator=""
         data-url="<?php /* https://eventcalendar.ap.seitenblick.com/json/EventApiRules.php.json */ ?>"></div>
</div>

<ul id="pagination" class="pagination"></ul>


</body>
</html>