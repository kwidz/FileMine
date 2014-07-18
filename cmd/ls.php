<?php 
if(isset($_GET["directory"])&& !empty($_GET["directory"])){
	$nb_fichier = 0;
	echo '<ul>';
	if($dossier = opendir($_GET["directory"])){
		while(false !== ($fichier = readdir($dossier)))
		{
			if($fichier != '.'){
				$nb_fichier++;
				
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
	echo '</ul>';
}