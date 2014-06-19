//Share on Facebook

$(document).on("tap", "#share-facebook", function(event) {
	event.preventDefault();

	window.plugins.socialsharing.shareViaFacebook('Check out my cool AstroCollage!', null, fullCanvasURL, null, null);
});

$(document).on("tap", "#share-twitter", function(event) {
	event.preventDefault();

	window.plugins.socialsharing.shareViaTwitter('Check out my cool AstroCollage!', null, fullCanvasURL, null, null);
});