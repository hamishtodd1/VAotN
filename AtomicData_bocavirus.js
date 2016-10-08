/*
 * TODO
 * 
 * -lights
 * 
 */

var flash_colors;
var flash_time = 76.6;
var unflash_time = 3.8;

//camera
var movement_duration = 2.2;
var pullback_start_time = 142.8;
var cell_move_time = 145.6;
var zoomin_start_time = 149.8;
var cell_fadeout_start_time = zoomin_start_time + movement_duration / 2;
var fade_starting_time = 152;
var Transcriptase_ogling_time = 169.5;
var second_pullback_start_time = 179.4;
var whole_thing_finish_time = 203.3;

function update_bocavirus() {
	//-------camera Story stuff
	if( our_CurrentTime < pullback_start_time || cell_fadeout_start_time + movement_duration < our_CurrentTime)
		EggCell.visible = false;
	else
		EggCell.visible = true;
	
	var cell_eaten_bocavirus_position = new THREE.Vector3( EggCell_initialposition.x - ( EggCell_initialposition.x - EggCell_radius ) * 2, 0, 0);
	var Transcriptase_ogling_position = new THREE.Vector3(playing_field_dimension,0,min_cameradist);
	var Transcriptase_DNAcage_visible_position = new THREE.Vector3( playing_field_dimension / 2, 0, min_cameradist * 2 );
	
	var rightmost_visible_x = EggCell_initialposition.x + EggCell_radius;
	var leftmost_visible_x = cell_eaten_bocavirus_position.x - EggCell_radius;
	var CEPx = ( rightmost_visible_x + leftmost_visible_x ) / 2;
	var CEPz = ( rightmost_visible_x - leftmost_visible_x ) / 2 / Math.tan( camera.fov / 360 * TAU / 2 );
	var Cell_virus_visible_position = new THREE.Vector3( CEPx, 0, CEPz );
	
	if( our_CurrentTime < pullback_start_time )
		camera.position.set(0,0,min_cameradist);
	else if( our_CurrentTime < pullback_start_time + movement_duration )
		camera.position.copy( move_smooth_vectors(camera_default_position, Cell_virus_visible_position, movement_duration, our_CurrentTime - pullback_start_time) );
	else if( our_CurrentTime < zoomin_start_time )
		camera.position.copy(Cell_virus_visible_position);
	else if( our_CurrentTime < zoomin_start_time + movement_duration )
		camera.position.copy( move_smooth_vectors(Cell_virus_visible_position, camera_default_position, movement_duration, our_CurrentTime - zoomin_start_time) );
	else if( our_CurrentTime < Transcriptase_ogling_time )
		camera.position.copy(camera_default_position);
	else if( our_CurrentTime < Transcriptase_ogling_time + movement_duration )
		camera.position.copy( move_smooth_vectors(camera_default_position, Transcriptase_ogling_position, movement_duration, our_CurrentTime - Transcriptase_ogling_time) );
	else if( our_CurrentTime < second_pullback_start_time )
		camera.position.copy(Transcriptase_ogling_position);
	else if( our_CurrentTime < second_pullback_start_time + movement_duration )
		camera.position.copy( move_smooth_vectors(Transcriptase_ogling_position, Transcriptase_DNAcage_visible_position, movement_duration, our_CurrentTime - second_pullback_start_time) );
	else if( our_CurrentTime < whole_thing_finish_time )
		camera.position.copy( Transcriptase_DNAcage_visible_position );
	else
		camera.position.copy( camera_default_position );
	
	EggCell.position.copy( move_smooth_vectors( EggCell_initialposition, cell_eaten_bocavirus_position, movement_duration, our_CurrentTime - cell_move_time ) );
	
	var fadeout_duration = movement_duration / 2;
	if( our_CurrentTime <= cell_fadeout_start_time )
		EggCell.material.opacity = 1;
	if( cell_fadeout_start_time < our_CurrentTime && our_CurrentTime < cell_fadeout_start_time + fadeout_duration )
		EggCell.material.opacity = 1 - ( our_CurrentTime - cell_fadeout_start_time) / fadeout_duration;
	if( cell_fadeout_start_time + fadeout_duration < our_CurrentTime )
		EggCell.material.opacity = 0;
	
	//-------Rotation
	if(isMouseDown) {
		bocavirus_MovementAngle = Mouse_delta.length() / 3;
		bocavirus_MovementAxis.set(-Mouse_delta.y, Mouse_delta.x, 0);
		bocavirus_MovementAxis.normalize();
		
		if( !Mouse_delta.equals( new THREE.Vector3() ) && rotation_understanding % 2 === 0 )
			rotation_understanding++;
	}
	else {
		bocavirus_MovementAngle *= 0.93;
	}
	if(!isMouseDown && rotation_understanding % 2 === 1)
		rotation_understanding++;
	
	var neo_bocavirus_axis = bocavirus_MovementAxis.clone();
	neo_bocavirus.updateMatrixWorld();
	neo_bocavirus.worldToLocal(neo_bocavirus_axis);
	neo_bocavirus_axis.normalize();
	neo_bocavirus.rotateOnAxis(neo_bocavirus_axis, bocavirus_MovementAngle);
	neo_bocavirus.updateMatrixWorld();

	//-------Colors
	//it takes a while. Could instead do them in fours. The two at the top and bottom, two on the left and right, two on the front and back
	var fadeto_time = 0.66;
	var fadeback_time = fadeto_time;
	var coloredness;
	if( our_CurrentTime < flash_time )
		coloredness = 0;
	else if( our_CurrentTime < flash_time + fadeto_time )
		coloredness = (our_CurrentTime - flash_time) / fadeto_time;
	else if( our_CurrentTime < unflash_time )
		coloredness = 1;
	else if( our_CurrentTime < unflash_time + fadeback_time )
		coloredness = 1 - ( our_CurrentTime - unflash_time ) / fadeback_time;
	else
		coloredness = 0;
	var default_r = 1;
	var default_g = 1;
	var default_b = 0;
//	for(var i = 0; i < neo_bocavirus_proteins.length; i++)
//	{
//		var our_r = coloredness * flash_colors[i][0] + (1-coloredness) * default_r;
//		var our_g = coloredness * flash_colors[i][1] + (1-coloredness) * default_g;
//		var our_b = coloredness * flash_colors[i][2] + (1-coloredness) * default_b;
//		
//		neo_bocavirus_proteins[i].material.color.r = our_r;
//		neo_bocavirus_proteins[i].material.color.g = our_g;
//		neo_bocavirus_proteins[i].material.color.b = our_b;
//	}
}

