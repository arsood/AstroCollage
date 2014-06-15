//Set up Kinetic

Kinetic.pixelRatio = 1;

var stage = new Kinetic.Stage({
    container: 'stage',
    width: $(document).width(),
    height: $(document).height()
});

var MouseUpF = false;

var layer = new Kinetic.Layer();

layer.on('touchstart mousedown', function(event){
	MouseUpF = true;

	if(CropName == "free"){
		createFreeCropObject(stage.getPointerPosition());
	}
});

layer.on('touchmove mousemove', function(event){
	if(CropName == "free" && MouseUpF == true){
		updateFreeCropObject(stage.getPointerPosition());
	}
});

layer.on('touchend mouseup', function(event){
	MouseUpF = false;
	if(CropName == "free"){
		closeFreeCropObject(stage.getPointerPosition());
	}
});

stage.add(layer);

//Do stuff upon document ready

$(document).ready(function() {
    //Set background fill on start

    fillBackground("color", "#000000");

    //Set stamp pad width

    resizeStampScroll();

    //Fix for owlcarousel automatic show

    $("#add-menu-container").hide();

    //Make container responsive

    $("#container").height($(document).height());

    //Show stamp cancel if it is set

    if (localStorage.getItem("stamp_selected")) {
        $("#cancel-stamp-menu").show();
    }

    //Remove edit menu on swipe right

    // var editMenu = document.getElementById("edit-menu");

    // Hammer(editMenu).on("dragright", function() {
    //     hideManiMenu();
    // });
});

//Toggle stamp pad visibility

$(document).on("tap", "#stamp-pad-handle", function() {
    cancelStampSelection();
    hideStampImageMenu();
    hideManiMenu();
    $("#stamp-pad-image-container").slideToggle(200);
});

function resizeStampScroll() {
    //Resize scroll container

    var size = ($("#stamp-pad-image-container div").length) * 128;
    $("#stamp-pad-image-container").css("width", size + "px");
}

//Stamp pad scroll event

$("#stamp-pad-scroll-container").scroll(function() {
    hideStampImageMenu();
});

//Toggle image add menu on tap

$(document).on("tap", "#add-menu-button", function() {
    hideGridMenu();
    hideShareMenu();

    hideManiMenu();

    //Show or hide select menu, astro background menu, and text add menu

    if ($("#select-menu-container").is(":visible")) {
        $("#select-menu-container").fadeOut(200);
    } else if ($("#add-astro-background-menu").is(":visible")) {
        $("#add-astro-background-menu").fadeOut(200);
    } else if ($("#add-text-menu").is(":visible")) {
        $("#add-text-menu").fadeOut(200);
    } else if ($("#text-style-menu").is(":visible")) { 
        $("#text-style-menu").fadeOut(200);
    } else {
        $("#add-menu-container").fadeToggle(200);
    }

    //Make sure to hide the snap menu if it's visible

    $("#snap-menu").hide();
});

//Change background color of canvas

$(document).on("tap", "#menu-backgrounds-color-options div", function() {
    fillBackground("color", $(this).css("background-color"));
});

//Function to fill background of stage

function fillBackground(type, value) {
    //Remove old background

    stage.find("#stage-background").remove();

    if (type === "color") {
        var rect = new Kinetic.Rect({
            x:0,
            y:0,
            width:$(document).width(),
            height:$(document).height(),
            fill:value,
            id:"stage-background"
        });

        layer.add(rect);
        stage.add(layer);

        resetStageBackground();
    }
}

//Make sure background is on bottom

function resetStageBackground() {
    //Wrap in timeout to fix loading errors

    setTimeout(function() {
        stage.find("#stage-background").moveToBottom();
        layer.draw();
    }, 30);
}

//Create carousel for all slidy menus

$("#add-menu-container, #menu-select-nebulae, #menu-select-nurseries, #menu-select-galaxies, #menu-select-stars, #menu-select-sun, #menu-select-planets, #menu-select-misc").owlCarousel({
    slideSpeed:300,
    paginationSpeed:400,
    singleItem:true
});

//Open up category-specific image options

$(document).on("tap", "#add-menu-container div.menu-image", function() {
    $("#add-menu-container").hide();
    $("#select-menu-container").show();

    $(".menu-select-container").children().hide();

    var category = $(this).attr("data-category");

    $("#menu-select-" + category).show();
});

//Hide options on menu back tap

$(document).on("tap", ".select-menu-back", function() {
    $("#select-menu-container").hide();
    $("#add-astro-background-menu").hide();
    $("#add-menu-container").show();
    $("#add-text-menu").hide();
});

//Handle tap of image in a category

