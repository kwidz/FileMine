<?php

	header('Content-type: text/css');

	// GET COLOR
	$settings = file_get_contents("../settings.json");
	$settings = (array)json_decode($settings);
	$color    = $settings["main-color"];

	// RGB CONVERTION
	$toconvert = ltrim($color,'#');
	$rgb       = array();
	if(strlen($toconvert)!=3 && strlen($toconvert)!=6){
		$toconvert = "44b198";
	}
	if(strlen($toconvert)==3){
		$substr = str_split($toconvert,1);
		for($i=0; $i<3; $i+=1){
			$substr[$i] = $substr[$i] . $substr[$i];
		}
	}
	else if(strlen($toconvert)==6){
		$substr = str_split($toconvert,2);
	}
	foreach($substr as $decomp){
		$rgb[] = hexdec($decomp);
	}

	// COLOR CALCULATION
	$darker  = array();
	$lighter = array();
	for($i=0; $i<3; $i+=1){
		$darker[$i]  = $rgb[$i] - 30;
		$lighter[$i] = $rgb[$i] + 30;
		if($darker[$i]<0)    $darker[$i]  = 0;
		if($lighter[$i]>255) $lighter[$i] = 255;
	}
	$perfect = "rgb(" . join(',',$rgb) . ")";
	$light   = "rgb(" . join(',',$lighter) . ")";
	$darck   = "rgb(" . join(',',$darker) . ")";

?>

* {
	outline-color: <?php echo $perfect ?>;
}

div#afile span.name,
div#title span.path {
	color: <?php echo $perfect ?>;
}

div#file_container div.folder:hover,
div#file_container div.file:hover,
input[type=button] {
	background-color: <?php echo $perfect ?>;
}

input[type=button] {
	border: 1px solid <?php echo $darck ?>;
}

input[type=button]:active {
	background-color: <?php echo $darck ?>;
}
