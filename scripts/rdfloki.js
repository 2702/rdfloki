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
                '<a id="graphDownload" href="#">download</a>' +
            '</div>');
    };

    function bind() {
        jQuery('#graphDownload').click(function() {
            SVGCrowbar.download(JSINFO.id.replace(/:/g, '_'));
            return false;
        });
    }

    initContainer();
    bind();
    draw(parse());
});
