$(function() {
    var $input = $('#xmlInput'),
        $parse = $('#parse'),
	$graph = $('#graphContainer');

    $parse.click(function() {
        $.parseRDF($input.val());
    });

    $input.change(function(){
	$graph.html('milordzie generuje graf');
    });

    $parse.click();

});