$(document).ready(function() {
	$popup = {
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
			$popup.closeonclick = true;
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
	$uploader = {
		show : function () {
			$cont = $("<div id='uploader'></div>");
			$("<span class='titre'>Create an empty file:</span>").appendTo($cont);
			$form_1 = $("<form></form>").appendTo($cont);
			$go1 = $("<input type='submit' value='Create' />").hide();
			$("<input type='text' id='create_file' name='name' />").appendTo($form_1).keyup(function(){
				if($(this).val() !== ""){
					$go1.show();
				}
				else {
					$go1.hide();
				}
			});
			$go1.appendTo($form_1);
			$form_1.submit(function(e){
				$.get("cmd/new.php", {path:$finder.path, file:$("#create_file").val(), type:"file" }).done(function($data) {
					$data = JSON.parse($data);
					if ($data.err === ""){
						$finder.refresh();
						$popup.close();
					}
					else {
						$util.error($data.err);
					}
				});
				e.preventDefault();
			});
			$("<span class='titre'>Create an empty folder:</span>").appendTo($cont);
			$form_2 = $("<form></form>").appendTo($cont);
			$go2 = $("<input type='submit' value='Create' />").hide();
			$("<input type='text' name='name' id='create_dir' />").appendTo($form_2).keyup(function(){
				if($(this).val() !== ""){
					$go2.show();
				}
				else {
					$go2.hide();
				}
			});
			$go2.appendTo($form_2);
			$form_2.submit(function(e){
				$.get("cmd/new.php", {path:$finder.path, file:$("#create_dir").val(), type:"dir" }).done(function($data) {
					$data = JSON.parse($data);
					if ($data.err === ""){
						$finder.refresh();
						$popup.close();
					}
					else {
						$util.error($data.err);
					}
				});
				e.preventDefault();
			});
			$("<span class='titre'>Upload some files:</span>").appendTo($cont);
			$form_3 = $("<form></form>").appendTo($cont);
			$go3 = $("<input type='submit' value='Upload' />").hide();
			$("<input type='file' name='file' />").appendTo($form_3).change(function(){
				if($(this).val() !== ""){
					$go3.show();
				}
				else {
					$go3.hide();
				}
			});
			$go3.appendTo($form_3);
			$form_3.submit(function(e){
				alert("Upload file");
				e.preventDefault();
			});
			$("<input type='button' value='close' />").click($popup.close).appendTo($cont);
			$popup.open($cont);
		}
	};
	$file = {
		open : function ($chemin,$name) {
			$cont = $("<div id='afile'></div>");
			$("<span class='name'>" + $name + "</span>").appendTo($cont);
			$infotable = $("<table></table>").appendTo($cont);
			$("<input type='button' value='Download' />").click(function(){
				$file.download($chemin + "/" + $name);
			}).appendTo($cont);

			$("<input type='button' value='Copy URL' id='CopyURLPopUp' style='margin-left:5px' />").appendTo($cont);
			$popup.width  = 500;
			$popup.open($cont);
			$.get( "cmd/info.php", { file : ($chemin + "/" + $name)} ).done(function($data) {
				if ($data) {
					$data = JSON.parse($data);
					if($data.err !== ''){
						$util.error($data.err);
					}
					else {
						$.each($data.info,function($label,$info){
							$tr = $("<tr></tr>").appendTo($infotable);
							$("<td>" + $label + "</td>").appendTo($tr);
							if($label=="size") $info = $util.humansize($info);
							$("<td>" + $info + "</td>").appendTo($tr);
						});
					}
				}
				else {
					$util.error("Empty reply from server for " + $name);
				}
			}).fail(function() {
				$util.error("Failed to connect, unable to get " + $name + " informations.");
			});


			var clientNew = new ZeroClipboard( $("#CopyURLPopUp") );
			clientNew.on( 'load', function(clientNew) {
				clientNew.on( 'datarequested', function(clientNew) {
					url=$file.copyURLFunction($chemin + "/" + $name);
					var reg=new RegExp(" ", "g");
					url=url.replace(reg,"%20");
					url="http://"+url;
					clientNew.setText(window.location.host+"/"+url);
				});

				clientNew.on( 'complete', function(clientNew, args) {
					console.log("Text copied to clipboard: \n" + args.text );
				});
			});

			clientNew.on( 'wrongflash noflash', function() {

				ZeroClipboard.destroy();
			} );

		},
		download : function () {
			$url = "cmd/get.php?";

			$.each(arguments,function($i,$fich){

				$url += "file" + $i + "=" + $fich + "&";
			});
			window.location.href = $url;
		},
		copyURLFunction : function () {
			$url = "cmd/get.php?";

			$.each(arguments,function($i,$fich){

				$url += "file" + $i + "=" + $fich + "&";
			});

			return $url;
		},
		delete : function ($chemin,$name) {
			// TODO
			$util.alert("delete " + $chemin + "/" + $name);
		}
	};
	$util = {
		alert : function ($msg) {
			// TODO
			$popup.open($msg);
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
			$("<input type='button' value='ok' />").click($popup.close).appendTo($cont);
			$popup.width  = 500;
			$popup.open($cont);
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
	};
	$finder = {
		path : "/",
		selected : [],
		updatepath : function () {
			window.location.hash = $finder.path;
			$("#path").empty();
			$("<a>#</a>").click(function () {
				$finder.lister("/");
			}).appendTo("#path");
			$splitted = $finder.path.split("/");
			$.each($splitted,function ($i,$dir){
				if($i!==0) {
					$("<span>/</span>").appendTo("#path");
					$lien = $("<a>" + $dir + "</a>");
					$lien.click(function(){
						$toopen = "";
						for($j=0;$j<=$i;$j++){
							$sep = "/";
							if($j===0 || $j==1) $sep = "";
							$toopen += $sep;
							$toopen += $splitted[$j];
						}
						$finder.lister($toopen);
					});
					$lien.appendTo("#path");
				}
			});
		},
		refresh : function () {
			$finder.lister($finder.path);
		},
		lister : function ($dir) {
			$.get( "cmd/ls.php", { dir: $dir} ).done(function($data) {
				if ($data) {
					$data = JSON.parse($data);
					if($data.err!==''){
						$util.error($data.err);
					}
					else {

						$data.list.sort(sortByName);
						$finder.path = $data.path;
						$finder.updatepath();
						$finder.selected = [];
						$("#file_container").empty();
						$.each($data.list,function($i,$fich){
							$ligne = $("<div class='" + $fich.type + "'></div>");
							$check = $("<input type='checkbox' />");
							$check.click(function(e){
								e.stopPropagation();
								if (this.checked) {
									$finder.selected.push($fich.name);
								}
								else {
									$index = $finder.selected.indexOf($fich.name);
									if($index !=-1) $finder.selected.splice($index, 1);
								}
							});
							$check.appendTo($("<span class='select'></span>").appendTo($ligne));
							$("<span class='name'>" + $fich.name + "</span>").appendTo($ligne);
							$("<span class='size'>" + $util.humansize($fich.size) + "</span>").appendTo($ligne);
							$ligne.click(function(){
								if ($fich.name=="..") {
									$tmp = $finder.path.split("/");
									$tmp.pop();
									$tmp = $tmp.join("/");
									if ($tmp==="") $tmp = "/";
									$finder.lister($tmp);
								}
								else if ($fich.type=="folder") {
									$sep = "/";
									if ($finder.path == "/") $sep = "";
									$finder.lister($finder.path + $sep + $fich.name);
								}
								else {
									$file.open($finder.path,$fich.name);
								}
							});
							$ligne.appendTo("#file_container");
						});
					}
				}
				else {
					$util.error("Empty reply from server for " + $dir);
				}
			}).fail(function() {
				$util.error("Failed to connect, unable to get " + $dir + " content.");
			});
		}
	};
	$("#button-download").click(function (e) {
		if($finder.selected.length === 0){
			$util.alert("No item selected.");
		}
		else {
			$all = [];
			$.each($finder.selected,function($i,$fich){
				$all.push($finder.path + "/" + $fich);
			});
			$file.download.apply(null,$all);
		}
	});
	ZeroClipboard.config( { moviePath: 'zeroclipboard/ZeroClipboard.swf' } );
	var client = new ZeroClipboard( $("#CopyURL") );
	client.on( 'load', function(client) {
		client.on( 'datarequested', function(client) {
			if($finder.selected.length === 0){
				$util.alert("No item selected.");
			}
			else {
				$all = [];
				$.each($finder.selected,function($i,$fich){
					$all.push($finder.path + "/" + $fich);
				});
				url=$file.copyURLFunction.apply(null,$all);
				var reg=new RegExp(" ", "g");
				url=url.replace(reg,"%20");
				url="http://"+url;
				client.setText(window.location.host+"/"+url);
			}


		});

		client.on( 'complete', function(client, args) {
			console.log("Text copied to clipboard: \n" + args.text );
		});
	});

	client.on( 'wrongflash noflash', function() {

		ZeroClipboard.destroy();
	} );
	$("#button-add").click($uploader.show);
	$("#popoverlay").click(function () {
		if($popup.closeonclick) $popup.close();
	});
	$(document).keyup(function(e) {
		if (e.keyCode == 27 /* ESC */ && $popup.closeonclick) $popup.close();
	});
	$popup.close();
	$hash = window.location.hash.substring(1);
	if ($hash==="") $hash = "/";
	$finder.lister($hash);

	$("#button-delete").click(function (e) {
		if($finder.selected.length === 0){
			$util.alert("No item selected.");
		}
		else {
			$all = [];
			$.each($finder.selected,function($i,$fich){
				$all = $finder.path + "/" + $fich;
				$.get( "cmd/rm.php", { dir: $all} ).done(function($data) {
					$util.alert($data);
					$finder.lister($finder.path);

				});

			});


		}
	});
});




function sortByName(key1, key2){
	if(key1.name.toUpperCase() > key2.name.toUpperCase())
		return 1;
		else
			return -1;

		}
