function fix_protein_to_anchors_vecs(desired_corner0,desired_corner1,desired_corner2, myprotein)
{
	fix_protein_to_anchors(
			desired_corner0.x,desired_corner0.y,desired_corner0.z,
			desired_corner1.x,desired_corner1.y,desired_corner1.z,
			desired_corner2.x,desired_corner2.y,desired_corner2.z,
			myprotein);
}

//this function won't alter the passed vectors
function fix_protein_to_anchors(
		desired_corner0x,desired_corner0y,desired_corner0z,
		desired_corner1x,desired_corner1y,desired_corner1z,
		desired_corner2x,desired_corner2y,desired_corner2z,
		myprotein)
{
	var basis_vec1 = new THREE.Vector3(desired_corner1x - desired_corner0x,desired_corner1y - desired_corner0y,desired_corner1z - desired_corner0z);
	var basis_vec2 = new THREE.Vector3(desired_corner2x - desired_corner0x,desired_corner2y - desired_corner0y,desired_corner2z - desired_corner0z);
	var basis_vec0 = new THREE.Vector3();
	//not normalizing (or anything like normalizing) this causes a kind of distortion in "z", but that is probably ok
	basis_vec0.crossVectors(basis_vec1, basis_vec2);
	basis_vec0.setLength(basis_vec1.length())
	
	basis_vec0.normalize();
	basis_vec1.normalize();
	basis_vec2.normalize();
	
	for(var i = 0; i < master_protein.geometry.attributes.position.array.length / 3; i++){
		myprotein.geometry.attributes.position.array[i*3+0] = atom_vertices_components[i*3+0] * basis_vec0.x + atom_vertices_components[i*3+1] * basis_vec1.x + atom_vertices_components[i*3+2] * basis_vec2.x;
		myprotein.geometry.attributes.position.array[i*3+1] = atom_vertices_components[i*3+0] * basis_vec0.y + atom_vertices_components[i*3+1] * basis_vec1.y + atom_vertices_components[i*3+2] * basis_vec2.y;
		myprotein.geometry.attributes.position.array[i*3+2] = atom_vertices_components[i*3+0] * basis_vec0.z + atom_vertices_components[i*3+1] * basis_vec1.z + atom_vertices_components[i*3+2] * basis_vec2.z;
	}
	
	myprotein.position.set(desired_corner0x,desired_corner0y,desired_corner0z);
    myprotein.updateMatrixWorld();
    myprotein.geometry.attributes.position.needsUpdate = true;
}

