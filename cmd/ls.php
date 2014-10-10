<?php

header("Content-Type: text/plain, charset=utf-8");

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
	$absolute = $settings["paths"][0] . $dir;
	$nb_fichier = 0;
	if($dossier = @opendir($absolute)){
		$sep = "";
		while(false !== ($fichier = readdir($dossier))){
			if($fichier == '.' || ($settings["show-hidden-file"]=="n" && $fichier[0]=="." && $fichier!="..")) continue;
			$nb_fichier += 1;
			$size = "-";
			if (is_dir($absolute."/".$fichier)) {
				$type = "folder";
			}
			else{
				$type = "file";
				$size = @filesize($absolute."/".$fichier);
			}
			$result .= $sep . "{\"name\":\"$fichier\",\"type\":\"$type\",\"size\":\"$size\"}\n";
			$sep     = ",";
		}
	}
	else {
		$err .= "Failed to open " . $dir;
	}
}
else {
	$err .= "Missing argument.\n";
}
if($dir == "" || $dir[0]!="/") $dir = "/" . $dir;

echo "{\"err\": \"$err\",\n \"list\": [ $result ],\n\"path\":\"$dir\"}";
