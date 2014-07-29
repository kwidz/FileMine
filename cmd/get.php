<?php

	$settings = file_get_contents("../settings.json");
	$settings = (array)json_decode($settings);

	if(isset($_GET["file"]) && !empty($_GET["file"])){
		$file = $_GET["file"];
		if(substr($settings["paths"][0],-1)=="/" && $file[0]=="/"){
			$file = substr($file, 1);
		}
		else if(substr($settings["paths"][0],-1)!="/" && $file[0]!="/"){
			$settings["paths"][0] .= "/";
		}
		$absolute              = $settings["paths"][0] . $file;
        if(file_exists($absolute)) {
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename='.basename($file));
            header('Content-Transfer-Encoding: binary');
            header('Expires: 0');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Pragma: public');
            header('Content-Length: ' . filesize($file));
            ob_clean();
            flush();
            readfile($file);
            exit;
        }
    }

?>
