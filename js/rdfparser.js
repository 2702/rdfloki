$.extend({
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
		'about': node.attr['rdf:about'],
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
		    'value': node.val
		});
		return;
	    }

	    if (namespace == 'lokirel') {
		parent['lokirels'].push({
		    'attr': name,
		    'type': node.attr['rdf:datatype'],
		    'value': node.val
		});
		return;
	    }
	}
    }
});
