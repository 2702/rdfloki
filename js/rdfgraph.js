var width = 960,
    height = 500;

var color = d3.scale.category20();

$.extend({
    rdfGraph: {

        MAX_NODE_LABEL_WIDTH: 20,

	draw: function(data) {
            this._prepareData(data);
            this._initLayout(data);
            this._initLinks(data);
            this._initNodes(data);
            this._initLinkLabels(data);
            this._bindLayout();
	},

        _prepareData: function(data) {
            function trim(s, n) {
                if (s.length > n - 3) {
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

        _initLayout: function(data) {
            this.layout = d3.layout.force()
		.charge(-2000)
		.linkDistance(200)
		.size([width, height]);

	    this.layout.nodes(data.nodes)
	    	.links(data.links)
	    	.start();

	    this.svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height);
        },

        _initNodes: function (data) {
	    var node = this.svg.selectAll(".nodeGroup")
		.data(data.nodes)
		.enter().append("g")
		.attr("class", function(d) { return "nodeGroup " + d.styles.join(" ") || ''; })
		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	    node.append("title")
		.text(function(d) { return d.label; });

	    node.append("text")
		.attr("dy", ".3em")
	        .attr("class", "nodeLabel")
                .attr("xlink:href", function(d) { return d.url; })
		.style("text-anchor", "middle")
		.text(function(d) { return d.shortLabel; })
                .each(function(d, i) {
                    d.width = this.getComputedTextLength() + 30;
                });

	    node.filter(".attribute").insert("rect", "text")
                .attr("class", "node")
		.attr("x", function(d) { return -d.width / 2; })
                .attr("y", '-2em')
		.attr("rx", 10).attr("ry", 10)
		.attr("width", function(d) { return d.width; })
                .attr("height", '4em');

	    node.filter(".resource").insert("ellipse", "text")
                .attr("class", "node")
		.attr("rx", function(d) { return d.width / 2; })
                .attr("ry", function(d) { return '2em'; })
                .attr("height", 30)
		.attr("width", function(d) {
                    return Math.min(d.width, 30);
                });

            this.node = node;
        },

        _initLinks: function(data) {
	    this.link = this.svg.selectAll(".link")
	    	.data(data.links)
	    	.enter().append("line")
	    	.attr("class", "link");
        },

        _initLinkLabels: function(data) {
	    this.linkLabels = this.svg.selectAll(".linkLabel")
	    	.data(data.links)
	    	.enter().append("text")
		.attr("dy", ".3em")
	        .attr("class", "linkLabel")
	    	.style("text-anchor", "middle")
	    	.text(function(d) { return d.label; });
        },

        _bindLayout: function() {
            var node = this.node,
                link = this.link,
                linkLabels = this.linkLabels;

	    this.layout.on("tick", function() {

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
	    });

        }
    }
});