function initialize_protein(){
	number_of_vertices_in_protein = protein_vertices_numbers.length / 3;
	
	for(var i = 0; i < protein_vertices_numbers.length; i++){
		protein_vertices_numbers[i] /= 32; 
	}
	
	var threefold_axis = new THREE.Vector3(1,1,1);
	threefold_axis.normalize();
	
	//TODO this is where it becomes about 5.
	for(var i = 0; i < protein_vertices_numbers.length / 3 / 3; i++){
		var point = new THREE.Vector3(	protein_vertices_numbers[i*3+0],
										protein_vertices_numbers[i*3+1],
										protein_vertices_numbers[i*3+2]);
		
		point.applyAxisAngle(threefold_axis, TAU / 3);
		protein_vertices_numbers[i*3 + 0 + protein_vertices_numbers.length / 3] = point.x;
		protein_vertices_numbers[i*3 + 1 + protein_vertices_numbers.length / 3] = point.y;
		protein_vertices_numbers[i*3 + 2 + protein_vertices_numbers.length / 3] = point.z;
		
		point.applyAxisAngle(threefold_axis, TAU / 3);
		protein_vertices_numbers[i*3 + 0 + 2*protein_vertices_numbers.length / 3] = point.x;
		protein_vertices_numbers[i*3 + 1 + 2*protein_vertices_numbers.length / 3] = point.y;
		protein_vertices_numbers[i*3 + 2 + 2*protein_vertices_numbers.length / 3] = point.z;
	}
	master_protein.geometry.addAttribute( 'position', new THREE.BufferAttribute( protein_vertices_numbers, 3 ) );
	
	for(var i = coarse_protein_triangle_indices.length / 3; i<coarse_protein_triangle_indices.length * 2 / 3; i++){
		coarse_protein_triangle_indices[i] += protein_vertices_numbers.length / 3 / 3;
	}
	for(var i = coarse_protein_triangle_indices.length * 2 / 3; i<coarse_protein_triangle_indices.length; i++){
		coarse_protein_triangle_indices[i] += protein_vertices_numbers.length / 3 / 3 * 2;
	}
	master_protein.geometry.setIndex( new THREE.BufferAttribute( coarse_protein_triangle_indices, 1 ) );
	master_protein.geometry.computeFaceNormals();
	master_protein.geometry.computeVertexNormals();
	
	/* for vector (x,y,z), perp distance from the plane perp to the vector (1,1,1) through the origin is abs(x+y+z) / sqrt(3)
	 * It is somewhat arbitrary to define that as the center though. It is a spherical sort of thing after all
	 * In theory you should be able to multiply the below by a scalar without changing bocavirus.
	 */
	var protein_vertical_center = 0;
	for(var i = 0; i < protein_vertices_numbers.length / 9; i++)
		protein_vertical_center += Math.abs( protein_vertices_numbers[i*3] + protein_vertices_numbers[i*3+1] + protein_vertices_numbers[i*3+2] );
	protein_vertical_center /= (protein_vertices_numbers.length / 9);
	protein_vertical_center /= Math.sqrt(3);
	
	var anchorpointpositions = Array(3);
	for(var i = 0; i< anchorpointpositions.length; i++){
		anchorpointpositions[i] = new THREE.Vector3();
		if(i==0) anchorpointpositions[i].set(1,PHI,0);
		if(i==1) anchorpointpositions[i].set(PHI,0,1);
		if(i==2) anchorpointpositions[i].set(0,1,PHI);
		anchorpointpositions[i].setLength(protein_vertical_center * Math.sin(TAU/5) / (Math.sqrt(3)/12*(3+Math.sqrt(5))));
	}
	
	//to get the components, we need the inverse of the matrix of its current basis vectors
	var basis_vec1 = anchorpointpositions[1].clone();
	basis_vec1.sub(anchorpointpositions[0]);
	var basis_vec2 = anchorpointpositions[2].clone();
	basis_vec2.sub(anchorpointpositions[0]);
	var basis_vec0 = new THREE.Vector3();
	basis_vec0.crossVectors(basis_vec1, basis_vec2);
	
	basis_vec0.normalize();
	basis_vec1.normalize();
	basis_vec2.normalize();
	
	var basis_matrix = new THREE.Matrix4();
	basis_matrix.set(	basis_vec0.x,basis_vec1.x,basis_vec2.x,	0,
						basis_vec0.y,basis_vec1.y,basis_vec2.y,	0,
						basis_vec0.z,basis_vec1.z,basis_vec2.z,	0,
						0,0,0,1);
	var conversion_matrix = new THREE.Matrix3();
	conversion_matrix.getInverse(basis_matrix,1);
	
	master_protein.position.copy(anchorpointpositions[0]);
	for(var i = 0; i < master_protein.geometry.attributes.position.array.length / 3; i++){
		master_protein.geometry.attributes.position.array[i*3+0] -= master_protein.position.x; 
		master_protein.geometry.attributes.position.array[i*3+1] -= master_protein.position.y;
		master_protein.geometry.attributes.position.array[i*3+2] -= master_protein.position.z;
	}
	
	atom_vertices_components = new Float32Array( master_protein.geometry.attributes.position.array.length );
	for(var i = 0; i<atom_vertices_components.length; i++){
		atom_vertices_components[i*3+0] = master_protein.geometry.attributes.position.array[i*3+0] * conversion_matrix.elements[0] + master_protein.geometry.attributes.position.array[i*3+1] * conversion_matrix.elements[3] + master_protein.geometry.attributes.position.array[i*3+2] * conversion_matrix.elements[6];
		atom_vertices_components[i*3+1] = master_protein.geometry.attributes.position.array[i*3+0] * conversion_matrix.elements[1] + master_protein.geometry.attributes.position.array[i*3+1] * conversion_matrix.elements[4] + master_protein.geometry.attributes.position.array[i*3+2] * conversion_matrix.elements[7];
		atom_vertices_components[i*3+2] = master_protein.geometry.attributes.position.array[i*3+0] * conversion_matrix.elements[2] + master_protein.geometry.attributes.position.array[i*3+1] * conversion_matrix.elements[5] + master_protein.geometry.attributes.position.array[i*3+2] * conversion_matrix.elements[8];
	}
	
	var bocavirus_surface = new THREE.Mesh(new THREE.BufferGeometry, new THREE.MeshBasicMaterial());
	bocavirus_surface.geometry.addAttribute('position',new THREE.BufferAttribute( new Float32Array( 22 * 3 ), 3 ));

	var bocavirus_firstriangle_vertices = Array(3);
	bocavirus_firstriangle_vertices[0] = new THREE.Vector3(0, 		1,   PHI);
	bocavirus_firstriangle_vertices[1] = new THREE.Vector3(0,		-1,  PHI);
	bocavirus_firstriangle_vertices[2] = new THREE.Vector3( PHI,	0, 	 1);
	for(var i = 0; i < bocavirus_firstriangle_vertices.length; i++){
		bocavirus_firstriangle_vertices[i].multiplyScalar(1.45);
		bocavirus_surface.geometry.attributes.position.setXYZ(i,
			bocavirus_firstriangle_vertices[i].x,
			bocavirus_firstriangle_vertices[i].y,
			bocavirus_firstriangle_vertices[i].z);
	}	
	deduce_most_of_surface_regular(0, bocavirus_surface.geometry.attributes.position);
	for(var i = 0; i<20; i++){
		for(var j = 0; j<3; j++){
			bocavirus_vertices[i*3+j] = new THREE.Vector3(
				bocavirus_surface.geometry.attributes.position.array[net_triangle_vertex_indices[i*3+j]*3+0],
				bocavirus_surface.geometry.attributes.position.array[net_triangle_vertex_indices[i*3+j]*3+1],
				bocavirus_surface.geometry.attributes.position.array[net_triangle_vertex_indices[i*3+j]*3+2]);
			initial_bocavirus_vertices[i*3+j] = bocavirus_vertices[i*3+j].clone();
		}
	}
	
	for(var i = 0; i<bocavirus_proteins.length; i++){
		bocavirus_proteins[i] = new THREE.Mesh( master_protein.geometry.clone(), master_protein.material.clone());
		
		fix_protein_to_anchors_vecs(
				bocavirus_vertices[i*3+0],
				bocavirus_vertices[i*3+1],
				bocavirus_vertices[i*3+2],
				bocavirus_proteins[i]);
	}
	
//	var ourvertexindex = 180;
//	indicatorblobs[0].position.set(
//		bocavirus_proteins[0].geometry.attributes.position.array[ourvertexindex*3+0],
//		bocavirus_proteins[0].geometry.attributes.position.array[ourvertexindex*3+1],
//		bocavirus_proteins[0].geometry.attributes.position.array[ourvertexindex*3+2] );
//	bocavirus_proteins[0].localToWorld(indicatorblobs[0].position);
	
	var normalized_virtualico_vertices = Array(12);
	normalized_virtualico_vertices[0] = new THREE.Vector3(0, 		1, 	PHI);
	normalized_virtualico_vertices[1] = new THREE.Vector3( PHI,	0, 	1);
	normalized_virtualico_vertices[2] = new THREE.Vector3(0,		-1, PHI);
	normalized_virtualico_vertices[3] = new THREE.Vector3(-PHI,	0, 	1);
	normalized_virtualico_vertices[4] = new THREE.Vector3(-1, 	PHI,0);
	normalized_virtualico_vertices[5] = new THREE.Vector3( 1, 	PHI,0);
	normalized_virtualico_vertices[6] = new THREE.Vector3( PHI,	0,	-1);
	normalized_virtualico_vertices[7] = new THREE.Vector3( 1,		-PHI,0);
	normalized_virtualico_vertices[8] = new THREE.Vector3(-1,		-PHI,0);
	normalized_virtualico_vertices[9] = new THREE.Vector3(-PHI,	0,	-1);
	normalized_virtualico_vertices[10] = new THREE.Vector3(0, 	1,	-PHI);
	normalized_virtualico_vertices[11] = new THREE.Vector3(0,		-1,	-PHI);
	
	
	
	for(var capsomer_index = 0; capsomer_index < 12; capsomer_index++)
	{
		for(var protein_triangle_index = 0; protein_triangle_index < 20; protein_triangle_index++)
		{
			for(var i = 0; i < 3; i++)
			{
				var vi = 100 + i * bocavirus_proteins[protein_triangle_index].geometry.attributes.position.array.length / 3 / 3;
				var indicative_vertex = new THREE.Vector3(
					bocavirus_proteins[protein_triangle_index].geometry.attributes.position.array[vi*3+0],
					bocavirus_proteins[protein_triangle_index].geometry.attributes.position.array[vi*3+1],
					bocavirus_proteins[protein_triangle_index].geometry.attributes.position.array[vi*3+2] );
				
				bocavirus_proteins[protein_triangle_index].localToWorld(indicative_vertex);
				
				var dist = normalized_virtualico_vertices[capsomer_index].distanceTo(indicative_vertex);
				if(dist < 1.1)
					console.log(dist, protein_triangle_index * 3 + i );
				
				//you could have them all be separate
//				neo_bocavirus_proteins[]
				
			}	
		}
		
		console.log("done")
	}
	
	{
		lights[0] = new THREE.PointLight( 0xffffff, 0.6 );
		lights[1] = new THREE.PointLight( 0xffffff, 0.6 );
		lights[2] = new THREE.PointLight( 0xffffff, 0.6 );
		lights[3] = new THREE.PointLight( 0xffffff, 0.6 );
		
		lights[0].position.set( 0, 100, 30 );
		lights[1].position.set( 100, 0, 30 );
		lights[2].position.set( -100, 0, 30 );
		lights[3].position.set( 0, -100, 30 );
	}
}