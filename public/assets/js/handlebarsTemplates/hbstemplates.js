this["Hbs"] = this["Hbs"] || {};
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
    + alias1((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||alias3).call(alias2,(depth0 != null ? lookupProperty(depth0,"eventdate") : depth0),"cccc",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":15,"column":57},"end":{"line":15,"column":88}}}))
    + "</div>\r\n                                <div class=\"event-date\">"
    + alias1((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||alias3).call(alias2,(depth0 != null ? lookupProperty(depth0,"eventdate") : depth0),"dd. MMM ´yy",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":16,"column":56},"end":{"line":16,"column":94}}}))
    + "</div>\r\n                            </td>\r\n                            <td class=\"canceled_bg published\">\r\n                                <div class=\"canceled\"></div>\r\n                            </td>\r\n                            <td>\r\n                                <a href=\""
    + alias1(((helper = (helper = lookupProperty(helpers,"url") || (depth0 != null ? lookupProperty(depth0,"url") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"url","hash":{},"data":data,"loc":{"start":{"line":22,"column":41},"end":{"line":22,"column":48}}}) : helper)))
    + "\" class=\"series\"></a>\r\n                                <div class=\"event-title\">"
    + ((stack1 = lookupProperty(helpers,"if").call(alias2,(depth0 != null ? lookupProperty(depth0,"highlight") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":23,"column":57},"end":{"line":23,"column":115}}})) != null ? stack1 : "")
    + alias1(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":23,"column":115},"end":{"line":23,"column":124}}}) : helper)))
    + "</div>\r\n                                <div>\r\n                                    <span class=\"event-location\">"
    + alias1(((helper = (helper = lookupProperty(helpers,"location") || (depth0 != null ? lookupProperty(depth0,"location") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"location","hash":{},"data":data,"loc":{"start":{"line":25,"column":65},"end":{"line":25,"column":77}}}) : helper)))
    + "</span>\r\n                                </div>\r\n                            </td>\r\n                            <td>\r\n                                <a href=\""
    + alias1(((helper = (helper = lookupProperty(helpers,"url") || (depth0 != null ? lookupProperty(depth0,"url") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"url","hash":{},"data":data,"loc":{"start":{"line":29,"column":41},"end":{"line":29,"column":48}}}) : helper)))
    + "\" class=\"more-link\">Details</a>\r\n                            </td>\r\n                      </tr>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "<div class=\"highlight-icon\"></div>";
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
    + alias1((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||alias3).call(alias2,(depth0 != null ? lookupProperty(depth0,"eventdate") : depth0),"cccc",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":8,"column":53},"end":{"line":8,"column":84}}}))
    + "</div>\r\n                            <div class=\"event-date\">"
    + alias1((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||alias3).call(alias2,(depth0 != null ? lookupProperty(depth0,"eventdate") : depth0),"dd. MMM ´yy",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":9,"column":52},"end":{"line":9,"column":90}}}))
    + "</div>\r\n                        </div>\r\n                        <div class=\"event-item-info\">\r\n                        <div class=\"event-kicker\">\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias2,(depth0 != null ? lookupProperty(depth0,"category") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":13,"column":28},"end":{"line":15,"column":35}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias2,((stack1 = (depth0 != null ? lookupProperty(depth0,"category") : depth0)) != null ? lookupProperty(stack1,"title") : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":16,"column":28},"end":{"line":20,"column":35}}})) != null ? stack1 : "")
    + "                            "
    + alias1(((helper = (helper = lookupProperty(helpers,"series") || (depth0 != null ? lookupProperty(depth0,"series") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"series","hash":{},"data":data,"loc":{"start":{"line":21,"column":28},"end":{"line":21,"column":38}}}) : helper)))
    + "\r\n                        </div>\r\n\r\n                            <div class=\"event-item-title\">\r\n                                <div class=\"event-title\">"
    + ((stack1 = lookupProperty(helpers,"if").call(alias2,(depth0 != null ? lookupProperty(depth0,"highlight") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":25,"column":57},"end":{"line":25,"column":115}}})) != null ? stack1 : "")
    + alias1(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":25,"column":115},"end":{"line":25,"column":124}}}) : helper)))
    + "</div>\r\n                            </div>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias2,(depth0 != null ? lookupProperty(depth0,"timeValid") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":27,"column":28},"end":{"line":31,"column":35}}})) != null ? stack1 : "")
    + "                            <span class=\"event-location\">"
    + alias1(((helper = (helper = lookupProperty(helpers,"location") || (depth0 != null ? lookupProperty(depth0,"location") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"location","hash":{},"data":data,"loc":{"start":{"line":32,"column":57},"end":{"line":32,"column":69}}}) : helper)))
    + "</span>\r\n                        </div>\r\n                    </a>\r\n                    <div class=\"event-item-links\">\r\n"
    + ((stack1 = (lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||alias3).call(alias2,(depth0 != null ? lookupProperty(depth0,"status") : depth0),"canceled",{"name":"eq","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":36,"column":20},"end":{"line":38,"column":27}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias2,(depth0 != null ? lookupProperty(depth0,"ticketUrl") : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":39,"column":20},"end":{"line":41,"column":27}}})) != null ? stack1 : "")
    + "                    </div>\r\n                </div>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                              "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"category") : depth0)) != null ? lookupProperty(stack1,"title") : stack1), depth0))
    + "\r\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"series") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":17,"column":32},"end":{"line":19,"column":39}}})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    return "                                |\r\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "<div class=\"highlight-icon\"></div>";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                                <span class=\"event-time\">\r\n                                    <time>"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"timeStart") || (depth0 != null ? lookupProperty(depth0,"timeStart") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"timeStart","hash":{},"data":data,"loc":{"start":{"line":29,"column":42},"end":{"line":29,"column":55}}}) : helper)))
    + " Uhr</time>\r\n                                </span>\r\n";
},"11":function(container,depth0,helpers,partials,data) {
    return "                        <div class=\"rotation-wrapper-outer\"><div class=\"buttonlink canceledevent rotation-wrapper-inner\"><span class=\"linktext element-to-rotate\">Abgesagt</span></div></div>\r\n";
},"13":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                        <a href=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"ticketUrl") || (depth0 != null ? lookupProperty(depth0,"ticketUrl") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ticketUrl","hash":{},"data":data,"loc":{"start":{"line":40,"column":33},"end":{"line":40,"column":46}}}) : helper)))
    + "\" class=\"rotation-wrapper-outer\"><div class=\"buttonlink ticket rotation-wrapper-inner\"><span class=\"linktext element-to-rotate\">Tickets</span></div></a>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class='flex-table'>\r\n    <div id='event-table' class='events' data-toggle=\"table\" data-pagination=\"true\">\r\n        <div class=\"event-items\">\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":12},"end":{"line":44,"column":21}}})) != null ? stack1 : "")
    + "        </div>\r\n    </div>\r\n</div>";
},"useData":true});
this["Hbs"]["highlights"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"url") || (depth0 != null ? lookupProperty(depth0,"url") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data,"loc":{"start":{"line":3,"column":17},"end":{"line":3,"column":24}}}) : helper)))
    + "\" class=\"event-item\">\r\n            <div class=\"row\">\r\n                <div class=\"col-12 col-md-5 col-lg-12 col-xl-5\">\r\n                    <div class=\"event-image\">\r\n                        <div class=\"ratio_events\">\r\n                            <div class=\"focuspoint\" "
    + ((stack1 = alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? lookupProperty(stack1,"focuspoint_data") : stack1), depth0)) != null ? stack1 : "")
    + ">\r\n                                <img src=\""
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? lookupProperty(stack1,"thumb_100px") : stack1), depth0))
    + "\" class=\"lazyload img-responsive\" title=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"titleTag") || (depth0 != null ? lookupProperty(depth0,"titleTag") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"titleTag","hash":{},"data":data,"loc":{"start":{"line":9,"column":104},"end":{"line":9,"column":116}}}) : helper)))
    + "\" alt=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"altTag") || (depth0 != null ? lookupProperty(depth0,"altTag") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"altTag","hash":{},"data":data,"loc":{"start":{"line":9,"column":123},"end":{"line":9,"column":133}}}) : helper)))
    + "\" data-sizes=\"auto\"\r\n                                data-srcset=\""
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? lookupProperty(stack1,"thumb_100px") : stack1), depth0))
    + " 100w,\r\n                                             "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? lookupProperty(stack1,"thumb_300px") : stack1), depth0))
    + " 300w,\r\n                                             "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? lookupProperty(stack1,"thumb_450px") : stack1), depth0))
    + " 450w,\r\n                                             "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? lookupProperty(stack1,"thumb_600px") : stack1), depth0))
    + " 600w,\r\n                                             "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? lookupProperty(stack1,"thumb_920px") : stack1), depth0))
    + " 920w,\r\n                                             "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? lookupProperty(stack1,"thumb_1230px") : stack1), depth0))
    + " 1230w\" />\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"event-date\">\r\n                          <div class=\"event-date__day d-md-none d-lg-block d-xl-none d-xxl-none\">"
    + alias4((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"eventdate") : depth0),"cccc",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":19,"column":97},"end":{"line":19,"column":128}}}))
    + "</div>\r\n                          <div class=\"event-date__date\">"
    + alias4((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"eventdate") : depth0),"dd.MM.",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":20,"column":56},"end":{"line":20,"column":89}}}))
    + "</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"col-12 col-md-7\">\r\n                    <div class=\"event-text\">\r\n                        <div class=\"event-kicker\">\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"category") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":28,"column":28},"end":{"line":30,"column":35}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"category") : depth0)) != null ? lookupProperty(stack1,"title") : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":31,"column":28},"end":{"line":35,"column":35}}})) != null ? stack1 : "")
    + "                            "
    + alias4(((helper = (helper = lookupProperty(helpers,"series") || (depth0 != null ? lookupProperty(depth0,"series") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"series","hash":{},"data":data,"loc":{"start":{"line":36,"column":28},"end":{"line":36,"column":38}}}) : helper)))
    + "\r\n                        </div>\r\n                        <div class=\"event-title\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":38,"column":49},"end":{"line":38,"column":58}}}) : helper)))
    + "</div>\r\n                        <div class=\"event-info "
    + alias4(((helper = (helper = lookupProperty(helpers,"status") || (depth0 != null ? lookupProperty(depth0,"status") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data,"loc":{"start":{"line":39,"column":47},"end":{"line":39,"column":57}}}) : helper)))
    + "\">\r\n"
    + ((stack1 = (lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"status") : depth0),"canceled",{"name":"eq","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":40,"column":28},"end":{"line":42,"column":35}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"status") : depth0),"postponed",{"name":"eq","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":43,"column":28},"end":{"line":45,"column":35}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(lookupProperty(helpers,"isSingleDayEvent")||(depth0 && lookupProperty(depth0,"isSingleDayEvent"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"startdate") : depth0),(depth0 != null ? lookupProperty(depth0,"enddate") : depth0),{"name":"isSingleDayEvent","hash":{},"data":data,"loc":{"start":{"line":46,"column":34},"end":{"line":46,"column":70}}}),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.program(13, data, 0),"data":data,"loc":{"start":{"line":46,"column":28},"end":{"line":52,"column":35}}})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"timeValid") : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":54,"column":28},"end":{"line":56,"column":35}}})) != null ? stack1 : "")
    + "                        </div>\r\n                   </div>\r\n                </div>\r\n            </div>\r\n        </a>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                              "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"category") : depth0)) != null ? lookupProperty(stack1,"title") : stack1), depth0))
    + "\r\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"series") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":32,"column":32},"end":{"line":34,"column":39}}})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    return "                                |\r\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "                                Abgesagt\r\n";
},"9":function(container,depth0,helpers,partials,data) {
    return "                                Verschoben:\r\n";
},"11":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                                <!-- Eintägiger Termin: Ausgabe des Startdatums im Format dd. MMMM yyyy -->\r\n                                "
    + container.escapeExpression((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"startdate") : depth0),"ccc dd. MMM yyyy",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":48,"column":32},"end":{"line":48,"column":75}}}))
    + "\r\n";
},"13":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                                <!-- Mehrtägiger Termin: Ausgabe von Startdatum und Enddatum -->\r\n                                "
    + alias3((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"startdate") : depth0),"dd.MMM.yyyy",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":51,"column":32},"end":{"line":51,"column":70}}}))
    + " - "
    + alias3((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"enddate") : depth0),"dd.MM.yyyy",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":51,"column":73},"end":{"line":51,"column":108}}}))
    + "\r\n";
},"15":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                                <br /><time>"
    + container.escapeExpression((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"eventdate") : depth0),"HH:mm",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":55,"column":44},"end":{"line":55,"column":76}}}))
    + " Uhr</time>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"event-col\">\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":4},"end":{"line":62,"column":13}}})) != null ? stack1 : "")
    + "</div>\r\n";
},"useData":true});
this["Hbs"]["lr_events_list"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                        <a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"url") || (depth0 != null ? lookupProperty(depth0,"url") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data,"loc":{"start":{"line":3,"column":33},"end":{"line":3,"column":40}}}) : helper)))
    + "\" class=\"event-item\">\r\n                            <div class=\"event-date-wrapper\">\r\n                                <span class=\"event-date\">"
    + alias4((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"eventdate") : depth0),"dd. MMMM yyyy",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":5,"column":57},"end":{"line":5,"column":97}}}))
    + "</span>\r\n                                <span class=\"event-time\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"timeStart") || (depth0 != null ? lookupProperty(depth0,"timeStart") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"timeStart","hash":{},"data":data,"loc":{"start":{"line":6,"column":57},"end":{"line":6,"column":70}}}) : helper)))
    + " Uhr\r\n"
    + ((stack1 = lookupProperty(helpers,"unless").call(alias1,(lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"timeEnd") : depth0),"23:59",{"name":"eq","hash":{},"data":data,"loc":{"start":{"line":7,"column":46},"end":{"line":7,"column":66}}}),{"name":"unless","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":36},"end":{"line":9,"column":47}}})) != null ? stack1 : "")
    + "                                </span>\r\n                            </div>\r\n                            <div class=\"event-title\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":12,"column":53},"end":{"line":12,"column":62}}}) : helper)))
    + "</div>\r\n                        </a>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                                      - "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"timeEnd") || (depth0 != null ? lookupProperty(depth0,"timeEnd") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"timeEnd","hash":{},"data":data,"loc":{"start":{"line":8,"column":40},"end":{"line":8,"column":51}}}) : helper)))
    + " Uhr\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                    <div class=\"event-list\">\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":12},"end":{"line":14,"column":21}}})) != null ? stack1 : "")
    + "                    </div>";
},"useData":true});
this["Hbs"]["lr_eventteaser"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                        <div class=\"event-item\">\r\n                            <div class=\"event-date\">"
    + alias3((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"eventdate") : depth0),"dd. MM.",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":4,"column":52},"end":{"line":4,"column":86}}}))
    + "</div>\r\n                            <div class=\"event-title\">"
    + alias3(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":5,"column":53},"end":{"line":5,"column":62}}}) : helper)))
    + "</div>\r\n                        </div>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                    <div class=\"event-teaser\">\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":12},"end":{"line":7,"column":21}}})) != null ? stack1 : "")
    + "                    </div>";
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
this["Hbs"]["sh_events_list"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression, alias4="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <a href=\"#\" class=\"event_item event-item showcontent "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"highlight") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":61},"end":{"line":3,"column":93}}})) != null ? stack1 : "")
    + "\">\r\n            <div class=\"row\">\r\n                <div class=\"col-xl-2\">\r\n                    <div class=\"event_date\">"
    + alias3((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"eventdate") : depth0),"dd.MM.",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":6,"column":44},"end":{"line":6,"column":77}}}))
    + "</div>\r\n                </div>\r\n                <div class=\"col-lg-5\">\r\n                    <div class=\"event_title\">"
    + alias3(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":9,"column":45},"end":{"line":9,"column":54}}}) : helper)))
    + "</div>\r\n                    <div class=\"event_lead\">"
    + alias3(((helper = (helper = lookupProperty(helpers,"teaser") || (depth0 != null ? lookupProperty(depth0,"teaser") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"teaser","hash":{},"data":data,"loc":{"start":{"line":10,"column":44},"end":{"line":10,"column":54}}}) : helper)))
    + "</div>\r\n                </div>\r\n                <div class=\"col-lg-4 offset-lg-1 d-flex justify-content-lg-end align-items-center\">\r\n                    <div class=\"event_info\">\r\n                        <div class=\"event_info_row\">\r\n                            <span class=\"label\">Datum</span>\r\n                            <span class=\"content\">"
    + alias3((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"eventdate") : depth0),"EEE, dd. MMMM yyyy",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":16,"column":50},"end":{"line":16,"column":95}}}))
    + "</span>\r\n                        </div>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"timeValid") : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":18,"column":24},"end":{"line":23,"column":31}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"organiser") : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":28,"column":0},"end":{"line":33,"column":7}}})) != null ? stack1 : "")
    + "                    </div>\r\n                </div>\r\n            </div>\r\n        </a>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "sh-event";
},"4":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                            <div class=\"event_info_row\">\r\n                                <span class=\"label\">Beginn</span>\r\n                                <span class=\"content\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"timeStart") || (depth0 != null ? lookupProperty(depth0,"timeStart") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"timeStart","hash":{},"data":data,"loc":{"start":{"line":21,"column":54},"end":{"line":21,"column":67}}}) : helper)))
    + " Uhr</span>\r\n                            </div>\r\n";
},"6":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                        <div class=\"event_info_row\">\r\n                            <span class=\"label\">Veranstaltet von</span>\r\n                            <span class=\"content\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"organiser") || (depth0 != null ? lookupProperty(depth0,"organiser") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"organiser","hash":{},"data":data,"loc":{"start":{"line":31,"column":50},"end":{"line":31,"column":63}}}) : helper)))
    + "</span>\r\n                        </div>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div id=\"event-table\" class=\"event-list\">\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":4},"end":{"line":38,"column":13}}})) != null ? stack1 : "")
    + "</div>\r\n";
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
    + alias2((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"eventdate") : depth0),"dd. MMM ´yy",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":25,"column":20},"end":{"line":25,"column":58}}}))
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
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                    <span class=\"event-time\">\r\n                        <time>"
    + alias3((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"eventdate") : depth0),"HH:mm",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":29,"column":30},"end":{"line":29,"column":62}}}))
    + " Uhr  -  "
    + alias3(((helper = (helper = lookupProperty(helpers,"timeEnd") || (depth0 != null ? lookupProperty(depth0,"timeEnd") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"timeEnd","hash":{},"data":data,"loc":{"start":{"line":29,"column":71},"end":{"line":29,"column":84}}}) : helper)))
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
this["Hbs"]["table-dashboard"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
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
    + alias4((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"eventdate") : depth0),"dd. MMM ´yy",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":16,"column":33},"end":{"line":16,"column":71}}}))
    + "</div>\r\n                            <div>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"timeValid") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":18,"column":32},"end":{"line":20,"column":39}}})) != null ? stack1 : "")
    + "                            </div>\r\n                        </div>\r\n                        <div class=\"d-flex flex-fill\">\r\n                            <div class=\"col-title\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":24,"column":51},"end":{"line":24,"column":60}}}) : helper)))
    + "</div>\r\n                            <div class=\"col-location\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"location") || (depth0 != null ? lookupProperty(depth0,"location") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"location","hash":{},"data":data,"loc":{"start":{"line":25,"column":54},"end":{"line":25,"column":66}}}) : helper)))
    + "</div>\r\n                        </div>\r\n                    </a>\r\n                </div>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                                    <time>"
    + container.escapeExpression((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"eventdate") : depth0),"HH:mm",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":19,"column":42},"end":{"line":19,"column":74}}}))
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
this["Hbs"]["tiles"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <div class=\"col-12 col-sm-4\">\r\n            <div class=\"tiles-event-day smallertext\">\r\n            "
    + alias3((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"eventdate") : depth0),"cccc",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":5,"column":12},"end":{"line":5,"column":43}}}))
    + "\r\n            </div>\r\n            <div class=\"tiles-event-date\">\r\n            "
    + alias3((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"eventdate") : depth0),"dd. MMMM yyyy",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":8,"column":12},"end":{"line":8,"column":52}}}))
    + "\r\n            </div>\r\n        </div>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"row\">\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":4},"end":{"line":11,"column":13}}})) != null ? stack1 : "")
    + "</div>";
},"useData":true});
this["Hbs"]["topevent"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"url") || (depth0 != null ? lookupProperty(depth0,"url") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data,"loc":{"start":{"line":3,"column":17},"end":{"line":3,"column":24}}}) : helper)))
    + "\" class=\"event-item top-event\">\r\n            <div class=\"row\">\r\n                <div class=\"col-12 col-md-5 col-lg-12\">\r\n                    <div class=\"event-image\">\r\n                        <div class=\"ratio_topevent\">\r\n                            <div class=\"focuspoint\" "
    + ((stack1 = alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? lookupProperty(stack1,"focuspoint_data") : stack1), depth0)) != null ? stack1 : "")
    + ">\r\n                                <img src=\""
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? lookupProperty(stack1,"thumb_100px") : stack1), depth0))
    + "\" class=\"lazyload img-responsive\" title=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"titleTag") || (depth0 != null ? lookupProperty(depth0,"titleTag") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"titleTag","hash":{},"data":data,"loc":{"start":{"line":9,"column":104},"end":{"line":9,"column":116}}}) : helper)))
    + "\" alt=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"altTag") || (depth0 != null ? lookupProperty(depth0,"altTag") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"altTag","hash":{},"data":data,"loc":{"start":{"line":9,"column":123},"end":{"line":9,"column":133}}}) : helper)))
    + "\" data-sizes=\"auto\"\r\n                                data-srcset=\""
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? lookupProperty(stack1,"thumb_100px") : stack1), depth0))
    + " 100w,\r\n                                             "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? lookupProperty(stack1,"thumb_300px") : stack1), depth0))
    + " 300w,\r\n                                             "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? lookupProperty(stack1,"thumb_450px") : stack1), depth0))
    + " 450w,\r\n                                             "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? lookupProperty(stack1,"thumb_600px") : stack1), depth0))
    + " 600w,\r\n                                             "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? lookupProperty(stack1,"thumb_920px") : stack1), depth0))
    + " 920w,\r\n                                             "
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"image") : depth0)) != null ? lookupProperty(stack1,"thumb_1230px") : stack1), depth0))
    + " 1230w\" />\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"event-date\">\r\n                          <div class=\"event-date__day\">"
    + alias4((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"eventdate") : depth0),"cccc",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":19,"column":55},"end":{"line":19,"column":86}}}))
    + "</div>\r\n                          <div class=\"event-date__date\">"
    + alias4((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"eventdate") : depth0),"dd.MM.",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":20,"column":56},"end":{"line":20,"column":89}}}))
    + "</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"col-12 col-md-7 col-lg-12 topevent-overlay\">\r\n                    <div class=\"event-text\">\r\n                        <div class=\"event-kicker\">\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"category") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":28,"column":28},"end":{"line":30,"column":35}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"category") : depth0)) != null ? lookupProperty(stack1,"title") : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":31,"column":28},"end":{"line":35,"column":35}}})) != null ? stack1 : "")
    + "                            "
    + alias4(((helper = (helper = lookupProperty(helpers,"series") || (depth0 != null ? lookupProperty(depth0,"series") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"series","hash":{},"data":data,"loc":{"start":{"line":36,"column":28},"end":{"line":36,"column":38}}}) : helper)))
    + "\r\n                        </div>\r\n                        <div class=\"event-title\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":38,"column":49},"end":{"line":38,"column":58}}}) : helper)))
    + "</div>\r\n                        <div class=\"event-info "
    + alias4(((helper = (helper = lookupProperty(helpers,"status") || (depth0 != null ? lookupProperty(depth0,"status") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data,"loc":{"start":{"line":39,"column":47},"end":{"line":39,"column":57}}}) : helper)))
    + "\">\r\n"
    + ((stack1 = (lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"status") : depth0),"canceled",{"name":"eq","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":40,"column":28},"end":{"line":42,"column":35}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"status") : depth0),"postponed",{"name":"eq","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":43,"column":28},"end":{"line":45,"column":35}}})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(lookupProperty(helpers,"isSingleDayEvent")||(depth0 && lookupProperty(depth0,"isSingleDayEvent"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"startdate") : depth0),(depth0 != null ? lookupProperty(depth0,"enddate") : depth0),{"name":"isSingleDayEvent","hash":{},"data":data,"loc":{"start":{"line":47,"column":34},"end":{"line":47,"column":70}}}),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.program(13, data, 0),"data":data,"loc":{"start":{"line":47,"column":28},"end":{"line":53,"column":35}}})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"timeValid") : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":55,"column":28},"end":{"line":57,"column":35}}})) != null ? stack1 : "")
    + "                        </div>\r\n                   </div>\r\n                </div>\r\n            </div>\r\n        </a>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                              "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"category") : depth0)) != null ? lookupProperty(stack1,"title") : stack1), depth0))
    + "\r\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"series") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":32,"column":32},"end":{"line":34,"column":39}}})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    return "                                |\r\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "                                Abgesagt\r\n";
},"9":function(container,depth0,helpers,partials,data) {
    return "                                Verschoben:\r\n";
},"11":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                                <!-- Eintägiger Termin: Ausgabe des Startdatums im Format dd. MMMM yyyy -->\r\n                                "
    + container.escapeExpression((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"startdate") : depth0),"dd. MMMM yyyy",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":49,"column":32},"end":{"line":49,"column":72}}}))
    + "\r\n";
},"13":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                                <!-- Mehrtägiger Termin: Ausgabe von Startdatum und Enddatum -->\r\n                                "
    + alias3((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"startdate") : depth0),"dd.MM.yyyy",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":52,"column":32},"end":{"line":52,"column":69}}}))
    + " - "
    + alias3((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"enddate") : depth0),"dd.MM.yyyy",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":52,"column":72},"end":{"line":52,"column":107}}}))
    + "\r\n";
},"15":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                                <br /><time>"
    + container.escapeExpression((lookupProperty(helpers,"formatDate")||(depth0 && lookupProperty(depth0,"formatDate"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"eventdate") : depth0),"HH:mm",{"name":"formatDate","hash":{},"data":data,"loc":{"start":{"line":56,"column":44},"end":{"line":56,"column":76}}}))
    + " Uhr</time>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"event-col\">\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":4},"end":{"line":63,"column":13}}})) != null ? stack1 : "")
    + "</div>\r\n";
},"useData":true});