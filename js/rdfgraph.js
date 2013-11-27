var width = 960,
    height = 500;

var color = d3.scale.category20();

$.extend({
    rdfGraph: {
	draw: function(data) {
	    var force = d3.layout.force()
		.charge(-600)
		.linkDistance(200)
		.size([width, height]);

	    var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height);

	    force.nodes(data.nodes)
	    	.links(data.links)
	    	.start();

	    var link = svg.selectAll(".link")
	    	.data(data.links)
	    	.enter().append("line")
	    	.attr("class", "link")
	    	.style("stroke-width", function(d) { return 5; });

	    var node = svg.selectAll(".node")
		.data(data.nodes)
		.enter().append("g")
		.attr("class", "node")
		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	    node.append("title")
		.text(function(d) { return d.label; });

	    node.append("circle")
		.attr("r", function(d) { return 50; })
		.style("fill", function(d) { return color(d.label); });

	    node.append("text")
		.attr("dy", ".3em")
	        .attr("class", "label")
		.style("text-anchor", "middle")
		.text(function(d) { return d.label; });

	    force.on("tick", function() {
		link.attr("x1", function(d) { return d.source.x; })
		    .attr("y1", function(d) { return d.source.y; })
		    .attr("x2", function(d) { return d.target.x; })
		    .attr("y2", function(d) { return d.target.y; });

		node.attr("transform", function(d) {
		    return "translate(" + d.x + "," + d.y + ")";
		});

	    });
	}
    }
});
