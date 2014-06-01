//Place image from camera roll

$(document).on("tap", "#place-camera-roll", function() {
	navigator.camera.getPicture(cameraSuccess, null, {
		destinationType:Camera.DestinationType.FILE_URI,
		sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
		quality:80
	});

	function cameraSuccess(imageData) {
		placeImage(imageData, "none", "none", {
			width:null,
			height:null
		});
	}
});

//Place image from camera

$(document).on("tap", "#place-camera", function() {
	navigator.camera.getPicture(cameraSuccess, null, {
		destinationType:Camera.DestinationType.FILE_URI,
		sourceType:Camera.PictureSourceType.CAMERA,
		quality:80
	});

	function cameraSuccess(imageData) {
		placeImage(imageData, "none", "none", {
			width:null,
			height:null
		});
	}
});

//Reset canvas

$(document).on("tap", "#reset-canvas-button", function() {
	navigator.notification.confirm(
		"Are you sure you want to reset your canvas?",
		onConfirm,
		"Reset Confirmation",
		"Reset,Cancel"
	);

	function onConfirm(button) {
		if (button === 1) {
			localStorage.removeItem("stamp_selected");
			location.reload();
		} else {
			return false;
		}
	}
});