<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Eventcalendar</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.7/handlebars.min.js" integrity="sha512-RNLkV3d+aLtfcpEyFG8jRbnWHxUqVZozacROI4J2F1sTaDqo1dPQYs01OMi1t1w9Y2FdbSCDSQ2ZVdAC8bzgAg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="assets/js/handlebarsTemplates/hbstemplates.js"></script>
    <script src="assets/js/events.js"></script>
    <!-- Styles -->
    <link rel="stylesheet" href="assets/css/events.css">
    <style>
        .rruleset {
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
<h1>Events</h1>
<!--<div class="rruleset" data-slice-start="" data-slice-end="" data-mode="widget" data-count="120" data-url="https://www.aalen.de/api/EventApiRules.php"><div id="test"></div></div></div>-->
<!--<div class="rruleset" data-slice-start="" data-slice-end="" data-mode="teaser" data-count="10" data-url="https://www.aalen.de/api/EventApiRules.php"></div>-->
<div id="eventList"></div>
<script id="event-table-template" type="text/x-handlebars-template">
    <table id="event-table" class="ap1">
    {{#each this}}
        <tr class="event-item showcontent ap1"><td>{{series}} {{#if series}}-{{/if}} {{title}} - {{eventdate}}</td></tr>
    {{/each}}
    </table>
<!--    <ol>-->
<!--        {{#each quotes}}-->
<!--        <li>{{quote}}</li>-->
<!--        {{/each}}-->
<!--    </ol>-->
</script>

<div class="rruleset" data-slice-start="" data-slice-end="" data-mode="highlights" data-count="100" data-url="https://www.aalen.de/api/EventApiRules.php"></div>


<ul id="pagination" class="pagination"></ul>

<div id="templates" style="display: none;"></div>

<!-- Scripts -->
<!--<script src="assets/js/events.js"></script>-->


</body>
</html>