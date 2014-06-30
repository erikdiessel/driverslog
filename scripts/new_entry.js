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
        this.header = new dl.header.controller(l.new_entry);
        
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
            dl.header.view(ctrl.header),
            
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