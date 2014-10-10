<?php

$settings = file_get_contents("../settings.json");
$settings = (array)json_decode($settings);

$all = [];

foreach($_GET as $key => $file){
	if(substr($key, 0, 4) != "file") continue;
	if(substr($settings["paths"][0],-1)=="/" && $file[0]=="/"){
		$file = substr($file, 1);
	}
	else if(substr($settings["paths"][0],-1)!="/" && $file[0]!="/"){
		$settings["paths"][0] .= "/";
	}
	$all[] = $settings["paths"][0] . $file;
}

if(count($all)==0){
	exit("FileMine: cmd/get.php: missing argument.");

}
else{
	$absolute = $all[0];
	if(is_dir($all[0]) || count($all)>1){
		$zip         = new ZipArchive();
		$i           = 0;
		do {
			$i += 1;
			$absolute = "/tmp/filemine-download" . $i .".zip";
		} while(file_exists($absolute));
		$zip->open($absolute,ZIPARCHIVE::CREATE);
		foreach($all as $file) {
			if(is_dir($file)){
				$tomuch = explode("/",substr($file,1));
				array_pop($tomuch);
				$tomuch = "/" . join("/",$tomuch) . "/";
				$tomuch = strlen($tomuch);
				$dirlist = new RecursiveDirectoryIterator($file);
				$filelist = new RecursiveIteratorIterator($dirlist);
				foreach($filelist as $chemin){
					if(is_dir($chemin)){
						$zip->addEmptyDir("filemine/" . substr($chemin,$tomuch));
					}
					else {
						$zip->addFile($chemin,"filemine/" . substr($chemin,$tomuch));
					}
				}
			}
			else {
				$zip->addFile($file,"filemine/" . end(explode("/",$file)));
			}
		}
		$zip->close();
	}
	if(file_exists($absolute)) {
		header('Content-Description: File Transfer');
		header('Content-Type: ' . mime_content_type($absolute));
		header('Content-Disposition: attachment; filename='.basename($absolute));
		header('Content-Transfer-Encoding: binary');
		header('Expires: 0');
		header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
		header('Pragma: public');
		header('Content-Length: ' . filesize($absolute));
		ob_clean();
		flush();
		readfile($absolute);
		exit;
	}
}

?>
