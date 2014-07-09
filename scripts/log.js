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