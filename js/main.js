$(function() {
    var $input = $('#xmlInput'),
        $parse = $('#parse'),
        $graph = $('#graphContainer'),
	$parsedRDF = $('#parsedRDF code'),
	$graphData = $('#graphData code');

    function dataChanged() {
	draw(parse());
    }

    function parse() {
	var data = $.rdfParser.parse($input.val()),
	    graphData = $.rdfGrapher.parse(data);

	$parsedRDF.html(JSON.stringify(data, null, 4));
	$graphData.html(JSON.stringify(graphData, null, 4));

	return graphData;
    };

    function draw(graphData) {
	$.rdfGraph.draw('#graphContainer', graphData);
    };

    $parse.click(function() {
        dataChanged();
    });

    $input.change(function(){
        dataChanged();
    });

    dataChanged();
});
