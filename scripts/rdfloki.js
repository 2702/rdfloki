jQuery(function() {

    // mockup settings
    if (JSINFO && JSINFO.rdfXmlConfig) {
        JSINFO.rdfXmlConfig.graphEnabled = true;
        JSINFO.rdfXmlConfig.graphVisible = true;
    }

    var graphEnabled = JSINFO &&
            JSINFO.rdfXmlConfig &&
            JSINFO.rdfXmlConfig.graphEnabled;

    if (!graphEnabled) {
        return;
    }

    var $containerWrapper = jQuery(JSINFO.rdfXmlConfig.containerSelector),
        graphContainerId = 'graphContainer',
        graphInitialized = false,
        downloadFilename = JSINFO.id.replace(/:/g, '_'),
        rdfXml = JSINFO.rdfXml,
        graphVisible = JSINFO.rdfXmlConfig.graphVisible,
        $graphContainer;

    function parse() {
	var data = jQuery.rdfParser.parse(rdfXml),
	    graphData = jQuery.rdfGrapher.parse(data);
	return graphData;
    };

    function draw(graphData) {
	jQuery.rdfGraph.draw('#' + graphContainerId, graphData);
    };

    function initGraph() {
        graphInitialized = true;
        draw(parse());
    }

    function initGraphContainer(visible) {
        $graphContainer = jQuery(
            '<div id="' + graphContainerId + '">' +
                '<a id="graphDownload" class="button" href="#">download</a>' +
            '</div>').appendTo($containerWrapper);
    };

    function initGraphToggler(initial) {
        var toggler = jQuery(
            '<a id="graphVisibleToggle" class="button" href="#">hide graph</a>')
                .insertBefore($graphContainer);

        toggler.click(function() {
            $graphContainer.toggle();
            if ($graphContainer.is(':visible')) {
                if (!graphInitialized) {
                    initGraph();
                }
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
            SVGCrowbar.download(downloadFilename);
            return false;
        });
    }

    initGraphContainer();
    initGraphToggler(graphVisible);
    bind();

    if (graphVisible) {
        initGraph();
    }
});
