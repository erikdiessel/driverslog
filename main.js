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
#### Chart.js
minimal library for creating graphs
#### localStorage
allow us to persist the data locally, so the app can
be used like a native app
#### gulp.js:
building our files, smaller code as grunt.
Allows us, to split the js-code into multiple files
and combine them in production.
#### Plidoc
produces the documentation, allows us to do literate-
style programming => better documentation
*/

var start = {};

start.controller = function(){
    this.new_entry = function() {
        m.route("/new_entry");
    };
};

start.view = function(ctrl) {
    return m("div", [
        m("div.topcoat-navigation-bar", [
    		m("div.topcoat-navigation-bar__item.center.full", [
        		m("h1.topcoat-navigation-bar__title", "DriversLog")   
        	])
    	]),
        m("button.topcoat-button", {onclick: ctrl.new_entry}, "Create new item")
	]);    
};



/*
The new_entry module 
----------------------
*/

var new_entry = {};

new_entry.controller = function(){
    this.to_start = function() {
        m.route("/");
    }
};

new_entry.view = function(ctrl) {
    return m("div", [
        m("div.topcoat-navigation-bar", [
            m("div.topcoat-navigation-bar__item.center.full", [
                m("h1.topcoat-navigation-bar__title", "Create new Entry")
            ])
        ]),
        m("button.topcoat-button", {onclick: ctrl.to_start}, "Back")
    ]);
};


/*
The routes
----------
*/

m.route(document.body, "/", {
    "/": start,
    "/new_entry": new_entry
});

// store the url in the hash => no page refreshes on old browsers
m.route.mode = "hash";