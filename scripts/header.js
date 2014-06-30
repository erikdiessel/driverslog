/*
The header component
---------------------
The header is a component which represents the title,
along with a back button to the start page.
It is its own component since this part is repeated
in every page.
*/

var dl = (function(dl) {
    dl.header = {};
    
    var l = {
        back: "Zurück"
    }
    
    dl.header.controller = function(title, showBackButton) {
        this.to_start = function() {
            m.route("/");
        };
        
        this.title = title;
        
        this.showBackButton = (showBackButton == undefined || showBackButton);
    };
    
    dl.header.view = function(ctrl) {
        return m("div.topcoat-navigation-bar", [
            ctrl.showBackButton ?
            	m("button.topcoat-button.topcoat-navigation-bar__item.col-1-8.mobile-col-1-4", {onclick: ctrl.to_start}, l.back)
                :  "",                
            m("div.topcoat-navigation-bar__item.center.col-9-12.mobile-col-9-12", [
            	m("h1.topcoat-navigation-bar__title", ctrl.title)
       		])
        ]);
    };
    
   
    return dl;
}(dl || {}));
