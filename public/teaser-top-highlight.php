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

    <div class="section module_event_highlights">
        <div class="container">
            <div class="row">
                <div class="col-12 col-lg-5">
                    <h2 class="d-block d-lg-none d-xs-none d-xxl-none">
                        <span class="kicker">Kicker</span>
                        <span class="headline">Headline</span>
                    </h2>
                    <div class="rruleset" data-slice-start="" data-slice-end="" data-mode="topevent" data-count="1"></div>
                </div>
                <div class="col-12 col-lg-7">
                    <h2 class="d-none d-lg-block">
                        <span class="kicker">Kicker</span>
                        <span class="headline">Headline</span>
                    </h2>
                    <div class="rruleset" data-slice-start="" data-slice-end="" data-mode="highlights" data-count="3" data-noduplicates="true"></div>
                    <a href="#" class="btn btn-primary btn-lg">Link</a>
                </div>
            </div>
        </div>
    </div>

</div>

<ul id="pagination" class="pagination"></ul>


</body>
</html>