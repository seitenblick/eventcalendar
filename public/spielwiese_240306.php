<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Eventcalendar</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.7/handlebars.min.js" integrity="sha512-RNLkV3d+aLtfcpEyFG8jRbnWHxUqVZozacROI4J2F1sTaDqo1dPQYs01OMi1t1w9Y2FdbSCDSQ2ZVdAC8bzgAg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="assets/js/handlebarsTemplates/hbstemplates.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
    <script src="assets/js/events_v2.js"></script>
    <!-- Styles -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <link rel="stylesheet" href="assets/css/events.css">
    <style>
        .rruleset {
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
<div class="container-fluid">
    <h1>Spielwiese</h1>
    <div id="eventList"></div>
    <!--<script id="event-table-template" type="text/x-handlebars-template">-->
    <script type="text/handlebar-template" id="event-table-template">
        <table id="event-table" class="ap1">
        {{#each item}}
            <tr class="event-item showcontent ap1"><td>{{series}} {{#if series}}-{{/if}} {{title}} - {{eventdate}}</td></tr>
        {{/each}}
        </table>
    <!--    <ol>-->
    <!--        {{#each quotes}}-->
    <!--        <li>{{quote}}</li>-->
    <!--        {{/each}}-->
    <!--    </ol>-->
    </script>

    <div class="event-filters">
        <a class="more-filters">+ mehr anzeigen</a>
        <div class="mb-10">
            <div class="event-categories">
                <button class="category-reset" <?php /*data-filter=""*/ ?>>Alle</button>
                <button class="category" data-filter="168400">Konzert</button>
                <button class="category" data-filter="168404">Sport</button>
                <button class="category" data-filter="168402">Theater</button>
                <button class="category" data-filter="168408">Ausstellung</button>
                <button class="category" data-filter="168399">Lesung</button>
                <button class="category" data-filter="168401">Markt</button>
                <button class="category" data-filter="168403">Sitzung</button>
                <button class="category" data-filter="168410">Fachtagung</button>
                <button class="category" data-filter="168411">Klimaschutz</button>
                <button class="category" data-filter="168412">Kulturveranstaltung</button>
                <button class="category" data-filter="168409">Sonderveranstaltung</button>
            </div>
        </div>
        <div class="break">
            <div class="filter-group">
                <div class="searchval-group">
                    <input type="text" value="" id="searchval" name="search" placeholder="Suchbegriff" class="form-control">
                </div>
                <div class="flatpickr-group">
                    <input class="flatpickr-range form-control" type="text" placeholder="Datum auswählen.." data-id="range">
                </div>
            </div>
        </div>
    </div>


    <div class="rruleset" data-slice-start="" data-slice-end="" data-mode="simpleTable" data-event-id="" data-series-id="" data-count="" data-mandator="168407" data-url="<?php /* https://eventcalendar.ap.seitenblick.com/json/EventApiRules.php.json */ ?>"></div>
</div>



<ul id="pagination" class="pagination"></ul>

<div id="templates" style="display: none;"></div>

<!-- Scripts -->
<!--<script src="assets/js/events.js"></script>-->


</body>
</html>