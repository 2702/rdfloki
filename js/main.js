$(function() {
    var $input = $('#xmlInput'),
        $parse = $('#parse'),
        $graph = $('#graphContainer');


    function parse() {
	$graph.html('milordzie generuje graf');
	$.rdfParser.parse($input.val());
    };

    $parse.click(function() {
        parse();
    });

    $input.change(function(){
	parse();
    });

    $parse.click();

});
