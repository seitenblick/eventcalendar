console.log('registerHelpers.js wurde geladen'); // Debug-Ausgabe
import Handlebars from 'handlebars';

let lang = document.documentElement.getAttribute("lang");

// Registriere `eq`-Helper
Handlebars.registerHelper('eq', function (arg1, arg2, options) {
    console.log('eq Helper Aufruf:', arg1, arg2); // Debugging
    if (arg1 === arg2) {
        console.log('eq-Helper: Bedingung erfüllt, Rendering Block');
        return options.fn(this);
    } else {
        console.log('eq-Helper: Bedingung nicht erfüllt, Rendering Inverse');
        return options.inverse(this);
    }
    // return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

// Registriere `formatDate`-Helper
Handlebars.registerHelper('formatDate', function (eventdate, format) {
    const lang = document.documentElement.getAttribute("lang");
    console.log('lang:', lang); // Debugging
    console.log('formatDate Helper Aufruf', eventdate, format, lang);  // Debugging
    return DateTime.fromJSDate(new Date(eventdate)).setZone('utc').setLocale(lang).toFormat(format);
});

// Prüfen, ob der Helper registriert ist
console.log('Registrierte Helper:', Handlebars.helpers); // Listet alle registrierten Helper auf