$(document).on("tap", "#select-menu-container div.menu-image", function() {
    if ($(this).children().length === 1) {
        return false;
    } else {
        pieceTapFlag = false;

        localStorage.setItem("selected_image", $(this).attr("data-image"));

        placeImage("img/library/" + localStorage.getItem("selected_image"), null, null, {
            width:null,
            height:null
        }, null, true);

        hideAddMenu();

        //Open up snap menu

        // var thisOffset = $(this).offset();

        // $("#snap-menu").css("top", thisOffset.top - ($(this).height() * 2 + 30)).css("left", thisOffset.left - ($(this).width() / 2) + 10).show();

        // localStorage.setItem("selected_image", $(this).attr("data-image"));
    }
});

//Set astro background image

$(document).on("tap", "#add-astro-background-menu div.menu-image", function() {
    if ($(this).children().length === 1) {
        return false;
    } else {
        stage.find("#stage-background").remove();

        var imageObj = new Image();

        var piece = new Kinetic.Image({
            image: imageObj,
            id:"stage-background",
            width:$(document).width(),
            height:$(document).height()
        });

        imageObj.src = $(this).attr("data-image");

        layer.add(piece);
        stage.add(layer);

        resetStageBackground();
    }
});

//Hide and show manipulation menu

function hideManiMenu() {
    $("#edit-menu").removeClass("edit-menu-show").addClass("edit-menu-hide");
}

function showManiMenu() {
    if ($("#stamp-pad-image-container").is(":visible")) {
        return false;
    } else {
        $("#edit-menu").removeClass("edit-menu-hide").addClass("edit-menu-show");
    }
}

//Hide mani menu button

$(document).on("tap", "#close-mani-menu-button", hideManiMenu);

//Image place function

var lastId = 1;
var pieceTapFlag = true;

function placeImage(insertImage, xCoord, yCoord, dimensions, imageId, mani) {
    //Place image on canvas

    var imageObj = new Image();
    
    imageObj.onload = function() {
        if (xCoord === null && yCoord === null) {
            xCoord = imageObj.width / 2;
            yCoord = imageObj.height / 2;
        }

        if (imageId === null) {
            idImage = lastId++;
        } else {
            idImage = imageId;
        }

        if (mani) {
            dragMe = true;
        } else {
            dragMe = false;
        }

        var piece = new Kinetic.Image({
            image:imageObj
        });

        var pieceGroup = new Kinetic.Group({
            x: xCoord,
            y: yCoord,
            offsetX: imageObj.width / 2,
            offsetY: imageObj.height / 2,
            id:idImage,
            draggable:dragMe,
            width:dimensions.width,
            height:dimensions.height
        });

        pieceGroup.add(piece);
        layer.add(pieceGroup);
        stage.add(layer);

        //Set up image transforms

        if (mani) {
            transImage(pieceGroup, true);
        }

        //Show layer options and set id so we can manipulate this layer later

        pieceGroup.on("tap", function() {
            //Toggle option menu on tap of canvas image

            if (localStorage.getItem("stamp_selected")) {
                return false;
            } else {
                localStorage.setItem("canvas_image_selected", this.id());
                if ($("#edit-menu").hasClass("edit-menu-hide") && !$("#add-menu-container").is(":visible") && !$("#select-menu-container").is(":visible") && !$("#add-astro-background-menu").is(":visible") && !$("#add-text-menu").is(":visible") && !$("#text-style-menu").is(":visible") && !$("#share-menu").is(":visible") && pieceTapFlag) {
                    showManiMenu();
                } else {
                    hideManiMenu();
                }

                layer.draw();
            }
        });
    };
    
    imageObj.src = insertImage;

    resetStageBackground();
}

function transImage(item, rotation) {
    //User Hammer.js for pinch zooming and rotating

    var hammertime = Hammer(item);

    var originalScale = {
        x:1,
        y:1
    };
    var originalRotation = 0;

    hammertime.on("transform", function(event) {
        event.preventDefault();

        var scaleDiff = 1 - originalScale.x;

        item.scale({
            x:event.gesture.scale - scaleDiff,
            y:event.gesture.scale - scaleDiff
        })

        if (rotation) {
            item.rotation(event.gesture.rotation + originalRotation);
        }

        layer.draw();
    }).on("transformend", function() {
        originalScale = item.scale();
        originalRotation = item.rotation();
    });
}

//Handle snap menu place

// $(document).on("tap", "#snap-menu-place", function() {
//     placeImage("img/library/" + localStorage.getItem("selected_image"), null, null, {
//         width:null,
//         height:null
//     }, null, true);

//     $("#snap-menu").hide();
// });

//Handle snap menu add to stamp pad

var stampTemplateSource = $("#stamp-pad-template").html();
var stampTemplate = Handlebars.compile(stampTemplateSource);

var stampImageId = 0;

//OLD CODE: Add to stamp pad from snap menu

