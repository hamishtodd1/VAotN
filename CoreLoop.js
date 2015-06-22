function Map_gameobjects() {	
}

function Map_everything() {
	Map_lattice();
	Map_gameobjects();
}

function UpdateWorld() {
	HandleVertexRearrangement();
	HandleLatticeMovement();
	HandleCapsidOpenness();
	Update_net_vectors();
	Map_everything();
}

function render() {
	delta_t = ourclock.getDelta();
	if(delta_t > 0.1) delta_t = 0.1;
	
	ReadInput();
	UpdateWorld();
	UpdateCamera();
	logged++;
	
	requestAnimationFrame( render );
	renderer.render( scene, camera );
	
}
init();
render();