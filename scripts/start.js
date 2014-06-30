var dl = (function(dl) {
    dl.start = {};
    
    var l = {
    	new_entry: "Neuer Eintrag",
        title: "Driverslog",
        history: "Bisherige Einträge",
        fuelStatistics: "Verbrauchsstatistik",
        priceStatistics: "Preisstatistik",
        mileageStatistics: "Kilometerstatistik"
    };
    
    //var l = localizations[navigator.language.substring(0,2)] || localizations['de'];
    
    

    dl.start.controller = function() {
        this.new_entry = function() {
            m.route("/new_entry");
        };
        
        this.history = function() {
            m.route("/history");
        };
        
        this.fuelStatistics = function() {
            m.route("/fuelStatistics");
        };
        
        this.priceStatistics = function() {
            m.route("/priceStatistics");
        };
        
        this.mileageStatistics = function() {
            m.route("/mileageStatistics");
        }
        
        // don't show a back button
        this.header = new dl.header.controller(l.title, false);
    };

    dl.start.view = function(ctrl) {
        return m("div", [
            dl.header.view(ctrl.header),
            
            m("button.topcoat-button.start-button", 
            	{ onclick: ctrl.new_entry },
              	l.new_entry
            ),
            
            m("button.topcoat-button.start-button", 
                { onclick: ctrl.history },
            	l.history
            ),
            
            m("button.topcoat-button.start-button",
            	{ onclick: ctrl.fuelStatistics },
              	l.fuelStatistics
            ),
            
            m("button.topcoat-button.start-button",
             	{ onclick: ctrl.priceStatistics }, 
             	l.priceStatistics
            ),
            
			m("button.topcoat-button.start-button",
             	{ onclick: ctrl.mileageStatistics }, 
             	l.mileageStatistics
            )
        ]);    
    };
    
    
    return dl;
}(dl || {}));