var dl = (function(dl) {
    dl.start = {};
    
    var l = {
    	new_entry: "Neuer Eintrag",
        title: "Driverslog",
        history: "Bisherige Einträge",
        fuelStatistics: "Verbrauchsstatistik",
        priceStatistics: "Preisstatistik",
        mileageStatistics: "Kilometerstatistik",
        notEnoughEntries: "Noch nicht genug Einträge vorhanden.",
        entryCreated: "Eintrag erfolgreich erstellt."
    };
    
    //var l = localizations[navigator.language.substring(0,2)] || localizations['de'];
    
    

    dl.start.controller = function() {
        
        
        // notification to the user,
        // that he has to enter yet another
        // entry
        this.notEnoughEntries = 
            new dl.notification.controller(l.notEnoughEntries);
        
        // notification that a new entry is created,
        // shown when the user is routed back to the
        // start page after a successfull creation of
        // a new entry
        this.entryCreated =
            new dl.notification.controller(l.entryCreated);
        
        // subscribe to the event, that a new entry is created
        dl.log.onCreation(this.entryCreated.show);
       
        this.new_entry = function() {
            dl.redirect("/new_entry");
        };
        
        this.history = function() {
            if(dl.log.notEmpty()) {
            	dl.redirect("/history");
            }
            else {
                this.notEnoughEntries.show();
            }
        }.bind(this);
        
        this.fuelStatistics = function() {
            if(dl.log.atLeastTwoEntries()) {
		    	dl.redirect("/fuelStatistics");               
            }
            else {
                this.notEnoughEntries.show();
            }
        }.bind(this);
        
        this.priceStatistics = function() {
            if(dl.log.atLeastTwoEntries()) {
            	dl.redirect("/priceStatistics");                
            }
            else {
                this.notEnoughEntries.show();
            }
        }.bind(this);
        
        this.mileageStatistics = function() {
            if(dl.log.atLeastTwoEntries()) {
            	dl.redirect("/mileageStatistics");                
            }
            else {
                this.notEnoughEntries.show();
            }
        }.bind(this);
        
        // don't show a back button
        this.header = new dl.header.controller(l.title, false);
    };

    dl.start.view = function(ctrl) {
        return m("div", [
            dl.header.view(ctrl.header),
            
            // Show a notification with the error:
            // Not enough entries, when the corresponding
            // controller property is activated
            dl.notification.view(ctrl.notEnoughEntries),
            
            dl.notification.view(ctrl.entryCreated),
            
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