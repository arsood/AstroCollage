//Share on Facebook

$(document).on("tap", "#share-facebook", function(event) {
	event.preventDefault();

	window.plugins.socialsharing.shareViaFacebook('Check out my cool AstroCollage!', null, fullCanvasURL, null, null);
});

$(document).on("tap", "#share-twitter", function(event) {
	event.preventDefault();

	window.plugins.socialsharing.shareViaTwitter('Check out my cool AstroCollage!', null, fullCanvasURL, null, null);
});

$(document).on("tap", "#share-send-by-email", function(event) {
	event.preventDefault();

	window.plugins.socialsharing.shareViaEmail(
		'Check out my AstroCollage',
		'My AstroCollage',
		null, // TO: must be null or an array
		null, // CC: must be null or an array
		null, // BCC: must be null or an array
		["'" + fullCanvasURL + "'"], // FILES: can be null, a string, or an array
		null, // called when sharing worked, but also when the user cancelled sharing via email (I've found no way to detect the difference)
		null // called when sh*t hits the fan
	);
});