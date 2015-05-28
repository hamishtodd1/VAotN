document.addEventListener( 'mousedown', onDocumentMouseDown, false);
document.addEventListener( 'mouseup', onDocumentMouseUp, false);

function onDocumentMouseDown(event) {
	event.preventDefault();
	isMouseDown = true;
	circleGeometry.vertices[0].x = 1;
	//console.log(circle);
}
function onDocumentMouseUp(event) {
	event.preventDefault();
	isMouseDown = false;
}

function onMouseMove( event ) {

	//this is all someone else's code

	MousePosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	MousePosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	
	var vector = new THREE.Vector3();

	vector.set(
		( event.clientX / window.innerWidth ) * 2 - 1,
		- ( event.clientY / window.innerHeight ) * 2 + 1,
		0.5 );

	vector.unproject( camera );

	var dir = vector.sub( camera.position ).normalize();

	var distance = - camera.position.z / dir.z;

	OldMousePosition.copy( MousePosition );
	MousePosition.copy( camera.position.clone().add( dir.multiplyScalar( distance ) ) );
	
	circleGeometry.vertices[0].x = MousePosition.x;
	circleGeometry.vertices[0].y = MousePosition.y;
	
	circle.needsUpdate = true;
}

window.addEventListener( 'mousemove', onMouseMove, false );