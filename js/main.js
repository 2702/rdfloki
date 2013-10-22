$(function() {
	var $input = $('#xmlInput'),
		$graph = $('#graphContainer');
		
	$input.change(function(){
		$graph.html('milordzie generuje graf');
	});
});