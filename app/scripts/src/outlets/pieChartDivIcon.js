define(function (require) {

	var L = require("leaflet"),
		d3 = require("d3");

	var DEFAULT_OUTER_RADIUS = 28;

	var PieChartDivIcon = L.DivIcon.extend({

		options: {
			strokeWidth: 1,
			radius: 28,
			innerRadiusDelta: 10,
			pieClass: 'cluster-pie',
			pieLabelClass: 'marker-cluster-pie-label',
			pathClassFunc: function (d) { return "category-" + d.data.key; },
			pathTitleFunc: emptyStringFunc, 
		},

		initialize: function (data, customOptions) {
			L.Util.setOptions(this, customOptions);
			var options = this.options,
				size = data.length,
				strokeWidth = options.strokeWidth,
				radius = options.radius,
				innerRadius = radius - options.innerRadiusDelta,
				iconWidth = 2 * (radius + strokeWidth),
				d3Data = d3.nest()
					.key(function (d) {
						return d.feature.properties.outletType.id;
					})
					.entries(data, d3.map);

				var svg = document.createElementNS(d3.ns.prefix.svg, 'svg'),
					svgOrigin = radius + strokeWidth,
					svgWidth = svgOrigin * 2,
					svgHeight = svgWidth,
					donut = d3.layout.pie(),
					arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(radius);

				//Create the pie chart
				var vis = d3.select(svg)
					.data([d3Data])
					.attr('class', options.pieClass)
					.attr('width', svgWidth)
					.attr('height', svgHeight);

				var arcs = vis.selectAll('g.arc')
					.data(donut.value(function (d) {
							return d.values.length;
						}))
					.enter().append('svg:g')
					.attr('class', 'arc')
					.attr('transform', 'translate(' + svgOrigin + ',' + svgOrigin + ')');

				arcs.append('svg:path')
					.attr('class', options.pathClassFunc)
					.attr('stroke-width', strokeWidth)
					.attr('d', arc)
					.append('svg:title')
					.text(options.pathTitleFunc);

				vis.append('text')
					.attr('x', svgOrigin)
					.attr('y', svgOrigin)
					.attr('class', options.pieLabelClass)
					.attr('text-anchor', 'middle')
					//.attr('dominant-baseline', 'central')
					/*IE doesn't seem to support dominant-baseline, but setting dy to .3em does the trick*/
					.attr('dy','.3em')
					.text(size);

			var html = serializeXmlNode(svg);

			L.DivIcon.prototype.initialize.call(this, {
				html: html,
				className: "marker-cluster",
				iconSize: new L.Point(iconWidth, iconWidth)
			});
		}
	});

	function emptyStringFunc() {
		return "";
	}

	function serializeXmlNode(xmlNode) {
		if (typeof window.XMLSerializer != "undefined") {
			return (new window.XMLSerializer()).serializeToString(xmlNode);
		} else if (typeof xmlNode.xml != "undefined") {
			return xmlNode.xml;
		}
		return "";
	}

	return PieChartDivIcon;
	
});