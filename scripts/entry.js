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