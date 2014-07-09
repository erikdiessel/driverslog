var dl = (function(dl) {
    
    dl.priceStatistics = {};
    
    l = {
        priceStatistics: "Preisstatistik: Preis pro l in ct"
    }
    
    dl.priceStatistics.controller = function() {
    	this.header = new dl.header.controller(l.priceStatistics);    

        this.chart = new dl.chart.controller(
        	dl.log.equidistantDates(),
            dl.log.equidistantPrices()
        );
    };
    
    dl.priceStatistics.view = function(ctrl) {
    	return m('div', [
            dl.header.view(ctrl.header),
            
            dl.chart.view(ctrl.chart)
        ]);    
    };
    
    return dl;
}(dl || {}));