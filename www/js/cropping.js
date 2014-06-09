//Rectangular crop

$(document).on("tap", "#edit-menu-reccrop", function(event) {
    event.stopPropagation();

    var astroElement = stage.find("#" + localStorage.getItem("canvas_image_selected"))[0];

    var adjWidth = astroElement.children[0].attrs.image.width; //* astroElement[0].attrs.scaleX;
    var adjHeight = astroElement.children[0].attrs.image.height; //* astroElement[0].attrs.scaleY;

    var rect = new Kinetic.Rect({
        x:astroElement.attrs.x,
        y:astroElement.attrs.y,
        offsetX:adjWidth / 2,
        offsetY:adjHeight / 2,
        width:300,
        height:300,
        stroke:"blue",
        strokeWidth:4,
        draggable:true,
        id:'cropRect',
        dragBoundFunc:function(pos) {
            var X = pos.x;
            var Y = pos.y;
            if (X < minX) {
                X = minX;
            }
            if (X > maxX) {
                X = maxX;
            }
            if (Y < minY) {
                Y = minY;
            }
            if (Y > maxY) {
                Y = maxY;
            }
            return {
                x:X,
                y:Y
            }
        }
    });

    var minX = astroElement.getX();
    var maxX = astroElement.getX() + adjWidth - rect.getWidth();
    var minY = astroElement.getY();
    var maxY = astroElement.getY() + adjHeight - rect.getHeight();
    
    astroElement.add(rect);

    transImage(rect, false);

    layer.draw();

    hideManiMenu();

    // rect.on("tap", function() {
    //     astroElement.crop({
    //         x:rect.attrs.x,
    //         y:rect.attrs.y,
    //         width:rect.attrs.width,
    //         height:rect.attrs.height
    //     });

    //     layer.draw();

    //     this.remove();

    //     var fillImage = new Image();
    //     fillImage.src = $(astroElement[0].attrs.image).attr("src");

    //     this.fillPatternImage(fillImage);
    // });
});