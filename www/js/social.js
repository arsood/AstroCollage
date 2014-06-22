//Open share menu and render canvas to image

var fullCanvasURL;
var canvasRenderURL;

$(document).on("tap", "#share-menu-button", function() {
    hideGridMenu();
    hideAddMenu();
    
    //Make sure crop and grid are disabled before render

    cancelCrop();

    //Make sure grid is gone before render

    stage.find("#stage-grid").remove();
    layer.draw();
    $("#grid-menu-options").hide();

    if ($("#share-menu").is(":visible")) {
        $("#share-menu").fadeOut(200, function() {
            $("#share-render-container .ajax-block").show();
            $("#share-render-container").removeAttr("style");
            canvasRenderURL = null;
        });
    } else {
        $("#share-menu").fadeIn(200, function() {
            stage.toDataURL({
                callback:function(dataUrl) {
                    fullCanvasURL = dataUrl;

                    ajaxUrl = fullCanvasURL.replace("data:image/png;base64,","");

                    $.ajax({
                        url:"http://api.astrocollage.net/convert.php",
                        type:"POST",
                        data:{
                            astroUri:ajaxUrl
                        },
                        success:function(data) {
                            $("#share-render-container").attr("style", "background:url(http://api.astrocollage.net/astrocollages/" + data + ") no-repeat;");

                            canvasRenderURL = "http://api.astrocollage.net/astrocollages/" + data;
                            
                            $("#share-render-container .ajax-block").hide();
                        },
                        error:function() {
                            $("#share-render-container .ajax-block").hide();
                            navigator.notification.alert(
                                "Sorry, your canvas cannot be shared at this time. Please save to your camera roll instead.",
                                null,
                                "Share Error",
                                "Close"
                            );
                        }
                    });
                }
            });
        });
    }
});

//Hide share menu

function hideShareMenu() {
    $("#share-menu").hide();
}

//Share on Facebook

$(document).on("tap", "#share-facebook", function(event) {
	event.preventDefault();

    if (canvasRenderURL) {
	   window.plugins.socialsharing.shareViaFacebook('Check out my cool AstroCollage!', null, canvasRenderURL, null, null);
    } else {
        navigator.notification.alert(
            "Your canvas is not ready yet. Please try again shortly.",
            null,
            "Not Ready",
            "Close"
        );
    }
});

$(document).on("tap", "#share-twitter", function(event) {
	event.preventDefault();

    if (canvasRenderURL) {
       window.plugins.socialsharing.shareViaTwitter('Check out my cool AstroCollage!', null, canvasRenderURL, null, null);
    } else {
        navigator.notification.alert(
            "Your canvas is not ready yet. Please try again shortly.",
            null,
            "Not Ready",
            "Close"
        );
    }
});

$(document).on("tap", "#share-send-by-email", function(event) {
	event.preventDefault();

    if (canvasRenderURL) {
       window.plugins.socialsharing.shareViaEmail(
            'Check out my AstroCollage',
            'My AstroCollage',
            null, // TO: must be null or an array
            null, // CC: must be null or an array
            null, // BCC: must be null or an array
            ["'" + canvasRenderURL + "'"], // FILES: can be null, a string, or an array
            null, // called when sharing worked, but also when the user cancelled sharing via email (I've found no way to detect the difference)
            null // called when sh*t hits the fan
        );
    } else {
        navigator.notification.alert(
            "Your canvas is not ready yet. Please try again shortly.",
            null,
            "Not Ready",
            "Close"
        );
    }
});