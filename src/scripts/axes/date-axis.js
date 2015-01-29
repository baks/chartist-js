/**
 * Step axis for step based charts like bar chart or step based line chart
 *
 * @module Chartist.DateAxis
 */
/* global Chartist */
(function (window, document, Chartist) {
  'use strict';

  function DateAxis(axisUnit, axisLength, options, ticksProvider) {
    Chartist.DateAxis.super.constructor.call(this,
      axisUnit,
      axisLength,
      options);

	this.ticksProvider = ticksProvider;
    this.ticks = ticksProvider.getTicks(options.highLow);
	this.min = this.ticks[0].valueOf();
	this.range = this.ticks[this.ticks.length-1].valueOf() - this.min;
  }

  function projectValue(value) {
    return {
      pos: value * (this.axisLength / this.range) - this.min * (this.axisLength / this.range),
      len: Chartist.projectLength(this.axisLength, 1, this)
    };
  }

  Chartist.DateAxis = Chartist.Axis.extend({
    constructor: DateAxis,
    projectValue: projectValue
  });

}(window, document, Chartist));
