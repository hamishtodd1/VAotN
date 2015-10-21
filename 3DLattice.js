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
		var explosion_speed = 0.002; 
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
	
	shape_accel = 200;
	
	var rhombohedra_convergence_time = 3/4;
	var icosahedra_startfadein_time = rhombohedra_convergence_time;
	var icosahedra_convergence_time = 1/2;
	var triacontahedra_startfadein_time = icosahedra_convergence_time;
	var triacontahedra_convergence_time = 1/4;
	var star_startfadein_time = triacontahedra_convergence_time;
	var star_convergence_time = 0;
	
	//if explodedness =1 they're all out, if it's 0 they're at their fixed radius.
	//the second layer of rhombohedra has the extra aspect that clusters are a certain distance from a special point
	//they all have a fade-in period, which should start the instant that the previous layer is in place
	//at togetherness = 0, everything is out and moving in. First thing to get in is rhombs
	if(togetherness < icosahedra_convergence_time)
		for(var i = 0; i < golden_rhombohedra.length; i++)
			scene.remove( golden_rhombohedra[i] );
	else{
		for(var i = 0; i < golden_rhombohedra.length; i++)
			scene.add( golden_rhombohedra[i] );
	}
	var rhombohedra_accel = shape_accel;
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
	
	
	
	
	if(togetherness < star_convergence_time)
		for(var i = 0; i < goldenicos.length; i++)
			scene.remove( goldenicos[i] );
	else{
		for(var i = 0; i < goldenicos.length; i++)
			scene.add( goldenicos[i] );
	}
	var icosahedra_finishfadein_time = (icosahedra_convergence_time + icosahedra_startfadein_time ) / 2; 
	var icosahedra_accel = shape_accel;
	var icosahedra_starting_velocity = -icosahedra_accel * icosahedra_convergence_time / 2;
	var icosahedra_dist = icosahedra_starting_velocity * togetherness + 0.5 * icosahedra_accel * togetherness * togetherness;
	if(togetherness < icosahedra_convergence_time)
		icosahedra_dist = 0;
	var icosahedra_final_position = (PHI-1/2) + 1;
	icosahedra_dist += icosahedra_final_position;
	for(var i = 0; i < goldenicos.length; i++) {
		goldenicos[i].position.normalize();
		goldenicos[i].position.multiplyScalar(icosahedra_dist);
	}
	if(togetherness > icosahedra_startfadein_time)
		goldenicos[0].material.opacity = 0;
	else if(togetherness < icosahedra_finishfadein_time)
		goldenicos[0].material.opacity = 1;
	else
		goldenicos[0].material.opacity = (togetherness - icosahedra_startfadein_time) / (icosahedra_finishfadein_time-icosahedra_startfadein_time)
	goldenicos[0].children[0].material.opacity = goldenicos[0].material.opacity;
	
	
	
	var triacontahedra_finishfadein_time = (triacontahedra_convergence_time + triacontahedra_startfadein_time ) / 2; 
	var triacontahedra_accel = shape_accel;
	var triacontahedra_starting_velocity = -triacontahedra_accel * triacontahedra_convergence_time / 2;
	var triacontahedra_dist = triacontahedra_starting_velocity * togetherness + 0.5 * triacontahedra_accel * togetherness * togetherness;
	if(togetherness < triacontahedra_convergence_time)
		triacontahedra_dist = 0;
	var triacontahedra_final_position = rhombohedron_h*3+Math.sqrt(3/10*(5+Math.sqrt(5)));
	triacontahedra_dist += triacontahedra_final_position;
	
	for(var i = 0; i < golden_triacontahedra.length; i++) {
		golden_triacontahedra[i].position.normalize();
		golden_triacontahedra[i].position.multiplyScalar(triacontahedra_dist);
	}
	if(togetherness > triacontahedra_startfadein_time)
		golden_triacontahedra[0].material.opacity = 0;
	else if(togetherness < triacontahedra_finishfadein_time)
		golden_triacontahedra[0].material.opacity = 1;
	else
		golden_triacontahedra[0].material.opacity = (togetherness - triacontahedra_startfadein_time) / (triacontahedra_finishfadein_time-triacontahedra_startfadein_time)
	golden_triacontahedra[0].children[0].material.opacity = golden_triacontahedra[0].material.opacity;
	
	
	
	
	var star_finishfadein_time = (star_convergence_time + star_startfadein_time ) / 2; 
	var star_accel = shape_accel;
	var star_starting_velocity = -star_accel * star_convergence_time / 2;
	var star_dist = star_starting_velocity * togetherness + 0.5 * star_accel * togetherness * togetherness;
	if(togetherness < star_convergence_time)
		star_dist = 0;
	var star_final_position = icosahedra_final_position * 2;	
	star_dist += star_final_position;
	
	for(var i = 0; i < golden_stars.length; i++) {
		golden_stars[i].position.normalize();
		golden_stars[i].position.multiplyScalar(star_dist);
	}
	if(togetherness > star_startfadein_time)
		golden_stars[0].children[0].material.opacity = 0;
	else if(togetherness < star_finishfadein_time)
		golden_stars[0].children[0].material.opacity = 1;
	else
		golden_stars[0].children[0].material.opacity = (togetherness - star_startfadein_time) / (star_finishfadein_time-star_startfadein_time)
	golden_stars[0].children[0].children[0].material.opacity = golden_stars[0].children[0].material.opacity;
}

