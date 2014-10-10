<?php

header("Content-Type: application/json, charset=utf-8");

$err = "";

switch ($_GET["action"]) {
	case "newfile": {
		if(!isset($_GET["path"]) || empty($_GET["path"])){
			$err .= "FileMine: add.php: newfile: missing argument. ";
		}
		else {

		}
	}
	break;
	case "newdir": {
		if(!isset($_GET["path"]) || empty($_GET["path"])) $err .= "FileMine: add.php: newdir: missing argument. ";

	}
	break;
	case "upload": {

	}
	break;
}

?>
