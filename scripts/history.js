var dl = (function(dl) {
    dl.history = {};
    
    var l = {
        history: "Bisherige Einträge",
        back: "Zurück"
    }
    
    
    dl.history.controller = function() {
        this.to_start = function() {
            m.route("/");
        };
    };
    
    dl.history.view = function(ctrl) {
		return m("div", [
            m("div.topcoat-navigation-bar", [
                m("button.topcoat-button.topcoat-navigation-bar__item.col-1-8.mobile-col-1-4", {onclick: ctrl.to_start}, l.back),                
                m("div.topcoat-navigation-bar__item.center.col-9-12.mobile-col-9-12", [
                    m("h1.topcoat-navigation-bar__title", l.history)
                ])
            ])
       ]);
    };
    
    return dl;
}(dl || {}));