<?php

header("Content-Type: text/plain, charset=utf-8");

$settings = file_get_contents("../settings.json");
$settings = (array)json_decode($settings);

date_default_timezone_set($settings["time-zone"]);

$err  = "";

if(isset($_GET["path"]) && !empty($_GET["path"]) && isset($_GET["file"])  && !empty($_GET["file"]) && isset($_GET["type"]) && !empty($_GET["type"])) {
	if(substr($settings["paths"][0],-1)=="/" && $_GET["path"][0]=="/"){
		$_GET["path"] = substr($_GET["path"], 1);
	}
	else if(substr($settings["paths"][0],-1)!="/" && $_GET["path"][0]!="/"){
		$settings["paths"][0] .= "/";
	}
	if(substr($_GET["path"],-1)!='/') $_GET["path"] .= '/';
	$absolute = $settings["paths"][0] . $_GET["path"];
	if($_GET["type"]=="dir"){
		if(!@mkdir($absolute . $_GET["file"])) $err = "Unable to create a directory named " . $_GET["file"] . ".";
	}
	elseif($_GET["type"]=="file"){
		if(!@touch($absolute . $_GET["file"])) $err = "Unable to create a file named " . $_GET["file"] . ".";
	}
	else {
		$err = "Wrong type.";
	}
}

echo json_encode(array("err"=>$err), JSON_PRETTY_PRINT);

?>
