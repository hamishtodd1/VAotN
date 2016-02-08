var Paria_models = Array(4); //DNA, pentamers, Dextros, Laevos

function init_pariacoto(){
	/*
	 * We're going to have four objects
	 * After however many vertices it is,
	 */
	Paria_models[0] = new THREE.Mesh(new THREE.BufferGeometry, new THREE.MeshLambertMaterial({color:0xF6F0D8}) ); //DNA
	Paria_models[1] = new THREE.Mesh(new THREE.BufferGeometry, new THREE.MeshLambertMaterial({color:0xBBC7DC}) ); //Pentamers
	Paria_models[2] = new THREE.Mesh(new THREE.BufferGeometry, new THREE.MeshLambertMaterial({color:0xB5D5BF}) ); //Dextros
	Paria_models[3] = new THREE.Mesh(new THREE.BufferGeometry, new THREE.MeshLambertMaterial({color:0xF2D4D7}) ); //Laevos
	
	Paria_models[0].geometry.addAttribute('position',new THREE.BufferAttribute( Pariacoto_DNAs_vertices, 3 ));
	Paria_models[0].geometry.setIndex(new THREE.BufferAttribute( Pariacoto_DNAs_faces, 1 ));
	Paria_models[1].geometry.addAttribute('position',new THREE.BufferAttribute( Pariacoto_Ps_vertices, 3 ));
	Paria_models[1].geometry.setIndex(new THREE.BufferAttribute( Pariacoto_Ps_faces, 1 ));
	Paria_models[2].geometry.addAttribute('position',new THREE.BufferAttribute( Pariacoto_Ds_vertices, 3 ));
	Paria_models[2].geometry.setIndex(new THREE.BufferAttribute( Pariacoto_Ds_faces, 1 ));
	Paria_models[3].geometry.addAttribute('position',new THREE.BufferAttribute( Pariacoto_Ls_vertices, 3 ));
	Paria_models[3].geometry.setIndex(new THREE.BufferAttribute( Pariacoto_Ls_faces, 1 ));
	
	var PariaScale = 0.59;
	
	for(var i = 0; i < Paria_models.length; i++){
		Paria_models[i].scale.x = PariaScale;
		Paria_models[i].scale.y = PariaScale;
		Paria_models[i].scale.z = PariaScale;
		
		Paria_models[i].geometry.computeFaceNormals();
		Paria_models[i].geometry.computeVertexNormals();
	}
}