var dl = (function(dl) {
    dl.fuelStatistics = {};
    
    var l = {
        fuelStatistics: "Verbrauchsstatistik",
        back: "Zurück"
    }
    
    
    dl.fuelStatistics.controller = function() {
        this.to_start = function() {
            m.route("/");
        };
        
        this.render = function() {
        	var context = document.getElementById('chart').getContext('2d');
            var chart = new Chart(context).Line({
                labels: ["Januar", "Februar"],
                datasets: [{
                    fillColor : "rgba(220,220,220,0.5)",
                    strokeColor : "rgba(220,220,220,1)",
                    pointColor : "rgba(220,220,220,1)",
                    pointStrokeColor : "#fff",
                    data: [20,40]
                }]
            });
        };
        
        // render the chart *after* the view was rendered
        setTimeout(this.render, 0);
    };
    
    dl.fuelStatistics.view = function(ctrl) {
		return m("div", [
            m("div.topcoat-navigation-bar", [
                m("button.topcoat-button.topcoat-navigation-bar__item.col-1-8.mobile-col-1-4", {onclick: ctrl.to_start}, l.back),                
                m("div.topcoat-navigation-bar__item.center.col-9-12.mobile-col-9-12", [
                    m("h1.topcoat-navigation-bar__title", l.fuelStatistics)
                ])
            ]),
            
            m("canvas#chart", {
                width: document.body.clientWidth - 60,
                height: document.body.clientHeight - 100
            })
       ]);
    };
    
    return dl;
}(dl || {}));