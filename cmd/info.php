<?php

header("Content-Type: text/plain");

$settings = file_get_contents("../settings.json");
$settings = (array)json_decode($settings);

date_default_timezone_set($settings["time-zone"]);

$err  = "";
$info = array();

if(isset($_GET["file"]) && !empty($_GET["file"])){
	$file = $_GET["file"];
	if(substr($settings["paths"][0],-1)=="/" && $file[0]=="/"){
		$file = substr($file, 1);
	}
	else if(substr($settings["paths"][0],-1)!="/" && $file[0]!="/"){
		$settings["paths"][0] .= "/";
	}
	$absolute              = $settings["paths"][0] . $file;
	$info["path"]          = $file;
	$info["type"]          = mime_content_type($absolute);
	$info["size"]          = filesize($absolute);
	$info["last accessed"] = date($settings["date-format"], fileatime($absolute));
	$info["last modified"] = date($settings["date-format"], filemtime($absolute));
}
else {
	$err .= "FileMine: cmd/info.php: invalid argument.";
}

echo json_encode(array("err"=>$err,"info"=>$info));

?>
