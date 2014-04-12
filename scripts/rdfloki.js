jQuery(function() {
    var $containerWrapper = jQuery(JSINFO.rdfXmlConfig.containerSelector),
        graphContainerId = 'graphContainer',
        graphInitialized = false,
        $graphContainer;

    function parse() {
	var data = jQuery.rdfParser.parse(JSINFO.rdfXml),
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

        if (JSINFO.rdfXmlConfig.graphVisible) {
            initGraph();
        }
    }
});
