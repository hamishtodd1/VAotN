/*
 * What we're planning is 20 rhomohedra, then 12 icosahedra, then 20 triacontahedra,
 * then 20*12=240 rhombohedra. Maybe just get them in as hexecontahedra
 * Then 5x12=60 icosahedra, then (sigh, violation) 20 triacontahedra AND 12 icosahedra. Then perhaps 20*30 = 360 rhombohedra
 * 
 * So maybe things should scale a little, or indeed indefinitely
 * You can perhaps turn it on one axis which also makes it generate
 * 
 * We could have a slider.
 * 
 * the random walk: forces are ionic and hydrogen bonds vs electrostatics
 */

function update_3DLattice() {
	if(InputObject.isMouseDown) {
		var explosion_speed = 0.004; 
		if( exploding ) {
			togetherness -= explosion_speed;
			if(togetherness < 0)
				togetherness = 0;
		}
		else {
			togetherness += explosion_speed;
			if(togetherness > 1)
				togetherness = 1;
		}
	}
	else {
		if(togetherness === 0)
			exploding = false;
		if(togetherness === 1)
			exploding = true;
	}
	
	//if explodedness =1 they're all out, if it's 0 they're at their fixed radius.
	//the second layer of rhombohedra has the extra aspect that clusters are a certain distance from a special point
	//they all have a fade-in period, which should start the instant that the previous layer is in place
	//at togetherness = 0, everything is out and moving in. First thing to get in is rhombs
	var rhombohedra_convergence_time = 0; //this will be much less but we want to stretch it out for now
	//console.log(togetherness )
	var rhombohedra_accel = 15; //guess
	var rhombohedra_starting_velocity = -rhombohedra_accel * rhombohedra_convergence_time / 2;
	var rhombohedra_dist = rhombohedra_starting_velocity * togetherness + 0.5 * rhombohedra_accel * togetherness * togetherness;
	if(togetherness < rhombohedra_convergence_time)
		rhombohedra_dist = 0;
	var rhombohedra_final_position = 1.2;
	rhombohedra_dist += rhombohedra_final_position;
	
	for(var i = 0; i < golden_rhombohedra.length; i++) {
		golden_rhombohedra[i].position.normalize();
		golden_rhombohedra[i].position.multiplyScalar(rhombohedra_dist);
	}
	
	
	
	
	var icosahedra_convergence_time = 0; //this will be much less but we want to stretch it out for now
	//console.log(togetherness )
	var icosahedra_accel = 15; //guess
	var icosahedra_starting_velocity = -icosahedra_accel * icosahedra_convergence_time / 2;
	var icosahedra_dist = icosahedra_starting_velocity * togetherness + 0.5 * icosahedra_accel * togetherness * togetherness;
	if(togetherness < icosahedra_convergence_time)
		icosahedra_dist = 0;
	var icosahedra_final_position = (PHI-1/2) + 1;
	console.log(icosahedra_final_position )
	icosahedra_dist += icosahedra_final_position;
	
	for(var i = 0; i < goldenicos.length; i++) {
		goldenicos[i].position.normalize();
		goldenicos[i].position.multiplyScalar(icosahedra_dist);
	}
}

function clamp(val, minval){
	if( val > minval) return val;
	else return minval;
}

