$(document).ready(function() {
	var lister = (function($dir){
		$.get( "cmd/ls.php", { dir: $dir} ).done(function($data) {
			if ($data) {
				$data = JSON.parse($data);
				if($data['err']!=''){
					alert($data['err']);
				}
				else {
					$("#path").html($data['path']);
					$("#file_container").empty();
					$.each($data['list'],function($i,$file){
						$ligne = $("<div class='" + $file['type'] + "'></div>");
						$("<span class='select'><input type='checkbox' /></span>").appendTo($ligne);
						$("<span class='name'>" + $file['name'] + "</span>").appendTo($ligne);
						$("<span class='size'>" + $file['size'] + "</span>").appendTo($ligne);
						$ligne.appendTo("#file_container");
					});
				}
			};
		});
	});
	lister.call(this,"/");
});
