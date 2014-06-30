var dl = (function(dl) {
    dl.fuelStatistics = {};
    
    var l = {
        fuelStatistics: "Verbrauchsstatistik"
    }
    
    
    dl.fuelStatistics.controller = function() {
        this.header = new dl.header.controller(l.fuelStatistics);
        
        this.chart = new dl.chart.controller(
        	dl.log.dateStrings(),
            dl.log.averageConsumptions()
        );
    };
    
    dl.fuelStatistics.view = function(ctrl) {
		return m("div", [
            dl.header.view(ctrl.header),
            
            dl.chart.view(this.chart)
       ]);
    };
    
    return dl;
}(dl || {}));