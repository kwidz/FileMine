$(document).ready(function() {
	$path = "/"; // NE PAS CHANGER pour editer le chemin allez dans le fichier de configuration
	var popopen = (function ($content) {
		$("#popup").html($content);
		$("#popoverlay").show();
		$("#popup").show();
	});
	var popclose = (function(){
		$("#popoverlay").hide();
		$("#popup").hide();
		$("#popup").empty;
	});
	var updatepath = (function () {
		$("#path").empty();
		$splitted = $path.split("/");
		$.each($splitted,function ($i,$dir){
			if($i!=0) {
				$("<span>/</span>").appendTo("#path");
				$lien = $("<a>" + $dir + "</a>");
				$lien.click(function(){
					$toopen = ""
					for($j=0;$j<=$i;$j++){
						$sep = "/";
						if($j==0 || $j==1) $sep = "";
						$toopen += $sep;
						$toopen += $splitted[$j];
					}
					lister.call(this,$toopen);
				});
				$lien.appendTo("#path");
			};
		});
	});
	var lister = (function($dir){
		$.get( "cmd/ls.php", { dir: $dir} ).done(function($data) {
			if ($data) {
				$data = JSON.parse($data);
				if($data['err']!=''){
					alert($data['err']);
				}
				else {
					$path = $data['path'];
					updatepath.call(this);
					$("#file_container").empty();
					$.each($data['list'],function($i,$file){
						$ligne = $("<div class='" + $file['type'] + "'></div>");
						$("<span class='select'><input type='checkbox' /></span>").appendTo($ligne);
						$("<span class='name'>" + $file['name'] + "</span>").appendTo($ligne);
						$("<span class='size'>" + $file['size'] + "</span>").appendTo($ligne);
							$ligne.click(function(){
								if ($file['name']=="..") {
									$tmp = $path.split("/");
									$tmp.pop();
									$tmp = $tmp.join("/");
									lister.call(this,$tmp);
								}
								else if ($file['type']=="folder") {
									$sep = "/";
									if ($path == "/") $sep = "";
									lister.call(this,$path + $sep + $file['name']);
								}
								else {
									popopen.call(this,$file['name']);
								}
							});
						$ligne.appendTo("#file_container");
					});
				}
			};
		});
	});
	$("#popoverlay").click(function(){
		popclose.call(this);
	});
	popclose.call(this);
	lister.call(this,$path);
});
