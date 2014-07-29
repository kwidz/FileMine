$(document).ready(function() {
	var popup = {
		open : function ($content) {
			$("#popup").css({
				"width"       : this.width + "px",
				"margin-left" : "-" + (this.width/2) + "px"
			});
			$("#popup").html($content);
			$("#popoverlay").show();
			$("#popup").show();
		},
		close : function () {
			$("#popoverlay").hide();
			$("#popup").hide();
			$("#popup").empty;
		},
		width  : 400
	};
	var file = {
		open : function ($chemin,$name) {
			$cont = $("<div id='afile'></div>");
			$("<span class='name'>" + $name + "</span>").appendTo($cont);
			$infotable = $("<table></table>").appendTo($cont);
			$("<input type='button' value='Download' />").click(function(){
				file.download($chemin,$name);
			}).appendTo($cont);
			popup.width  = 500;
			popup.open($cont);
			$.get( "cmd/info.php", { file : ($chemin + "/" + $name)} ).done(function($data) {
				if ($data) {
					$data = JSON.parse($data);
					if($data['err']!=''){
						util.error($data['err']);
					}
					else {
						$.each($data['info'],function($label,$info){
							$tr = $("<tr></tr>").appendTo($infotable);
							$("<td>" + $label + "</td>").appendTo($tr);
							if($label=="size") $info = util.humansize($info);
							$("<td>" + $info + "</td>").appendTo($tr);
						});
					}
				}
				else {
					util.error("Empty reply from server for " + $name);
				}
			}).fail(function() {
				util.error("Failed to connect, unable to get " + $name + " informations.");
			});
		},
		download : function ($chemin,$name) {
			// TODO
			util.alert("download of " + $chemin + "/" + $name);
		},
		delete : function ($chemin,$name) {
			// TODO
			util.alert("delete " + $chemin + "/" + $name);
		}
	}
	var util = {
		alert : function ($msg) {
			// TODO
			popup.open($msg);
		},
		confirm : function ($msg,yes,no) {
			// TODO confirm box plus approprie
			if(confirm($msg)){
				yes();
			}
			else {
				no();
			}
		},
		error : function ($msg) {
			$cont = $("<div id='error'></div>");
			$("<span class='titre'>Error :(</span>").appendTo($cont);
			$("<span class='msg'>" + $msg + "</span>").appendTo($cont);
			$("<input type='button' value='ok' />").click(popup.close).appendTo($cont);
			popup.width  = 500;
			popup.open($cont);
		},
		humansize : function ($octet) {
			// TODO convertion mauvaise: byte et non octet
			if($octet == "-") return $octet;
			$octet = parseInt($octet);
			if ($octet >= 1073741824){
				$octet = Math.round($octet / 1073741824 * 100) / 100;
				return $octet + " Go";
			}
			if ($octet >= 1048576){
				$octet = Math.round($octet / 1048576 * 100) / 100;
				return $octet + " Mo";
			}
			if ($octet >= 1024){
				$octet = Math.round($octet / 1024 * 100) / 100;
				return $octet + " Ko";
			}
			return $octet + " o";
		}
	}
	var finder = {
		path : "/",
		updatepath : function () {
			$("#path").empty();
			$("<a>#</a>").click(function () {
				finder.lister("/");
			}).appendTo("#path");
			$splitted = finder.path.split("/");
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
						finder.lister($toopen);
					});
					$lien.appendTo("#path");
				};
			});
		},
		lister : function ($dir) {
			$.get( "cmd/ls.php", { dir: $dir} ).done(function($data) {
				if ($data) {
					$data = JSON.parse($data);
					if($data['err']!=''){
						util.error($data['err']);
					}
					else {
						finder.path = $data['path'];
						finder.updatepath();
						$("#file_container").empty();
						$.each($data['list'],function($i,$file){
							$ligne = $("<div class='" + $file['type'] + "'></div>");
							$("<span class='select'><input type='checkbox' /></span>").appendTo($ligne);
							$("<span class='name'>" + $file['name'] + "</span>").appendTo($ligne);
							$("<span class='size'>" + util.humansize($file['size']) + "</span>").appendTo($ligne);
							$ligne.click(function(){
								if ($file['name']=="..") {
									$tmp = finder.path.split("/");
									$tmp.pop();
									$tmp = $tmp.join("/");
									if ($tmp=="") $tmp = "/";
									finder.lister($tmp);
								}
								else if ($file['type']=="folder") {
									$sep = "/";
									if (finder.path == "/") $sep = "";
									finder.lister(finder.path + $sep + $file['name']);
								}
								else {
									file.open(finder.path,$file['name']);
								}
							});
							$ligne.appendTo("#file_container");
						});
					}
				}
				else {
					util.error("Empty reply from server for " + $dir);
				}
			}).fail(function() {
				util.error("Failed to connect, unable to get " + $dir + " content.");
			});
		}
	}
	$("#popoverlay").click(popup.close);
	$(document).keyup(function(e) {
		if (e.keyCode == 27) popup.close();    // esc
	});
	popup.close();
	finder.lister(finder.path);
});
