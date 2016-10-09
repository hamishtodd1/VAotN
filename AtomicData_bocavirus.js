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
	
	var neo_bocavirus_axis = new THREE.Vector3();
	for(var i = 0; i < neo_bocavirus_proteins.length; i++)
	{
		neo_bocavirus_proteins[i].updateMatrixWorld();
		neo_bocavirus_axis.copy(bocavirus_MovementAxis);
		neo_bocavirus_proteins[i].worldToLocal(neo_bocavirus_axis);
		neo_bocavirus_axis.normalize();
		neo_bocavirus_proteins[i].rotateOnAxis(neo_bocavirus_axis, bocavirus_MovementAngle);
		neo_bocavirus_proteins[i].updateMatrixWorld();
	}

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
	coloredness = 1;
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
	var master_protein = new THREE.Mesh( new THREE.BufferGeometry(), new THREE.MeshLambertMaterial({color:0xf0f00f, transparent:true, alphaTest: 0.001}) );
	master_protein.geometry.addAttribute( 'position', new THREE.BufferAttribute( Boca_vertices, 3 ) );
	master_protein.geometry.setIndex( new THREE.BufferAttribute( Boca_faces, 1 ) );
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
	
	var point = new THREE.Vector3();
	var axis2 = new THREE.Vector3();
	axis2.addVectors(normalized_virtualico_vertices[0],normalized_virtualico_vertices[5]);
	axis2.normalize();
	for(var i = 0; i < master_protein.geometry.attributes.position.array.length / 3; i++){
		point.set(	master_protein.geometry.attributes.position.array[i*3+0],
					master_protein.geometry.attributes.position.array[i*3+1],
					master_protein.geometry.attributes.position.array[i*3+2]);
		
		point.applyAxisAngle(normalized_virtualico_vertices[0], TAU / 5);
		point.applyAxisAngle(axis2, TAU / 2);
		
		master_protein.geometry.attributes.position.array[i*3+0] = point.x;
		master_protein.geometry.attributes.position.array[i*3+1] = point.y;
		master_protein.geometry.attributes.position.array[i*3+2] = point.z;
	}
	
	for(var i = 0; i < neo_bocavirus_proteins.length; i++)
		neo_bocavirus_proteins[i] = master_protein.clone(); 
	
	EggCell = new THREE.Mesh(new THREE.PlaneGeometry(EggCell_radius * 2,EggCell_radius * 2),
			new THREE.MeshBasicMaterial({map:random_textures[3], transparent: true} ) );
	EggCell.position.copy(EggCell_initialposition);
}

//the seed index is which, in the group of five proteins in the "fundamental domain" like thing, this refers to
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