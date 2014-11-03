<?php
  $dir      = $_GET["dir"];
  $settings = file_get_contents("../settings.json");
  $settings = (array)json_decode($settings);
  $path = $settings["paths"][0];
  $pattern = '`(//)`';
  $replacement = '/';
  $dir = preg_replace($pattern, $replacement, $dir);
  $fichToDel = $path.$dir;
  if(is_dir($fichToDel)){
    if(repEmpty($fichToDel)){
      rmdir($fichToDel);
      echo "The folder was deleted";
    }
    else echo "The folder must be empty to be deleted";
  }
  else{
    $rep = unlink($fichToDel);
    echo "The file was deleted";
}
function repEmpty($rep){
  $findFich=0;

    if ($dh = opendir($rep))
     {
      while (($file = readdir($dh)) !== false && $findFich==0)
      {
       if ($file!="." && $file!=".." ) $findFich=1;
       }
      closedir($dh);
     }

  if( $findFich==0) return true;
  else return false;
}
?>
