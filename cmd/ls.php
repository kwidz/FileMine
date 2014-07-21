<?php

header("Content-Type: text/plain");

$err    = "";
$result = "";
if(isset($_GET["dir"]) && !empty($_GET["dir"])){
	$dir=$_GET["dir"];
	// $settings = file_get_contents("../settings.json");
	// $settings = json_decode($settings);
	$nb_fichier = 0;
	if($dossier = @opendir($_GET["dir"])){
		$sep = "";
		while(false !== ($fichier = readdir($dossier)))
		{
			if($fichier != '.'){
				$nb_fichier += 1;
				if (is_dir($dir."/".$fichier)) {
					$type = "file";
				}else{
					$type = "folder";
				}
				$result .= $sep . "{\"name\":\"$fichier\",\"type\":\"$type\",\"size\":\"-\"}\n";
				$sep     = ",";
			}
		}
	}
	else {
		$err .= "Failed to open directory.";
	}
}
else {
	$err .= "Missing argument.\n";
}
echo "{\"err\": \"$err\",\n \"list\": [ $result ],\n\"path\":\"$dir\"}";
