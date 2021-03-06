//Open share menu and render canvas to image

var fullCanvasURL;
var canvasRenderURL;

$(document).on("tap", "#share-menu-button", function() {
    hideGridMenu();
    hideAddMenu();
    
    //Make sure crop and grid are disabled before render

    if (cropFlag) {
        cancelCrop();
    }

    //Make sure grid is gone before render

    if (stage.find("#stage-grid").length === 1) {
        stage.find("#stage-grid").remove();
        layer.draw();
        $("#grid-menu-options").hide();
    }

    if ($("#share-menu").is(":visible")) {
        $("#share-menu").fadeOut(200, function() {
            hideShareMenu();
        });
    } else {
        $("#share-menu").fadeIn(200, function() {
            //Add branding text before render            

            var brandText = new Kinetic.Text({
                x:stage.width() - 250,
                y:stage.height() - 50,
                fontSize:25,
                text:"Astronomy Collage",
                fill:"#FFFFFF",
                id:"brand-text"
            });


            layer.add(brandText);
            stage.add(layer);

            stage.toDataURL({
                mimeType:"image/png",
                quality:1,
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
                            canvasRenderURL = "http://104.130.10.41/astrocollages/" + data;

                            // fileTransfer.download(
                            //     canvasRenderURL,
                            //     "/user/full/" + data,
                            //     function(entry) {
                            //         console.log("Download complete: " + entry.fullPath);
                            //     },
                            //     function(error) {
                            //         console.log("Download error source: " + error.source);
                            //         console.log("Download error target: " + error.target);
                            //         console.log("Error code: " + error.code);
                            //     }
                            // );
                            
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
    $("#share-render-container .ajax-block").show();
    $("#share-render-container").removeAttr("style");
    
    canvasRenderIMG = null;
    canvasRenderURL = null;

    //Remove branding text

    if (stage.find("#brand-text").length === 1) {
        stage.find("#brand-text")[0].remove();
        layer.draw();
    }
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

//Share on Twitter

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

//Send by email

$(document).on("tap", "#share-send-by-email", function(event) {
	event.preventDefault();

    if (canvasRenderURL) {
       window.plugins.socialsharing.shareViaEmail(
            'Check out my Astronomy Collage! <div style="margin-top:20px;"><a href="https://itunes.apple.com/us/app/astrocollage/id893408730?ls=1&mt=8">Download Astronomy Collage on the App Store</a></div>',
            'My Astronomy Collage',
            null, // TO: must be null or an array
            null, // CC: must be null or an array
            null, // BCC: must be null or an array
            [canvasRenderURL], // FILES: can be null, a string, or an array
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