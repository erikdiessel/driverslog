var dl = (function(dl) {
    dl.history = {};
    
    var l = {
        history: "Bisherige Einträge",
        back: "Zurück"
    }
    
    
    dl.history.controller = function() {
        this.header = new dl.header.controller(l.history);
        
    };
    
    dl.history.view = function(ctrl) {
		return m("div", [
            dl.header.view(ctrl.header)
       ]);
    };
    
    return dl;
}(dl || {}));