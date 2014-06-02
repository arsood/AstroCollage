//Set up Kinetic

Kinetic.pixelRatio = 1;

var stage = new Kinetic.Stage({
  container: 'stage',
  width: $(document).width(),
  height: $(document).height()
});

var layer = new Kinetic.Layer();

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

    var editMenu = document.getElementById("edit-menu");

    Hammer(editMenu).on("dragright", function(event) {
        hideManiMenu();
    });
});

//Toggle stamp pad visibility

$(document).on("tap", "#stamp-pad-handle", function() {
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

$(document).on("tap", "#add-menu-button", function(event) {
    event.stopPropagation();
    hideManiMenu();

    //Show or hide select menu and astro background menu

    if ($("#select-menu-container").is(":visible")) {
        $("#select-menu-container").fadeOut(200);
    } else if ($("#add-astro-background-menu").is(":visible")) {
        $("#add-astro-background-menu").fadeOut(200);
    } else {
        $("#add-menu-container").fadeToggle(200);
    }

    //Make sure to hide the snap menu if it's visible

    $("#snap-menu").hide();
});

//Change background color of canvas

$(document).on("tap", "#menu-backgrounds-color-options div", function() {
    //$("#stage").css("background-color", $(this).css("background-color"));
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
    }, 10);
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
});

//Handle tap of image in a category

$(document).on("tap", "#select-menu-container div.menu-image", function() {
    if ($(this).children().length === 1) {
        return false;
    } else {
        //Open up snap menu

        var thisOffset = $(this).offset();

        $("#snap-menu").css("top", thisOffset.top - ($(this).height() * 2 + 30)).css("left", thisOffset.left - ($(this).width() / 2) + 10).show();

        localStorage.setItem("selected_image", $(this).attr("data-image"));
    }
});

//Set astro background image

$(document).on("tap", "#add-astro-background-menu div.menu-image", function() {
    if ($(this).children().length === 1) {
        return false;
    } else {
        stage.find("#stage-background").remove();

        placeImage($(this).attr("data-image"), null, null, {
            width:$(document).width(),
            height:$(document).height()
        }, "stage-background", false);

        resetStageBackground();
    }
});

//Hide and show manipulation menu

function hideManiMenu() {
    $("#edit-menu").removeClass("edit-menu-show").addClass("edit-menu-hide");
}

function showManiMenu() {
    $("#edit-menu").removeClass("edit-menu-hide").addClass("edit-menu-show");
}

