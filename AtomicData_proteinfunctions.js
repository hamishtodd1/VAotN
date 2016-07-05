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
	
	//TODO this is where it becomes about 5.
	for(var i = 0; i < protein_vertices_numbers.length / 3 / 3; i++){
		var point = new THREE.Vector3(	protein_vertices_numbers[i*3+0],
										protein_vertices_numbers[i*3+1],
										protein_vertices_numbers[i*3+2]);
	}
	master_protein.geometry.addAttribute( 'position', new THREE.BufferAttribute( protein_vertices_numbers, 3 ) );
	master_protein.geometry.setIndex( new THREE.BufferAttribute( coarse_protein_triangle_indices, 1 ) );
	master_protein.geometry.computeFaceNormals();
	master_protein.geometry.computeVertexNormals();
	
	var normalized_virtualico_vertices = Array(12);
	normalized_virtualico_vertices[0] = new THREE.Vector3(0, 	1, 	PHI);
	normalized_virtualico_vertices[1] = new THREE.Vector3( PHI,	0, 	1);
	normalized_virtualico_vertices[2] = new THREE.Vector3(0,	-1, PHI);
	normalized_virtualico_vertices[3] = new THREE.Vector3(-PHI,	0, 	1);
	normalized_virtualico_vertices[4] = new THREE.Vector3(-1, 	PHI,0);
	normalized_virtualico_vertices[5] = new THREE.Vector3( 1, 	PHI,0);
	normalized_virtualico_vertices[6] = new THREE.Vector3( PHI,	0,	-1);
	normalized_virtualico_vertices[7] = new THREE.Vector3( 1,	-PHI,0);
	normalized_virtualico_vertices[8] = new THREE.Vector3(-1,	-PHI,0);
	normalized_virtualico_vertices[9] = new THREE.Vector3(-PHI,	0,	-1);
	normalized_virtualico_vertices[10] = new THREE.Vector3(0, 	1,	-PHI);
	normalized_virtualico_vertices[11] = new THREE.Vector3(0,	-1,	-PHI);
	for(var i = 0; i < 12; i++)
		normalized_virtualico_vertices[i].normalize();
	
	var threefold_axis = new THREE.Vector3(1,1,1);
	threefold_axis.normalize();
	var fivefold_axis = normalized_virtualico_vertices[0].clone();
	
	master_protein.rotateOnAxis(threefold_axis, TAU / 3);
	master_protein.updateMatrixWorld();
	var tempaxis = fivefold_axis.clone();
	master_protein.worldToLocal(tempaxis);
	master_protein.rotateOnAxis(tempaxis, 2 * TAU / 5);
	master_protein.updateMatrixWorld();
	
	for(var i = 0; i < neo_bocavirus_proteins.length; i++)
	{
		neo_bocavirus_proteins[i] = new THREE.Mesh( master_protein.geometry.clone(), master_protein.material.clone() );
		neo_bocavirus_proteins[i].rotation.copy(master_protein.rotation)
		neo_bocavirus_proteins[i].updateMatrixWorld();
	}
		
	
	//-----Creating the group
	//"1"
	var axis1 = normalized_virtualico_vertices[0].clone();
	axis1.add(normalized_virtualico_vertices[3]);
	rotate_protein_bunch(axis1, TAU / 2, 1);
	
	//"2"
	var axis2a = normalized_virtualico_vertices[0].clone();
	axis2a.add(normalized_virtualico_vertices[3]);
	rotate_protein_bunch(axis2a, TAU / 2, 2);
	var axis2b = normalized_virtualico_vertices[2].clone();
	axis2b.add(normalized_virtualico_vertices[3]);
	rotate_protein_bunch(axis2b, TAU / 2, 2);
	
	//"3"
	var axis3 = normalized_virtualico_vertices[0].clone();
	axis3.add(normalized_virtualico_vertices[4]);
	rotate_protein_bunch(axis3, TAU / 2, 3);
	
	//"4"
	var axis4a = normalized_virtualico_vertices[0].clone();
	axis4a.add(normalized_virtualico_vertices[3]);
	rotate_protein_bunch(axis4a,  TAU / 2, 4);
	var axis4b = normalized_virtualico_vertices[3].clone();
	rotate_protein_bunch(axis4b,3*TAU / 5, 4);
	
	//doubling up
	for(var j = 0; j < 60; j += 10)
	{
		for(var i = 5; i < 10; i++ )
		{
			var specific_da = z_central_axis.clone();
			neo_bocavirus_proteins[j+i].worldToLocal(specific_da);
			neo_bocavirus_proteins[j+i].rotateOnAxis(specific_da, TAU / 2);
			neo_bocavirus_proteins[j+i].updateMatrixWorld();
		}
	}
	
	var y_central_axis = new THREE.Vector3(0,1,0);
	for(var j = 0; j < 60; j += 20)
	{
		for(var i = 10; i < 20; i++ )
		{
			var specific_da = y_central_axis.clone();
			neo_bocavirus_proteins[j+i].worldToLocal(specific_da);
			neo_bocavirus_proteins[j+i].rotateOnAxis(specific_da, TAU / 2);
			neo_bocavirus_proteins[j+i].updateMatrixWorld();
		}
	}
	
	var hooray_axis = new THREE.Vector3(1,1,1);
	hooray_axis.normalize();
	for(var i = 20; i < 40; i++)
	{
		var specific_da = hooray_axis.clone();
		neo_bocavirus_proteins[i].worldToLocal(specific_da);
		neo_bocavirus_proteins[i].rotateOnAxis(specific_da, TAU / 3);
		neo_bocavirus_proteins[i].updateMatrixWorld();
		
		neo_bocavirus_proteins[i].material.color.b = 1;
		neo_bocavirus_proteins[i].material.color.r = 0;
	}
	for(var i = 40; i < 60; i++)
	{
		var specific_da = hooray_axis.clone();
		neo_bocavirus_proteins[i].worldToLocal(specific_da);
		neo_bocavirus_proteins[i].rotateOnAxis(specific_da,2*TAU / 3);
		neo_bocavirus_proteins[i].updateMatrixWorld();
		
		neo_bocavirus_proteins[i].material.color.b = 1;
		neo_bocavirus_proteins[i].material.color.g = 0;
	}
	
	
	
	
	
//	for(var i = 1; i < 5; i++)
//	{
//		var tempaxis = fivefold_axis.clone();
//		neo_bocavirus_proteins[i].worldToLocal(tempaxis);
//		neo_bocavirus_proteins[i].rotateOnAxis(tempaxis, i * TAU / 5);
//		neo_bocavirus_proteins[i].updateMatrixWorld();
//	}
	
	/*
	 * Hold it so that you're looking at a yellow emblem and the 0 is on top
	 * Work out how to generate all the yellows on the half facing towards you
	 * Then do that for another bunch. Then rotate them all around the y central axis
	 * 
	 * Then get one into place for the purples, then the blues
	 */
	
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

function rotate_protein_bunch(ouraxis, amt, seed_index)
{
	neo_bocavirus_proteins[seed_index].worldToLocal(ouraxis);
	ouraxis.normalize();
	for(var i = 0; i < 12; i++)
	{
		neo_bocavirus_proteins[i*5+seed_index].rotateOnAxis(ouraxis, amt);
		neo_bocavirus_proteins[i*5+seed_index].updateMatrixWorld();
	}
}