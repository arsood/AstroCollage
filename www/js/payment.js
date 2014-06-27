var IAP = {};

$(document).on("deviceready", function() {
	storekit.init({
		debug:true,
		ready:IAP.onReady,
		purchase:IAP.onPurchase,
		restore:IAP.onRestore,
		error:IAP.onError
	});
});

$(document).on("tap", ".locked", function() {
	if (IAP.loaded) {
		navigator.notification.confirm(
			"Would you like to unlock all images for $0.99?",
			onConfirm,
			"Purchase Image Unlock",
			"Purchase,Restore,Cancel"
		);

		function onConfirm(button) {
			if (button === 1) {
				window.storekit.purchase("app.astrocollage.unlock");
			} else if (button === 2) {
				window.storekit.restore();
			} else if (button === 3) {
				return false;
			}
		}
	} else {
		navigator.notification.alert(
            "Sorry, the store is not available.",
            null,
            "Store Not Available",
            "Close"
        );
	}
});

IAP.onReady = function() {
	storekit.load("app.astrocollage.unlock", function(products, invalidids) {
		IAP.loaded = true;
	});
};

IAP.onPurchase = function(transactionId, productId, receipt) {
	if (productId === "app.astrocollage.unlock") {
		$(".locked").remove();
		localStorage.setItem("full_unlock", true);
	}
};

IAP.onRestore = function(transactionId, productId, transactionReceipt) {
	if (productId === "app.astrocollage.unlock") {
		$(".locked").remove();
		localStorage.setItem("full_unlock", true);
	}
};

IAP.onError = function(errorCode, errorMessage) {
	console.log("Error: " + errorMessage);
};

