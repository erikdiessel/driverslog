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
        "/fuelStatistics": dl.fuelStatistics
    });

    // store the url in the hash => no page refreshes on old browsers
    m.route.mode = "hash";    
}, 0);
