jQuery(function() {
    var jQuerycontainerWrapper = jQuery(JSINFO.rdfXmlConfig.containerSelector);

    function parse() {
	var data = jQuery.rdfParser.parse(JSINFO.rdfXml),
	    graphData = jQuery.rdfGrapher.parse(data);
	return graphData;
    };

    function draw(graphData) {
	jQuery.rdfGraph.draw("#graphContainer", graphData);
    };

    function initContainer() {
	jQuerycontainerWrapper.append(
            '<div id="graphContainer">' +
                '<a id="graphDownload">download</a>' +
            '</div>');
    };

    function bind() {
        jQuery('#graphDownload').click(function() {
            // TODO: get svg name
            SVGCrowbar.download('graph');

            return false;
        });
    }

    initContainer();
    bind();
    draw(parse());
});
