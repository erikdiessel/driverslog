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