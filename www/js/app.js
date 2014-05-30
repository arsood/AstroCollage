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

//Toggle image add menu on tap

$(document).on("tap", "#add-menu-button", function(event) {
    event.stopPropagation();
    hideManiMenu();
    if ($("#select-menu-container").is(":visible")) {
        $("#select-menu-container").fadeOut(200);
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
    stage.find("#stage-background").moveToBottom();
    layer.draw();
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

//Hide and show manipulation menu

function hideManiMenu() {
    $("#edit-menu").removeClass("edit-menu-show").addClass("edit-menu-hide");
}

function showManiMenu() {
    $("#edit-menu").removeClass("edit-menu-hide").addClass("edit-menu-show");
}

var lastId = 1;

function placeImage(insertImage, xCoord, yCoord) {
    //Place image on canvas

    var imageObj = new Image();
    
    imageObj.onload = function() {
        if (xCoord === "none" && yCoord === "none") {
            xCoord = imageObj.width / 2;
            yCoord = imageObj.height / 2;
        }

        var piece = new Kinetic.Image({
            x: xCoord,
            y: yCoord,
            offsetX: imageObj.width / 2,
            offsetY: imageObj.height / 2,
            image: imageObj,
            draggable:true,
            id:lastId++
        });

        layer.add(piece);
        stage.add(layer);

        //Set up image transforms

        transImage(piece, true);

        //Show layer options and set id so we can manipulate this layer later

        piece.on("tap", function() {
            //Toggle option menu on tap of canvas image

            if (localStorage.getItem("stamp_selected")) {
                return false;
            } else {
                localStorage.setItem("canvas_image_selected", this.id());
                if ($("#edit-menu").hasClass("edit-menu-hide") && !$("#add-menu-container").is(":visible") && !$("#select-menu-container").is(":visible")) {
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
    
    imageObj.src = 'img/library/' + insertImage;

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
    placeImage(localStorage.getItem("selected_image"), "none", "none");

    $("#snap-menu").hide();
});

//Handle snap menu add to stamp pad

var stampTemplateSource = $("#stamp-pad-template").html();
var stampTemplate = Handlebars.compile(stampTemplateSource);

$(document).on("tap", "#snap-menu-add", function() {
    var html = stampTemplate({ image:localStorage.getItem("selected_image") });

    $("#stamp-pad-image-container").append(html);

    resizeStampScroll();

    $("#snap-menu").hide();

    //Create draggable element

    $(".stamp-pad-image").draggable({
        revert:true,
        helper:"clone",
        appendTo:"#container"
    });

    //Create droppable effect

    $("#container").droppable({
        drop:function(event, ui) {
            if (ui.offset.top >= 100) {
                ui.draggable.fadeOut(200);
                ui.helper.fadeOut(200);
            }
        }
    });
});

//Handle snap menu cancel

$(document).on("tap", "#snap-menu-cancel", function() {
    $("#snap-menu").fadeOut("fast");
});

//Tap on a stamp pad image

$(document).on("tap", ".stamp-pad-image", function() {
    localStorage.setItem("stamp_selected", $(this).attr("data-image"));
    $(".stamp-pad-image").removeClass("black-border");
    $(this).addClass("black-border");
    $("#stamp-pad-image-container").slideUp(200, function() {
        $("#cancel-stamp-menu").fadeIn(200);
    });
});

//Machine gun to place stamp image that was selected

$(document).on("tap", "canvas", function(event) {
    if (localStorage.getItem("stamp_selected")) {
        placeImage(localStorage.getItem("stamp_selected"), event.pageX, event.pageY);
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