//long axis points down long diagonal, short axis from the center to a vertex. Short axis we think of as y, long as z.
function fill_buffer_with_rhombohedron(long_axis, short_axis,array){
	var x_axis = short_axis.clone(); 
	x_axis.cross(long_axis);
	long_axis.normalize();
	short_axis.normalize();
	x_axis.normalize();
	
	var rhombohedron_r = 4/Math.sqrt(10+2*Math.sqrt(5))/Math.sqrt(3);
	var rhombohedron_s = rhombohedron_r * HS3;
	var rhombohedron_h = Math.sqrt(1-rhombohedron_r*rhombohedron_r);
	
	var vectors = Array(8);
	vectors[0] = long_axis.clone();
	vectors[0].multiplyScalar(rhombohedron_h*1.5);
	vectors[1] = short_axis.clone();
	vectors[1].multiplyScalar(rhombohedron_r);
	vectors[1].addScaledVector( long_axis, 0.5*rhombohedron_h );
	vectors[2] = short_axis.clone();
	vectors[2].multiplyScalar(-rhombohedron_r/2);
	vectors[2].addScaledVector( x_axis, rhombohedron_s );
	vectors[2].addScaledVector( long_axis, 0.5*rhombohedron_h );
	vectors[3] = short_axis.clone();
	vectors[3].multiplyScalar(-rhombohedron_r/2);
	vectors[3].addScaledVector( x_axis, -rhombohedron_s );
	vectors[3].addScaledVector( long_axis, 0.5*rhombohedron_h );
	vectors[4] = short_axis.clone();
	vectors[4].multiplyScalar( rhombohedron_r/2);
	vectors[4].addScaledVector( x_axis, -rhombohedron_s );
	vectors[4].addScaledVector( long_axis, -0.5*rhombohedron_h );
	vectors[5] = short_axis.clone();
	vectors[5].multiplyScalar( rhombohedron_r/2);
	vectors[5].addScaledVector( x_axis, rhombohedron_s );
	vectors[5].addScaledVector( long_axis, -0.5*rhombohedron_h );
	vectors[6] = short_axis.clone();
	vectors[6].multiplyScalar(-rhombohedron_r);
	vectors[6].addScaledVector( long_axis, -0.5*rhombohedron_h );
	vectors[7] = long_axis.clone();
	vectors[7].multiplyScalar(-rhombohedron_h*1.5);

	for(var i = 0; i<vectors.length; i++){
		array[i*3+0] = vectors[i].x;
		array[i*3+1] = vectors[i].y;
		array[i*3+2] = vectors[i].z;
	}
}

