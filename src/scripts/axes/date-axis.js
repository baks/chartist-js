/**
 * Step axis for step based charts like bar chart or step based line chart
 *
 * @module Chartist.DateAxis
 */
/* global Chartist */
(function (window, document, Chartist) {
  'use strict';

  function DateAxis(axisUnit, axisLength, options) {
    Chartist.DateAxis.super.constructor.call(this,
      axisUnit,
      axisLength,
      options);

    this.bounds = Chartist.getBounds(this.axisLength, options.highLow, options.scaleMinSpace, options.referenceValue);
  }

  function projectValue(value) {
    return {
      pos: value * (this.axisLength / this.bounds.range) - bounds.min * (this.axisLength / this.bounds.range),
      len: Chartist.projectLength(this.axisLength, this.bounds.step, this.bounds)
    };
  }

  Chartist.DateAxis = Chartist.Axis.extend({
    constructor: DateAxis,
    projectValue: projectValue
  });

}(window, document, Chartist));
