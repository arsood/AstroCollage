//Set up Kinetic

var stage = new Kinetic.Stage({
  container: 'stage',
  width: $(document).width(),
  height: $(document).height()
});

var layer = new Kinetic.Layer();

stage.add(layer);

$(document).ready(function() {
    resizeStampScroll();

    //Fix for owlcarousel automatic show

    $("#add-menu-container").hide();

    //Make container responsive

    $("#container").height($(document).height());
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

$(document).on("tap", "#add-menu-button", function() {
    if ($("#select-menu-container").is(":visible")) {
        $("#select-menu-container").fadeOut(200);
    } else {
        $("#add-menu-container").fadeToggle(200);
    }
});

//Change background color of canvas

$(document).on("tap", "#menu-backgrounds-color-options div", function() {
    $("#stage").css("background-color", $(this).css("background-color"));
});

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
            draggable:true
        });

        layer.add(piece);
        stage.add(layer);

        //User Hammer.js for pinch zooming and rotating

        var hammertime = Hammer(piece);

        var originalScale = {
            x:1,
            y:1
        };
        var originalRotation = 0;

        hammertime.on("transform", function(event) {
            event.preventDefault();

            piece.scale({
                x:event.gesture.scale,
                y:event.gesture.scale
            }).rotation(event.gesture.rotation + originalRotation);

            layer.draw();
        }).on("transformend", function() {
            originalScale = piece.scale();
            originalRotation = piece.rotation();
        });
    };
    
    imageObj.src = 'img/library/' + insertImage;
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
    $("#stamp-pad-image-container").slideUp(200);
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