function clamp(val, minval){
	if( val > minval) return val;
	else return minval;
}

var rhombohedron_r = 4/Math.sqrt(10+2*Math.sqrt(5))/Math.sqrt(3);
var rhombohedron_s = rhombohedron_r * HS3;
var rhombohedron_h = Math.sqrt(1-rhombohedron_r*rhombohedron_r);

//long axis points down long diagonal, short axis from the center to a vertex. Short axis we think of as y, long as z.
function fill_buffer_with_rhombohedron(long_axis, short_axis,array){
	var x_axis = short_axis.clone(); 
	x_axis.cross(long_axis);
	long_axis.normalize();
	short_axis.normalize();
	x_axis.normalize();
	
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

//the triaconta requires that we actually be point along a 3-fold
function orient_piece(vector_to_point_down, vector_to_line_up_with, myobject){
	var first_rotation_axis = new THREE.Vector3(0,0,1);
	var first_rotation_angle = Math.acos(vector_to_point_down.dot(first_rotation_axis));
	first_rotation_axis.cross(vector_to_point_down);
	first_rotation_axis.normalize();
	var first_rotation_quaternion = new THREE.Quaternion();
	myobject.rotateOnAxis( first_rotation_axis, first_rotation_angle );
	myobject.updateMatrixWorld();
	
	var corner_to_origin = vector_to_point_down.clone();
	corner_to_origin.negate();
	var corner_spindle = vector_to_line_up_with.clone();
	corner_spindle.cross(corner_to_origin);
	var desired_object_Y = corner_to_origin.clone();
	desired_object_Y.cross(corner_spindle);
	myobject.worldToLocal(desired_object_Y);
	
	var Y = new THREE.Vector3(0,1,0); //of course this isn't at a right angle to cornertoorigin
	var second_rotation_axis = desired_object_Y.clone();
	second_rotation_axis.cross(Y);
	second_rotation_axis.normalize();
	var second_rotation_angle = Math.acos(desired_object_Y.dot(Y) / desired_object_Y.length());

	myobject.rotateOnAxis( second_rotation_axis, -second_rotation_angle );
	
	var displacement_vec = vector_to_point_down.clone();
	displacement_vec.normalize();
	myobject.position.copy(displacement_vec);
	myobject.updateMatrixWorld();
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
	virtual_dodecahedron_vertices[14] = new THREE.Vector3( PHI,0,-1/PHI); //problem with triacontahedra...
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
	virtual_icosahedron_axis = new THREE.Vector3(0,0,1);
	for(var i = 0; i < virtual_icosahedron_vertices.length; i++) {
		virtual_icosahedron_vertices[i].applyAxisAngle(virtual_icosahedron_axis, TAU/4);
		virtual_icosahedron_vertices[i].normalize();
	}
	
	var quasicrystalmaterial_line = new THREE.LineBasicMaterial({
		size: 0.065,
		color: 0x0000ff
	});
	var rhombohedron_material = new THREE.MeshBasicMaterial({ //could make lambert if this doesn't work
		color: 0xD56252,
		//shading: THREE.FlatShading, //light sources didn't seem to do anything
		side:THREE.DoubleSide,
		transparent: true
	});
	var star_material = rhombohedron_material.clone();
	var goldenico_material = new THREE.MeshBasicMaterial({ //could make lambert if this doesn't work
		color: 0x6ADEFF,
		//shading: THREE.FlatShading, //light sources didn't seem to do anything
		side:THREE.DoubleSide,
		transparent: true
	});
	var triacontahedron_material = new THREE.MeshBasicMaterial({ //could make lambert if this doesn't work
		color: 0xAC83FF,
		//shading: THREE.FlatShading, //light sources didn't seem to do anything
		side:THREE.DoubleSide,
		transparent: true
	});
	var shapes_edgesmaterial = new THREE.MeshBasicMaterial({color:0x000000,side:THREE.DoubleSide,transparent:true});
	
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
		
		var golden_rhombohedra_edgematerial = shapes_edgesmaterial.clone();
		
		for( var i = 0; i < golden_rhombohedra.length; i++) { 
			golden_rhombohedra[i] = new THREE.Mesh( new THREE.BufferGeometry(), rhombohedron_material );
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
				
				mycylinder = new THREE.Mesh( mycylinder_geometry, golden_rhombohedra_edgematerial );
				THREE.SceneUtils.attach(mycylinder, scene, golden_rhombohedra[i]);
			}
			
			var dodecahedron_edge = virtual_dodecahedron_vertices[(i+1)%20].clone();
			dodecahedron_edge.sub(virtual_dodecahedron_vertices[i]);

			orient_piece(virtual_dodecahedron_vertices[i], dodecahedron_edge, golden_rhombohedra[i]);
		}
		
		golden_stars[0] = new THREE.Object3D();
		var golden_star_edgesmaterial = shapes_edgesmaterial.clone();
		for(var j = 0; j<golden_rhombohedra.length; j++) {
			var myrhomb = golden_rhombohedra[j].clone();
			myrhomb.material = star_material;
			for(k = 0; k <myrhomb.children.length; k++)
				myrhomb.children[k].material = golden_star_edgesmaterial;
			myrhomb.position.normalize();
			myrhomb.position.multiplyScalar(1.2);
			myrhomb.updateMatrixWorld();
			
			THREE.SceneUtils.attach(myrhomb, scene, golden_stars[0]);
		}
		for(var i = 1; i<golden_stars.length; i++)
			golden_stars[i] = golden_stars[0].clone();
		for(var i = 0; i<golden_stars.length; i++){
			golden_stars[i].position.copy(virtual_icosahedron_vertices[i]);
	   		golden_stars[i].position.multiplyScalar(10);
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
		
		//we actually want the threefold axis to rule
		var corner1 = new THREE.Vector3(triacontahedron_vertices_numbers[0],triacontahedron_vertices_numbers[1],triacontahedron_vertices_numbers[2]);
		var corner2 = new THREE.Vector3(triacontahedron_vertices_numbers[3],triacontahedron_vertices_numbers[4],triacontahedron_vertices_numbers[5]);
		var rotationaxis = corner1.clone();
		rotationaxis.cross(corner2);
		rotationaxis.normalize();
		var rotationangle = Math.acos(corner1.dot(corner2) / corner1.length() / corner2.length());
		for(var i = 0; i < triacontahedron_vertices_numbers.length / 3; i++){
			corner = new THREE.Vector3(triacontahedron_vertices_numbers[i*3+0],triacontahedron_vertices_numbers[i*3+1],triacontahedron_vertices_numbers[i*3+2]);
			corner.applyAxisAngle(rotationaxis,-rotationangle);
			triacontahedron_vertices_numbers[i*3+0] = corner.x;
			triacontahedron_vertices_numbers[i*3+1] = corner.y;
			triacontahedron_vertices_numbers[i*3+2] = corner.z;
		}	
		
//		var virtual_dodeca_rotation_axis = new THREE.Vector3(0,0,-1);
//		for(var i = 0; i<virtual_dodecahedron_vertices.length; i++)
//			virtual_dodecahedron_vertices[i].applyAxisAngle(virtual_dodeca_rotation_axis, TAU / 4);
		
		var golden_triacontahedra_edgematerial = shapes_edgesmaterial.clone();
		for( var i = 0; i < golden_triacontahedra.length; i++) { 
			golden_triacontahedra[i] = new THREE.Mesh( new THREE.BufferGeometry(), triacontahedron_material );
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
				
				mycylinder = new THREE.Mesh( mycylinder_geometry, golden_triacontahedra_edgematerial );
				THREE.SceneUtils.attach(mycylinder, scene, golden_triacontahedra[i]);
			}
			
			var dodecahedron_edge;
			if(i==13)
				dodecahedron_edge = virtual_dodecahedron_vertices[12].clone(); //TODO this is a hack
			else
				dodecahedron_edge = virtual_dodecahedron_vertices[(i+1)%20].clone();
			dodecahedron_edge.sub(virtual_dodecahedron_vertices[i]);
			
			orient_piece(virtual_dodecahedron_vertices[i], dodecahedron_edge, golden_triacontahedra[i]);
		}
		
//		var virtual_dodeca_rotation_axis = new THREE.Vector3(0,0,-1);
//		for(var i = 0; i<virtual_dodecahedron_vertices.length; i++)
//			virtual_dodecahedron_vertices[i].applyAxisAngle(virtual_dodeca_rotation_axis, -TAU / 4);
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
	   	goldenico_vertices_numbers[21*3+0] = 0;
	   	goldenico_vertices_numbers[21*3+1] = 0;
	   	goldenico_vertices_numbers[21*3+2] = -2.5*h;
	   	assign_goldenico_vertices(0,triacontahedron_r,													1,	1.5*h,	goldenico_vertices_numbers);
	   	assign_goldenico_vertices(-Math.sin(TAU/10)*PHI*triacontahedron_r, PHI*PHI/2*triacontahedron_r,	6,	h/2,	goldenico_vertices_numbers);
	   	
	   	var goldenicos_edgematerial = shapes_edgesmaterial.clone();
	   	
	   	for( var i = 0; i < goldenicos.length; i++) { 
	   		goldenicos[i] = new THREE.Mesh( new THREE.BufferGeometry(), goldenico_material );
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
				
				mycylinder = new THREE.Mesh( mycylinder_geometry, goldenicos_edgematerial );
				THREE.SceneUtils.attach(mycylinder, scene, goldenicos[i]);
			}
	   		
	   		var icosahedron_edge;
	   		if(i>9)
	   			icosahedron_edge = virtual_icosahedron_vertices[i-1].clone();
	   		else
	   			icosahedron_edge = virtual_icosahedron_vertices[(i+1)%12].clone();
	   		icosahedron_edge.sub(virtual_icosahedron_vertices[i]);
	   		icosahedron_edge.negate();
	   		
	   		orient_piece(virtual_icosahedron_vertices[i], icosahedron_edge, goldenicos[i]);
	   	}
	   	
	   	rotated_icos[0] = goldenicos[0].clone();
	   	//rotated_icos[0].position.x = 0;rotated_icos[0].position.y = 0;rotated_icos[0].position.z = 0;
	   	
//	   	rotated_icos[0] = new THREE.Object3D();
//		var golden_star_edgesmaterial = shapes_edgesmaterial.clone();
//		for(var j = 0; j<golden_rhombohedra.length; j++) {
//			var myrhomb = golden_rhombohedra[j].clone();
//			myrhomb.material = star_material;
//			for(k = 0; k <myrhomb.children.length; k++)
//				myrhomb.children[k].material = golden_star_edgesmaterial;
//			myrhomb.position.normalize();
//			myrhomb.position.multiplyScalar(1.2);
//			myrhomb.updateMatrixWorld();
//			
//			THREE.SceneUtils.attach(myrhomb, scene, rotated_icos[0]);
//		}
//		for(var i = 1; i<rotated_icos.length; i++)
//			rotated_icos[i] = rotated_icos[0].clone();
//		for(var i = 0; i<rotated_icos.length; i++){
//			rotated_icos[i].position.copy(virtual_icosahedron_vertices[i]);
//	   		rotated_icos[i].position.multiplyScalar(10);
//		}
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