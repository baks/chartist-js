/**
 * Date Ticks Provider
 *
 * 
 *
 * @module Chartist.DateTicksProvider
 */
/* global Chartist */
(function(window, document, Chartist){
  'use strict';
function getTicks(highLow) {
    		var startDate = highLow.low;
    		var endDate = highLow.high;

    		var duration = endDate - startDate;
    		var bestResolution = getBestResolutionBasedOnDuration(duration);

    		var newStart = roundDown(new Date(startDate.getTime()), bestResolution);
    		var newEnd = roundUp(new Date(endDate.getTime()), bestResolution);

    		var step = 1;
    		var startTick = getStart(newStart, bestResolution);
    		var endTick = addStep(newEnd, step, bestResolution);

    		var ticks = [];
    		while(startTick.valueOf() < endTick.valueOf())
    		{
    			ticks.push(new Date(startTick.getTime()));
    			startTick = addStep(startTick, step, bestResolution);
    		}
    		return ticks;
    	}

  	function getBestResolutionBasedOnDuration(duration) {
  		if(duration > 31556952000)
  		{
  			return 0;
  		}
  		if(duration > 2592000000)
  		{
  			return 1;
  		}
  		if(duration > 86400000)
  		{
  			return 2;
  		}
  		if(duration > 3600000)
  		{
  			return 3;
  		}
  		if(duration > 60000)
  		{
  			return 4;
  		}
  		if(duration > 1000)
  		{
  			return 5;
  		}

  		return 6;
  	}

  	function addStep(date, step, resolution) {
    		var res = date;
    		switch (resolution)
    		{
    			case 0:
    				res.setFullYear(date.getFullYear() + step);
    				break;
    			case 1:
    				res.setMonth(date.getMonth() + step);
    				break;
    			case 2:
    				res.setDate(date.getDate() + step);
    				break;
    			case 3:
    				res.setHours(date.getHours() + step);
    				break;
    			case 4:
    				res.setMinutes(date.getMinutes() + step);
    				break;
    			case 5:
    				res.setSeconds(date.getSeconds() + step);
    				break;
    			case 6:
    				res.setMilliseconds(date.getMilliseconds() + step);
    				break;
    			default:
    				break;
    		}
    		return res;
    	}

    	function getStart(date, resolution) {
    		var res = date;
    		switch (resolution) {
    		    case 0:
    		        res = new Date(date.getFullYear(),1, 0,0,0,0,0);
    		        break;
    		    case 1:
  				    res = new Date(date.getFullYear(), date.getMonth(),  1, 0,0,0,0);
    		        break;
    		    case 2:
  				    res = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0,0,0,0);
    		        break;
    		    case 3:
    		        res = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),0,0,0);
    		        break;
    		    case 4:
    		        res = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),date.getMinutes(),0,0);
    		        break;
    		    case 5:
    		        res = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),date.getMinutes(),date.getSeconds(),0);
    		        break;
    		    case 6:
    		        res = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),date.getMinutes(),date.getSeconds(),date.getMilliseconds());
    		        break;
    		    default:
    		        break;
    		}
    		return res;
    	}

    	function roundDown(date, resolution) {
    		var res = date;
    		switch (resolution)
    		{
  			case 0:
    		        res = new Date(date.getFullYear(),1, 0,0,0,0,0);
    		        break;
    		    case 1:
  				    res = new Date(date.getFullYear(), date.getMonth(),  1, 0,0,0,0);
    		        break;
    		    case 2:
  				    res = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0,0,0,0);
    		        break;
    		    case 3:
    		        res = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),0,0,0);
    		        break;
    		    case 4:
    		        res = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),date.getMinutes(),0,0);
    		        break;
    		    case 5:
    		        res = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),date.getMinutes(),date.getSeconds(),0);
    		        break;
    		    case 6:
    		        res = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),date.getMinutes(),date.getSeconds(),date.getMilliseconds());
    		        break;
    		    default:
    		        break;
    		}

    		return res;
    	}

    	function roundUp(date, resolution) {
    	    var res = roundDown(date, resolution);
  		    switch (resolution)
  		    {
    			case 0:
    				res.setFullYear(date.getFullYear() + 1);
    				break;
    			case 1:
    				res.setMonth(date.getMonth() + 1);
    				break;
    			case 2:
    				res.setDate(date.getDate() + 1);
    				break;
    			case 3:
    				res.setHours(date.getHours() + 1);
    				break;
    			case 4:
    				res.setMinutes(date.getMinutes() + 1);
    				break;
    			case 5:
    				res.setSeconds(date.getSeconds() + 1);
    				break;
    			case 6:
    				res.setMilliseconds(date.getMilliseconds() + 1);
    				break;
    			default:
    				break;
    		    }

    		return res;
    	}
	
	function DateTicksProvider() {
	}

  // Creating date tick provider type in Chartist namespace
  Chartist.DateTicksProvider = Chartist.Base.extend({
    constructor: DateTicksProvider,
    getTicks: getTicks
  });

}(window, document, Chartist));