$(document).on("tap", "#share-facebook", function(event) {
	alert("Worked");
    window.plugins.socialsharing.shareViaFacebook('Message via Facebook', null, null, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
});