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
<!--    <script src="assets/js/events_v2_new.js"></script>-->
<!--    <script src="assets/js/events_v2.js"></script>-->
<!--    <script src="assets/js/events_rebuild.js"></script>-->
    <script src="assets/js/eventCalendar.js"></script>
    <script src="assets/js/handlebarsTemplates/hbstemplates.js"></script>
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
    <h1>Kalender-Detail</h1>

    <div class="section module-next-events">
        <div class="container">
            <div class="row">
                <div class="col-12 col-lg-6 mx-auto">
                    <div class="break mb-0 text-center">
                        <div id="collapseAllEvents" class="collapsed break">
                            <div class="calender-sheet-wrapper">
                                <div class="calender-sheet">
                                    <div class="flatpickr-wrapper">
                                        <div class="flatpickr"></div>
                                    </div>
                                </div>
                                <div class="flatpickr-infotext">
                                    <div class="h3">Zeitraum</div>
                                    <div class="event-period">
                                        <div class="event-period-start">
                                            STARTDATUM
                                        </div>
                                        <div class="event-period-end">
                                            ENDDATUM
                                        </div>
                                    </div>
                                    Alle kommenden Termine sind im Kalender markiert.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="section module-event-list">
        <div class="container">
            <div class="row">
                <div class="col-md-8 mx-auto">
                    <div class="service-messages"></div>
                    <div id="data-container">
                        <div class="rruleset" data-slice-start="" data-slice-end="" data-mode="flexTable" data-count="" data-url="/api/EventApiRules.php" data-json-url="https://eventcalendar.seitenblick.com/json/kultur_events.json" data-series-id="214110"></div>
                        <ul id="pagination" class="pagination"></ul>
                        <div class="pagination-compact">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>



</div>>


</body>
</html>