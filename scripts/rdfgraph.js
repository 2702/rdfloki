jQuery.extend({
    rdfGraph: {

        MAX_NODE_LABEL_WIDTH: 20,
        HEIGHT: 500,

	draw: function(selector, data) {
            this._prepareData(data);
            this._initLayout(selector, data);
            this._initLinks(data);
            this._initNodes(data);
            this._initLinkLabels(data);
            this._centerEls(data);
            this._positionEls();
            this._bindLayout();
	},

        _prepareData: function(data) {
            function trim(s, n) {
                if (s.length > n) {
                    return s.substring(0, n - 3) + '...';
                }
                return s;
            }

            data.nodes.forEach(function(node) {
                var els = node.label.split(':');

                node.shortLabel = trim(
                    els[els.length - 1], this.MAX_NODE_LABEL_WIDTH);
		node.width = node.shortLabel.length + 2;


            }, this);

            return data;
        },

        _initLayout: function(selector, data) {
            var container = d3.select(selector),
                initialWidth = parseInt(container.style('width')),
                initialHeight = parseInt(container.style('height')),
                svg;

            data.initialWidth = initialWidth;
            data.initialHeight = initialHeight;

            this.layout = d3.layout.force()
		.charge(function(d) {return -1200 * Math.sqrt(d.shortLabel.length); })
		.linkDistance(200)
		.size([initialWidth, initialHeight]);

	    this.layout.nodes(data.nodes)
	    	.links(data.links);

            function zoom() {
                svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }

	    svg = container.append("svg")
                .attr("class", "rdfgraph")
		.attr("width", '100%')
		.attr("height", initialHeight)
                .append("g");

            svg.append("rect")
                .attr("class", "overlay")
                .attr('fill', 'none')
                .attr("width", '100%')
                .attr("height", initialHeight)
                .call(d3.behavior.zoom().scaleExtent([0.5, 1]).on("zoom", zoom));

            svg = this.svg = svg.append("g");
        },

        _initNodes: function (data) {
	    var node = this.svg.selectAll(".nodeGroup")
		.data(data.nodes)
		.enter().append("g")
		.attr("class", function(d) { return "nodeGroup " + d.styles.join(" ") || ''; });

            var nodeHref = node
                .append("a").attr("xlink:href", function(d) { return d.url; });

            var force = this.layout,
                graph = this,
                drag = force.drag().origin(function(d) {
                    return {x: d.x, y: d.y};
                }).on("drag.force", function(d) {
                    force.stop();
                    d.x = d3.event.x;
                    d.y = d3.event.y;
                    graph._positionEls();
                });

	    node.append("title")
		.text(function(d) { return d.label; });

	    nodeHref.append("text")
		.attr("dy", ".3em")
	        .attr("class", "nodeLabel")
                .attr('stroke', 'white')
                .attr('stroke-width', '1px')
                .attr('fill', 'white')
		.style("text-anchor", "middle")
		.text(function(d) { return d.shortLabel; })
                .each(function(d, i) {
                    d.width = this.getComputedTextLength() + 30;
                });

	    node.filter(".attribute").selectAll("a").insert("rect", "text")
                .attr("class", "node")
                .attr('fill', '#699CCA')
		.attr("x", function(d) { return -d.width / 2; })
                .attr("y", '-2em')
		.attr("rx", 10).attr("ry", 10)
		.attr("width", function(d) { return d.width; })
                .attr("height", '4em');

	    node.filter(".resource").selectAll("a").insert("ellipse", "text")
                .attr("class", "node")
                .attr('fill', '#4BB249')
		.attr("rx", function(d) { return d.width / 2; })
                .attr("ry", function(d) { return '2em'; })
                .attr("height", 30)
		.attr("width", function(d) {
                    return Math.min(d.width, 30);
                });

            node
                .attr('stroke', 'white')
                .attr('stroke-width', '3px');

            node.call(drag);

            this.node = node;
        },

        _initLinks: function(data) {
            this.linkGroups = this.svg.selectAll(".link")
                .data(data.links)
                .enter()
                .append("g")
                .attr("class", "linkGroup")
                .attr('stroke', '#999')
                .attr('stroke-opacity', '.6')
                .attr('stroke-width', '3px')
                .attr("title", function(d) { return d.label; });

	    this.link = this.linkGroups.append("line")
	    	.attr("class", "link");
        },

        _initLinkLabels: function (data) {
            this.linkGroups.append("text")
		.attr("dy", ".3em")
	        .attr("class", "linkLabelShadow")
                .attr('stroke', 'white')
                .attr('stroke-opacity', '.8')
                .attr('stroke-width', '5px')
                .attr('fill', 'white')
	    	.style("text-anchor", "middle")
	    	.text(function(d) { return d.label; });

	    this.linkGroups.append("text")
		.attr("dy", ".3em")
	        .attr("class", "linkLabel")
                .attr('stroke', 'white')
                .attr('stroke-opacity', '.5')
                .attr('stroke-width', '0.3px')
                .attr('fill', 'black')
	    	.style("text-anchor", "middle")
	    	.text(function(d) { return d.label; });

            this.linkLabels = this.linkGroups.selectAll("text");

        },

        _bindLayout: function() {
            var graph = this;

	    this.layout.on("tick", function() {
                graph._positionEls();
	    });
        },

        _positionEls: function() {
            var node = this.node,
                link = this.link,
                linkLabels = this.linkLabels;

	    link.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });

	    linkLabels
		.attr("x", function(d) { return (d.source.x + d.target.x) / 2; })
		.attr("y", function(d) { return (d.source.y + d.target.y) / 2; });

	    node.attr("transform", function(d) {
		return "translate(" + d.x + "," + d.y + ")";
	    });
        },

        _centerEls: function(data) {
            // Center the nodes in the middle.
            var n = data.nodes.length;

            this.layout.start();
            for (var i = n * 5; i > 0; --i) this.layout.tick();
            this.layout.stop();

            var ox = 0, oy = 0;
            data.nodes.forEach(function(d) { ox += d.x, oy += d.y; });
            ox = ox / n - data.initialWidth / 2, oy = oy / n - data.initialHeight / 2;
            data.nodes.forEach(function(d) { d.x -= ox, d.y -= oy; });
        }
    }
});
