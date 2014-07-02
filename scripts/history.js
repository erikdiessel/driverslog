var dl = (function(dl) {
    dl.history = {};
    
    var l = {
        history: "Bisherige Einträge",
        back: "Zurück"
    }
    
    
    dl.history.controller = function() {
        this.header = new dl.header.controller(l.history);
        
        this.entryControllers = dl.log.entries.map(function(entry) {
            return new dl.entry.controller(entry);
        });
    };
    
    dl.history.view = function(ctrl) {
		return m("div", [
            dl.header.view(ctrl.header),
            
            m("div", ctrl.entryControllers.map(function(entryController) {
                return dl.entry.view(entryController);
            }))
       	]);
    };
    
    return dl;
}(dl || {}));