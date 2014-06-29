var dl = (function(dl) {

   	/*
	Some date utility functions
    ---------------------------
    We use the following format: 
    	dd.mm.yyyy
    example:
    	29.6.2014        
    */
    
    dl.dateToString = function(date) {
        // return a string in the format
        return date.getDate().toString() + "." 
            // the month is 0-based
            + (date.getMonth()+1).toString() + "."
            + date.getFullYear().toString();
    };

    // the inverse of dateToString
    dl.stringToDate = function(str) {
        var parts = str.split('.');
        var day = parseInt(parts[0])
        // the month is 0-based
        var month = parseInt(parts[1]) - 1;
        var year = parseInt(parts[2]);

        return new Date(year, month, day);   
    };
    
    return dl;
}(dl || {}));


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
/*
The log 
-------
The log represents the model of the driverslog.
It provides the functionality to create new entries,
compute statistics, as well as persisting the data
in localstorage.
*/


var dl = (function(dl) {
    // The constructor for our log
    var Log = function() {
        this.entries = localStorage.getItem('dl.entries') ?
            JSON.parse(localStorage.getItem('dl.entries')) :
        	[];
        
        this.persist = function() {
            localStorage.setItem('dl.entries', JSON.stringify(this.entries));
        };
        
        this.addEntry = function(description, date, amount, price, mileage) {
            this.entries.push({
                description: description,
                date: date,
                amount: amount,
                price: price,
                mileage: mileage
            });
            
            this.persist();
        };
        
        // Returns an array of the average consumption
        // of fuel per 100 km belonging to the entries
        this.averageConsumptions = function() {
            var consumptions;
            for(var i=0; i<this.entries.length-1; i++) {
                var before = this.entries[i];
                var after = this.entries[i+1];
                var distance = after.mileage - before.mileage;
                var consumption = after.amount / distance * 100;
                consumptions.push(consumption);
            }
            return consumption;
        };
        
        
    };
   
    /*
    An entry
    --------
    To permit storing entries directly as JSON, we use native
    objects without any functions attached.
    The type of an entry is therefore the following:
    
    Entry:
    {
    	description: String,
        date: Date,
        amount: float,
        price: float
    }
    */
        
    
    /*
    The dl.log provides access to the Log as a singleton object.
    Because the constructor isn't public, we ensure that there
    is only one instance of the log around, so that there are
    no conflicts when using the localstorage.
    */
    
    dl.log = new Log();
    
    return dl;

}(dl || {}));
/*
DriversLog
==========

DriversLog is a mobile webapp for saving and analyzing
all informantion belonging to car tours.

Goals
-----

* high performance, native-like, even on old Android devices
* using only minimal libraries
* use *modern* web technologies
* intuitive, clean and minimalistic user interface

Application architecture
------------------------

To archieve these goals we use the following libraries:

#### Mithril
efficient data binding from model to view, with
very good performance
#### Topcoat
provides the UI-building blocks. Very good performance
uses only CSS => minimal
#### Simple-Grid
provides a grid system for layout, doesn't include other
styles or modifications so that it can be used along Topcoat
#### Chart.js
minimal library for creating graphs
#### localStorage
allows us to persist the data locally, so the app can
be used like a native app
#### gulp.js:
building our files, smaller code as grunt.
Allows us, to split the js-code into multiple files
and combine them in production.
#### Plidoc
produces the documentation, allows us to do literate-
style programming => better documentation
*/

/*
The main part 
------------
*/

// The app namespace
//var dl = {};









/*
The routes
----------

We need to set the routes *after* all the modules
were definied. Therefore we wrap this in a timeout with
0 ms to ensure, it's queued at the end of the execution queue,
so it get's executed at the end.

*/


setTimeout(function() {
    m.route(document.body, "/", {
        "/": dl.start,
        "/new_entry": dl.new_entry,
        "/history": dl.history,
        "/fuelStatistics": dl.fuelStatistics
    });

    // store the url in the hash => no page refreshes on old browsers
    m.route.mode = "hash";    
}, 0);

/*
The new_entry module 
----------------------
*/

