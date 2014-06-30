var dl = (function(dl) {
    
    dl.mileageStatistics = {};
    
    var l = {
        mileageStatistics: "Kilometerstandsstatistik"
    };
    
    dl.mileageStatistics.controller = function() {
        this.header = new dl.header.controller(l.mileageStatistics);
        
        this.chart = new dl.chart.controller(
        	dl.log.equidistantDates(),
            dl.log.equidistantMileages()
        );
    }
    
    dl.mileageStatistics.view = function(ctrl) {
        return m("div", [
            dl.header.view(ctrl.header),
            
            dl.chart.view(ctrl.chart)
        ]);
    };
    
    return dl;
}(dl || {}))