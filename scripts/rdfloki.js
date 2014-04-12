jQuery(function() {
    var $containerWrapper = jQuery(JSINFO.rdfXmlConfig.containerSelector);

    function parse() {
	var data = jQuery.rdfParser.parse(JSINFO.rdfXml),
	    graphData = jQuery.rdfGrapher.parse(data);
	return graphData;
    };

    function draw(graphData) {
	jQuery.rdfGraph.draw("#graphContainer", graphData);
    };

    function initContainer() {
	$containerWrapper.append(
            '<div id="#graphContainer">' +
                '<a id="graphDownload">download</a>' +
            '</div>');
    };

    function bind() {
        $('#graphDownload').click(function() {
            // TODO: get svg name
            SVGCrowbar.download('graph');

            return false;
        });
    }

    initContainer();
    bind();
    draw(parse());
});
