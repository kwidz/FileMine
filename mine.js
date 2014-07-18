$(document).ready(function() {

	lister("/home/geoffrey");
});



function getXMLHttpRequest() {
	var xhr = null;

	if (window.XMLHttpRequest || window.ActiveXObject) {
		if (window.ActiveXObject) {
			try {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		} else {
			xhr = new XMLHttpRequest();
		}
	} else {
		alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
		return null;
	}

	return xhr;
}



function lister(directory){

	var xhr = getXMLHttpRequest();
	xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {

        		document.getElementById("file_container").innerHTML= xhr.responseText; // Données textuelles récupérées

        }
	};
	//modif pour fichier
	xhr.open("GET", "cmd/ls.php?directory="+directory, true);
	xhr.send();

}