var dl = (function(dl) {

    dl.new_entry = {};
    
    var l = {
        new_entry: "Neuer Eintrag",
        back: "Zurück",
        description: "Beschreibung",
        date: "Datum",
        amount: "Tankmenge in l",
        price: "Preis pro l",
        create: "Erstellen",
        mileage: "Kilometerstand"
    }
    

    dl.new_entry.controller = function() {
        this.to_start = function() {
            m.route("/");
        };
        
        this.description = m.prop("");
        // standard is the current date
        this.date = m.prop(dl.dateToString(new Date()));
        this.amount = m.prop("");
        this.price = m.prop("");
        this.mileage = m.prop("");

        this.create = function() {
            dl.log.addEntry(
                this.description(),
                dl.stringToDate(this.date()),
                parseFloat(this.amount()),
                parseFloat(this.price()),
                parseFloat(this.mileage())
            );
        }.bind(this);
    };

    dl.new_entry.view = function(ctrl) {
        return m("div", [
            m("div.topcoat-navigation-bar", [
                m("button.topcoat-button.topcoat-navigation-bar__item.col-1-8.mobile-col-1-4", {onclick: ctrl.to_start}, l.back),                
                m("div.topcoat-navigation-bar__item.center.col-9-12.mobile-col-9-12", [
                    m("h1.topcoat-navigation-bar__title", l.new_entry)
                ])
            ]),
            
            m("div.field.col-1-1.mobile-col-1-1", [
                m("label.col-5-12.mobile-col-5-12", l.description),
                m("input.topcoat-text-input.col-7-12.mobile-col-7-12", {
                    onchange: m.withAttr("value", ctrl.description),
                    value: ctrl.description(),
                    placeholder: l.description
                })              
            ]),
            
            m("div.field.col-1-1.mobile-col-1-1", [
                m("label.col-5-12.mobile-col-5-12", l.date),
                m("input.topcoat-text-input.col-7-12.mobile-col-7-12", {
                    onchange: m.withAttr("value", ctrl.date),
                    value: ctrl.date(),
                    placeholder: l.date
                })
            ]),
            
            m("div.field.col-1-1.mobile-col-1-1", [
                m("label.col-5-12.mobile-col-5-12", l.amount),
                m("input[type=number].topcoat-text-input.col-7-12.mobile-col-7-12", {
                    onchange: m.withAttr("value", ctrl.amount),
                    value: ctrl.amount(),
                    placeholder: l.amount,
                    min: 0,
                    max: 100,
                    step: 0.1
                })
            ]),
          
            m("div.field.col-1-1.mobile-col-1-1", [
                m("label.col-5-12.mobile-col-5-12", l.price),
                m("input[type=number].topcoat-text-input.col-7-12.mobile-col-7-12", {
                    onchange: m.withAttr("value", ctrl.price),
                    value: ctrl.price(),
                    placeholder: l.price,
                    min: 1.00,
                    max: 2.00,
                    step: 0.01
                })
            ]),
            
            m("div.field.col-1-1.mobile-col-1-1", [
                m("label.col-5-12.mobile-col-5-12", l.mileage),
                m("input[type=number].topcoat-text-input.col-7-12.mobile-col-7-12", {
                    onchange: m.withAttr("value", ctrl.mileage),
                    value: ctrl.mileage(),
                    placeholder: l.mileage,
                    min: 1,
                    max: 999999,
                })
            ]),
            
            m("button.topcoat-button--cta.col-1-1.mobile-col-1-1", {
                onclick: ctrl.create
            }, l.create)
            
        ]);
    };
    
    return dl;
}(dl || {}));

// m.route(document.body, "/", {
//     "/new_entry": dl.new_entry
// });

	

var dl = (function(dl) {
    dl.start = {};
    
    var l = {
    	new_entry: "Neuer Eintrag",
        title: "Driverslog",
        history: "Bisherige Einträge",
        fuelStatistics: "Verbrauchsstatistik"
    };
    
    //var l = localizations[navigator.language.substring(0,2)] || localizations['de'];
    
    

    dl.start.controller = function(){
        this.new_entry = function() {
            m.route("/new_entry");
        };
        
        this.history = function() {
            m.route("/history");
        };
        
        this.fuelStatistics = function() {
            m.route("/fuelStatistics");
        };
    };

    dl.start.view = function(ctrl) {
        return m("div", [
            m("div.topcoat-navigation-bar", [
                m("div.topcoat-navigation-bar__item.center.full", [
                    m("h1.topcoat-navigation-bar__title", l.title)   
                ])
            ]),
            
            m("button.topcoat-button.start-button", 
            	{ onclick: ctrl.new_entry },
              	l.new_entry
            ),
            
            m("button.topcoat-button.start-button", 
                { onclick: ctrl.history },
            	l.history
            ),
            
            m("button.topcoat-button.start-button",
            	{onclick: ctrl.fuelStatistics },
              	l.fuelStatistics
            )
        ]);    
    };
    
    
    return dl;
}(dl || {}));

// m.route(document.body, "/", {
//     "/": dl.start
// });