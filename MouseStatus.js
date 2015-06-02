document.addEventListener( 'mousedown', onDocumentMouseDown, false);
document.addEventListener( 'mouseup', onDocumentMouseUp, false);

function onDocumentMouseDown(event) {
	event.preventDefault();
	isMouseDown = true;
}
function onDocumentMouseUp(event) {
	event.preventDefault();
	isMouseDown = false;
}

function onMouseMove( event ) {
	// MousePosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	// MousePosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	
	// var vector = new THREE.Vector3();

	// vector.set(
		// ( event.clientX / window.innerWidth ) * 2 - 1,
		// - ( event.clientY / window.innerHeight ) * 2 + 1,
		// 0.5 );

	// vector.unproject( camera );

	// var dir = vector.sub( camera.position ).normalize();

	// var distance = - camera.position.z / dir.z;

	// OldMousePosition.copy( MousePosition );
	// MousePosition.copy( camera.position.clone().add( dir.multiplyScalar( distance ) ) );
	
	var Xdists_from_center = Array(circleGeometry.vertices.length);
	var Ydists_from_center = Array(circleGeometry.vertices.length);
	for(var i = 0; i < circleGeometry.vertices.length; i++) {
		Xdists_from_center[i] = circleGeometry.vertices[i].x - circleGeometry.vertices[0].x;
		Ydists_from_center[i] = circleGeometry.vertices[i].y - circleGeometry.vertices[0].y;
	}
	
	MousePosition.x = (event.clientX-window_width/2) * (orthographic_cuboid_width / window_width);
	MousePosition.y = -(event.clientY-window_height/2) * (orthographic_cuboid_width / window_width);
	
	for(var i = 0; i < circleGeometry.vertices.length; i++) {
		circleGeometry.vertices[i].x = MousePosition.x + Xdists_from_center[i];
		circleGeometry.vertices[i].y = MousePosition.y + Ydists_from_center[i];
	}
	
	circleGeometry.verticesNeedUpdate = true;
}

window.addEventListener( 'mousemove', onMouseMove, false );