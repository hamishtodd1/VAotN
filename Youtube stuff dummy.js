var secondsthroughvid = animation_beginning_second;

function react_to_video(){
	secondsthroughvid += delta_t;
}

function load_dummy_textures(){
	for(var i = 0; i < picture_objects.length; i++)
		picture_objects[i] = new THREE.Mesh(new THREE.CubeGeometry( 0,0,0), 
											new THREE.MeshBasicMaterial({color:0xffffff}) );
}

load_dummy_textures();
init();
render();