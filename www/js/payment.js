// var IAP = {
// 	list:["app.astrocollage.unlock"]
// };

// IAP.load = function() {
// 	if (!window.storekit) {
// 		console.log("In-App Purchase is not available");
// 		return;
// 	}

// 	storekit.init({
// 		debug:true,
// 		ready:IAP.onReady,
// 		purchase:IAP.onPurchase,
// 		restore:IAP.onRestore,
// 		error:IAP.onError
// 	});
// };

// IAP.load();

// IAP.onReady = function() {
// 	storekit.load(IAP.list, function(products, invalidids) {
// 		IAP.products = products;
// 		IAP.loaded = true;
// 	});
// };

// if (IAP.loaded) {
// 	$(document).on("tap", ".locked", function() {
// 		navigator.notification.confirm(
// 			"Would you like to unlock all images for $0.99?",
// 			onConfirm,
// 			"Purchase Image Unlock",
// 			"Purchase,Restore,Cancel"
// 		);

// 		function onConfirm(button) {
// 			if (button === 1) {
// 				IAP.buy("app.astrocollage.unlock");
// 			} else if (button === 2) {
// 				IAP.restore();
// 			} else if (button === 3) {
// 				return false;
// 			}
// 		}
// 	});
// };

// IAP.onPurchase = function(transactionId, productId, receipt) {
// 	if (productId === "app.astrocollage.unlock") {
// 		$(".locked").remove();
// 	}
// };

// IAP.onError = function(errorCode, errorMessage) {
// 	alert("Error: " + errorMessage);
// };

// IAP.buy = function(productId) {
// 	storekit.purchase(productId);
// };

// IAP.onRestore = function(transactionId, productId, transactionReceipt) {
// 	if (productId === "app.astrocollage.unlock") {
// 		$(".locked").remove();
// 	}
// };

// IAP.restore = function() {
// 	storekit.restore();
// };

//YEAH

storekit.init({
	debug:true,
	ready:IAP.onReady,
	purchase:IAP.onPurchase,
	restore:IAP.onRestore,
	error:IAP.onError
});

$(document).on("tap", ".locked", function() {
	navigator.notification.confirm(
		"Would you like to unlock all images for $0.99?",
		onConfirm,
		"Purchase Image Unlock",
		"Purchase,Restore,Cancel"
	);

	function onConfirm(button) {
		if (button === 1) {
			storekit.purchase("app.astrocollage.unlock");
		} else if (button === 2) {
			storekit.restore();
		} else if (button === 3) {
			return false;
		}
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

