
	document.getElementById("theCode").addEventListener("input", convert);

	$("#hideBtn").click(function(){
		$("#inputArea").toggle();
		$(".header").toggle();		
		$(".container").toggle();
		$("footer").toggle();
	});

	$("#doit").click(function(){
		convert();
	});

	$("#doitnew").click(function(){
		var code = $("#theCode").val();
		var beautified = js_beautify(code);
		var html = Prism.highlight(beautified, Prism.languages.javascript);
		$("#prettyArea").html(html);
		Prism.highlightAll();
		//Update code textbox also
		document.getElementById('theCode').value=beautified
		//make sure the canvas height stretches to match the pretty code
		$("#canvas").height($("#outerPrettyArea").height()+20);
	});

	function convert(){
		var code = $("#theCode").val();
		var html = Prism.highlight(code, Prism.languages.javascript);
		$("#prettyArea").html(html);
		Prism.highlightAll();

		//make sure the canvas height stretches to match the pretty code
		$("#canvas").height($("#outerPrettyArea").height()+20);

	}

	convert();

	/////// CODE TO DO SVG DRAWING /////

	var drawShapeId = "#myRect";
	var down = false;
	var startPos = null;
	boundingRect = {}
	boundingRect.x = -1;
	boundingRect.y = -1;
	boundingRect.w = -1;
	boundingRect.h = -1;

	

	$("#canvas").mousedown(function(e){
		down = true;
		startPos = {x:e.offsetX, y:e.offsetY};
		boundingRect.x = e.offsetX;
		boundingRect.y = e.offsetY; 
		drawShape(drawShapeId, boundingRect);
		//setPosition(drawShapeId, e.offsetX, e.offsetY);
		
	});

	$("#canvas").mouseup(function(e){
		down = false;
		startPos = null;
	});

	$("#canvas").mousemove(function(e){

		// var offset = {x: e.offsetX, y:e.offsetY}
		// var page = {x: e.pageX, y: e.pageY}

		// console.debug("offset: ", JSON.stringify(offset));
		// console.debug("page: "+JSON.stringify(page));

		if(down==true){
			var xDiff = e.offsetX - startPos.x;
			var yDiff = e.offsetY - startPos.y;

			boundingRect.x = startPos.x;
			boundingRect.y = startPos.y;
			boundingRect.w = xDiff;
			boundingRect.h = yDiff;

			if(xDiff < 0 ){
				boundingRect.x = startPos.x + xDiff;
				boundingRect.w = -xDiff;
			}

			if(yDiff < 0){
				boundingRect.y = startPos.y + yDiff;
				boundingRect.h = -yDiff;
			}


			drawShape(drawShapeId, boundingRect);
			// setPosition(drawShapeId, )
			// setSize(drawShapeId, xDiff, yDiff);
		}


	});

	function drawShape(svgObj, rect){

		setSize(svgObj, rect.w, rect.h);

		setPosition(svgObj, rect.x, rect.y);
	}

	function setSize(svgObjId, w, h){

		var objw = $(svgObjId)[0].width; //assume it's a rect
		var objh = $(svgObjId)[0].height;

		if($(svgObjId).prop("tagName")=="ellipse"){ //if it's an ellipse we need rx, and ry
			objw = $(svgObjId)[0].rx;
			objh = $(svgObjId)[0].ry;

			w = w/2;
			h = h/2;
		}

		objw.baseVal.value = w;
		objh.baseVal.value = h;

	}

	function setPosition(svgObjId, x, y){

		var objx = $(svgObjId)[0].x; //assume it's a rect
		var objy = $(svgObjId)[0].y;

		if($(svgObjId).prop("tagName")=="ellipse"){ //if it's an ellipse we need cx, and cy
			objx = $(svgObjId)[0].cx;
			objy = $(svgObjId)[0].cy;

			//modify x to account for center position and radius
			//console.log("x before: "+x);
			 //x += parseInt($("#myOval")[0].rx.baseVal.value/2);
			 //y += parseInt($("#myOval")[0].ry.baseVal.value/2);
			 x = boundingRect.x + boundingRect.w/2;
			 y = boundingRect.y + boundingRect.h/2;
			//console.log("x after: "+x);

			

		}


		objx.baseVal.value = x;  // remainder of svg obj path.to.value is the same
		objy.baseVal.value = y;
	}
	 //$('input[name=q12_3]:checked').val())

	// $("#clearOval").click(function(){
	// 	setSize("#myOval",0,0);
	// });

	// $("#clearRect").click(function(){
	// 	setSize("#myRect",0,0);
	// })

	$("#clearCurrent").click(function(){
		var shapeId = "#my" + $("select[name='drawShapeToggle']").val();
		setSize(shapeId, 0, 0);
	});

	$("#clearAll").click(function(){
		setSize("#myOval",0,0);
		setSize("#myOval2",0,0);
		setSize("#myOval3",0,0);
		setSize("#myRect",0,0);
		setSize("#myRect2",0,0);
		setSize("#myRect3",0,0);
	});
	

	 $("input[name='drawShapeToggle']").change(function(){

		//console.log("toggle!!!");

		var shapeVal = $("input[name='drawShapeToggle']:checked").val();

		if(shapeVal=="oval"){
			drawShapeId="#myOval";
			//$("#shapeToggle").html("Draw Rect");
		}
		else if(shapeVal == "oval2"){
			drawShapeId="#myOval2";
		}
		else{
			drawShapeId="#myRect";
			//$("#shapeToggle").html("Draw Oval");
		}

		// debug("changed and val is: ")
		// codeType = $("input[name='codeType']:checked").val();

		// toggleCodeType(codeType);

	});

	$("select[name='drawShapeToggle']").change(function(){

		//console.log("toggle!!!");

		var shapeVal = $("select[name='drawShapeToggle']").val();
		drawShapeId = "#my"+shapeVal;
		$("#clearCurrent").html("Clear "+shapeVal)

	});

	$("#fontSize").change(setFontSize);

	document.getElementById("fontSize").addEventListener("input", setFontSize);

	function setFontSize(){
		var val = $("#fontSize").val()+"px"
		$("#outerPrettyArea").css("font-size", val);
		$("#fontSizeDisplay").html(val);

		//make sure the canvas height stretches to match the pretty code
		$("#canvas").height($("#outerPrettyArea").height()+20);
	}

	document.getElementById("projTitleInput").addEventListener("input", setTitle);
	$("#projTitleInput").change(setTitle);
	function setTitle(){
		$("#projTitle").html($("#projTitleInput").val());
	}

	document.getElementById("otherTextInput").addEventListener("input", setOtherText);
	$("#otherTextInput").change(setOtherText);
	function setOtherText(){
		$("#otherText").html($("#otherTextInput").val());
	}

	//////////////////// CLIPBOARD COPY PASTE //////////////////

	var CLIPBOARD = new CLIPBOARD_CLASS("my_canvas", true);

	/**
	 * image pasting into canvas
	 * 
	 * @param {string} canvas_id - canvas id
	 * @param {boolean} autoresize - if canvas will be resized
	 */
	function CLIPBOARD_CLASS(canvas_id, autoresize) {
		var _self = this;
		var canvas = document.getElementById(canvas_id);
		var ctx = document.getElementById(canvas_id).getContext("2d");

		//handlers
		document.addEventListener('paste', function (e) { _self.paste_auto(e); }, false);

		//on paste
		this.paste_auto = function (e) {
			if (e.clipboardData) {
				var items = e.clipboardData.items;
				if (!items) return;
				
				//access data directly
				for (var i = 0; i < items.length; i++) {
					if (items[i].type.indexOf("image") !== -1) {
						//image
						var blob = items[i].getAsFile();
						var URLObj = window.URL || window.webkitURL;
						var source = URLObj.createObjectURL(blob);
						this.paste_createImage(source);
					}
				}
				e.preventDefault();
			}
		};
		//draw pasted image to canvas
		this.paste_createImage = function (source) {
			var pastedImage = new Image();
			pastedImage.onload = function () {
				if(autoresize == true){
					//resize
					canvas.width = pastedImage.width;
					canvas.height = pastedImage.height;
				}
				else{
					//clear canvas
					ctx.clearRect(0, 0, canvas.width, canvas.height);
				}
				ctx.drawImage(pastedImage, 0, 0);
			};
			pastedImage.src = source;
		};
	}
	
