$(document).on("tap", "#place-camera-roll", function() {
	navigator.camera.getPicture(cameraSuccess, cameraError, {
		sourceType:Camera.PictureSourceType.PHOTOLIBRARY
	});

	function cameraSuccess(imageData) {
		alert(imageData);
	}

	function cameraError() {
		navigator.notification.alert(
			"Sorry... There was an error accessing your photos.",
			null,
			"Error",
			"Done"
		);
	}
});