var lastId = 1;

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
            x: xCoord,
            y: yCoord,
            offsetX: imageObj.width / 2,
            offsetY: imageObj.height / 2,
            image: imageObj,
            draggable:dragMe,
            id:idImage,
            width:dimensions.width,
            height:dimensions.height
        });

        layer.add(piece);
        stage.add(layer);

        //Set up image transforms

        if (mani) {
            transImage(piece, true);
        }

        //Show layer options and set id so we can manipulate this layer later

        piece.on("tap", function() {
            //Toggle option menu on tap of canvas image

            if (localStorage.getItem("stamp_selected")) {
                return false;
            } else {
                localStorage.setItem("canvas_image_selected", this.id());
                if ($("#edit-menu").hasClass("edit-menu-hide") && !$("#add-menu-container").is(":visible") && !$("#select-menu-container").is(":visible") && !$("#add-astro-background-menu").is(":visible")) {
                    showManiMenu();
                    //this.stroke("red");
                    //this.strokeWidth(4);
                } else {
                    hideManiMenu();
                    //this.stroke(0);
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

$(document).on("tap", "#snap-menu-place", function() {
    placeImage("img/library/" + localStorage.getItem("selected_image"), null, null, {
        width:null,
        height:null
    }, null, true);

    $("#snap-menu").hide();
});

//Handle snap menu add to stamp pad

var stampTemplateSource = $("#stamp-pad-template").html();
var stampTemplate = Handlebars.compile(stampTemplateSource);

var stampImageId = 0;

$(document).on("tap", "#snap-menu-add", function() {
    var html = stampTemplate({ image:localStorage.getItem("selected_image"), id: stampImageId++ });

    $("#stamp-pad-image-container").append(html);

    resizeStampScroll();

    $("#snap-menu").hide();

    //DARN SHAME :( This was some nice code!

    //Create draggable element

    // $(".stamp-pad-image").draggable({
    //     revert:true,
    //     helper:"clone",
    //     appendTo:"#container"
    // });

    //Create droppable effect

    // $("#container").droppable({
    //     drop:function(event, ui) {
    //         if (ui.offset.top >= 100) {
    //             ui.draggable.fadeOut(200);
    //             ui.helper.fadeOut(200);
    //         }
    //     }
    // });
});

//Handle snap menu cancel

$(document).on("tap", "#snap-menu-cancel", function() {
    $("#snap-menu").fadeOut("fast");
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

    $("#stamp-image-menu").hide();

    $("#stamp-pad-image-container").slideUp(200, function() {
        $("#cancel-stamp-menu").fadeIn(200);
    });
});

//Cancel stamp image menu selection

$(document).on("tap", "#stamp-image-cancel", function() {
    hideStampImageMenu();
});

//Function to hide stamp image menu

function hideStampImageMenu() {
    $("#stamp-image-menu").fadeOut(100).dequeue();
    $("#stamp-image-caret").fadeOut(100).dequeue();
}

//Remove stamp from stamp pad

$(document).on("tap", "#stamp-image-remove", function() {
    $("#stamp-image-menu").fadeOut(100).dequeue();
    $("#" + sessionStorage.getItem("temp_stamp_selected")).fadeOut(100).dequeue()
    $("#stamp-image-caret").fadeOut(100).dequeue();
});

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

//Render canvas to image

$(document).on("tap", "#share-menu-button", function() {
    stage.toDataURL({
        callback:function(dataUrl) {
            console.log(dataUrl);
        }
    });
});

//Clear stamp selection

$(document).on("tap", "#cancel-stamp-menu", function() {
    localStorage.removeItem("stamp_selected");
    $(".stamp-pad-image").removeClass("black-border");
    $(this).fadeOut();
});

//Remove an image from the canvas

$(document).on("tap", "#edit-menu-remove", function() {
    stage.find("#" + localStorage.getItem("canvas_image_selected")).remove();
    layer.draw();

    hideManiMenu();
});

//Change layer

$(document).on("tap", "#change-layer-up", function() {
    stage.find("#" + localStorage.getItem("canvas_image_selected")).moveUp();
    layer.draw();
    resetStageBackground();
});

$(document).on("tap", "#change-layer-down", function() {
    stage.find("#" + localStorage.getItem("canvas_image_selected")).moveDown();
    layer.draw();
    resetStageBackground();
});

//Rectangular crop

$(document).on("tap", "#edit-menu-reccrop", function(e) {
    e.stopPropagation();

    var astroElement = stage.find("#" + localStorage.getItem("canvas_image_selected"));

    var adjWidth = astroElement[0].attrs.image.width * astroElement[0].attrs.scaleX;
    var adjHeight = astroElement[0].attrs.image.height * astroElement[0].attrs.scaleY;

    var rect = new Kinetic.Rect({
        x:astroElement[0].attrs.x,
        y:astroElement[0].attrs.y,
        offsetX:adjWidth / 2,
        offsetY:adjHeight / 2,
        width:adjWidth,
        height:adjHeight,
        stroke:"blue",
        strokeWidth:4,
        draggable:true,
        id:'cropRect'
    });

    transImage(rect, false);

    layer.add(rect);
    stage.add(layer);

    hideManiMenu();

    rect.on("tap", function() {
        astroElement.crop({
            x:rect.attrs.x,
            y:rect.attrs.y,
            width:rect.attrs.width,
            height:rect.attrs.height
        });

        layer.draw();

        rect.remove();
    });
});

//Open up astro background menu

$(document).on("tap", "#background-astro", function() {
    $("#add-menu-container").hide();
    $("#add-astro-background-menu").show();
});