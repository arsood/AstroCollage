var CropName = "";
var astroElement = null;
var CropObj = null;
var ControlObj = null;
var dragFlag = false;

//Rectangular crop

$(document).on("tap", "#edit-menu-reccrop", function(event) {
    event.stopPropagation();

    astroElement = stage.find("#" + localStorage.getItem("canvas_image_selected"))[0];

    //YOUR CODE HERE
    $("#crop-confirm-menu").fadeIn(200);
	setNonDrag();
	CropName = "rect";
    hideManiMenu();
	
	createCropObject();
});

//Circular crop

$(document).on("tap", "#edit-menu-circrop", function(event) {
    event.stopPropagation();

    astroElement = stage.find("#" + localStorage.getItem("canvas_image_selected"))[0];

    //YOUR CODE HERE

    $("#crop-confirm-menu").fadeIn(200);
	setNonDrag();
	CropName = "circle";
    hideManiMenu();
	createCropObject();
});

//Free crop

$(document).on("tap", "#edit-menu-freecrop", function(event) {
    event.stopPropagation();

    astroElement = stage.find("#" + localStorage.getItem("canvas_image_selected"))[0];

    //YOUR CODE HERE

    $("#crop-confirm-menu").fadeIn(200);
	setNonDrag();
	CropName = "free";
    hideManiMenu();
});

//Cancel crop

$(document).on("tap", "#crop-cancel-button", cancelCrop);

function cancelCrop() {
	$("#crop-confirm-menu").hide();
	recoverDragFlag();
	
	if(CropObj) {
		CropObj.destroy();
	}

	if(ControlObj) {
		ControlObj.destroy();
	}
		
	layer.draw();
	CropName = "";
	CropObj = null;
	ControlObj = null;
	astroElement = null;
}

$(document).on("tap", "#crop-confirm-button", function(){
    $("#crop-confirm-menu").hide();
	recoverDragFlag();
	
	if(CropObj)
		CropObj.destroy();
	if(ControlObj)
		ControlObj.destroy();
		
	processCrop();
	
	layer.draw();
	CropName = "";
	CropObj = null;
	ControlObj = null;
});

function setNonDrag(){
	var child = layer.getChildren();
	for( var i = 0; i < child.length; i ++){
		var t_draggable = child[i].draggable();
		
		child[i].setAttrs({ draggable: false });
		child[i].t_draggable = t_draggable;
	}
}

function recoverDragFlag(){
	var child = layer.getChildren();
	for( var i = 0; i < child.length; i ++){
		var t_draggable = child[i].t_draggable;
		if(t_draggable != true)
			t_draggable = false;
		child[i].setAttrs({draggable: t_draggable});
	}
}