function init_cubicLattice_stuff() {
	var virtual_dodecahedron_vertices = Array(20);
	virtual_dodecahedron_vertices[0] = new THREE.Vector3(1,-1,1);
	virtual_dodecahedron_vertices[1] = new THREE.Vector3(0,-1/PHI, PHI);
	virtual_dodecahedron_vertices[2] = new THREE.Vector3(-1,-1,1);
	virtual_dodecahedron_vertices[3] = new THREE.Vector3(-PHI,0, 1/PHI);
	virtual_dodecahedron_vertices[4] = new THREE.Vector3(-PHI,0,-1/PHI);
	virtual_dodecahedron_vertices[5] = new THREE.Vector3(-1,1,-1);
	virtual_dodecahedron_vertices[6] = new THREE.Vector3(0, 1/PHI,-PHI);
	virtual_dodecahedron_vertices[7] = new THREE.Vector3(1,1,-1);
	virtual_dodecahedron_vertices[8] =  new THREE.Vector3( 1/PHI, PHI,0);
	virtual_dodecahedron_vertices[9] =  new THREE.Vector3(-1/PHI, PHI,0);
	virtual_dodecahedron_vertices[10] = new THREE.Vector3(-1,1,1);
	virtual_dodecahedron_vertices[11] = new THREE.Vector3(0, 1/PHI, PHI);
	virtual_dodecahedron_vertices[12] = new THREE.Vector3(1,1,1);
	virtual_dodecahedron_vertices[13] = new THREE.Vector3( PHI,0, 1/PHI);
	virtual_dodecahedron_vertices[14] = new THREE.Vector3( PHI,0,-1/PHI);
	virtual_dodecahedron_vertices[15] = new THREE.Vector3(1,-1,-1);
	virtual_dodecahedron_vertices[16] = new THREE.Vector3(0,-1/PHI,-PHI);
	virtual_dodecahedron_vertices[17] = new THREE.Vector3(-1,-1,-1);
	virtual_dodecahedron_vertices[18] = new THREE.Vector3(-1/PHI,-PHI,0);
	virtual_dodecahedron_vertices[19] = new THREE.Vector3( 1/PHI,-PHI,0);
	for(var i = 0; i< virtual_dodecahedron_vertices.length; i++)
		virtual_dodecahedron_vertices[i].normalize();
	var virtual_icosahedron_vertices = Array(12);
	virtual_icosahedron_vertices[0] = new THREE.Vector3(0, 		1, 	PHI);
	virtual_icosahedron_vertices[1] = new THREE.Vector3( PHI,	0, 	1);
	virtual_icosahedron_vertices[2] = new THREE.Vector3(0,		-1, PHI);
	virtual_icosahedron_vertices[3] = new THREE.Vector3(-PHI,	0, 	1);
	virtual_icosahedron_vertices[4] = new THREE.Vector3(-1, 	PHI,0);
	virtual_icosahedron_vertices[5] = new THREE.Vector3( 1, 	PHI,0);
	virtual_icosahedron_vertices[6] = new THREE.Vector3( PHI,	0,	-1);
	virtual_icosahedron_vertices[7] = new THREE.Vector3( 1,		-PHI,0);
	virtual_icosahedron_vertices[8] = new THREE.Vector3(-1,		-PHI,0);
	virtual_icosahedron_vertices[9] = new THREE.Vector3(-PHI,	0,	-1);
	virtual_icosahedron_vertices[10] = new THREE.Vector3(0, 	1,	-PHI);
	virtual_icosahedron_vertices[11] = new THREE.Vector3(0,		-1,	-PHI);
	for(var i = 0; i < virtual_icosahedron_vertices.length; i++)
		virtual_icosahedron_vertices[i].normalize();
	
	var quasicrystalmaterial_line = new THREE.LineBasicMaterial({
		size: 0.065,
		color: 0x0000ff
	});
	var quasicrystalmaterial_face = new THREE.MeshBasicMaterial({ //could make lambert if this doesn't work
		size: 0.065,
		color: 0xD56252,
		//shading: THREE.FlatShading, //light sources didn't seem to do anything
		side:THREE.DoubleSide
	});
	
	{
		var rhombohedron_h = Math.sqrt(1/3+2/(3*Math.sqrt(5)));
		var rhombohedron_r = 2*Math.sqrt(2/(15+Math.sqrt(5)));
		var rhombohedron_s = 4/Math.sqrt(10+2*Math.sqrt(5));
		
		var rhombohedron_line_pairs = new Uint32Array([
	       0,1,		0,2,	0,3,
	       1,4,		1,5,	2,5,	2,6,	3,6,	3,4,
	       7,4,		7,5,	7,6]);
		var rhombohedron_face_triangles = new Uint32Array([
	       0,1,2,	0,2,3,	0,3,1,
	       2,1,5,	1,3,4,	3,2,6,
	       2,5,6,	1,4,5,	3,6,4,
	       4,6,7,	6,5,7,	5,4,7]);
		var rhombohedron_vertices_numbers = new Float32Array(3*8);
		fill_buffer_with_rhombohedron(new THREE.Vector3(0,0,1), new THREE.Vector3(0,1,0),rhombohedron_vertices_numbers);
		
		var center = new THREE.Vector3(0,0,0);
		for(var i = 0; i < 8; i++){
			center.x += rhombohedron_vertices_numbers[i*3+0];
			center.y += rhombohedron_vertices_numbers[i*3+1];
			center.z += rhombohedron_vertices_numbers[i*3+2];
		}
		center.multiplyScalar(1/8);
		for(var i = 0; i < 8; i++){
			rhombohedron_vertices_numbers[i*3+0] -= center.x;
			rhombohedron_vertices_numbers[i*3+1] -= center.y;
			rhombohedron_vertices_numbers[i*3+2] -= center.z;
		}
		//var rightingrotationaxis
		
		for( var i = 0; i < golden_rhombohedra.length; i++) { 
			golden_rhombohedra[i] = new THREE.Mesh( new THREE.BufferGeometry(), quasicrystalmaterial_face );
			golden_rhombohedra[i].geometry.addAttribute( 'position', new THREE.BufferAttribute( rhombohedron_vertices_numbers, 3 ) );
			golden_rhombohedra[i].geometry.addAttribute( 'index', new THREE.BufferAttribute( rhombohedron_face_triangles, 1 ) );
			golden_rhombohedra[i].updateMatrixWorld();
			
			/* We have a vector C which points to your dodecahedron corner, and E, pointing along the edge that your Y axis should end up on
			 * 
			 * 1: point towards your dodecahedron corner by rotating about the axis that is the cross product of C and (0,0,1)
			 * 2: apply that same rotation to the vector (0,1,0), call the result Y
			 * 3: get the vector that is at a right angle to C and in the same plane as C and E, using cross product, call that vector A
			 * 4: get the angle between A and Y
			 * 5: align by rotating around C by that angle
			 * 6: move some amount along C.
			 * 
			 * Going to need to make it a "fill a buffer with this"
			 */
			
			var golden_rhombohedra_edge_radius = 0.03;
			for(var j = 0; j < golden_rhombohedra[i].geometry.attributes.position.array.length/3; j++){
				var mysphere = new THREE.Mesh( (new THREE.BufferGeometry).fromGeometry(new THREE.SphereGeometry(golden_rhombohedra_edge_radius,8,4)),new THREE.MeshBasicMaterial({color:0x000000,side:THREE.DoubleSide}));
				THREE.SceneUtils.attach(mysphere, scene, golden_rhombohedra[i]);
				mysphere.position.x = golden_rhombohedra[i].geometry.attributes.position.array[j*3+0];
				mysphere.position.y = golden_rhombohedra[i].geometry.attributes.position.array[j*3+1];
				mysphere.position.z = golden_rhombohedra[i].geometry.attributes.position.array[j*3+2];
			}
			var corners_for_edge = Array(1,2,3,1,3,7,1,7,2,2,7,3);
			for( var j = 0; j < 12; j++) {
				var mycylinder_vertices_numbers = new Float32Array(16*3);
				var corner_index1 = j < 3 ? 0 : Math.floor(j / 3) + 3;
				var corner_index2 = corners_for_edge[j];
				put_tube_in_buffer(
						new THREE.Vector3(
							golden_rhombohedra[i].geometry.attributes.position.array[corner_index1*3+0],
							golden_rhombohedra[i].geometry.attributes.position.array[corner_index1*3+1],
							golden_rhombohedra[i].geometry.attributes.position.array[corner_index1*3+2]),
						new THREE.Vector3(
							golden_rhombohedra[i].geometry.attributes.position.array[corner_index2*3+0],
							golden_rhombohedra[i].geometry.attributes.position.array[corner_index2*3+1],
							golden_rhombohedra[i].geometry.attributes.position.array[corner_index2*3+2]),
						mycylinder_vertices_numbers, golden_rhombohedra_edge_radius);
				
				var mycylinder_geometry = new THREE.BufferGeometry();
				mycylinder_geometry.addAttribute( 'index', new THREE.BufferAttribute( cylinder_triangle_indices, 1 ) );
				mycylinder_geometry.addAttribute( 'position', new THREE.BufferAttribute( mycylinder_vertices_numbers, 3 ) );
				
				mycylinder = new THREE.Mesh( mycylinder_geometry, new THREE.MeshBasicMaterial({color:0x000000,side:THREE.DoubleSide}) );
				THREE.SceneUtils.attach(mycylinder, scene, golden_rhombohedra[i]);
			}
			
			var dodecahedron_edge = virtual_dodecahedron_vertices[(i+1)%20].clone();
			dodecahedron_edge.sub(virtual_dodecahedron_vertices[i]);
			
			var first_rotation_axis = new THREE.Vector3(0,0,1);
			var first_rotation_angle = Math.acos(virtual_dodecahedron_vertices[i].dot(first_rotation_axis));
			first_rotation_axis.cross(virtual_dodecahedron_vertices[i]);
			first_rotation_axis.normalize();
			var first_rotation_quaternion = new THREE.Quaternion();
			golden_rhombohedra[i].rotateOnAxis( first_rotation_axis, first_rotation_angle );
			golden_rhombohedra[i].updateMatrixWorld();
			
			var corner_to_origin = virtual_dodecahedron_vertices[i].clone();
			corner_to_origin.negate();
			var corner_spindle = dodecahedron_edge.clone();
			corner_spindle.cross(corner_to_origin);
			var desired_rhombohedron_Y = corner_to_origin.clone();
			desired_rhombohedron_Y.cross(corner_spindle);
			golden_rhombohedra[i].worldToLocal(desired_rhombohedron_Y);
			
			var Y = new THREE.Vector3(0,1,0); //of course this isn't at a right angle to cornertoorigin
			var second_rotation_axis = desired_rhombohedron_Y.clone();
			second_rotation_axis.cross(Y);
			second_rotation_axis.normalize();
			var second_rotation_angle = Math.acos(desired_rhombohedron_Y.dot(Y) / desired_rhombohedron_Y.length());
	
			golden_rhombohedra[i].rotateOnAxis( second_rotation_axis, -second_rotation_angle );
			
			var rhomdisplacement = virtual_dodecahedron_vertices[i].clone();
			rhomdisplacement.multiplyScalar(1.2);
			golden_rhombohedra[i].position.add(rhomdisplacement);
			golden_rhombohedra[i].updateMatrixWorld();
		}
	}
	
	var p = 2*((1+Math.sqrt(5))/Math.sqrt(10+2*Math.sqrt(5)));
	var q = 4/Math.sqrt(10+2*Math.sqrt(5));	
	{
		var triacontahedron_face_indices = new Uint32Array([
			0,1,2,	0,2,3,	0,3,4,	0,4,5,	0,5,1,
			1,6,7,	2,7,8,	3,8,9,	4,9,10,	5,10,6,
			7,2,1,	8,3,2,	9,4,3,	10,5,4,	6,1,5,
			11,7,6,	12,8,7,	13,9,8,	14,10,9,15,6,10, //problem
			
			11,25,7,	7,20,12,	12,24,8,	8,19,13,	13,23,9,
			9,18,14,	14,22,10,	10,17,15,	15,21,6,	6,16,11,
			20,7,25,	24,12,20,	19,8,24,	23,13,19,	18,9,23,
			22,14,18,	17,10,22,	21,15,17,	16,6,21,	25,11,16,
	
			31,30,26,	31,26,27,	31,27,28,	31,28,29,	31,29,30,
			25,26,30,	21,27,26,	22,28,27,	23,29,28,	24,30,29,
			16,21,25,	17,22,21,	18,23,22,	19,24,23,	20,25,24,
			26,25,21,	27,21,22,	28,22,23,	29,23,24,	30,24,25,
		]);
		
		var triacontahedron_line_pairs = new Uint32Array([
		   0,1,		0,2,	0,3,	0,4,	0,5,
		   1,6,		1,7,	2,7,	2,8,	3,8,	3,9,	4,9,	4,10,	5,10,	5,6,
		   6,15,	6,11,	7,11,	7,12,	8,12,	8,13,	9,13,	9,14,	10,14,	10,15,
		   
		   6,16,	11,25,	7,20,	12,24,	8,19,	13,23,	9,18,	14,22,	10,17,	15,21,
		   
		   16,25,	16,21,	17,21,	17,22,	18,22,	18,23,	19,23,	19,24,	20,24,	20,25,
		   21,26,	21,27,	22,27,	22,28,	23,28,	23,29,	24,29,	24,30,	25,30,	25,26,
		   31,26,	31,27,	31,28,	31,29,	31,30]);
		var triacontahedron_r = q/Math.sin(TAU/10)/2;
		var h = Math.sqrt(1-triacontahedron_r*triacontahedron_r);
		var triacontahedron_vertices_numbers = new Float32Array(32*3);
		triacontahedron_vertices_numbers[0] = 0;
		triacontahedron_vertices_numbers[1] = 0;
		triacontahedron_vertices_numbers[2] = 3*h+(1-h)/2;
		triacontahedron_vertices_numbers[31*3+0] = 0;
		triacontahedron_vertices_numbers[31*3+1] = 0;
		triacontahedron_vertices_numbers[31*3+2] = -(3*h+(1-h)/2);
		assign_triaconta_vertices(0,triacontahedron_r,													1,	2*h+(1-h)/2,triacontahedron_vertices_numbers);
		assign_triaconta_vertices(-Math.sin(TAU/10)*PHI*triacontahedron_r, PHI*PHI/2*triacontahedron_r,	6,	 h+(1-h)/2,	triacontahedron_vertices_numbers);
		assign_triaconta_vertices(0,PHI * triacontahedron_r,											11,	  (1-h)/2,	triacontahedron_vertices_numbers);
		
		for( var i = 0; i < golden_triacontahedra.length; i++) { 
			golden_triacontahedra[i] = new THREE.Mesh( new THREE.BufferGeometry(), quasicrystalmaterial_face );
			golden_triacontahedra[i].geometry.addAttribute( 'position', new THREE.BufferAttribute( triacontahedron_vertices_numbers, 3 ) );
			golden_triacontahedra[i].geometry.addAttribute( 'index', new THREE.BufferAttribute( triacontahedron_face_indices, 1 ) );
			
			for( var j = 0; j < 60; j++) {
				var mycylinder_vertices_numbers = new Float32Array(16*3);
				var corner_index1 = triacontahedron_line_pairs[j*2];
				var corner_index2 = triacontahedron_line_pairs[j*2+1];
				put_tube_in_buffer(
					new THREE.Vector3(
						golden_triacontahedra[i].geometry.attributes.position.array[corner_index1*3+0],
						golden_triacontahedra[i].geometry.attributes.position.array[corner_index1*3+1],
						golden_triacontahedra[i].geometry.attributes.position.array[corner_index1*3+2]),
					new THREE.Vector3(
						golden_triacontahedra[i].geometry.attributes.position.array[corner_index2*3+0],
						golden_triacontahedra[i].geometry.attributes.position.array[corner_index2*3+1],
						golden_triacontahedra[i].geometry.attributes.position.array[corner_index2*3+2]),
					mycylinder_vertices_numbers, golden_rhombohedra_edge_radius);
				
				var mycylinder_geometry = new THREE.BufferGeometry();
				mycylinder_geometry.addAttribute( 'index', new THREE.BufferAttribute( cylinder_triangle_indices, 1 ) );
				mycylinder_geometry.addAttribute( 'position', new THREE.BufferAttribute( mycylinder_vertices_numbers, 3 ) );
				
				mycylinder = new THREE.Mesh( mycylinder_geometry, new THREE.MeshBasicMaterial({color:0x000000,side:THREE.DoubleSide}) );
				THREE.SceneUtils.attach(mycylinder, scene, golden_triacontahedra[i]);
			}
		}
	}
	
	{
		var goldenico_face_indices = new Uint32Array([
			0,1,2,	0,2,3,	0,3,4,	0,4,5,	0,5,1,
			1,6,7,	2,7,8,	3,8,9,	4,9,10,	5,10,6,
			7,2,1,	8,3,2,	9,4,3,	10,5,4,	6,1,5,
			15,7,6,	14,8,7,	13,9,8,	12,10,9,11,6,10,
	
			21,16,17,	21,17,18,	21,18,19,	21,19,20,	21,20,16,
			6,11,15,	10,12,11,	9,13,12,	8,14,13,	7,15,14,
			15,16,20,	11,17,16,	12,18,17,	13,19,18,	14,20,19,
			20,14,15,	16,15,11,	17,11,12,	18,12,13,	19,13,14
			]);
		
		var goldenico_line_pairs = new Uint32Array([
	   	   0,1,		0,2,	0,3,	0,4,	0,5,
	   	   1,6,		1,7,	2,7,	2,8,	3,8,	3,9,	4,9,	4,10,	5,10,	5,6,
	   	   6,11,	6,15,	7,15,	7,14,	8,14,	8,13,	9,13,	9,12,	10,12,	10,11,
	   	   
	   	   15,16,	15,20,	14,20,	14,19,	13,19,	13,18,	12,18,	12,17,	11,17,	11,16,
	   	   21,20,	21,19,	21,18,	21,17,	21,16]);
		
	   	var goldenico_vertices_numbers = new Float32Array(32*3);
	   	goldenico_vertices_numbers[0] = 0;
	   	goldenico_vertices_numbers[1] = 0;
	   	goldenico_vertices_numbers[2] = 2.5*h;
	   	console.log(2.5*h);
	   	goldenico_vertices_numbers[21*3+0] = 0;
	   	goldenico_vertices_numbers[21*3+1] = 0;
	   	goldenico_vertices_numbers[21*3+2] = -2.5*h;
	   	assign_goldenico_vertices(0,triacontahedron_r,													1,	1.5*h,	goldenico_vertices_numbers);
	   	assign_goldenico_vertices(-Math.sin(TAU/10)*PHI*triacontahedron_r, PHI*PHI/2*triacontahedron_r,	6,	h/2,	goldenico_vertices_numbers);
	   	
	   	for( var i = 0; i < goldenicos.length; i++) { 
	   		goldenicos[i] = new THREE.Mesh( new THREE.BufferGeometry(), quasicrystalmaterial_face );
	   		goldenicos[i].geometry.addAttribute( 'position', new THREE.BufferAttribute( goldenico_vertices_numbers, 3 ) );
	   		goldenicos[i].geometry.addAttribute( 'index', new THREE.BufferAttribute( goldenico_face_indices, 1 ) );
	   		
	   		for( var j = 0; j < 40; j++) {
				var mycylinder_vertices_numbers = new Float32Array(16*3);
				var corner_index1 = goldenico_line_pairs[j*2];
				var corner_index2 = goldenico_line_pairs[j*2+1];
				put_tube_in_buffer(
						new THREE.Vector3(
							goldenicos[i].geometry.attributes.position.array[corner_index1*3+0],
							goldenicos[i].geometry.attributes.position.array[corner_index1*3+1],
							goldenicos[i].geometry.attributes.position.array[corner_index1*3+2]),
						new THREE.Vector3(
							goldenicos[i].geometry.attributes.position.array[corner_index2*3+0],
							goldenicos[i].geometry.attributes.position.array[corner_index2*3+1],
							goldenicos[i].geometry.attributes.position.array[corner_index2*3+2]),
						mycylinder_vertices_numbers, golden_rhombohedra_edge_radius);
				
				var mycylinder_geometry = new THREE.BufferGeometry();
				mycylinder_geometry.addAttribute( 'index', new THREE.BufferAttribute( cylinder_triangle_indices, 1 ) );
				mycylinder_geometry.addAttribute( 'position', new THREE.BufferAttribute( mycylinder_vertices_numbers, 3 ) );
				
				mycylinder = new THREE.Mesh( mycylinder_geometry, new THREE.MeshBasicMaterial({color:0x000000,side:THREE.DoubleSide}) );
				THREE.SceneUtils.attach(mycylinder, scene, goldenicos[i]);
			}
	   		
	   		var icosahedron_edge;
	   		if(i>9)
	   			icosahedron_edge = virtual_icosahedron_vertices[i-1].clone();
	   		else
	   			icosahedron_edge = virtual_icosahedron_vertices[(i+1)%12].clone();
	   		icosahedron_edge.sub(virtual_icosahedron_vertices[i]);
	   		icosahedron_edge.negate();
			
			var first_rotation_axis = new THREE.Vector3(0,0,1);
			var first_rotation_angle = Math.acos(virtual_icosahedron_vertices[i].dot(first_rotation_axis));
			first_rotation_axis.cross(virtual_icosahedron_vertices[i]);
			first_rotation_axis.normalize();
			var first_rotation_quaternion = new THREE.Quaternion();
			goldenicos[i].rotateOnAxis( first_rotation_axis, first_rotation_angle );
			goldenicos[i].updateMatrixWorld();
			
			var corner_to_origin = virtual_icosahedron_vertices[i].clone();
			corner_to_origin.negate();
			var corner_spindle = icosahedron_edge.clone();
			corner_spindle.cross(corner_to_origin);
			var desired_ico_Y = corner_to_origin.clone();
			desired_ico_Y.cross(corner_spindle);
			goldenicos[i].worldToLocal(desired_ico_Y);
			
			var Y = new THREE.Vector3(0,1,0); //of course this isn't at a right angle to cornertoorigin
			var second_rotation_axis = desired_ico_Y.clone();
			second_rotation_axis.cross(Y);
			second_rotation_axis.normalize();
			var second_rotation_angle = Math.acos(desired_ico_Y.dot(Y) / desired_ico_Y.length());
	
			goldenicos[i].rotateOnAxis( second_rotation_axis, -second_rotation_angle );
			
			var icodisplacement = virtual_icosahedron_vertices[i].clone();
			icodisplacement.multiplyScalar(1.2);
			goldenicos[i].position.add(icodisplacement);
			goldenicos[i].updateMatrixWorld();
			
			goldenicos[i].position.copy(virtual_icosahedron_vertices[i]);
			goldenicos[i].position.normalize();
			goldenicos[i].position.multiplyScalar(3);
			//y negative, x=0, z positive
	   	}
	}
}

