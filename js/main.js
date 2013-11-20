$(function() {
    var $input = $('#xmlInput'),
        $parse = $('#parse'),
        $graph = $('#graphContainer'),
	$parsedRDF = $('#parsedRDF code'),
	$graphData = $('#graphData code');

    function parse() {
	var data = $.rdfParser.parse($input.val());

	$parsedRDF.html(JSON.stringify(data, null, 4));
	$graphData.html(JSON.stringify(
	    $.rdfGrapher.parse(data), null, 4));
    };

    $parse.click(function() {
        parse();
    });

    $input.change(function(){
	parse();
    });

    $parse.click();
});