function createCropObject(){
	if( astroElement == null )
		return;
	
	switch(CropName){
	case "rect":
		var x = astroElement.x() - astroElement.offsetX() * astroElement.scaleX();
		var y = astroElement.y() - astroElement.offsetY() * astroElement.scaleY();
		var w = astroElement.getWidth() * astroElement.scaleX();
		var h = astroElement.getHeight() * astroElement.scaleY();
		
		if( astroElement.getType() == 'Group' )
		{
			var child = astroElement.getChildren()[0];
			w = child.width() * astroElement.scaleX();
			h = child.height() * astroElement.scaleY();
		}
		
		x += w / 2;
		y += h / 2;
		
		if( w > 200 )
			w = 200;
		if( h > 200 )
			h = 200;
			
		x -= w / 2;
		y -= h / 2;
		
		if( x < 0 )
			x = 0;
		if( y < 0 )
			y = 0;
			
			
		CropObj = new Kinetic.Rect({
			x: x,
			y: y,
			width: w,
			height: h,
			fill: '#0000FF',
			stroke: 'black',
			strokeWidth: 1,
			opacity: 0.4,
			draggable: true,
			
			dragBoundFunc: function(pos){
				var newX, newY;
				var x = astroElement.x() - astroElement.offsetX() * astroElement.scaleX();
				var y = astroElement.y() - astroElement.offsetY() * astroElement.scaleY();
				var w = astroElement.getWidth() * astroElement.scaleX();
				var h = astroElement.getHeight() * astroElement.scaleY();
				
				if( astroElement.getType() == 'Group' )
				{
					var child = astroElement.getChildren()[0];
					w = child.width() * astroElement.scaleX();
					h = child.height() * astroElement.scaleY();
				}
				
				newX = pos.x;
				if(pos.x < x )
					newX = x;
				if(pos.x + this.width() > x + w)
					newX = x + w - this.width();
				newY = pos.y;
				if(pos.y < y )
					newY = y;
				if(pos.y + this.height() > y + w)
					newY = y + w - this.height();
				
				ControlObj.setAttrs({x: newX + this.width(), y: newY + this.height()});
				return {
					x: newX,
					y: newY,
				}
			}
		});
		
		ControlObj = new Kinetic.Circle({
			x: x + w,
			y: y + h,
			radius: 10,
			stroke: "black",
			strokeWidth: 5,
			fill: "#a6a6a6",
			draggable: true,
			dragBoundFunc: function(pos){
				var newX, newY;
				var x = astroElement.x() - astroElement.offsetX() * astroElement.scaleX();
				var y = astroElement.y() - astroElement.offsetY() * astroElement.scaleY();
				var w = astroElement.getWidth() * astroElement.scaleX();
				var h = astroElement.getHeight() * astroElement.scaleY();
				if( astroElement.getType() == 'Group' )
				{
					var child = astroElement.getChildren()[0];
					w = child.width() * astroElement.scaleX();
					h = child.height() * astroElement.scaleY();
				}
				newX = pos.x;
				if(pos.x < x )
					newX = x;
				else if(pos.x > x + w)
					newX = x + w;
				newY = pos.y;
				if(pos.y < y)
					newY = y;
				else if( pos.y > y + h )
					newY = y + h;
					
				CropObj.setAttrs({ width: newX - CropObj.x(), height: newY - CropObj.y() });
				return {
					x: newX,
					y: newY,
				}
			}
		});
		layer.add(CropObj);
		layer.add(ControlObj);
		layer.draw();
		break;
	case "circle":
		var x = astroElement.x() - astroElement.offsetX() * astroElement.scaleX();
		var y = astroElement.y() - astroElement.offsetY() * astroElement.scaleY();
		var w = astroElement.getWidth() * astroElement.scaleX();
		var h = astroElement.getHeight() * astroElement.scaleY();
		
		if( astroElement.getType() == 'Group' )
		{
			var child = astroElement.getChildren()[0];
			w = child.width() * astroElement.scaleX();
			h = child.height() * astroElement.scaleY();
		}
		x += w / 2;
		y += h / 2;
		if( w > 200 )
			w = 200;
		if( h > 200 )
			h = 200;
		var r = w < h ? w : h;
		
		x -= r / 2;
		y -= r / 2;
		
		if( x < 0 )
			x = 0;
		if( y < 0 )
			y = 0;
			
		var r = w < h ? w : h;
		
		CropObj = new Kinetic.Circle({
			x: x + r / 2,
			y: y + r / 2,
			radius: r / 2,
			fill: '#0000FF',
			stroke: 'black',
			strokeWidth: 1,
			opacity: 0.4,
			draggable: true,
			
			dragBoundFunc: function(pos){
				var newX, newY;
				var x = astroElement.x() - astroElement.offsetX() * astroElement.scaleX();
				var y = astroElement.y() - astroElement.offsetY() * astroElement.scaleY();
				var w = astroElement.getWidth() * astroElement.scaleX();
				var h = astroElement.getHeight() * astroElement.scaleY();
				var r = this.radius();
				
				if( astroElement.getType() == 'Group' )
				{
					var child = astroElement.getChildren()[0];
					w = child.width() * astroElement.scaleX();
					h = child.height() * astroElement.scaleY();
				}
				
				newX = pos.x;
				if(pos.x - r < x )
					newX = x + r;
				if(pos.x + r > x + w)
					newX = x + w - r;
					
				newY = pos.y;
				if(pos.y - r < y )
					newY = y + r;
				if(pos.y + r > y + w)
					newY = y + w - r;
				
				ControlObj.setAttrs({x: newX + r, y: newY});
				
				return {
					x: newX,
					y: newY,
				}
			}
		});
		
		ControlObj = new Kinetic.Circle({
			x: x + r,
			y: y + r / 2,
			radius: 10,
			stroke: "black",
			strokeWidth: 5,
			fill: "#a6a6a6",
			draggable: true,
			dragBoundFunc: function(pos){
				
				var newX, newY;
				var x = astroElement.x() - astroElement.offsetX() * astroElement.scaleX();
				var y = astroElement.y() - astroElement.offsetY() * astroElement.scaleY();
				var w = astroElement.getWidth() * astroElement.scaleX();
				var h = astroElement.getHeight() * astroElement.scaleY();
				if( astroElement.getType() == 'Group' )
				{
					var child = astroElement.getChildren()[0];
					w = child.width() * astroElement.scaleX();
					h = child.height() * astroElement.scaleY();
				}
				var r = Math.sqrt((pos.x - CropObj.x()) * (pos.x - CropObj.x()) + (pos.y - CropObj.y()) * (pos.y - CropObj.y()));
				var tr = r;
				
				var maxRx, maxRy, maxR;
				
				maxRx = (CropObj.x() - x > x + w - CropObj.x()) ? x + w - CropObj.x() : CropObj.x() - x;
				maxRy = (CropObj.y() - y > y + h - CropObj.y()) ? y + h - CropObj.y() : CropObj.y() - y;
				maxR = (maxRx > maxRy) ? maxRy : maxRx;
				
				r = (r > maxR) ? maxR : r;
				var dx = (pos.x - CropObj.x()) * r / tr;
				var dy = (pos.y - CropObj.y()) * r / tr;
				
				CropObj.setAttrs({ radius: r });
				return {
					x: CropObj.x() + dx,
					y: CropObj.y() + dy,
				}
			}
		});
		layer.add(CropObj);
		layer.add(ControlObj);
		layer.draw();
		break;
	case "free":
		break;
	default:
		break;
	}
}