function assign_triaconta_vertices(initialX,initialY,initial_index, height, array){
	for(var i = 0; i< 5; i++){
		var theta = i*TAU/5;
		
		array[(initial_index+i)*3+0] =  Math.cos(theta) * initialX + Math.sin(theta) * initialY;
		array[(initial_index+i)*3+1] = -Math.sin(theta) * initialX + Math.cos(theta) * initialY;
		array[(initial_index+i)*3+2] = height;
		
		array[((31-initial_index-i)*3)+0] =  Math.cos(theta+TAU/10) * initialX + Math.sin(theta+TAU/10) * initialY;
		array[((31-initial_index-i)*3)+1] = -Math.sin(theta+TAU/10) * initialX + Math.cos(theta+TAU/10) * initialY;
		array[((31-initial_index-i)*3)+2] = -height;
	}
}

function assign_goldenico_vertices(initialX,initialY,initial_index, height, array){
	for(var i = 0; i< 5; i++){
		var theta = i*TAU/5;
		
		array[(initial_index+i)*3+0] =  Math.cos(theta) * initialX + Math.sin(theta) * initialY;
		array[(initial_index+i)*3+1] = -Math.sin(theta) * initialX + Math.cos(theta) * initialY;
		array[(initial_index+i)*3+2] = height;
		
		array[((21-initial_index-i)*3)+0] =  Math.cos(theta+TAU/10) * initialX + Math.sin(theta+TAU/10) * initialY;
		array[((21-initial_index-i)*3)+1] = -Math.sin(theta+TAU/10) * initialX + Math.cos(theta+TAU/10) * initialY;
		array[((21-initial_index-i)*3)+2] = -height;
	}
}