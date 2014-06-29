var dl = (function(dl) {
    dl.start = {};
    
    var l = {
    	new_entry: "Neuer Eintrag",
        title: "Driverslog",
        history: "Bisherige Einträge",
        fuelStatistics: "Verbrauchsstatistik"
    };
    
    //var l = localizations[navigator.language.substring(0,2)] || localizations['de'];
    
    

    dl.start.controller = function(){
        this.new_entry = function() {
            m.route("/new_entry");
        };
        
        this.history = function() {
            m.route("/history");
        };
        
        this.fuelStatistics = function() {
            m.route("/fuelStatistics");
        };
    };

    dl.start.view = function(ctrl) {
        return m("div", [
            m("div.topcoat-navigation-bar", [
                m("div.topcoat-navigation-bar__item.center.full", [
                    m("h1.topcoat-navigation-bar__title", l.title)   
                ])
            ]),
            
            m("button.topcoat-button.start-button", 
            	{ onclick: ctrl.new_entry },
              	l.new_entry
            ),
            
            m("button.topcoat-button.start-button", 
                { onclick: ctrl.history },
            	l.history
            ),
            
            m("button.topcoat-button.start-button",
            	{onclick: ctrl.fuelStatistics },
              	l.fuelStatistics
            )
        ]);    
    };
    
    
    return dl;
}(dl || {}));

// m.route(document.body, "/", {
//     "/": dl.start
// });