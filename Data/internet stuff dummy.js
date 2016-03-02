var secondsthroughvid = animation_beginning_second;

function react_to_video(){
	secondsthroughvid += delta_t;
}

function load_dummy_textures(){
	var mywidth = 2.2;
	for(var i = 0; i < picture_objects.length; i++) {
		picture_objects[i] = new THREE.Mesh(new THREE.CubeGeometry( mywidth,mywidth,0), 
											new THREE.MeshBasicMaterial({color:0x000ff0, transparent:true}) );

		picture_objects[i].position.x = -playing_field_width / 2 + 1.2;
		picture_objects[i].position.y = playing_field_width / 2 - 1.2;
		picture_objects[i].position.z = 0.01;
	}
	
}

load_dummy_textures();
init();
render();