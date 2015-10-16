document.addEventListener( 'mousedown', onDocumentMouseDown, false);
document.addEventListener( 'mouseup', onDocumentMouseUp, false);
window.addEventListener( 'mousemove', onMouseMove, false );

function onDocumentMouseDown(event) {
	event.preventDefault();
	InputObject.isMouseDown = true;
}
function onDocumentMouseUp(event) {
	event.preventDefault();
	InputObject.isMouseDown = false;
	//minimum amount of time so that people don't hammer the screen?
}

function onMouseMove( event ) {
	event.preventDefault();
	InputObject.mousex = event.clientX;
	InputObject.mousey = event.clientY;
}

function update_mouseblob(){
	var Xdists_from_center = Array(circle.geometry.vertices.length);
	var Ydists_from_center = Array(circle.geometry.vertices.length);
	for(var i = 0; i < circle.geometry.vertices.length; i++) {
		Xdists_from_center[i] = circle.geometry.vertices[i].x - circle.geometry.vertices[0].x;
		Ydists_from_center[i] = circle.geometry.vertices[i].y - circle.geometry.vertices[0].y;
	}
	
	for(var i = 0; i < circle.geometry.vertices.length; i++) {
		circle.geometry.vertices[i].x = MousePosition.x + Xdists_from_center[i];
		circle.geometry.vertices[i].y = MousePosition.y + Ydists_from_center[i];
	}
	
	circle.geometry.verticesNeedUpdate = true;
}

//this is called once a frame and must be the only thing that addresses Inputobject, lest functions get different impressions of inputs.
//this function shouldn't actually *do* anything with the data, it's only to be read elsewhere.
function ReadInput() {
	OldMousePosition.copy( MousePosition );
	MousePosition.x = (InputObject.mousex-window_width/2) * (playing_field_width / window_width);
	MousePosition.y = -(InputObject.mousey-window_height/2) * (playing_field_height / window_height);
	
	Mouse_delta.set( MousePosition.x - OldMousePosition.x, MousePosition.y - OldMousePosition.y);
	
	isMouseDown_previously = isMouseDown;
	isMouseDown = InputObject.isMouseDown;
}