// $(document).on("tap", "#snap-menu-add", function() {
//     var html = stampTemplate({ image:localStorage.getItem("selected_image"), id: stampImageId++ });

//     $("#stamp-pad-image-container").append(html);

//     resizeStampScroll();

//     $("#snap-menu").hide();

//     OLD CODE: Can remove element from stamp pad on downward drag

//     Create draggable element

//     $(".stamp-pad-image").draggable({
//         revert:true,
//         helper:"clone",
//         appendTo:"#container"
//     });

//     Create droppable effect

//     $("#container").droppable({
//         drop:function(event, ui) {
//             if (ui.offset.top >= 100) {
//                 ui.draggable.fadeOut(200);
//                 ui.helper.fadeOut(200);
//             }
//         }
//     });
// });

//Handle snap menu cancel

// $(document).on("tap", "#snap-menu-cancel", function() {
//     $("#snap-menu").fadeOut("fast");
// });

//Save image data to localStorage and set to stamp pad

$(document).on("tap", "#edit-menu-stamp-adduse", function() {
    var selectedLayer = stage.find("#" + localStorage.getItem("canvas_image_selected"))[0];

    console.log(selectedLayer.toJSON());

    console.log(selectedLayer.toDataURL());
});

//Tap on stamp pad image to get options

$(document).on("tap", ".stamp-pad-image", function() {
    //Get ID to pass down scope to the menu

    sessionStorage.setItem("temp_stamp_selected", $(this).attr("id"));

    var thisOffset = $(this).offset();

    var newLeftOffset = thisOffset.left - ($(this).width() / 2) - 10;

    //Make sure menu doesn't go off-screen

    if (newLeftOffset < 20) {
        newLeftOffset = 10;
    }

    if (newLeftOffset > $(document).width() - 250) {
        newLeftOffset = $(document).width() - 248;
    }

    $("#stamp-image-menu").css("left", newLeftOffset).show();
    $("#stamp-image-caret").css("left", thisOffset.left + 32).show();
});

//Activate stamp pad image

$(document).on("tap", "#stamp-image-activate", function() {
    //Grab the data-image attribute to activate the stamp

    var dataImage = $("#" + sessionStorage.getItem("temp_stamp_selected")).attr("data-image");
    
    //Set the persistent localStorage to hold on to the stamp

    localStorage.setItem("stamp_selected", dataImage);
    $(".stamp-pad-image").removeClass("black-border");
    $("#" + sessionStorage.getItem("temp_stamp_selected")).addClass("black-border");
    
    //Hide the stamp image menu and the stamp container

    hideStampImageMenu();

    $("#stamp-pad-image-container").slideUp(200, function() {
        $("#cancel-stamp-menu").fadeIn(200);
    });
});

//Cancel stamp image menu selection

$(document).on("tap", "#stamp-image-cancel", function() {
    hideStampImageMenu();
});

//Remove stamp from stamp pad

$(document).on("tap", "#stamp-image-remove", function() {
    $("#" + sessionStorage.getItem("temp_stamp_selected")).fadeOut(100).dequeue()
    hideStampImageMenu();
});

//Function to hide stamp image menu

function hideStampImageMenu() {
    $("#stamp-image-menu").fadeOut(100).dequeue();
    $("#stamp-image-caret").fadeOut(100).dequeue();
}

//Machine gun to place stamp image that was selected

$(document).on("tap", "canvas", function(event) {
    if (localStorage.getItem("stamp_selected")) {
        placeImage("img/library/" + localStorage.getItem("stamp_selected"), event.pageX, event.pageY, {
            width:null,
            height:null
        }, null, true);
    } else {
        return false;
    }
});

//Open share menu and render canvas to image

$(document).on("tap", "#share-menu-button", function() {
    hideGridMenu();
    hideAddMenu();

    if ($("#share-menu").is(":visible")) {
        $("#share-menu").fadeOut(200, function() {
            $("#share-render-container .ajax-block").show();
            $("#share-render-container").removeAttr("style");
        });
    } else {
        $("#share-menu").fadeIn(200, function() {
            stage.toDataURL({
                callback:function(dataUrl) {
                    $("#share-render-container").attr("style", "background:url(" + dataUrl + ") no-repeat;");
                    localStorage.setItem("full_canvas_render", dataUrl);
                    $("#share-render-container .ajax-block").hide();
                }
            });
        });
    }
});

//Hide share menu

function hideShareMenu() {
    $("#share-menu").hide();
}

//Clear stamp selection

$(document).on("tap", "#cancel-stamp-menu", cancelStampSelection);

function cancelStampSelection() {
    localStorage.removeItem("stamp_selected");
    $(".stamp-pad-image").removeClass("black-border");
    $("#cancel-stamp-menu").fadeOut();
}

//Remove an image from the canvas

