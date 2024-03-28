this["Hbs"] = this["Hbs"] || {};
this["Hbs"]["dashboardTable"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                <div class=\"d-flex event-item showcontent "
    + alias4(((helper = (helper = lookupProperty(helpers,"status") || (depth0 != null ? lookupProperty(depth0,"status") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data,"loc":{"start":{"line":13,"column":58},"end":{"line":13,"column":68}}}) : helper)))
    + "\" data-tags=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"categories") || (depth0 != null ? lookupProperty(depth0,"categories") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"categories","hash":{},"data":data,"loc":{"start":{"line":13,"column":81},"end":{"line":13,"column":95}}}) : helper)))
    + "\">\r\n                    <a class=\"simple-ajax-popup event-link d-flex col\" href=\"event_detail.php\">\r\n                        <div class=\"col-date\">\r\n                            <div>"
    + alias4(((helper = (helper = lookupProperty(helpers,"itemDateLong") || (depth0 != null ? lookupProperty(depth0,"itemDateLong") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"itemDateLong","hash":{},"data":data,"loc":{"start":{"line":16,"column":33},"end":{"line":16,"column":49}}}) : helper)))
    + "</div>\r\n                            <div>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"timeValid") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":18,"column":32},"end":{"line":20,"column":39}}})) != null ? stack1 : "")
    + "                            </div>\r\n                        </div>\r\n                        <div class=\"d-flex flex-fill\">\r\n                            <div class=\"col-title\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":24,"column":51},"end":{"line":24,"column":60}}}) : helper)))
    + "</div>\r\n                            <div class=\"col-location\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"location") || (depth0 != null ? lookupProperty(depth0,"location") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"location","hash":{},"data":data,"loc":{"start":{"line":25,"column":54},"end":{"line":25,"column":66}}}) : helper)))
    + "</div>\r\n                        </div>\r\n                    </a>\r\n                </div>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                                    <time>"
    + alias4(((helper = (helper = lookupProperty(helpers,"itemHour") || (depth0 != null ? lookupProperty(depth0,"itemHour") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"itemHour","hash":{},"data":data,"loc":{"start":{"line":19,"column":42},"end":{"line":19,"column":54}}}) : helper)))
    + ":"
    + alias4(((helper = (helper = lookupProperty(helpers,"itemMinutes") || (depth0 != null ? lookupProperty(depth0,"itemMinutes") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"itemMinutes","hash":{},"data":data,"loc":{"start":{"line":19,"column":55},"end":{"line":19,"column":70}}}) : helper)))
    + " Uhr</time>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"event-table-wrap\">\r\n    <div id=\"event-table\" class=\"event-table\">\r\n        <div class=\"table-head d-flex\">\r\n            <div class=\"col-date\">Datum</div>\r\n            <div class=\"d-flex flex-fill\">\r\n                <div class=\"col-title\">Titel</div>\r\n                <div class=\"col-location\">Veranstaltungsort</div>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"table-body\">\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":12},"end":{"line":29,"column":21}}})) != null ? stack1 : "")
    + "        </div>\r\n    </div>\r\n</div>";
},"useData":true});
this["Hbs"]["defaultTable"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                      <tr class=\"event-item showcontent published showme\" data-tags=\""
    + alias1(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"category") : depth0)) != null ? lookupProperty(stack1,"id") : stack1), depth0))
    + "\">\r\n                            <td>\r\n                                <div class=\"smallertext\">"
    + alias1(((helper = (helper = lookupProperty(helpers,"itemWeekdayLong") || (depth0 != null ? lookupProperty(depth0,"itemWeekdayLong") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"itemWeekdayLong","hash":{},"data":data,"loc":{"start":{"line":15,"column":57},"end":{"line":15,"column":76}}}) : helper)))
    + "</div>\r\n                                <div class=\"event-date\">"
    + alias1(((helper = (helper = lookupProperty(helpers,"itemDateLong") || (depth0 != null ? lookupProperty(depth0,"itemDateLong") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"itemDateLong","hash":{},"data":data,"loc":{"start":{"line":16,"column":56},"end":{"line":16,"column":72}}}) : helper)))
    + "</div>\r\n                            </td>\r\n                            <td class=\"canceled_bg published\">\r\n                                <div class=\"canceled\"></div>\r\n                            </td>\r\n                            <td>\r\n                                <a href=\""
    + alias1(((helper = (helper = lookupProperty(helpers,"url") || (depth0 != null ? lookupProperty(depth0,"url") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"url","hash":{},"data":data,"loc":{"start":{"line":22,"column":41},"end":{"line":22,"column":48}}}) : helper)))
    + "\" class=\"series\"></a>\r\n                                <span class=\"event-title\">"
    + alias1(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":23,"column":58},"end":{"line":23,"column":67}}}) : helper)))
    + "</span>\r\n                                <div>\r\n                                    <span class=\"event-location\">"
    + alias1(((helper = (helper = lookupProperty(helpers,"location") || (depth0 != null ? lookupProperty(depth0,"location") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"location","hash":{},"data":data,"loc":{"start":{"line":25,"column":65},"end":{"line":25,"column":77}}}) : helper)))
    + "</span>\r\n                                </div>\r\n                            </td>\r\n                            <td>\r\n                                <a href=\""
    + alias1(((helper = (helper = lookupProperty(helpers,"url") || (depth0 != null ? lookupProperty(depth0,"url") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"url","hash":{},"data":data,"loc":{"start":{"line":29,"column":41},"end":{"line":29,"column":48}}}) : helper)))
    + "\" class=\"more-link\">Details</a>\r\n                            </td>\r\n                      </tr>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"table-responsive\">\r\n    <table id=\"event-table\" class=\"events table\" data-toggle=\"table\" data-pagination=\"true\">\r\n        <thead>\r\n              <tr>\r\n                <th>Datum</th>\r\n                <th aria-label=\"status\"></th>\r\n                <th>Titel</th>\r\n                <th>Weitere Infos</th>\r\n              </tr>\r\n        </thead>\r\n            <tbody>\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":18},"end":{"line":32,"column":27}}})) != null ? stack1 : "")
    + "            </tbody>\r\n    </table>\r\n</div>";
},"useData":true});
this["Hbs"]["eventtest"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\r\n                                <div class=\"event-title\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data,"loc":{"start":{"line":6,"column":57},"end":{"line":6,"column":66}}}) : helper)))
    + "</div>\r\n\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class='flex-table'>\r\n    <div id='event-table' class='events' data-toggle=\"table\" data-pagination=\"true\">\r\n        <div class=\"event-items\">\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":12},"end":{"line":8,"column":21}}})) != null ? stack1 : "")
    + "        </div>\r\n    </div>\r\n</div>";
},"useData":true});
this["Hbs"]["flexTable"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                <div class=\"event-item showcontent testtemplate\" data-tags=\""
    + alias1(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"category") : depth0)) != null ? lookupProperty(stack1,"id") : stack1), depth0))
    + "\">\r\n                    <a href=\""
    + alias1(((helper = (helper = lookupProperty(helpers,"url") || (depth0 != null ? lookupProperty(depth0,"url") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"url","hash":{},"data":data,"loc":{"start":{"line":6,"column":29},"end":{"line":6,"column":36}}}) : helper)))
    + "\">\r\n                        <div class=\"event-item-date\">\r\n                            <div class=\"smallertext\">"
    + alias1(((helper = (helper = lookupProperty(helpers,"itemWeekdayLong") || (depth0 != null ? lookupProperty(depth0,"itemWeekdayLong") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"itemWeekdayLong","hash":{},"data":data,"loc":{"start":{"line":8,"column":53},"end":{"line":8,"column":72}}}) : helper)))
    + "</div>\r\n                            <div class=\"event-date\">"
    + alias1(((helper = (helper = lookupProperty(helpers,"itemDateLong") || (depth0 != null ? lookupProperty(depth0,"itemDateLong") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"itemDateLong","hash":{},"data":data,"loc":{"start":{"line":9,"column":52},"end":{"line":9,"column":68}}}) : helper)))
    + "</div>\r\n                        </div>\r\n                        <div class=\"event-item-info\">\r\n                            <div class=\"event-item-title\">\r\n                                <div class=\"event-title\">"
    + alias1(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":13,"column":57},"end":{"line":13,"column":66}}}) : helper)))
    + "</div>\r\n                            </div>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias2,(depth0 != null ? lookupProperty(depth0,"timeValid") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":28},"end":{"line":19,"column":35}}})) != null ? stack1 : "")
    + "                            <span class=\"event-location\">"
    + alias1(((helper = (helper = lookupProperty(helpers,"location") || (depth0 != null ? lookupProperty(depth0,"location") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"location","hash":{},"data":data,"loc":{"start":{"line":20,"column":57},"end":{"line":20,"column":69}}}) : helper)))
    + "</span>\r\n                        </div>\r\n\r\n                    </a>\r\n                    <div class=\"event-item-links\">\r\n                    </div>\r\n                </div>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                                <span class=\"event-time\">\r\n                                    <time>"
    + alias4(((helper = (helper = lookupProperty(helpers,"itemHour") || (depth0 != null ? lookupProperty(depth0,"itemHour") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"itemHour","hash":{},"data":data,"loc":{"start":{"line":17,"column":42},"end":{"line":17,"column":54}}}) : helper)))
    + ":"
    + alias4(((helper = (helper = lookupProperty(helpers,"itemMinutes") || (depth0 != null ? lookupProperty(depth0,"itemMinutes") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"itemMinutes","hash":{},"data":data,"loc":{"start":{"line":17,"column":55},"end":{"line":17,"column":70}}}) : helper)))
    + " Uhr</time>\r\n                                </span>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class='flex-table'>\r\n    <div id='event-table' class='events' data-toggle=\"table\" data-pagination=\"true\">\r\n        <div class=\"event-items\">\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":12},"end":{"line":27,"column":21}}})) != null ? stack1 : "")
    + "        </div>\r\n    </div>\r\n</div>";
},"useData":true});
this["Hbs"]["nextEventsList"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <div class=\"next-event-entry\">\r\n            <a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"url") || (depth0 != null ? lookupProperty(depth0,"url") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data,"loc":{"start":{"line":4,"column":21},"end":{"line":4,"column":28}}}) : helper)))
    + "\" tabindex=\"0\" class=\"\">\r\n                <span class=\"next-event-day\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"itemDateWeekdayDayMonth") || (depth0 != null ? lookupProperty(depth0,"itemDateWeekdayDayMonth") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"itemDateWeekdayDayMonth","hash":{},"data":data,"loc":{"start":{"line":5,"column":45},"end":{"line":5,"column":72}}}) : helper)))
    + "</span>\r\n                <span class=\"next-event-title\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":6,"column":47},"end":{"line":6,"column":56}}}) : helper)))
    + "</span>\r\n            </a>\r\n        </div>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"next-events-entries\">\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":4},"end":{"line":9,"column":13}}})) != null ? stack1 : "")
    + "</div>";
},"useData":true});
this["Hbs"]["simpleTable"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, alias5="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            <tr class=\"event-item showcontent\" data-tags=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"category") : depth0)) != null ? lookupProperty(stack1,"id") : stack1), depth0))
    + "\" >\r\n                <td>"
    + alias2(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":24,"column":20},"end":{"line":24,"column":28}}}) : helper)))
    + "</td>\r\n                <td>"
    + alias2(((helper = (helper = lookupProperty(helpers,"itemDateLong") || (depth0 != null ? lookupProperty(depth0,"itemDateLong") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"itemDateLong","hash":{},"data":data,"loc":{"start":{"line":25,"column":20},"end":{"line":25,"column":36}}}) : helper)))
    + "</td>\r\n                <td>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,(depth0 != null ? lookupProperty(depth0,"timeValid") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":27,"column":16},"end":{"line":31,"column":23}}})) != null ? stack1 : "")
    + "              </td>\r\n              <td>"
    + alias2(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":33,"column":18},"end":{"line":33,"column":27}}}) : helper)))
    + "</td>\r\n              <td>"
    + alias2(((helper = (helper = lookupProperty(helpers,"location") || (depth0 != null ? lookupProperty(depth0,"location") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"location","hash":{},"data":data,"loc":{"start":{"line":34,"column":18},"end":{"line":34,"column":30}}}) : helper)))
    + "</td>\r\n              <td>"
    + alias2(((helper = (helper = lookupProperty(helpers,"status") || (depth0 != null ? lookupProperty(depth0,"status") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"status","hash":{},"data":data,"loc":{"start":{"line":35,"column":18},"end":{"line":35,"column":28}}}) : helper)))
    + "</td>\r\n              <td>"
    + alias2(((helper = (helper = lookupProperty(helpers,"url") || (depth0 != null ? lookupProperty(depth0,"url") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"url","hash":{},"data":data,"loc":{"start":{"line":36,"column":18},"end":{"line":36,"column":25}}}) : helper)))
    + "</td>\r\n              <td><img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? lookupProperty(stack1,"thumb_100px") : stack1), depth0))
    + "\" width=\"100\" /><br />"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? lookupProperty(stack1,"thumb_100px") : stack1), depth0))
    + "</td>\r\n              <td>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"category") : depth0)) != null ? lookupProperty(stack1,"id") : stack1), depth0))
    + "<br />"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"category") : depth0)) != null ? lookupProperty(stack1,"title") : stack1), depth0))
    + "</td>\r\n              <td>"
    + alias2(((helper = (helper = lookupProperty(helpers,"series") || (depth0 != null ? lookupProperty(depth0,"series") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"series","hash":{},"data":data,"loc":{"start":{"line":39,"column":18},"end":{"line":39,"column":28}}}) : helper)))
    + "</td>\r\n              <td>"
    + alias2(((helper = (helper = lookupProperty(helpers,"highlight") || (depth0 != null ? lookupProperty(depth0,"highlight") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"highlight","hash":{},"data":data,"loc":{"start":{"line":40,"column":18},"end":{"line":40,"column":31}}}) : helper)))
    + "</td>\r\n              <td>"
    + alias2(((helper = (helper = lookupProperty(helpers,"topevent") || (depth0 != null ? lookupProperty(depth0,"topevent") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"topevent","hash":{},"data":data,"loc":{"start":{"line":41,"column":18},"end":{"line":41,"column":30}}}) : helper)))
    + "</td>\r\n              <td>"
    + alias2(((helper = (helper = lookupProperty(helpers,"rule") || (depth0 != null ? lookupProperty(depth0,"rule") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"rule","hash":{},"data":data,"loc":{"start":{"line":42,"column":18},"end":{"line":42,"column":26}}}) : helper)))
    + "</td>\r\n\r\n            </tr>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                    <span class=\"event-time\">\r\n                        <time>"
    + alias4(((helper = (helper = lookupProperty(helpers,"itemHour") || (depth0 != null ? lookupProperty(depth0,"itemHour") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"itemHour","hash":{},"data":data,"loc":{"start":{"line":29,"column":30},"end":{"line":29,"column":42}}}) : helper)))
    + "."
    + alias4(((helper = (helper = lookupProperty(helpers,"itemMinutes") || (depth0 != null ? lookupProperty(depth0,"itemMinutes") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"itemMinutes","hash":{},"data":data,"loc":{"start":{"line":29,"column":43},"end":{"line":29,"column":58}}}) : helper)))
    + " Uhr</time>\r\n                    </span>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div id='event-table' class=\"table-responsive\">\r\n    <table class=\"table table-striped\">\r\n      <thead>\r\n        <tr>\r\n            <td>ID</td>\r\n            <td>Datum</td>\r\n            <td>Uhrzeit</td>\r\n            <td>Titel der Veranstaltung</td>\r\n            <td>Location</td>\r\n            <td>Status</td>\r\n            <td>URL</td>\r\n            <td>Bild</td>\r\n            <td>Kategorie Id und Titel</td>\r\n            <td>Reihe</td>\r\n            <td>Highlight</td>\r\n            <td>Topevent</td>\r\n            <td>Wiederholungs-Regel</td>\r\n\r\n        </tr>\r\n      </thead>\r\n      <tbody class=\"event-items\">\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":22,"column":8},"end":{"line":45,"column":17}}})) != null ? stack1 : "")
    + "      </tbody>\r\n    </table>\r\n</div>";
},"useData":true});