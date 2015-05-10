//Convert dataURI to blob

function dataURItoBlob(dataURI) {
	var binary = atob(dataURI.split(',')[1]);
	var array = [];

	for(var i = 0; i < binary.length; i++) {
		array.push(binary.charCodeAt(i));
	}

	return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}

//Generate random ID

function makeId() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < 5; i++ ) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	};

	return text;
}