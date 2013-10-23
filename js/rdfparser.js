$.extend({
    parseRDF: function (rdf) {
        var doc = new XmlDocument(rdf),
            nodes = doc.childrenNamed("rdf:Description"),
            data = [];

        nodes.forEach(function(n) {
            console.log(n.attr['rdf:about']);
        });
    }
});
