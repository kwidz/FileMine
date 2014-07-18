$(document).ready(function() {

	$.ajax( "settings.json" )
	.done(function() {
		alert( "success" );
	})
	.fail(function(test) {
		//alert(JSON.stringify(test));
	});
});
