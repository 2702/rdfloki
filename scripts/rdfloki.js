jQuery(function() {
    var $container_wrapper = jQuery(JSINFO.rdfXmlConfig.containerSelector);

    function dataChanged() {
	draw(parse());
    }

    function parse() {
	var data = jQuery.rdfParser.parse(JSINFO.rdfXml),
	    graphData = jQuery.rdfGrapher.parse(data);
	return graphData;
    };

    function draw(graphData) {
	jQuery.rdfGraph.draw("#graph_container", graphData);
    };

    function initContainer() {
	var cont = document.createElement('div');
	cont.id = "graph_container";
	$container_wrapper.append(cont);
    };
    
    initContainer();
    dataChanged();
});
