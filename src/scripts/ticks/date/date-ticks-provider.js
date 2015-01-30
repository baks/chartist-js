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
    		//var bestResolution = getBestResolutionBasedOnDuration(duration);

    		var newStart = this.roundDown(new Date(startDate.getTime())/*, bestResolution*/);
    		var newEnd = this.roundUp(new Date(endDate.getTime())/*, bestResolution*/);

    		var step = 1;
    		var startTick = this.getStart(newStart/*, bestResolution*/);
    		var endTick = this.addStep(newEnd, step/*, bestResolution*/);

    		var ticks = [];
    		while(startTick.valueOf() < endTick.valueOf())
    		{
    			ticks.push(startTick);
    			startTick = this.addStep(new Date(startTick.getTime()), step/*, bestResolution*/);
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
	function addStep(date, step) {
	}

	function getStart(date) {
	}

	function roundDown(date) {
	}

	function roundUp(date) {
	}
	
	function DateTicksProvider() {
	}

  // Creating date tick provider type in Chartist namespace
  Chartist.DateTicksProvider = Chartist.Base.extend({
    constructor: DateTicksProvider,
    getTicks: getTicks,
	addStep: addStep,
	roundDown: roundDown,
	roundUp: roundUp,
	getStart: getStart
  });

}(window, document, Chartist));