jQuery(function() {
    var $containerWrapper = jQuery(JSINFO.rdfXmlConfig.containerSelector);

    function dataChanged() {
	draw(parse());
    }

    function parse() {
	var data = jQuery.rdfParser.parse(JSINFO.rdfXml),
	    graphData = jQuery.rdfGrapher.parse(data);
	return graphData;
    };

    function draw(graphData) {
	jQuery.rdfGraph.draw("#graphContainer", graphData);
    };

    function initContainer() {
	var cont = document.createElement('div');
	cont.id = "graphContainer";
	$containerWrapper.append(cont);
    };

    initContainer();
    dataChanged();
});