function processCrop(){
	if(!astroElement || !CropObj)
		return;
	var points = new Array();
	if(CropObj.getClassName() == "Rect")
		rectCrop();
	else if(CropObj.getClassName() == "Circle")
		circleCrop();
	else if(CropObj.getClassName() == "Line")
		freeCrop();
}

function rectCrop(){
	var x, y, w, h;
	if( CropObj.width() < 0 )
		x = CropObj.x() + CropObj.width();
	else
		x = CropObj.x();
		
	if( CropObj.height() < 0 )
		y = CropObj.y() + CropObj.height();
	else
		y = CropObj.y();
	
	w = Math.abs(CropObj.width());
	h = Math.abs(CropObj.height());
	var t_draggable = astroElement.t_draggable;
	
	var imageObj = new Image();
	imageObj.onload = function() {
		var croped = new Kinetic.Rect({
			x: 0,
			y: 0,
			width: w,
			height: h,
			fillPatternImage: imageObj,
		});
		var id = lastId ++;
		var pieceGroup = new Kinetic.Group({
            x: x + w / 2,
            y: y + h / 2,
            offsetX: w / 2,
            offsetY: h / 2,
            id: id,
            draggable:t_draggable,
            width:w,
            height:h
		});
        pieceGroup.on("tap click", function() {
            //Toggle option menu on tap of canvas image

            if (localStorage.getItem("stamp_selected")) {
                return false;
            } else {
                localStorage.setItem("canvas_image_selected", this.id());
                if ($("#edit-menu").hasClass("edit-menu-hide") && !$("#add-menu-container").is(":visible") && !$("#select-menu-container").is(":visible") && !$("#add-astro-background-menu").is(":visible") && !$("#add-text-menu").is(":visible") && !$("#text-style-menu").is(":visible")) {
                    showManiMenu();
                } else {
                    hideManiMenu();
                }

                layer.draw();
            }
        });
		
		pieceGroup.t_draggable = t_draggable;
		pieceGroup.add(croped);
		layer.add(pieceGroup);
		transImage(pieceGroup, true);
		astroElement.remove();
		astroElement.destroy();
		astroElement = null;
		
		layer.draw();
	};
	imageObj.src = (astroElement.getChildren()[0]).toDataURL({
		x: x,
		y: y,
		width: w,
		height: h,
	});
}