$(document).on("tap", "#edit-menu-remove", function() {
    stage.find("#" + localStorage.getItem("canvas_image_selected")).remove();
    layer.draw();

    cancelCrop();

    hideManiMenu();
});

//Change layer

$(document).on("tap", "#change-layer-up", function(event) {
    event.stopPropagation();
    stage.find("#" + localStorage.getItem("canvas_image_selected")).moveUp();
    layer.draw();
    resetStageBackground();
});

$(document).on("tap", "#change-layer-down", function(event) {
    event.stopPropagation();
    stage.find("#" + localStorage.getItem("canvas_image_selected")).moveDown();
    layer.draw();
    resetStageBackground();
});

//Open up astro background menu

$(document).on("tap", "#background-astro", function() {
    $("#add-menu-container").hide();
    $("#add-astro-background-menu").show();
});

//Hide add menu

function hideAddMenu() {
    hideManiMenu();

    $("#select-menu-container").hide(0, function() {
        //Reactivate piece tapping
        pieceTapFlag = true;
    });

    $("#add-astro-background-menu").hide();
    $("#add-menu-container").hide();
    $("#add-text-menu").hide();
    $("#text-style-menu").hide();

    $("#snap-menu").hide();
}

//Hide grid menu

function hideGridMenu() {
    $("#grid-menu").hide();
}

//Open up grid options menu

$(document).on("tap", "#grid-menu-button", function() {
    hideAddMenu();

    $("#grid-menu").fadeToggle(200);
});

//Place grid on canvas

$(document).on("tap", ".grid-menu-item", function() {
    stage.find("#stage-grid").remove();

    var imageObj = new Image();

    var piece = new Kinetic.Image({
        image: imageObj,
        id:"stage-grid",
        width:$(document).width(),
        height:$(document).height(),
        opacity:0.3
    });

    imageObj.src = $(this).attr("data-grid");

    layer.add(piece);
    stage.add(layer);

    resetStageBackground();

    $("#grid-menu").fadeOut(200).dequeue();
    $("#grid-menu-options").fadeIn(200).dequeue();
});

//Change grid layers

$(document).on("tap", "#grid-layer-up", function() {
    stage.find("#stage-grid").moveUp();

    layer.draw();

    resetStageBackground();
});

$(document).on("tap", "#grid-layer-down", function() {
    stage.find("#stage-grid").moveDown();

    layer.draw();

    resetStageBackground();
});

//Remove grid

$(document).on("tap", "#remove-grid-button", function() {
    stage.find("#stage-grid").remove();

    layer.draw();

    $("#grid-menu-options").fadeOut(200);
});

//Show add text options

$(document).on("tap", "#place-text", function() {
    hideAddMenu();
    $("#add-text-menu").show();
});

//Add text to canvas

var textId = 0;

$(document).on("tap", "#add-text-button", function(event) {
    event.preventDefault();

    var textValue = $("#add-text-input").val();

    if (textValue === "") {
        return false;
    }

    var newText = new Kinetic.Text({
        x:stage.width() / 3,
        y:200,
        fontSize:50,
        text:$("#add-text-input").val(),
        fill:"#FFFFFF",
        draggable:true,
        id:"text" + (textId++)
    });


    layer.add(newText);
    stage.add(layer);

    $("#add-text-input").val("");
    $("#add-text-menu").fadeOut(200);

    //Hide iOS keyboard

    document.activeElement.blur();
    $("#add-text-input").blur();

    //Set up tap on text element

    newText.on("tap", function() {
        localStorage.setItem("text_block_selected", this.id());
        hideAddMenu();

        $("#text-style-menu").fadeIn(200);
    });
});

//Change font color of selected text

$(document).on("tap", "#text-style-colors div", function() {
    var text = stage.find("#" + localStorage.getItem("text_block_selected"))[0];

    text.attrs.fill = $(this).css("background-color");

    layer.draw();
});

//Change font size up and down

$(document).on("tap", "#text-size-up", function() {
    var text = stage.find("#" + localStorage.getItem("text_block_selected"))[0];
    var newSize = text.attrs.fontSize + 20;

    tweenFontSize(text, newSize);
});

$(document).on("tap", "#text-size-down", function() {
    var text = stage.find("#" + localStorage.getItem("text_block_selected"))[0];
    var newSize = text.attrs.fontSize - 20;

    tweenFontSize(text, newSize);
});

function tweenFontSize(node, size) {
    var tween = new Kinetic.Tween({
        node:node,
        fontSize:size,
        duration:0.2
    });

    tween.play();
}

//Remove selected text

$(document).on("tap", "#delete-text-button", function() {
    stage.find("#" + localStorage.getItem("text_block_selected")).remove();
    layer.draw();
    $("#text-style-menu").fadeOut(200);
});

//Close menus with X button

$(document).on("tap", "#text-style-menu .close-menu-x", hideAddMenu);