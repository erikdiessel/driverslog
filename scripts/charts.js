/* The chart component
---------------------
This component represents a chart, together with the view.
*/

var dl = (function(dl) {
    
    dl.chart = {};
    
    dl.chart.controller = function(labels, values) {
        
    	this.render = function(id, labels, values) {
            console.log(id);
            var context = document.getElementById(id).getContext('2d');
            var chart = new Chart(context).Line({
                labels: labels,
                datasets: [{
                    fillColor : "rgba(220,220,220,0.5)",
                    strokeColor : "rgba(220,220,220,1)",
                    pointColor : "rgba(220,220,220,1)",
                    pointStrokeColor : "#fff",
                    data: values
                }]
            }, {
                scaleFontColor: "#fff",
                animation: false
            });    
        };
        
        setTimeout(this.render.bind(this, 'chart', labels, values), 0);
    };
    
	dl.chart.view = function(ctrl) {
    	return m("canvas#chart", {
        	width: document.body.clientWidth - 60,
           	height: document.body.clientHeight - 100
        });
    };
                   
    return dl;
}(dl || {}));