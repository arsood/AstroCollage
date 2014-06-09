//Rectangular crop

$(document).on("tap", "#edit-menu-reccrop", function(event) {
    event.stopPropagation();

    var astroElement = stage.find("#" + localStorage.getItem("canvas_image_selected"))[0];

    //YOUR CODE HERE

    $("#crop-confirm-menu").fadeIn(200);

    hideManiMenu();
});

//Circular crop

$(document).on("tap", "#edit-menu-circrop", function(event) {
    event.stopPropagation();

    var astroElement = stage.find("#" + localStorage.getItem("canvas_image_selected"))[0];

    //YOUR CODE HERE

    $("#crop-confirm-menu").fadeIn(200);

    hideManiMenu();
});

//Free crop

$(document).on("tap", "#edit-menu-freecrop", function(event) {
    event.stopPropagation();

    var astroElement = stage.find("#" + localStorage.getItem("canvas_image_selected"))[0];

    //YOUR CODE HERE

    $("#crop-confirm-menu").fadeIn(200);

    hideManiMenu();
});

//Cancel crop

$(document).on("tap", "#crop-cancel-button", function() {
    $("#crop-confirm-menu").hide();
});