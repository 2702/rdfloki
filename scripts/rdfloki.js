jQuery(function() {
    var $containerWrapper = jQuery(JSINFO.rdfXmlConfig.containerSelector),
        graphContainerId = 'graphContainer',
        $graphContainer;

    function parse() {
	var data = jQuery.rdfParser.parse(JSINFO.rdfXml),
	    graphData = jQuery.rdfGrapher.parse(data);
	return graphData;
    };

    function draw(graphData) {
	jQuery.rdfGraph.draw('#' + graphContainerId, graphData);
    };

    function initGraphContainer(visible) {
        $graphContainer = jQuery(
            '<div id="' + graphContainerId + '">' +
                '<a id="graphDownload" href="#">download</a>' +
            '</div>').appendTo($containerWrapper);
    };

    function initGraphToggler(initial) {
        var toggler = jQuery(
            '<a id="graphVisibleToggle" href="#">toggle graph</a>')
                .appendTo($graphContainer);

        toggler.click(function() {
            $graphContainer.toggle();
            if ($graphContainer.is(':visible')) {
                toggler.text('hide graph');
            } else {
                toggler.text('show graph');
            }
        });

        if (!initial) {
            toggler.click();
        }
    }

    function bind() {
        jQuery('#graphDownload').click(function() {
            SVGCrowbar.download(JSINFO.id.replace(/:/g, '_'));
            return false;
        });
    }

    if (JSINFO && JSINFO.rdfXmlConfig) {
        // mockup settings
        JSINFO.rdfXmlConfig.enableGraph = true;
        JSINFO.rdfXmlConfig.graphVisible = true;
    }

    if (JSINFO &&
        JSINFO.rdfXmlConfig &&
        JSINFO.rdfXmlConfig.enableGraph) {

        initGraphContainer();
        initGraphToggler(JSINFO.rdfXmlConfig.graphVisible);
        bind();
        draw(parse());
    }
});
