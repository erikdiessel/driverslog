/*
The entry component
----------------

The entry component represents an entry as 
it's shown to a human.
*/

var dl = (function() {
    
    var dl.entry = {};
    
    var l = {
        date: "Datum",
        price: "Preis pro l",
        amount: "Tankmenge",
        mileage: "Kilometerstand"
    }
    
    
    // The parameter *entry* is of type Entry,
    // as defined in log.js (an object with
    // the properties: date, price, amount mileage)
    dl.entry.controller = function(entry) {
        this.date = dl.dateToString(entry.date)
        this.price = entry.price;
        this.amount = entry.amount;
        this.mileage = entry.mileage;
    };
    
    dl.entry.view = function(ctrl) {
    	return m("div", [
            
        ]);    
    };
    
    return dl;
}(dl || {}));