function circleCrop(){
	var x, y, r;
	x = CropObj.x();
	y = CropObj.y();
	r = CropObj.radius();
	
	var t_draggable = astroElement.t_draggable;
	
	var imageObj = new Image();
	imageObj.onload = function() {
		var croped = new Kinetic.Shape({
		  drawFunc: function(context) {
				context.beginPath();
				context.arc(r, r, r, 0, 2 * Math.PI, false);
				context.closePath();
				context.fillStrokeShape(this);
		  },
			x: 0,
			y: 0,
			width: r * 2,
			height: r * 2,
		  fillPatternImage: imageObj,
		});
		var id = lastId ++;
		var pieceGroup = new Kinetic.Group({
            x: x,
            y: y,
            id: id,
            offsetX: r,
            offsetY: r,
            draggable:t_draggable,
            width: r * 2,
            height: r * 2
		});
		
        pieceGroup.on("tap click", function() {
            //Toggle option menu on tap of canvas image

            if (localStorage.getItem("stamp_selected")) {
                return false;
            } else {
                localStorage.setItem("canvas_image_selected", this.id());
                if ($("#edit-menu").hasClass("edit-menu-hide") && !$("#add-menu-container").is(":visible") && !$("#select-menu-container").is(":visible") && !$("#add-astro-background-menu").is(":visible") && !$("#add-text-menu").is(":visible") && !$("#text-style-menu").is(":visible")) {
                    showManiMenu();
                } else {
                    hideManiMenu();
                }

                layer.draw();
            }
        });
		
		pieceGroup.t_draggable = t_draggable;
		pieceGroup.add(croped);
		layer.add(pieceGroup);
		transImage(pieceGroup, true);
		astroElement.remove();
		astroElement.destroy();
		astroElement = null;
		
		layer.draw();
	};
	imageObj.src = (astroElement.getChildren()[0]).toDataURL({
		x: x - r,
		y: y - r,
		width: r * 2,
		height: r * 2,
	});
	
	console.log(x + "  ,  " + y + "  ,  " + r);
}

function createFreeCropObject(pos){
	if( astroElement == null || CropObj != null )
		return;
	var pointX, pointY;
	
	var x = astroElement.x() - astroElement.offsetX() * astroElement.scaleX();
	var y = astroElement.y() - astroElement.offsetY() * astroElement.scaleY();
	var w = astroElement.getWidth() * astroElement.scaleX();
	var h = astroElement.getHeight() * astroElement.scaleY();
	
	if( astroElement.getType() == 'Group' )
	{
		var child = astroElement.getChildren()[0];
		w = child.width() * astroElement.scaleX();
		h = child.height() * astroElement.scaleY();
	}
	
	if( pos.x < x )
		pointX = x;
	else if( pos.x > x + w )
		pointX = x + w;
	else
		pointX = pos.x;
		
	if( pos.y < y )
		pointY = y;
	else if( pos.y > y + h )
		pointY = y + h;
	else
		pointY = pos.y;
		
		
	CropObj = new Kinetic.Line({
		x: 0,
		y: 0,
		points: [pointX, pointY],
		stroke: '#0000FF',
		strokeWidth: 5,
	});
	CropObj.minX = pointX;
	CropObj.maxX = pointX;
	CropObj.minY = pointY;
	CropObj.maxY = pointY;
	
	layer.add(CropObj);
	layer.draw();
}

