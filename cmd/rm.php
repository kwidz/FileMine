<?php
  $dir      = $_GET["dir"];
  $settings = file_get_contents("../settings.json");
  $settings = (array)json_decode($settings);
  $path = $settings["paths"][0];
  $pattern = '`(//)`';
  $replacement = '/';
  $dir = preg_replace($pattern, $replacement, $dir);
  $fichToDel = $path.$dir;

  exec('./script.sh '.$fichToDel);

  echo $last_line;

?>
