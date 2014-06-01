//Place image from camera roll

$(document).on("tap", "#place-camera-roll", function() {
	navigator.camera.getPicture(cameraSuccess, null, {
		destinationType:Camera.DestinationType.FILE_URI,
		sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
		quality:80
	});

	function cameraSuccess(imageData) {
		placeImage(imageData, null, null, {
			width:null,
			height:null
		}, null, true);
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
		placeImage(imageData, null, null, {
			width:null,
			height:null
		}, null, true);
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

//Add background from camera roll

$(document).on("tap", "#background-camera-roll", function() {
	navigator.camera.getPicture(placeCordovaBackground, null, {
		destinationType:Camera.DestinationType.FILE_URI,
		sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
		quality:80
	});
});

//Add background from take photo

$(document).on("tap", "#background-take-photo", function() {
	navigator.camera.getPicture(placeCordovaBackground, null, {
		destinationType:Camera.DestinationType.FILE_URI,
		sourceType:Camera.PictureSourceType.CAMERA,
		quality:80
	});
});

function placeCordovaBackground(imageData) {
	stage.find("#stage-background").remove();

	fillBackground("color", "#000000");

	layer.draw();

	placeImage(imageData, null, null, {
		width:$(document).width(),
		height:$(document).height()
	}, "stage-background", false);

	resetStageBackground();
}