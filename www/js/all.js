/* The chart component
---------------------
This component represents a chart, together with the view.
*/

var dl = (function(dl) {
    
    dl.chart = {};
    
    dl.chart.controller = function(labels, values) {
        
    	this.render = function(id, labels, values) {
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
        	width: document.body.clientWidth - 5,
           	height: document.body.clientHeight - 100
        });
    };
                   
    return dl;
}(dl || {}));
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


/*
The entry component
----------------

The entry component represents an entry as 
it's shown to a human.
*/

var dl = (function() {
    
    dl.entry = {};
    
    var l = {
        date: "Datum: ",
        price: "Preis pro l: ",
        amount: "Tankmenge: ",
        mileage: "Kilometerstand: "
    }
    
    
    // The parameter *entry* is of type Entry,
    // as defined in log.js (an object with
    // the properties:
    // date, price, amount, mileage, description )
    dl.entry.controller = function(entry) {
        this.date = dl.dateToString(entry.date)
        this.price = entry.price.toString() + " €";
        this.amount = entry.amount.toString() + " l";
        this.mileage = entry.mileage.toString() + " km"; 
        this.description = entry.description
    };
    
    dl.entry.view = function(ctrl) {
    	return m("div.topcoat-list", [
            m("h3.topcoat-list__header", ctrl.description),
            m("ul.topcoat-list__container", [
                
                m("li.topcoat-list__item", [
                	m("span.entry-label", l.date),
                    m("span", ctrl.date)
                ]),
                
                m("li.topcoat-list__item", [
                	m("span.entry-label", l.price),
                    m("span", ctrl.price)
                ]),    
                
                m("li.topcoat-list__item", [
                	m("span.entry-label", l.amount),
                    m("span", ctrl.amount)
                ]),
                
                m("li.topcoat-list__item", [
                	m("span.entry-label", l.mileage),
                    m("span", ctrl.mileage)
                ])    
                
            ])
        ]);    
    };
    
    return dl;
}(dl || {}));
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
            dl.redirect("/");
        };
        
        this.title = title;
        
        this.showBackButton = (showBackButton == undefined || showBackButton);
    };
    
    dl.header.view = function(ctrl) {
        return m("div.topcoat-navigation-bar", [
            ctrl.showBackButton ?
            	m("button.topcoat-button.topcoat-navigation-bar__item.col-1-4", {onclick: ctrl.to_start}, l.back)
                :  "",                
            m("div.topcoat-navigation-bar__item.center.header", [
            	m("h1.topcoat-navigation-bar__title", ctrl.title)
       		])
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
        
        /*
        In Android 2.3 there is a bug:
        When trying to save a date object as JSON and then
        parsing the JSON, the JSON object is invalid, such
        that the date, month, year - fields are NaN.
        
        To solve this issue we simply store timestamps
        instead of Date objects. We therefore have to convert
        the timestamps to dates in the constructor, and
        in the *persist* function, we have to convert the
        dates to timestamps and then stringify the data as JSON.
        */
        
        this.entries = localStorage.getItem('dl.entries') ?
            JSON.parse(localStorage.getItem('dl.entries')) :
        	[];
        this.entries.forEach(function(entry) {
            // timestamp to date
            entry.date = new Date(entry.date);
        });
        
        
        this.persist = function() {
            this.entries.forEach(function(entry) {
                // date to timestamp
            	entry.date = entry.date.getTime(); 	    
            });      
            
            localStorage.setItem('dl.entries', JSON.stringify(this.entries));
            
            // and timestamps back to dates
            this.entries.forEach(function(entry) {
                entry.date = new Date(entry.date);
            });
        };
        
        this.notEmpty = function() {
            return this.entries.length > 0;
        };
        
        this.atLeastTwoEntries = function() {
            return this.entries.length >= 2;
        }
        
        // Returns whether the given values constitute a valid entry
        this.validEntry = function(date, amount, price, mileage) {
            return 5.0 < amount  && amount < 400.0
            	&& 100.0 < price && price < 200.0 
            	&& 1 < mileage && mileage < 1000000; 
        }
        
        // Registers a callback which is fired when a new entry
        // is created. In this way, other modules can subscribe
        // which did not trigger the creation of a new entry,
        // for example the start page which wants to show a
        // notification to inform the user.
        this.onCreationCallback = function(){}; // empty function
        
        this.onCreation = function(func) {
            this.onCreationCallback = func;
        }
        
        this.addEntry = function(description, date, amount, price, mileage) {
            this.entries.push({
                description: description,
                date: date,
                amount: amount,
                price: price,
                mileage: mileage
            });
            
            this.persist();
            
            // fire registered callback for the creation event,
            // but with a delay, such that the start page
            // is loaded before
            setTimeout(this.onCreationCallback, 500);
        };
        
        // Returns an array of the average consumption
        // of fuel per 100 km belonging to the entries
        this.averageConsumptions = function() {
            var consumptions = [];
            for(var i=0; i<this.entries.length-1; i++) {
                var before = this.entries[i];
                var after = this.entries[i+1];
                var distance = after.mileage - before.mileage;
                var consumption = after.amount / distance * 100;
                consumptions.push(consumption);
            }
            return consumptions;
        };
        
        this.dateStrings = function() {
        	return this.entries.slice(1).map(function(entry) {
            	return dl.dateToString(entry.date);    
            });  
        };
        
        
        // Returns a list of entries, which are not real
        // but match the values for the real entries,
        // when the dates match.
        // This provides us with an option to plot a graph
        // where the x-axis is proportional to the time.
        
        // Parameters:
        // n: Number of *virtual* entries
        this.equidistantVirtualEntries = function(n) {
            
            // return the empty list when the list of entries
            // is empty, to prevent problems
            if(this.entries.length == 0) {
                return [];
            }
            
        	var timestamps = this.entries.map(function(entry) {
                return entry.date.getTime();
            });
            
            // ugly hack to allow to pass an array as the arguments
            // list to Math.min / Math.max
            var first = Math.min.apply(null, timestamps);
            var last = Math.max.apply(null, timestamps);
            
            // The rounding error is negligeable since we
            // have a millisecond precision and time periods
            // of days.
            // We floor the values because the the 
            // computed timestap of the last virtual
            // entry is smaller than that of the last
            // real entry. This makes the formulation
            // of a loop-condition easier.
            var step = Math.floor((last - first) / (n - 1));
            
            // We are assuming that the entries are ordered
            // by their date values
            
            var entryIndex = 0;
            
            var virtualEntries = [];
            
            for(var i=0; i < n; i++) {
                var currentTimestamp = first + i * step;
                
                while(this.entries[entryIndex].date.getTime() < currentTimestamp) {
                    entryIndex++;
                }
                
                // The *entryIndex* is now the index of the first entry which
                // has is directly after our current virtual entry in time
                // We can therefore simply copy its values but we have 
                // to change the date.
             
                
                var clonedEntry = this.entries[entryIndex];
                
                virtualEntries.push({
                    date: new Date(currentTimestamp),
                    price: clonedEntry.price,
                    amount: clonedEntry.amount,
                    mileage: clonedEntry.mileage
                });
            }
            
            return virtualEntries;
        }
        
        /*
        The constant STEPS stores the number of labels which
        are used in equidistant date-charts.
        */
        
        var STEPS = 20;  
        
        
        // Returns a list of dates which are equidistant, 
        // using equidistantVirtualEntries
        // Should be used by the chart-creation function.
        this.equidistantDates = function() {
            return this.equidistantVirtualEntries(STEPS).map(function(entry) {
            	return dl.dateToString(entry.date);    
            });
        };
        
        // The corresponding prices for the equidistant dates
        this.equidistantPrices = function() {
            return this.equidistantVirtualEntries(STEPS).map(function(entry) {
                return entry.price;
            });
        };
        
        // The corresponding mileage values for the equidistant dates
        this.equidistantMileages = function() {
            return this.equidistantVirtualEntries(STEPS).map(function(entry) {
                return entry.mileage;
            });
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
    
    When storing as JSON, the date-attribute is converted automatically
    to a string. We therefore have to convert the back when
    repopulating our entries list on startup.
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
        "/fuelStatistics": dl.fuelStatistics,
        "/priceStatistics": dl.priceStatistics,
        "/mileageStatistics": dl.mileageStatistics
    });

    // store the url in the hash => no page refreshes on old browsers
    m.route.mode = "hash";    
}, 0);

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
        price: "Preis pro l in ct",
        create: "Erstellen",
        mileage: "Kilometerstand",
        incorrectInputs: "Einige Daten fehlen noch."
    }
    

    dl.new_entry.controller = function() {
        this.header = new dl.header.controller(l.new_entry);
        
        this.description = m.prop("");
        // standard is the current date
        this.date = m.prop(dl.dateToString(new Date()));
        this.amount = m.prop("");
        this.price = m.prop("");
        this.mileage = m.prop("");
        
        
        // notification for showing the user that they made
        // some mistakes when entering their data
        this.incorrectInputs = 
            new dl.notification.controller(l.incorrectInputs);

        
        
        this.create = function() {
            var description = this.description();
            var date = dl.stringToDate(this.date());
            var amount = parseFloat(this.amount());
            var price = parseFloat(this.price());
            var mileage = parseFloat(this.mileage());
            
            if (dl.log.validEntry(date, amount, price, mileage)) {
                dl.log.addEntry(
                    description,
                    date,
                    amount,
                    price,
                    mileage
                );
                // go back to the start page
                dl.redirect("/");
            }
            else {
            	this.incorrectInputs.show();    
            }            
            
        }.bind(this);
    };

    dl.new_entry.view = function(ctrl) {
        return m("div", [
            dl.header.view(ctrl.header),
            
            dl.notification.view(ctrl.incorrectInputs),
            
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
                    min: 100,
                    max: 200,
                    step: 0.1
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
/*
Notification component
---------------------

A notification is a small message about an event,
to give some information to the user.
*/

var dl = (function(dl) {
    dl.notification = {};
    
    dl.notification.controller = function(message) {
        this.message = message;
        
        // property which controls whether the
        // notification is currently displayed
        this.showing = m.prop(false);
        
        this.show = function() {
            // display the notification for some time
            this.showing(true);
            
            var DISPLAY_TIME = 4000; // 5 seconds
            
            // after some time, hide the notification
            setTimeout(function() {
                this.showing(false);
                // refresh the view
                // Needed, because this is an asynchronous
                // operation.
                m.redraw();
            }.bind(this), DISPLAY_TIME);
        }.bind(this);
    };
    
    dl.notification.view = function(ctrl) {
        return ctrl.showing() ?
            m("span.topcoat-notification.center", ctrl.message) :
        	""; 	
    };
    
    
    return dl;
}(dl || {}));
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
/*
Redirect utility
---------------

Mithril uses the pushState-API for
routing. Since the pushState-API is buggy in
Android 2.3 - 4.0 we need a new function
for routing to a new page.
We change the window.location property manually
and then trigger the standard Mithril route function.
*/

var dl = (function(dl) {
    
    dl.redirect = function(path) {
    	window.location.hash = path;
        m.route(path);
    };
    
    return dl;
}(dl || {}));
var dl = (function(dl) {
    dl.start = {};
    
    var l = {
    	new_entry: "Neuer Eintrag",
        title: "Driverslog",
        history: "Bisherige Einträge",
        fuelStatistics: "Verbrauchsstatistik",
        priceStatistics: "Preisstatistik",
        mileageStatistics: "Kilometerstatistik",
        notEnoughEntries: "Noch nicht genug Einträge vorhanden.",
        entryCreated: "Eintrag erfolgreich erstellt."
    };
    
    //var l = localizations[navigator.language.substring(0,2)] || localizations['de'];
    
    

    dl.start.controller = function() {
        
        
        // notification to the user,
        // that he has to enter yet another
        // entry
        this.notEnoughEntries = 
            new dl.notification.controller(l.notEnoughEntries);
        
        // notification that a new entry is created,
        // shown when the user is routed back to the
        // start page after a successfull creation of
        // a new entry
        this.entryCreated =
            new dl.notification.controller(l.entryCreated);
        
        // subscribe to the event, that a new entry is created
        dl.log.onCreation(this.entryCreated.show);
       
        this.new_entry = function() {
            dl.redirect("/new_entry");
        };
        
        this.history = function() {
            if(dl.log.notEmpty()) {
            	dl.redirect("/history");
            }
            else {
                this.notEnoughEntries.show();
            }
        }.bind(this);
        
        this.fuelStatistics = function() {
            if(dl.log.atLeastTwoEntries()) {
		    	dl.redirect("/fuelStatistics");               
            }
            else {
                this.notEnoughEntries.show();
            }
        }.bind(this);
        
        this.priceStatistics = function() {
            if(dl.log.atLeastTwoEntries()) {
            	dl.redirect("/priceStatistics");                
            }
            else {
                this.notEnoughEntries.show();
            }
        }.bind(this);
        
        this.mileageStatistics = function() {
            if(dl.log.atLeastTwoEntries()) {
            	dl.redirect("/mileageStatistics");                
            }
            else {
                this.notEnoughEntries.show();
            }
        }.bind(this);
        
        // don't show a back button
        this.header = new dl.header.controller(l.title, false);
    };

    dl.start.view = function(ctrl) {
        return m("div", [
            dl.header.view(ctrl.header),
            
            // Show a notification with the error:
            // Not enough entries, when the corresponding
            // controller property is activated
            dl.notification.view(ctrl.notEnoughEntries),
            
            dl.notification.view(ctrl.entryCreated),
            
            m("button.topcoat-button.start-button", 
            	{ onclick: ctrl.new_entry },
              	l.new_entry
            ),
            
            m("button.topcoat-button.start-button", 
                { onclick: ctrl.history },
            	l.history
            ),
            
            m("button.topcoat-button.start-button",
            	{ onclick: ctrl.fuelStatistics },
              	l.fuelStatistics
            ),
            
            m("button.topcoat-button.start-button",
             	{ onclick: ctrl.priceStatistics }, 
             	l.priceStatistics
            ),
            
			m("button.topcoat-button.start-button",
             	{ onclick: ctrl.mileageStatistics }, 
             	l.mileageStatistics
            )
        ]);    
    };
    
    
    return dl;
}(dl || {}));