function updateFreeCropObject(pos){
	if( astroElement == null || CropObj == null || CropObj.closed( ) == true )
		return;
		
	var pointX, pointY;
	
	var x = astroElement.x() - astroElement.offsetX() * astroElement.scaleX();
	var y = astroElement.y() - astroElement.offsetY() * astroElement.scaleY();
	var w = astroElement.getWidth() * astroElement.scaleX();
	var h = astroElement.getHeight() * astroElement.scaleY();
	
	if( astroElement.getType() == 'Group' )
	{
		var child = astroElement.getChildren()[0];
		w = child.width() * astroElement.scaleX();
		h = child.height() * astroElement.scaleY();
	}
	
	if( pos.x < x )
		pointX = x;
	else if( pos.x > x + w )
		pointX = x + w;
	else
		pointX = pos.x;
		
	if( pos.y < y )
		pointY = y;
	else if( pos.y > y + h )
		pointY = y + h;
	else
		pointY = pos.y;
		
	var points = CropObj.points();
	points.push(pointX);
	points.push(pointY);
	CropObj.points(points);
	
	if( CropObj.minX > pointX )
		CropObj.minX = pointX;
	if( CropObj.maxX < pointX )
		CropObj.maxX = pointX;
		
	if( CropObj.minY > pointY )
		CropObj.minY = pointY;
	if( CropObj.maxY < pointY )
		CropObj.maxY = pointY;
	layer.draw();
}

function closeFreeCropObject(pos){
	if( astroElement == null || CropObj == null || CropObj.closed( ) == true)
		return;
		
	updateFreeCropObject(pos);
	CropObj.closed( true );
	CropObj.fill('#0000FF');
	CropObj.stroke('black');
	CropObj.strokeWidth( 1 );
	CropObj.opacity( 0.4 );
	
	layer.draw();
}

function freeCrop(){
	console.log("line");
	var x, y, w, h;
	x = CropObj.minX;
	y = CropObj.minY;
	w = CropObj.maxX - CropObj.minX;
	h = CropObj.maxY - CropObj.minY;
	var points = CropObj.points();
	
	for(var i = 0; i < points.length; i += 2){
		points[i] = points[i] - x;
		points[i + 1] = points[i + 1] - y;
	}
	
	var t_draggable = astroElement.t_draggable;
	
	var imageObj = new Image();
	imageObj.onload = function() {
		var croped = new Kinetic.Line({
			x: 0,
			y: 0,
			width: w,
			height: h,
			points: points,
			fillPatternImage: imageObj,
			closed: true,
		});
		var id = lastId ++;
		var pieceGroup = new Kinetic.Group({
            x: x + w / 2,
            y: y + h / 2,
            offsetX: w / 2,
            offsetY: h / 2,
            id: id,
            draggable:t_draggable,
            width:w,
            height:h
		});
        pieceGroup.on("tap click", function() {
            //Toggle option menu on tap of canvas image

            if (localStorage.getItem("stamp_selected")) {
                return false;
            } else {
                localStorage.setItem("canvas_image_selected", this.id());
                if ($("#edit-menu").hasClass("edit-menu-hide") && !$("#add-menu-container").is(":visible") && !$("#select-menu-container").is(":visible") && !$("#add-astro-background-menu").is(":visible") && !$("#add-text-menu").is(":visible") && !$("#text-style-menu").is(":visible")) {
                    showManiMenu();
                } else {
                    hideManiMenu();
                }

                layer.draw();
            }
        });
		
		pieceGroup.t_draggable = t_draggable;
		pieceGroup.add(croped);
		layer.add(pieceGroup);
		transImage(pieceGroup, true);
		astroElement.remove();
		astroElement.destroy();
		astroElement = null;
		
		layer.draw();
	};
	imageObj.src = (astroElement.getChildren()[0]).toDataURL({
		x: x,
		y: y,
		width: w,
		height: h,
	});
}