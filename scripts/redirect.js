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