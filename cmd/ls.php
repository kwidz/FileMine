<?php
if(isset($_GET["directory"])&& !empty($_GET["directory"])){
	$directory=$_GET["directory"];
	$nb_fichier = 0;
	if($dossier = opendir($_GET["directory"])){
		while(false !== ($fichier = readdir($dossier)))
		{
			if($fichier != '.'){
				$nb_fichier++;


				if (is_dir($directory."/".$fichier)) {

					echo"<div class='folder'>
					<span class='select'>
					<input type='checkbox' />
					</span>
					<span class='name'>
					$fichier
					</span>
					<span class='size'>
					2 Go
					</span>
					</div>";	
				}else{


					echo"<div class='file'>
					<span class='select'>
					<input type='checkbox' />
					</span>
					<span class='name'>
					$fichier
					</span>
					<span class='size'>
					2 Go
					</span>
					</div>";
				}
			}
		}

	}
}