var EggCell_radius = 50;
var EggCell_initialposition = new THREE.Vector3( EggCell_radius + playing_field_dimension,0,0);

function init_bocavirus_stuff()
{
	neo_bocavirus = new THREE.Mesh( new THREE.BufferGeometry(), new THREE.MeshLambertMaterial({color:0xf0f00f, transparent:true}) );
	//actually you want to load them in as vertices probably so you can find the right one.
	
	var bocavirus_proteins_positions = Array(60);
	var master_position = new THREE.Vector3();
	
	for(var i = 0; i < bocavirus_proteins_positions.length; i++)
	{
		bocavirus_proteins_positions[i] = new THREE.Vector3();
		
		for(var j = 0; j < 74; j++ )
		{
			bocavirus_proteins_positions[i].x += Boca_vertices[(i*74+j)*3+0];
			bocavirus_proteins_positions[i].y += Boca_vertices[(i*74+j)*3+1];
			bocavirus_proteins_positions[i].z += Boca_vertices[(i*74+j)*3+2];
		}
		
		bocavirus_proteins_positions[i].multiplyScalar( 1/74 );
		
		master_position.add(bocavirus_proteins_positions[i]);
		
		var adjusted_indices = [26,   47,  59, 55, 56,  43,  3,  15, 16];
		var adjusted_scalars = [1.31,1.5,1.33,1.3,1.2,1.24,1.2,1.07,1.1];
		for(var j = 0; j < adjusted_scalars.length; j++ )
		{
			Boca_vertices[(i*74+adjusted_indices[j])*3+0] = ( Boca_vertices[(i*74+adjusted_indices[j])*3+0] - bocavirus_proteins_positions[i].x ) * adjusted_scalars[j] + bocavirus_proteins_positions[i].x;
			Boca_vertices[(i*74+adjusted_indices[j])*3+1] = ( Boca_vertices[(i*74+adjusted_indices[j])*3+1] - bocavirus_proteins_positions[i].y ) * adjusted_scalars[j] + bocavirus_proteins_positions[i].y;
			Boca_vertices[(i*74+adjusted_indices[j])*3+2] = ( Boca_vertices[(i*74+adjusted_indices[j])*3+2] - bocavirus_proteins_positions[i].z ) * adjusted_scalars[j] + bocavirus_proteins_positions[i].z;
		}
	}
	
	master_position.multiplyScalar(1/60);
	
	for(var i = 0; i < bocavirus_proteins_positions.length; i++)
	{
		for(var j = 0; j < 74; j++ )
		{
			Boca_vertices[(i*74+j)*3+0] -= master_position.x;
			Boca_vertices[(i*74+j)*3+1] -= master_position.y;
			Boca_vertices[(i*74+j)*3+2] -= master_position.z;
		}
	}
	
	for(var i = 0; i < bocavirus_proteins_positions.length; i++)
	{
		for(var j = 0; j < 74; j++ )
		{
			Boca_vertices[(i*74+j)*3+0] -= master_position.x;
			Boca_vertices[(i*74+j)*3+1] -= master_position.y;
			Boca_vertices[(i*74+j)*3+2] -= master_position.z;
			
			Boca_vertices[(i*74+j)*3+0] *= 0.024;
			Boca_vertices[(i*74+j)*3+1] *= 0.024;
			Boca_vertices[(i*74+j)*3+2] *= 0.024;
		}
	}
	
	neo_bocavirus.geometry.addAttribute( 'position', new THREE.BufferAttribute( Boca_vertices, 3 ) );
	neo_bocavirus.geometry.setIndex( new THREE.BufferAttribute( Boca_faces, 1 ) );

	
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
	
	var example_fivefold = new THREE.Vector3(Boca_vertices[26*3+0],Boca_vertices[26*3+1],Boca_vertices[26*3+2]);
	var their_point = new THREE.Vector3();
	for(var i = 1; i < 60; i++)
	{
		//we want the four closest
		their_point.set(Boca_vertices[(i*74+26)*3+0],Boca_vertices[(i*74+26)*3+1],Boca_vertices[(i*74+26)*3+2]);
		if(example_fivefold.distanceTo(their_point) < 0.1 )
			example_fivefold.add(their_point);
	}
	console.log(example_fivefold);
	
	var first_axis = new THREE.Vector3();
	first_axis.crossVectors(normalized_virtualico_vertices[0], example_fivefold);
	first_axis.normalize();
	var first_angle = normalized_virtualico_vertices[0].angleTo(example_fivefold);
	var bocavec = new THREE.Vector3();
	for(var i = 0, il = Boca_vertices.length / 3; i < il; i++)
	{
		bocavec.set(Boca_vertices[i*3+0],Boca_vertices[i*3+1],Boca_vertices[i*3+2]);
		bocavec.applyAxisAngle(first_axis,-first_angle);
		Boca_vertices[i*3+0] = bocavec.x;
		Boca_vertices[i*3+1] = bocavec.y;
		Boca_vertices[i*3+2] = bocavec.z;
	}
	
	var example_threefold = new THREE.Vector3(Boca_vertices[43*3+0],Boca_vertices[43*3+1],Boca_vertices[43*3+2]);
	for(var i = 1; i < 60; i++)
	{
		//we want the four closest
		their_point.set(Boca_vertices[(i*74+43)*3+0],Boca_vertices[(i*74+43)*3+1],Boca_vertices[(i*74+43)*3+2]);
		if(example_threefold.distanceTo(their_point) < 0.1 )
			example_threefold.add(their_point);
	}
	console.log(example_threefold);
	
	var projected_threefold_getter = new THREE.Vector3();
	projected_threefold_getter.crossVectors(normalized_virtualico_vertices[0],example_threefold);
	var projected_threefold = new THREE.Vector3();
	projected_threefold.crossVectors(projected_threefold_getter,normalized_virtualico_vertices[0]);
	
	var desired_threefold = new THREE.Vector3(1,1,1);
	var projected_desired_threefold_getter = new THREE.Vector3();
	projected_desired_threefold_getter.crossVectors(normalized_virtualico_vertices[0],desired_threefold);
	var projected_desired_threefold = new THREE.Vector3();
	projected_desired_threefold.crossVectors(projected_desired_threefold_getter,normalized_virtualico_vertices[0]);
	
	var second_angle = projected_threefold.angleTo(projected_desired_threefold);
	var bocavec = new THREE.Vector3();
	for(var i = 0, il = Boca_vertices.length / 3; i < il; i++)
	{
		bocavec.set(Boca_vertices[i*3+0],Boca_vertices[i*3+1],Boca_vertices[i*3+2]);
		bocavec.applyAxisAngle(normalized_virtualico_vertices[0],-second_angle);
		Boca_vertices[i*3+0] = bocavec.x;
		Boca_vertices[i*3+1] = bocavec.y;
		Boca_vertices[i*3+2] = bocavec.z;
	}
	
	//it looks like it could be off. Compare its screencap with your generated thing
	
	
	
//	var master_protein = neo_bocavirus;
//	master_protein.geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(74 * 3), 3 ) );
//	master_protein.geometry.setIndex( new THREE.BufferAttribute( new Uint16Array(144*3), 1 ) );
//	
//	for(var i = 0, il = master_protein.geometry.attributes.position.array.length; i < il; i++)
//		master_protein.geometry.attributes.position.array[i] = neo_bocavirus.geometry.attributes.position.array[i];
//	for(var i = 0, il = master_protein.index.array.length; i < il; i++)
//		master_protein.geometry.index.array[i] = neo_bocavirus.geometry.index.array[i];
//	
//	master_protein.geometry.computeFaceNormals();
//	master_protein.geometry.computeVertexNormals();
//	
//	for(var i = 0; i < neo_bocavirus_proteins.length; i++)
//	{
//		neo_bocavirus_proteins[i] = new THREE.Mesh( master_protein.geometry.clone(), master_protein.material.clone() );
//		neo_bocavirus_proteins[i].rotation.copy(master_protein.rotation)
//		neo_bocavirus_proteins[i].updateMatrixWorld();
//	}
	
//	/*
//	 * mirroring the protein
//	 * http://gamedev.stackexchange.com/questions/43615/how-can-i-reflect-a-point-with-respect-to-the-plane
//	 * points
//	 * -1,1,1
//	 * normalized_virtualico_vertices[0]
//	 * 0,0,0
//	 */
//		
//	
//	//----------Creating the group
//	//"1"
//	var axis1 = normalized_virtualico_vertices[0].clone();
////	axis1.add(normalized_virtualico_vertices[3]);
//	rotate_protein_bunch(axis1, 2 * TAU / 5, 1);
//	
////	//"2"
//	var axis2 = normalized_virtualico_vertices[0].clone();
//	axis2.add(normalized_virtualico_vertices[4]);
//	rotate_protein_bunch(axis2, TAU / 2, 2);
////	
////	//"3"
//	var axis3a = normalized_virtualico_vertices[0].clone();
//	rotate_protein_bunch(axis3a, TAU / 5, 3);
//	var axis3b = normalized_virtualico_vertices[4].clone();
//	axis3b.add(normalized_virtualico_vertices[3]);
//	rotate_protein_bunch(axis3b, TAU / 2, 3);
//	
////	//"4"
//	var axis4a = normalized_virtualico_vertices[0].clone();
//	axis4a.add(normalized_virtualico_vertices[4]);
//	rotate_protein_bunch(axis4a,TAU / 2, 4);
//	var axis4b = normalized_virtualico_vertices[4].clone();
//	rotate_protein_bunch(axis4b,3*TAU / 5, 4);
//	
//	//tripling the proteins, now you have 15.
//	for(var j = 0; j < 60; j += 15)
//	{
//		for(var i = 5; i < 10; i++ )
//		{
//			var specific_da = new THREE.Vector3(1,1,1);
//			specific_da.normalize();
//			neo_bocavirus_proteins[j+i].worldToLocal(specific_da);
//			neo_bocavirus_proteins[j+i].rotateOnAxis(specific_da, TAU / 3);
//			neo_bocavirus_proteins[j+i].updateMatrixWorld();
//		}
//		
//		for(var i =10; i < 15; i++ )
//		{
//			var specific_da = new THREE.Vector3(1,1,1);
//			specific_da.normalize();
//			neo_bocavirus_proteins[j+i].worldToLocal(specific_da);
//			neo_bocavirus_proteins[j+i].rotateOnAxis(specific_da, 2 * TAU / 3);
//			neo_bocavirus_proteins[j+i].updateMatrixWorld();
//		}
//	}
//	
//	flash_colors = Array(60);
//	for(var i = 0; i < flash_colors.length; i++ )
//		flash_colors[i] = Array(3);
//	for(var i = 0; i < 15; i++)
//	{
//		flash_colors[i][0] = 0;
//		flash_colors[i][1] = 1;
//		flash_colors[i][2] = 0;
//	}
//		
//	
//	for(var i = 15; i < 30; i++)
//	{
//		var specific_da = new THREE.Vector3(1,0,0);
//		neo_bocavirus_proteins[i].worldToLocal(specific_da);
//		neo_bocavirus_proteins[i].rotateOnAxis(specific_da, TAU / 2);
//		neo_bocavirus_proteins[i].updateMatrixWorld();
//		
//		flash_colors[i][0] = 0;
//		flash_colors[i][1] = 0.5;
//		flash_colors[i][2] = 1;
//	}
//	for(var i = 30; i < 45; i++)
//	{
//		var specific_da = new THREE.Vector3(0,1,0);
//		neo_bocavirus_proteins[i].worldToLocal(specific_da);
//		neo_bocavirus_proteins[i].rotateOnAxis(specific_da, TAU / 2);
//		neo_bocavirus_proteins[i].updateMatrixWorld();
//		
//		flash_colors[i][0] = 1;
//		flash_colors[i][1] = 0.5;
//		flash_colors[i][2] = 0;
//	}
//	for(var i = 45; i < 60; i++)
//	{
//		var specific_da = new THREE.Vector3(0,0,1);
//		neo_bocavirus_proteins[i].worldToLocal(specific_da);
//		neo_bocavirus_proteins[i].rotateOnAxis(specific_da, TAU / 2);
//		neo_bocavirus_proteins[i].updateMatrixWorld();
//		
//		flash_colors[i][0] = 1;
//		flash_colors[i][1] = 0;
//		flash_colors[i][2] = 1;
//	}
//	
//	for(var capsomer_index = 0; capsomer_index < 12; capsomer_index++)
//	{
//		capsomer_protein_indices[ capsomer_index ] = Array(5);
//		
//		var lowest_unused = 0;
//		for(var j = 0; j < neo_bocavirus_proteins.length; j++)
//		{
//			var indicative_vertex = new THREE.Vector3(
//				neo_bocavirus_proteins[j].geometry.attributes.position.array[100*3+0],
//				neo_bocavirus_proteins[j].geometry.attributes.position.array[100*3+1],
//				neo_bocavirus_proteins[j].geometry.attributes.position.array[100*3+2] );
//			
//			neo_bocavirus_proteins[j].localToWorld(indicative_vertex);
//			
//			var dist = normalized_virtualico_vertices[capsomer_index].distanceTo(indicative_vertex);
//			if(dist < 2)
//			{
//				capsomer_protein_indices[capsomer_index][ lowest_unused ] = j;
//				lowest_unused++;
//			}
//		}
//	}
	
	neo_bocavirus.geometry.computeFaceNormals();
	neo_bocavirus.geometry.computeVertexNormals();
	
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
	
	EggCell = new THREE.Mesh(new THREE.PlaneGeometry(EggCell_radius * 2,EggCell_radius * 2),
			new THREE.MeshBasicMaterial({map:random_textures[3], transparent: true} ) );
	EggCell.position.copy(EggCell_initialposition);
}