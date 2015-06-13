function Map_gameobjects() {	
}

function Map_everything() {
	Map_lattice();
	Map_gameobjects();
}

function UpdateWorld() {
	HandleVertexRearrangement();
	HandleCapsidOpenness();
	HandleLatticeMovement();
	Update_net_vectors();
	Map_everything();
}

function render() {
	UpdateWorld();
	
	requestAnimationFrame( render );	
	renderer.render( scene, camera );
}
init();
render();