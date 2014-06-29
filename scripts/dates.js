var dl = (function(dl) {

   	/*
	Some date utility functions
    ---------------------------
    We use the following format: 
    	dd.mm.yyyy
    example:
    	29.6.2014        
    */
    
    dl.dateToString = function(date) {
        // return a string in the format
        return date.getDate().toString() + "." 
            // the month is 0-based
            + (date.getMonth()+1).toString() + "."
            + date.getFullYear().toString();
    };

    // the inverse of dateToString
    dl.stringToDate = function(str) {
        var parts = str.split('.');
        var day = parseInt(parts[0])
        // the month is 0-based
        var month = parseInt(parts[1]) - 1;
        var year = parseInt(parts[2]);

        return new Date(year, month, day);   
    };
    
    return dl;
}(dl || {}));

