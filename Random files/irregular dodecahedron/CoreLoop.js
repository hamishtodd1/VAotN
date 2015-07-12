function UpdateWorld() {
	deduce_dodecahedron(0);
	rotatedodeca();
	core();
}

function render() {
	delta_t = ourclock.getDelta();
	if(delta_t > 0.1) delta_t = 0.1;
	
	UpdateWorld();
	
	requestAnimationFrame( render );	
	renderer.render( scene, camera );
}
init(); //could this be being called each frame?
render();