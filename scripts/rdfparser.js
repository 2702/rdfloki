jQuery.extend({
    rdfParser: {

	parse: function(rdf) {
            var doc = new XmlDocument(rdf),
		data = this._parseDoc(doc);

	    return data;
	},

	_parseDoc: function(doc) {
            var nodes = doc.childrenNamed("rdf:Description"),
	        data = [];

	    nodes.forEach(function(n) {
		data.push(this._parseObject(n));
	    }, this);

	    return data;
	},

	_parseObject: function(node) {
	    var data = {
		'resource': node.attr['rdf:about'],
		'lokiattrs': [],
		'lokirels': []
	    };
	    node.children.forEach(function(child){
		this._parseAttr(child, data);
	    }, this);

	    return data;
	},

	_parseAttr: function(node, parent) {
	    var attr = node.name,
		match = /^(\w+):(\w+)/.exec(attr),
		namespace = match[1],
		name = match[2];

	    if (attr == 'rdfs:label') {
		parent['label'] = node.val;
		return;
	    }

	    if (attr == 'rdf:type') {
		parent['type'] = node.attr['rdf:resource'];
		return;
	    }

	    if (namespace == 'lokiatt') {
		parent['lokiattrs'].push({
		    'attr': name,
		    'type': node.attr['rdf:datatype'],
		    'label': node.val,
		    'value': node.val
		});
		return;
	    }

	    if (namespace == 'lokirel') {
		parent['lokirels'].push({
		    'attr': name,
		    'type': node.attr['rdf:datatype'],
		    'resource': node.attr['rdf:resource'],
		    'label': /.*:(.*?:.*?:.*?.*?)$/.exec(node.attr['rdf:resource'])[1]
		});
		return;
	    }
	}
    },

    rdfGrapher: {

	parse: function (data) {
	    var graph = {
	    	links: [],
	    	nodes: []
	    };

	    data.forEach(function(node) {
		this._parseObject(graph, node);
	    }, this);

	    return graph;
	},

	_parseObject: function (graph, data) {
	    var index = graph.nodes.push({
		label: data.label,
		url: data.resource,
		styles: ['resource', 'root']
	    }) - 1;

	    data["lokiattrs"].forEach(function(attr) {
		this._parseLokiAttr(graph, attr, {
		    data: data,
		    index: index
		});
	    }, this);

	    data["lokirels"].forEach(function(attr) {
		this._parseLokiRel(graph, attr, {
		    data: data,
		    index: index
		});
	    }, this);

	},

	_parseLokiAttr: function (graph, data, root) {
	    var index = graph.nodes.push({
		label: data.label,
		styles: ['attribute']
	    }) - 1;

	    graph.links.push({
		source: root.index,
		target: index,
		label: data.attr,
		styles: ['attribute']
	    });
	},

	_parseLokiRel: function (graph, data, root) {
	    var index = graph.nodes.push({
		label: data.label,
		url: data.resource,
		styles: ['resource']
	    }) - 1;

	    graph.links.push({
		source: root.index,
		target: index,
		label: data.attr,
		styles: ['resource']
	    });
	}
    }
});
