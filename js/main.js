$(function() {
    var $input = $('#xmlInput'),
        $parse = $('#parse'),
        $graph = $('#graphContainer'),
	$code = $('#parsedRDF code');

    function parse() {
	var data = $.rdfParser.parse($input.val());

	$code.html(JSON.stringify(data, null, 4));
    };

    $parse.click(function() {
        parse();
    });

    $input.change(function(){
	parse();
    });

    $parse.click();
});
