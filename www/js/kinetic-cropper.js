function update(activeAnchor) {
    var group = activeAnchor.getParent();

    var topLeft = group.get('.topLeft')[0];
    var topRight = group.get('.topRight')[0];
    var bottomRight = group.get('.bottomRight')[0];
    var bottomLeft = group.get('.bottomLeft')[0];
    var cropper = group.get('.cropper')[0];
        
    var anchorX = activeAnchor.getX();
    var anchorY = activeAnchor.getY();

    // update anchor positions
    switch (activeAnchor.getName()) {
        case 'topLeft':
            topRight.setY(anchorY);
            bottomLeft.setX(anchorX);
            break;
        case 'topRight':
            topLeft.setY(anchorY);
            bottomRight.setX(anchorX);
            break;
        case 'bottomRight':
            bottomLeft.setY(anchorY);
            topRight.setX(anchorX);
            break;
        case 'bottomLeft':
            bottomRight.setY(anchorY);
            topLeft.setX(anchorX);
            break;
    }

    cropper.setPosition(topLeft.getPosition().x,topLeft.getPosition().y);

    var width = topRight.getX() - topLeft.getX();
    var height = bottomLeft.getY() - topLeft.getY();
    if(width && height) {
        cropper.setSize(width, height);
    }
}

function updateLeftMaskWidth(mask,leftAnchor) {
    mask.setWidth(leftAnchor.getAbsolutePosition().x - 100);
}

function updateRightMaskWidthAndPos(mask,rightAnchor) {
    mask.setAbsolutePosition(rightAnchor.getAbsolutePosition().x,mask.getAbsolutePosition().y);
    mask.setWidth(213 - (rightAnchor.getAbsolutePosition().x - 100));
}

function updateTopMaskHeight(mask,cropper,topAnchor) {
    mask.setAbsolutePosition(topAnchor.getAbsolutePosition().x,mask.getAbsolutePosition().y);
    mask.setHeight(topAnchor.getAbsolutePosition().y - 110);
    mask.setWidth(cropper.getWidth());
}

function updateBottomMaskHeightAndPos(mask,cropper,bottomAnchor) {
    mask.setAbsolutePosition(bottomAnchor.getAbsolutePosition().x, bottomAnchor.getAbsolutePosition().y);
    mask.setHeight(236 - (bottomAnchor.getAbsolutePosition().y - 110));
    mask.setWidth(cropper.getWidth());
}

function addAnchor(group, x, y, name) {
    var stage = group.getStage();
    var layer = group.getLayer();

    var anchor = new Kinetic.Circle({
        x: x,
        y: y,
        stroke: '#666',
        fill: '#ddd',
        strokeWidth: 1,
        radius: 5,
        name: name,
        draggable: true,
        dragBoundFunc: function(pos) {
            var newX = pos.x;
            var newY = pos.y;
            var image = this.getParent().getParent().get('.image')[0];
            var cropper = this.getParent();

            // Bound horizontaly
            if(newX < 100) {
                newX = 100;
            }
            else if(newX > image.getWidth() + 100 - cropper.getWidth()) {
                newX = image.getWidth() + 100 - cropper.getWidth();
            }

            if(newY < 110) {
                newY = 110;
            }
            else if(newY > image.getHeight() + 110 - cropper.getHeight()) {
                newY = image.getHeight() + 110 - cropper.getHeight();
            }

            return {
                x: newX,
                y: newY
            }
        }
    });

    anchor.on('dragmove', function() {
        update(this);
        layer.draw();
    });
    // add hover styling
    anchor.on('mouseover', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'pointer';
        this.setStrokeWidth(2);
        layer.draw();
    });
    anchor.on('mouseout', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'default';
        this.setStrokeWidth(2);
        layer.draw();
    });

    group.add(anchor);
}

function initStage(img) {
    var stage = new Kinetic.Stage({
        container: 'container',
        width: 578,
        height: 400
    });
    var imageGroup = new Kinetic.Group({
        x: 100,
        y: 110
    });

    var cropperGroup = new Kinetic.Group({
        x: 170,
        y: 150,
        draggable: true,
        dragBoundFunc: function(pos) {
            var newX = pos.x;
            var newY = pos.y;
            var image = this.getParent().get('.image')[0];
            var cropper = this.get('.cropper')[0];

            // Bound horizontally
            if(newX < 100) {
                newX = 100;
            }
            else if(newX > image.getWidth() + 100 - cropper.getWidth()) {
                newX = image.getWidth() + 100 - cropper.getWidth();
            }

            // Bound vertically
            if(newY < 110) {
                newY = 110;
            }
            else if(newY > image.getHeight() + 110 - cropper.getHeight()) {
                newY = image.getHeight() + 110 - cropper.getHeight();
            }

            return {
                x: newX,
                y: newY
            }
        }
    });
    var layer = new Kinetic.Layer({
        draggable: true
    });
    
    

    layer.add(imageGroup);
    layer.add(cropperGroup);
    stage.add(layer);

    // cropping rectangle
    var cropperRect = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: 100,
        height: 138,
        stroke: 'black',
        name: 'cropper',
        strokeWidth: 1
    });

    cropperGroup.add(cropperRect);
    addAnchor(cropperGroup, 0, 0, 'topLeft');
    addAnchor(cropperGroup, 100, 0, 'topRight');
    addAnchor(cropperGroup, 100, 138, 'bottomRight');
    addAnchor(cropperGroup, 0, 138, 'bottomLeft');

    cropperGroup.on('dragstart', function() {
        this.moveToTop();
    });

    cropperGroup.on('dragmove', function() {
        var layer = this.getLayer();
        var topLeft = this.get('.topLeft')[0];
        var bottomLeft = this.get('.bottomLeft')[0];
        var topRight = this.get('.topRight')[0];
        layer.draw();
    });


    // image
    var srcImg = new Kinetic.Image({
        x: 0,
        y: 0,
        image: img,
        name: 'image'
    });
    
    
    imageGroup.add(srcImg);
    
    
    
            layer.on('dragstart', function () {
                //this.moveToTop();
                console.log(this);
            });
            
            layer.on('dragend', function () {
                //this.moveToTop();
                //Diagnostics(testGroup)
                console.log(this);
            });
    
    stage.draw();
}

var img = new Image();

img.onload = function() {
    initStage(this);
}

img.src = 'http://www.html5canvastutorials.com/demos/assets/yoda.jpg';