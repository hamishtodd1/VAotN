function UpdateWorld() {
	HandleCapsidOpenness();
	//HandleVertexRearrangement();
}

function render() {
	UpdateWorld();
	
	requestAnimationFrame( render );	
	renderer.render( scene, camera );
}
init(); //could this be being called each frame?
render();