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

    $("#container").height($(document).height());
});

//Toggle stamp pad visibility

$(document).on("tap", "#stamp-pad-handle", function() {
    $("#stamp-pad-image-container").slideToggle(200);
});

//Tap on a stamp pad image

$(document).on("tap", ".stamp-pad-image", function() {
    $(".stamp-pad-image").removeClass("black-border");
    $(this).addClass("black-border");
    $("#stamp-pad-image-container").slideUp(200);
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

$("#add-menu-container, #menu-select-nebulae, #menu-select-nurseries, #menu-select-galaxies, #menu-select-sun, #menu-select-planets, #menu-select-misc").owlCarousel({
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
        //Place image on canvas

        var imageObj = new Image();
        
        imageObj.onload = function() {
            var piece = new Kinetic.Image({
                x: imageObj.width / 2,
                y: imageObj.height / 2,
                offsetX: imageObj.width / 2,
                offsetY: imageObj.height / 2,
                image: imageObj,
                draggable:true
            });

            layer.add(piece);
            stage.add(layer);

            //User Hammer.js for pinch zooming and rotating

            var hammertime = Hammer(piece);

            hammertime.on("transform", function(event) {
                event.preventDefault();

                piece.scale({
                    x:event.gesture.scale,
                    y:event.gesture.scale
                }).rotation(event.gesture.rotation);

                layer.draw();
            });
        };
        
        imageObj.src = 'img/library/' + $(this).attr("data-image");
    }
});