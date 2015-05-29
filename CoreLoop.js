function UpdateWorld() {
	HandleCapsidOpenness(capsidopenness, surface_vertices.array);
	HandleVertexRearrangement();
}

function render() {
	UpdateWorld();
	
	requestAnimationFrame( render );	
	renderer.render( scene, camera );
}
init(); //could this be being called each frame?
render();