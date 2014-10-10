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
			$("#popup").empty();
			popup.closeonclick = true;
		},
		width : 400,
		closeonclick : true
	};
	$progressbar = {
		create : function ($id,$name) {
			$progress = $("<div class='process' id='" + $id + "'></div>");
			$("<span class='percent' id='percent_" + $id + "'>0%</span>").appendTo($progress);
			$("<span class='name' id='name_" + $id + "'>" + $name + "</span>").appendTo($progress);
			$("<div class='bar'><div style='width:0%' id='bar_" + $id + "'></div></div>").appendTo($progress);
			$progress.appendTo("#operation");
		},
		update : function ($id,$percent) {
			$("#percent_" + $id).html($percent + "%");
			$("#bar_" + $id).css({"width" : $percent + "%"});
		},
		delete : function ($id) {
			$("#" + $id).remove();
		}
	};
	var uploader = {
		show : function () {
			$cont = $("<div id='uploader'></div>");
			$("<span class='titre'>Create an empty file:</span>").appendTo($cont);
			$form = $("<form></form>").appendTo($cont);
			$go1 = $("<input type='submit' value='Create' />").hide();
			$("<input type='text' name='name' />").appendTo($form).keyup(function(){
				if($(this).val() != ""){
					$go1.show();
				}
				else {
					$go1.hide();
				}
			});
			$go1.appendTo($form)
			$form.submit(function(e){
				alert("create file")
				e.preventDefault();
			});
			$("<span class='titre'>Create an empty folder:</span>").appendTo($cont);
			$form = $("<form></form>").appendTo($cont);
			$go2 = $("<input type='submit' value='Create' />").hide();
			$("<input type='text' name='name' />").appendTo($form).keyup(function(){
				if($(this).val() != ""){
					$go2.show();
				}
				else {
					$go2.hide();
				}
			});
			$go2.appendTo($form)
			$form.submit(function(e){
				alert("create folder")
				e.preventDefault();
			});
			$("<span class='titre'>Upload some files:</span>").appendTo($cont);
			$form = $("<form></form>").appendTo($cont);
			$go3 = $("<input type='submit' value='Upload' />").hide();
			$("<input type='file' name='file' />").appendTo($form).change(function(){
				if($(this).val() != ""){
					$go3.show();
				}
				else {
					$go3.hide();
				}
			});
			$go3.appendTo($form)
			$form.submit(function(e){
				alert("Upload file")
				e.preventDefault();
			});
			$("<input type='button' value='close' />").click(popup.close).appendTo($cont);
			popup.open($cont);
		}
	}
	var file = {
		open : function ($chemin,$name) {
			$cont = $("<div id='afile'></div>");
			$("<span class='name'>" + $name + "</span>").appendTo($cont);
			$infotable = $("<table></table>").appendTo($cont);
			$("<input type='button' value='Download' />").click(function(){
				file.download($chemin + "/" + $name);
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
		download : function () {
			$url = "cmd/get.php?";
			$.each(arguments,function($i,$file){
				$url += "file" + $i + "=" + $file + "&";
			});
			window.location.href = $url;
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
		selected : [],
		updatepath : function () {
			window.location.hash = finder.path;
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
		refresh : function () {
			finder.lister(finder.path);
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
						finder.selected = [];
						$("#file_container").empty();
						$.each($data['list'],function($i,$file){
							$ligne = $("<div class='" + $file['type'] + "'></div>");
							$check = $("<input type='checkbox' />");
							$check.click(function(e){
								e.stopPropagation();
								if (this.checked) {
									finder.selected.push($file['name']);
								}
								else {
									$index = finder.selected.indexOf($file['name']);
									if($index !=-1) finder.selected.splice($index, 1);
								}
							});
							$check.appendTo($("<span class='select'></span>").appendTo($ligne));
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
	$("#button-download").click(function (e) {
		if(finder.selected.length == 0){
			util.alert("No item selected.");
		}
		else {
			$all = [];
			$.each(finder.selected,function($i,$file){
				$all.push(finder.path + "/" + $file);
			});
			file.download.apply(null,$all);
		}
	});
	$("#button-add").click(uploader.show);
	$("#popoverlay").click(function () {
		if(popup.closeonclick) popup.close();
	});
	$(document).keyup(function(e) {
		if (e.keyCode == 27 && popup.closeonclick) popup.close();    // esc
	});
	popup.close();
	$hash = window.location.hash.substring(1);
	if ($hash=="") $hash = "/";
	finder.lister($hash);
});
