function HandleCapsidOpenness() {
		
	var capsidopeningspeed = 0.01;

	if( !isMouseDown ) {
		if( capsidopenness === 1)
 			return;
		capsidopenness += capsidopeningspeed;
		if( capsidopenness >= 1 )
			capsidopenness = 1;
	}
	else {
		if( capsidopenness === 0)
 			return;
		capsidopenness -= capsidopeningspeed;
		if( capsidopenness <= 0 )
			capsidopenness = 0;
	}
	
	//the first three vertices
	{
		var startingangle = 2 * Math.atan(PHI/(PHI-1));
		var theta = startingangle * capsidopenness / 2;
		//remember edge length is 1
		
		/*surface_vertices_numbers[0 + 0] = 0;
		surface_vertices_numbers[0 + 1] = 0;
		surface_vertices_numbers[0 + 2] = capsidopenness * Math.sqrt( (5 + Math.sqrt(5) ) / 2);
		
		surface_vertices_numbers[3 + 0] = 0;
		surface_vertices_numbers[3 + 1] = Math.sin(theta);
		surface_vertices_numbers[3 + 2] = surface_vertices_numbers[2] - Math.cos(theta);*/
	}
	
	for( var i = 3; i < 22; i++) {
		var theta = minimum_angles[i] + capsidopenness * (TAU/2 - minimum_angles[i]);
		
		var a_index = vertices_derivations[i][0];
		var b_index = vertices_derivations[i][1];
		var c_index = vertices_derivations[i][2];
		
		var a = new THREE.Vector3( //this is our origin
			surface_vertices_numbers[a_index * 3 + 0],
			surface_vertices_numbers[a_index * 3 + 1],
			surface_vertices_numbers[a_index * 3 + 2]);	
			
		var a_net = new THREE.Vector3( //this is our origin
			flatnet_vertices_numbers[a_index * 3 + 0],
			flatnet_vertices_numbers[a_index * 3 + 1],
			flatnet_vertices_numbers[a_index * 3 + 2]);	
		
		var crossbar_unit = new THREE.Vector3(
			surface_vertices_numbers[b_index * 3 + 0],
			surface_vertices_numbers[b_index * 3 + 1],
			surface_vertices_numbers[b_index * 3 + 2]);
		crossbar_unit.sub(a);			
		crossbar_unit.normalize();
		
		var net_crossbar_unit = new THREE.Vector3(
			flatnet_vertices_numbers[b_index*3+0],
			flatnet_vertices_numbers[b_index*3+1],
			flatnet_vertices_numbers[b_index*3+2]);
		net_crossbar_unit.sub(a_net);
		net_crossbar_unit.normalize();
		
		var final_vector_net = new THREE.Vector3( 
			flatnet_vertices_numbers[i*3+0],
			flatnet_vertices_numbers[i*3+1],
			flatnet_vertices_numbers[i*3+2]);
		final_vector_net.sub(a_net);
		var final_vector_hinge_origin_length = final_vector_net.length() * get_cos( final_vector_net, net_crossbar_unit);	
		
		var final_vector_hinge_origin = new THREE.Vector3(
			crossbar_unit.x * final_vector_hinge_origin_length,
			crossbar_unit.y * final_vector_hinge_origin_length,
			crossbar_unit.z * final_vector_hinge_origin_length);
			
		var final_vector_hinge_origin_net = new THREE.Vector3(
			net_crossbar_unit.x * final_vector_hinge_origin_length,
			net_crossbar_unit.y * final_vector_hinge_origin_length,
			net_crossbar_unit.z * final_vector_hinge_origin_length);
			
		var final_vector_hinge_net = final_vector_net.clone();
		final_vector_hinge_net.sub( final_vector_hinge_origin_net );

		var C = new THREE.Vector3(
			surface_vertices_numbers[c_index * 3 + 0],
			surface_vertices_numbers[c_index * 3 + 1],
			surface_vertices_numbers[c_index * 3 + 2]);
		C.sub(a);
		var C_hinge_origin_length = C.length() * get_cos(crossbar_unit, C);		
		var C_hinge_origin = new THREE.Vector3(
			crossbar_unit.x * C_hinge_origin_length,
			crossbar_unit.y * C_hinge_origin_length,
			crossbar_unit.z * C_hinge_origin_length);
		
		var C_hinge_unit = new THREE.Vector3();
		C_hinge_unit.subVectors( C, C_hinge_origin);
		C_hinge_unit.normalize();
		var C_hinge_component = C_hinge_unit.clone();
		C_hinge_component.multiplyScalar( Math.cos(theta) * final_vector_hinge_net.length());
			
		var downward_vector_unit = new THREE.Vector3();		
		downward_vector_unit.crossVectors(crossbar_unit, C);
		downward_vector_unit.normalize();
		var downward_component = downward_vector_unit.clone();
		downward_component.multiplyScalar(Math.sin(theta) * final_vector_hinge_net.length())
		
		var final_vector = new THREE.Vector3();
		final_vector.addVectors(downward_component, C_hinge_component);
		final_vector.add( final_vector_hinge_origin );
		final_vector.add( a );
		
		surface_vertices.array[ i * 3 + 0] = final_vector.x;
		surface_vertices.array[ i * 3 + 1] = final_vector.y;
		surface_vertices.array[ i * 3 + 2] = final_vector.z;
		surface_vertices.needsUpdate = true;
		
		if(capsidopenness = 0) {
			polyhedron_vertices.array[ i * 3 + 0] = final_vector.x;
			polyhedron_vertices.array[ i * 3 + 1] = final_vector.y;
			polyhedron_vertices.array[ i * 3 + 2] = final_vector.z;
			polyhedron_vertices.needsUpdate = true;
		}
	}	
}