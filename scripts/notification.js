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