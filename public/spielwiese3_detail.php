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
<!--    <script src="assets/js/events_rebuild.js"></script>-->
    <script src="assets/js/eventCalendar.js"></script>
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

    <article class="container maincontent eventdetail">
        <?php include("80_mobile_right_col.php"); ?>

        <div class="row">
            <div class="col-lg-8 content-col">
                <?php include("81_service_icons.php"); ?>
                <ul class="breadcrumb">
                    <li><a href="http://www.aalen.de/startseite.1.25.htm">Startseite</a></li>
                    <li>Wirtschaft</li>
                    <li class="active">Aktuelles</li>
                </ul>
                <h1>Testveranstaltung</h1>
                <div class="break">
                    <div class="row">
                        <div class="col-12 col-sm-6">
                            <h2>Termin</h2>
                            <?php /*<div class="label label-danger">abgesagt</div> */ ?>
                            <div class="event-date canceled">
                                13. März 2029 -<br /> 20. März 2029
                            </div>
                            <div class="event-time">
                                <div class="smallertext">Uhrzeit jeweils</div>
                                <div class="">09:00 - 18:00 Uhr</div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6">
                            <h2>Veranstaltungsort</h2>
                            <div class="vcard">
                                <div class="org">
                                    <div class="org">Jurahalle Ebnat </div>
                                </div>
                                <div class="adr">
                                    <div class="">Thurn-und-Taxis-Straße 25</div>
                                    <div class=""><span class="postal-code">73432 <span class="locality">Aalen-Ebnat</span></div>
                                </div>
                                <div class="tel">Tel.: 07361 9588-20</div>
                                <div class="email">E-Mail: </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="break">
                    <h2>Nächste Termine</h2>
                    <div class="rruleset" data-slice-start="" data-slice-end="" data-mode="tiles" data-count="3" data-event-id="211896"></div>
                </div>
                <div class="break mb-0">
                    <a class="expand-link collapsed" data-bs-toggle="collapse" href="#collapseAllEvents" role="button" aria-expanded="false" aria-controls="collapseAllEvents">Alle Termine ansehen</a>
                    <div id="collapseAllEvents" class="collapse break">
                        <div class="row">
                            <div class="col-12 col-sm-6">
                                <div class="flatpickr-wrapper unclickable">
                                    <div class="flatpickr"></div>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                Alle kommenden Termine sind im Kalender markiert.
                            </div>
                        </div>
                    </div>
                </div>
                <div class="break">
                    <img src="http://placehold.it/200x133" class="lazyload img-responsive" title="Bildtitel" alt="Alt-Tag" data-sizes="auto" data-srcset="http://placehold.it/200x133 200w,   http://placehold.it/250x167 250w, http://placehold.it/300x200 300w, http://placehold.it/350x233 350w, http://placehold.it/365x243 365w, http://placehold.it/500x334 500w, http://placehold.it/600x400 600w, http://placehold.it/750x500 750w, http://placehold.it/1250x833 1250w" />
                </div>
                <div class="break">
                    <p class="lead">eine Klimagroteske mit Musik von Tina Brüggemann</p>
                    <p>Eine Stadt in Deutschland. Ein Kurort nahe der Schwäbischen Alb, einer der wenigen Orte, am dem es sich noch gut durchatmen lässt.</p>
                    <p>Regelmäßig erschüttern Explosionen die Luft. Sie rühren von Bergsprengungen her – der Alpenkamm wird ausgedünnt, denn das gesprengte Gestein bindet CO2 und entlastet so die Atmosphäre. Der Forscher, der sich das ausgedacht hat, soll geehrt werden, im zentralen Hotel stimmt man sich schon mit den ersten Klimapartys ein.</p>
                    <p>Doch nicht allen schmecken die Drinks mit den coolen Namen und nicht nur der Aktivistin von FFF ist diese praktische Lösung der Klimaprobleme suspekt.</p>
                    <p>MIT Bernd Tauber, Diana Wolf, Julia Sylvester, Manuel Flach, Vjaceslav Kiselev (Cello), dem Klima-Club und dem Aalener Bürgerchor</p>
                    <p>REGIE UND LEITUNG BÜRGERCHOR Tina Brüggemann</p>
                    <p>DRAMATURGIE Tonio Kleinknecht</p>
                    <p>AUSSTATTUNG Ariane Scherpf</p>
                    <p>DRAMATURGIE UND LEITUNG KLIMACLUB Jonathan Giele</p>
                    <p>KLAVIER Claus Wengenmayr</p>
                </div>
            </div>

            <div class="col-lg-3 pull-right visible-lg right-col">
                <!--                <div class="mircosite-navigation">-->
                <!--                    <div class="microsite-navigation-headline">Navigation</div>-->
                <!--                    <ul>-->
                <!--                        <li><a href="#">Schubart</a></li>-->
                <!--                        <li><a href="#">Historie des Preises</a>-->
                <!--                            <ul>-->
                <!--                                <li><a href="#">Schubart Literaturpreis</a></li>-->
                <!--                                <li><a href="#">Die Jury</a></li>-->
                <!--                                <li><a href="#">Preisträger seit 1955</a></li>-->
                <!--                                <li><a href="#">Preisträger 2005-2015</a></li>-->
                <!--                                <li><a href="#">Preisverleihung 2015</a></li>-->
                <!--                                <li><a href="#">Preisverleihung 2017</a></li>-->
                <!--                            </ul>-->
                <!--                        </li>-->
                <!--                        <li><a href="#">Aktuelles</a></li>-->
                <!--                        <li><a href="#">Bildergalerien</a></li>-->
                <!--                        <li><a href="#">Downloads</a></li>-->
                <!--                    </ul>-->
                <!--                </div>-->

                <div class="further-info">
                    Weitere Informationen
                </div>

                <div class="teaser">
                    <h2>Veranstalter</h2>
                    <div class="vcard">
                        <div class="org">Theater der Stadt Aalen</div>
                        <div class="adr">
                            <div class="">Georg-Elser-Platz 1</div>
                            <div class=""><span class="postal-code">73431 <span class="locality">Aalen</span></div>
                        </div>
                        <div class="tel">Tel.: 07361 9588-20</div>
                        <div class="email">E-Mail: </div>
                    </div>
                </div>

                <div class="teaser list">
                    <h2>Downloads</h2>
                    <ul>
                        <li>
                            <a href="#" class="download pdf">
                                <span class="icon-download"></span>
                                Spielplan Juli bis August 2021 (1.3MB)
                            </a>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    </article>
</div>>


</body>
</html>