function Map_gameobjects() {	
}

function Map_everything() {
	Map_lattice();
	Map_gameobjects();
}

function UpdateWorld() {
	HandleCapsidOpenness(); //really this is "update surface"
	HandleCapsidRotation(); //what you probably need to keep in mind is a picture of this as a list of the things that happen inside their functions
	
	HandleVertexRearrangement();
	HandleLatticeMovement();
	Update_net_variables();
	
	Map_everything();
}

function render() {
	delta_t = ourclock.getDelta();
	if(delta_t > 0.1) delta_t = 0.1;
	//delta_t = 0.01;
	
	ReadInput();
	UpdateWorld();
	UpdateCamera();
	
	//setTimeout( function() { requestAnimationFrame( render );}, 100 );
	requestAnimationFrame( render );
	renderer.render( scene, camera );
	
}
init();
render();