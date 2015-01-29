/**
 * Line XY Chart.
 *
 * 
 *
 * @module Chartist.LineXY
 */
/* global Chartist */
(function(window, document, Chartist){
  'use strict';

  /**
   * Default options in line charts. Expand the code view to see a detailed list of options with comments.
   *
   * @memberof Chartist.LineXY
   */
  var defaultOptions = {
    // Options for X-Axis
    axisX: {
      // The offset of the labels to the chart area
      offset: 30,
      // Allows you to correct label positioning on this axis by positive or negative x and y offset.
      labelOffset: {
        x: 0,
        y: 0
      },
      // If labels should be shown or not
      showLabel: true,
      // If the axis grid should be drawn or not
      showGrid: true,
      // Interpolation function that allows you to intercept the value from the axis label
      labelInterpolationFnc: Chartist.noop
    },
    // Options for Y-Axis
    axisY: {
      // The offset of the labels to the chart area
      offset: 40,
      // Allows you to correct label positioning on this axis by positive or negative x and y offset.
      labelOffset: {
        x: 0,
        y: 0
      },
      // If labels should be shown or not
      showLabel: true,
      // If the axis grid should be drawn or not
      showGrid: true,
      // Interpolation function that allows you to intercept the value from the axis label
      labelInterpolationFnc: Chartist.noop,
      // This value specifies the minimum height in pixel of the scale steps
      scaleMinSpace: 20
    },
    // Specify a fixed width for the chart as a string (i.e. '100px' or '50%')
    width: undefined,
    // Specify a fixed height for the chart as a string (i.e. '100px' or '50%')
    height: undefined,
    // If the line should be drawn or not
    showLine: true,
    // If dots should be drawn or not
    showPoint: true,
    // If the line chart should draw an area
    showArea: false,
    // The base for the area chart that will be used to close the area shape (is normally 0)
    areaBase: 0,
    // Specify if the lines should be smoothed (Catmull-Rom-Splines will be used)
    lineSmooth: true,
    // Overriding the natural low of the chart allows you to zoom in or limit the charts lowest displayed value
    low: undefined,
    // Overriding the natural high of the chart allows you to zoom in or limit the charts highest displayed value
    high: undefined,
    // Padding of the chart drawing area to the container element and labels
    chartPadding: 5,
    // When set to true, the last grid line on the x-axis is not drawn and the chart elements will expand to the full available width of the chart. For the last label to be drawn correctly you might need to add chart padding or offset the last label with a draw event handler.
    fullWidth: false,
    // Override the class names that get used to generate the SVG structure of the chart
    classNames: {
      chart: 'ct-chart-line',
      label: 'ct-label',
      labelGroup: 'ct-labels',
      series: 'ct-series',
      line: 'ct-line',
      point: 'ct-point',
      area: 'ct-area',
      grid: 'ct-grid',
      gridGroup: 'ct-grids',
      vertical: 'ct-vertical',
      horizontal: 'ct-horizontal'
    }
  };

  /**
   * Creates a new chart
   *
   */
  function createChart(options) {
    var seriesGroups = [];

    // Create new svg object
    this.svg = Chartist.createSvg(this.container, options.width, options.height, options.classNames.chart);

    var chartRect = Chartist.createChartRect(this.svg, options);
	
	var yValues = [];
	var xValues = [];
	this.data.series.forEach(function(series, seriesIndex) {
		xValues[seriesIndex] = [];
		yValues[seriesIndex] = [];
		series.data.forEach(function(value, valueIndex) {
			xValues[seriesIndex][valueIndex] = value.x;
			yValues[seriesIndex][valueIndex] = value.y;
		});
	});

    var highLowForY = Chartist.getHighLow(yValues);
	var highLowForX = Chartist.getHighLow(xValues);
    // Overrides of high / low from settings
    highLowForY.high = +options.high || (options.high === 0 ? 0 : highLowForY.high);
    highLowForY.low = +options.low || (options.low === 0 ? 0 : highLowForY.low);

    var axisX = new Chartist.DateAxis(
      Chartist.Axis.units.x,
      chartRect.x2 - chartRect.x1, {
        highLow: highLowForX,
        scaleMinSpace: options.axisX.scaleMinSpace
      },
	  new Chartist.DateTicksProvider()
    );

    var axisY = new Chartist.LinearScaleAxis(
      Chartist.Axis.units.y,
      chartRect.y1 - chartRect.y2, {
        highLow: highLowForY,
        scaleMinSpace: options.axisY.scaleMinSpace
      }
    );

    // Start drawing
    var labelGroup = this.svg.elem('g').addClass(options.classNames.labelGroup),
      gridGroup = this.svg.elem('g').addClass(options.classNames.gridGroup);

	var ticksX = axisX.ticks || axisX.bounds.values;
	var ticksY = axisY.ticks || axisY.bounds.values;
	
    Chartist.drawAxis(
      axisX,
      ticksX,
      function(projectedValue) {
        projectedValue.pos = chartRect.x1 + projectedValue.pos;
        return projectedValue;
      },
      chartRect,
      gridGroup,
      chartRect.y2,
      labelGroup,
      {
        x: options.axisX.labelOffset.x,
        y: chartRect.y1 + options.axisX.labelOffset.y + (this.supportsForeignObject ? 5 : 20)
      },
      this.supportsForeignObject,
      options,
      this.eventEmitter
    );

    Chartist.drawAxis(
      axisY,
      ticksY,
      function(projectedValue) {
        projectedValue.pos = chartRect.y1 - projectedValue.pos;
        return projectedValue;
      },
      chartRect,
      gridGroup,
      chartRect.x1,
      labelGroup,
      {
        x: options.chartPadding + options.axisY.labelOffset.x + (this.supportsForeignObject ? -10 : 0),
        y: options.axisY.labelOffset.y + (this.supportsForeignObject ? -15 : 0)
      },
      this.supportsForeignObject,
      options,
      this.eventEmitter
    );

    // Draw the series
    this.data.series.forEach(function(series, seriesIndex) {
      seriesGroups[seriesIndex] = this.svg.elem('g');

	  //check for specific series options
	  var seriesOptions = Chartist.extend({}, options, series.options);
	  
      // Write attributes to series group element. If series name or meta is undefined the attributes will not be written
      seriesGroups[seriesIndex].attr({
        'series-name': series.name,
        'meta': Chartist.serialize(series.meta)
      }, Chartist.xmlNs.uri);

      // Use series class from series data or if not set generate one
      seriesGroups[seriesIndex].addClass([
        options.classNames.series,
        (series.className || options.classNames.series + '-' + Chartist.alphaNumerate(seriesIndex))
      ].join(' '));

      var pathCoordinates = [];

      series.data.forEach(function(value, valueIndex) {
        var p = {
          x: chartRect.x1 + axisX.projectValue(value.x, valueIndex,  series).pos,
          y: chartRect.y1 - axisY.projectValue(value.y, valueIndex,  series).pos
        };
        pathCoordinates.push(p.x, p.y);

        //If we should show points we need to create them now to avoid secondary loop
        // Small offset for Firefox to render squares correctly
        if (seriesOptions.showPoint) {
          var point = seriesGroups[seriesIndex].elem('line', {
            x1: p.x,
            y1: p.y,
            x2: p.x + 0.01,
            y2: p.y
          }, options.classNames.point).attr({
            'value.x': value.x,
			'value.y': value.y,
            'meta': Chartist.getMetaData(series, valueIndex)
          }, Chartist.xmlNs.uri);

          this.eventEmitter.emit('draw', {
            type: 'point',
            value: value,
            index: valueIndex,
            group: seriesGroups[seriesIndex],
            element: point,
            x: p.x,
            y: p.y
          });
        }
      }.bind(this));

      // TODO: Nicer handling of conditions, maybe composition?
      if (seriesOptions.showLine || seriesOptions.showArea) {
        // TODO: We should add a path API in the SVG library for easier path creation
        var pathElements = ['M' + pathCoordinates[0] + ',' + pathCoordinates[1]];

        // If smoothed path and path has more than two points then use catmull rom to bezier algorithm
        if (seriesOptions.lineSmooth && pathCoordinates.length > 4) {

          var cr = Chartist.catmullRom2bezier(pathCoordinates);
          for(var k = 0; k < cr.length; k++) {
            pathElements.push('C' + cr[k].join());
          }
        } else {
          for(var l = 3; l < pathCoordinates.length; l += 2) {
            pathElements.push('L' + pathCoordinates[l - 1] + ',' + pathCoordinates[l]);
          }
        }

        if(seriesOptions.showLine) {
          var line = seriesGroups[seriesIndex].elem('path', {
            d: pathElements.join('')
          }, options.classNames.line, true).attr({
            'values': series.data
          }, Chartist.xmlNs.uri);

          this.eventEmitter.emit('draw', {
            type: 'line',
            values: series.data,
            index: seriesIndex,
            group: seriesGroups[seriesIndex],
            element: line
          });
        }

        if(seriesOptions.showArea) {
          // If areaBase is outside the chart area (< low or > high) we need to set it respectively so that
          // the area is not drawn outside the chart area.
          var areaBase = Math.max(Math.min(seriesOptions.areaBase, axisY.bounds.max), axisY.bounds.min);

          // If we need to draw area shapes we just make a copy of our pathElements SVG path array
          var areaPathElements = pathElements.slice();

          // We project the areaBase value into screen coordinates
          var areaBaseProjected = chartRect.y1 - axisY.projectValue(areaBase).pos;
          // And splice our new area path array to add the missing path elements to close the area shape
          areaPathElements.splice(0, 0, 'M' + chartRect.x1 + ',' + areaBaseProjected);
          areaPathElements[1] = 'L' + pathCoordinates[0] + ',' + pathCoordinates[1];
          areaPathElements.push('L' + pathCoordinates[pathCoordinates.length - 2] + ',' + areaBaseProjected);

          // Create the new path for the area shape with the area class from the options
          var area = seriesGroups[seriesIndex].elem('path', {
            d: areaPathElements.join('')
          }, options.classNames.area, true).attr({
            'values': series.data
          }, Chartist.xmlNs.uri);

          this.eventEmitter.emit('draw', {
            type: 'area',
            values: series.data,
            index: seriesIndex,
            group: seriesGroups[seriesIndex],
            element: area
          });
        }
      }
    }.bind(this));

    this.eventEmitter.emit('created', {
      boundsX: axisX.bounds,
	  boundsY: axisY.bounds,
      chartRect: chartRect,
      svg: this.svg,
      options: options
    });
  }

  function LineXY(query, data, options, responsiveOptions, ticksXProvider, ticksYProvider) {
    Chartist.LineXY.super.constructor.call(this,
      query,
      data,
      Chartist.extend({}, defaultOptions, options),
      responsiveOptions);
	  this.ticksXProvider = ticksXProvider;
	  this.ticksYProvider = ticksYProvider;
  }

  // Creating line chart type in Chartist namespace
  Chartist.LineXY = Chartist.Base.extend({
    constructor: LineXY,
    createChart: createChart
  });

}(window, document, Chartist));
