<?php

header("Content-Type: text/plain");

$err    = "";
$result = "";
if(isset($_GET["dir"]) && !empty($_GET["dir"])){
	$dir      = $_GET["dir"];
	$settings = file_get_contents("../settings.json");
	$settings = (array)json_decode($settings);
	if(substr($settings["paths"][0],-1)=="/" && $dir[0]=="/"){
		$dir = substr($dir, 1);
	}
	else if(substr($settings["paths"][0],-1)!="/" && $dir[0]!="/"){
		$settings["paths"][0] .= "/";
	}
	$dir = $settings["paths"][0] . $dir;
	$nb_fichier = 0;
	if($dossier = @opendir($dir)){
		$sep = "";
		while(false !== ($fichier = readdir($dossier))){
			if($fichier=='.' || ($settings["hidden-file"]=="n" && $fichier[0]=="." && $fichier!="..")) continue;
			$nb_fichier += 1;
			$size = "-";
			if (is_dir($dir."/".$fichier)) {
				$type = "folder";
			}
			else{
				$type = "file";
				$size = @filesize($dir."/".$fichier);
				if ($size >= 1073741824){
					$size = round($size / 1073741824 * 100) / 100 . " Go";
				}
				elseif ($size >= 1048576){
					$size = round($size / 1048576 * 100) / 100 . " Mo";
				}
				elseif ($size >= 1024){
					$size = round($size / 1024 * 100) / 100 . " Ko";
				}
				else {
					$size .= " o";
				}
			}
			$result .= $sep . "{\"name\":\"$fichier\",\"type\":\"$type\",\"size\":\"$size\"}\n";
			$sep     = ",";
		}
	}
	else {
		$err .= "Failed to open " . $_GET["dir"];
	}
}
else {
	$err .= "Missing argument.\n";
}
echo "{\"err\": \"$err\",\n \"list\": [ $result ],\n\"path\":\"$dir\"}";
