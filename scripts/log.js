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
        
        
        // The date-values are serialzed as strings in the JSON-format
        // we therefore have to convert the strings back to Date-instances.
        this.entries.forEach(function(entry) {
        	entry.date = new Date(Date.parse(entry.date));    
        });
        
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