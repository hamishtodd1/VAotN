function Update_net_vectors() {
	for(var i = 0; i < 20; i++) {
		var side0vertex = vertices_derivations[i+2][0];
		var side1vertex = vertices_derivations[i+2][1]; //always counter-clockwise
		
		surface_triangle_side_unit_vectors[i][0].set(
			surface_vertices.array[side0vertex*3 + 0] - surface_vertices.array[(i+2)*3 + 0],
			surface_vertices.array[side0vertex*3 + 1] - surface_vertices.array[(i+2)*3 + 1],
			surface_vertices.array[side0vertex*3 + 2] - surface_vertices.array[(i+2)*3 + 2]			
			);
		surface_triangle_side_unit_vectors[i][1].set(
			surface_vertices.array[side1vertex*3 + 0] - surface_vertices.array[(i+2)*3 + 0],
			surface_vertices.array[side1vertex*3 + 1] - surface_vertices.array[(i+2)*3 + 1],
			surface_vertices.array[side1vertex*3 + 2] - surface_vertices.array[(i+2)*3 + 2]
			);
		surface_triangle_side_unit_vectors[i][0].normalize();
		surface_triangle_side_unit_vectors[i][1].normalize();
		
		var flatnet_triangle_side_unit_vector0 = new THREE.Vector2(
			flatnet_vertices.array[side0vertex*3 + 0] - flatnet_vertices.array[(i+2)*3 + 0],
			flatnet_vertices.array[side0vertex*3 + 1] - flatnet_vertices.array[(i+2)*3 + 1]			
			);
		var flatnet_triangle_side_unit_vector1 = new THREE.Vector2(
			flatnet_vertices.array[side1vertex*3 + 0] - flatnet_vertices.array[(i+2)*3 + 0],
			flatnet_vertices.array[side1vertex*3 + 1] - flatnet_vertices.array[(i+2)*3 + 1]
			);
		flatnet_triangle_side_unit_vector0.normalize();
		flatnet_triangle_side_unit_vector1.normalize();
		
		var factor = flatnet_triangle_side_unit_vector1.y * flatnet_triangle_side_unit_vector0.x - flatnet_triangle_side_unit_vector1.x * flatnet_triangle_side_unit_vector0.y;
		shear_matrix[i][0] = flatnet_triangle_side_unit_vector1.y / factor;
		shear_matrix[i][1] = flatnet_triangle_side_unit_vector1.x / factor;
		shear_matrix[i][2] = flatnet_triangle_side_unit_vector0.y /-factor;
		shear_matrix[i][3] = flatnet_triangle_side_unit_vector0.x /-factor;
		
		// if( i===2 &&logged===0) console.log(surface_triangle_side_unit_vectors[i][0],surface_triangle_side_unit_vectors[i][1]);
		// if( i===2&&logged===0) console.log(flatnet_triangle_side_unit_vector0,flatnet_triangle_side_unit_vector1);
		// if( i===2&&logged===0) console.log(shear_matrix[i]);
	}
}

function map_from_lattice_to_surface(x,y, net_triangle_index) {
	x -= flatnet_vertices.array[(net_triangle_index+2)*3 + 0];
	y -= flatnet_vertices.array[(net_triangle_index+2)*3 + 1];
	
	var side0_component_length = x * shear_matrix[net_triangle_index][0] - y * shear_matrix[net_triangle_index][1];
	var side1_component_length = x * shear_matrix[net_triangle_index][2] - y * shear_matrix[net_triangle_index][3];
	
	// if(!logged)console.log(x,y);
	// if(!logged)console.log(surface_triangle_side_unit_vectors[net_triangle_index][0],surface_triangle_side_unit_vectors[net_triangle_index][1]);
	// if(!logged)console.log(side0_component_length,side1_component_length); //wanting 1/3,1/3
	
	var side0_component = surface_triangle_side_unit_vectors[net_triangle_index][0].clone();
	var side1_component = surface_triangle_side_unit_vectors[net_triangle_index][1].clone();
	side0_component.multiplyScalar(side0_component_length);
	side1_component.multiplyScalar(side1_component_length);
	
	var mappedpoint = new THREE.Vector3();
	mappedpoint.addVectors(side0_component,side1_component);
	mappedpoint.x += surface_vertices.array[(net_triangle_index+2) * 3 + 0];
	mappedpoint.y += surface_vertices.array[(net_triangle_index+2) * 3 + 1];
	mappedpoint.z += surface_vertices.array[(net_triangle_index+2) * 3 + 2];
	
	return mappedpoint;
}

function locate_in_net(x,y) {
	//potential optimization: put these in a tree so you only need to make like 5 checks, not 20.
	//Would need reconciliation with irregularity. Though in that situation you'd probably have a smaller lattice
	for(var j = 0; j < 20; j++ ) {			
		if( point_in_triangle(
				x,y,
				flatnet_vertices.array[net_triangle_vertex_indices[j*3+0] * 3 + 0], flatnet_vertices.array[net_triangle_vertex_indices[j*3+0] * 3 + 1],
				flatnet_vertices.array[net_triangle_vertex_indices[j*3+1] * 3 + 0], flatnet_vertices.array[net_triangle_vertex_indices[j*3+1] * 3 + 1],
				flatnet_vertices.array[net_triangle_vertex_indices[j*3+2] * 3 + 0], flatnet_vertices.array[net_triangle_vertex_indices[j*3+2] * 3 + 1],
				true) )
			return j;
	}
	
	return 666;
}