function correct_defects() {
	for( var corner = 0; corner < 22; corner++) {
		var angular_defect = 0;
		for( var triangle = 0; triangle < 20; triangle++) {
			for(var triangle_corner = 0; triangle_corner < 3; triangle_corner++) {
				actual_index = net_triangle_vertex_indices[ triangle * 3 + triangle_corner];
				if( vertex_identifications[corner][actual_index] !== 0) {
					angular_defect += corner_angle_from_indices(triangle, actual_index);
				}
			}
		}
		
		var wiggleroom = 0.00001;
		if( Math.abs( angular_defect - TAU * 5/6 ) > wiggleroom ) {
			var error = angular_defect - TAU * 5/6;
			console.log( "Warning: defect at net vertex " + corner + " off by " + error);
			return 0;
		}
	}
	return 1;
}

//we're going to assume the net is sorted.
function update_polyhedron(vertex_tobechanged, initial_changed_vertex) {
	//update that one vertex
	{
		var Vmode;
		if( initial_changed_vertex === vertex_tobechanged)
			Vmode = CORE;
		else
			Vmode = ASSOCIATED;
		
		var P1_index = V_vertex_indices[Vmode][initial_changed_vertex][4];
		var P2_index = V_vertex_indices[Vmode][initial_changed_vertex][7];
		var P3_index = V_vertex_indices[Vmode][initial_changed_vertex][3];
		
		//it's triangle 1 and 2 (array indices) in the V diagram		
		var P1_side_net = new THREE.Vector3(
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][5] * 3 + 0]	-	flatnet_vertices.array[P1_index * 3 + 0],
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][5] * 3 + 1]	-	flatnet_vertices.array[P1_index * 3 + 1],
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][5] * 3 + 2]	-	flatnet_vertices.array[P1_index * 3 + 2] );
		var P2_side_net = new THREE.Vector3(
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][8] * 3 + 0]	-	flatnet_vertices.array[P2_index * 3 + 0],
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][8] * 3 + 1]	-	flatnet_vertices.array[P2_index * 3 + 1],
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][8] * 3 + 2]	-	flatnet_vertices.array[P2_index * 3 + 2] );
		var P3_side_net = new THREE.Vector3(
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][5] * 3 + 0]	-	flatnet_vertices.array[P3_index * 3 + 0],
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][5] * 3 + 1]	-	flatnet_vertices.array[P3_index * 3 + 1],
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][5] * 3 + 2]	-	flatnet_vertices.array[P3_index * 3 + 2] );
			
		var r1 = P1_side_net.length();
		var r2 = P2_side_net.length();
		var r3 = P3_side_net.length();
		
		var P1 = new THREE.Vector3(
			polyhedron_vertices.array[P1_index * 3 + 0],
			polyhedron_vertices.array[P1_index * 3 + 1],
			polyhedron_vertices.array[P1_index * 3 + 2] );
		var P2 = new THREE.Vector3(
			polyhedron_vertices.array[P2_index * 3 + 0],
			polyhedron_vertices.array[P2_index * 3 + 1],
			polyhedron_vertices.array[P2_index * 3 + 2] );
		var P3 = new THREE.Vector3(
			polyhedron_vertices.array[P3_index * 3 + 0],
			polyhedron_vertices.array[P3_index * 3 + 1],
			polyhedron_vertices.array[P3_index * 3 + 2] );
			
		P3.sub(P1);
		P2.sub(P1);
		var P3_P2_angle = Math.acos(P3.dot(P2)/P2.length()/P3.length());
		
		var P1_t = new THREE.Vector3(0,0,0); //r1
		var P2_t = new THREE.Vector3(P2.length(),0,0); //r2
		var P3_t = new THREE.Vector3(P3.length() * Math.cos(P3_P2_angle), P3.length() * Math.sin(P3_P2_angle),0);
		
		var cp_t = new THREE.Vector3();
		cp_t.x = ( r1*r1 - r2*r2 + P2_t.x * P2_t.x ) / ( 2 * P2_t.x );
		cp_t.y = ( r1*r1 - r3*r3 + P3_t.x * P3_t.x + P3_t.y * P3_t.y ) / ( P3_t.y * 2 ) - ( P3_t.x / P3_t.y ) * cp_t.x;
		cp_t.z = Math.sqrt(r1*r1 - cp_t.x*cp_t.x - cp_t.y*cp_t.y);
		//console.log(cp_t);
		
		//console.log(cp_t.distanceTo(P1_t) - r1, cp_t.distanceTo(P2_t) - r2, cp_t.distanceTo(P3_t) - r3);
		//console.log(cp_t.distanceTo(P3_t) - r3);
		
		var cp = new THREE.Vector3(0,0,0);
		
		var z_direction = new THREE.Vector3();
		z_direction.crossVectors(P2,P3);
		z_direction.normalize();
		z_direction.multiplyScalar(cp_t.z);
		cp.add(z_direction);
		
		var x_direction = P2.clone();
		x_direction.normalize();
		x_direction.multiplyScalar(cp_t.x);
		cp.add(x_direction);
		
		var y_direction = new THREE.Vector3();
		y_direction.crossVectors(z_direction,x_direction);
		y_direction.normalize();
		y_direction.multiplyScalar(cp_t.y);
		cp.add(y_direction);
		
		cp.add(P1);
		
		P2.add(P1);
		P3.add(P1);
		//console.log(cp.distanceTo(P3) - r3,cp.distanceTo(P2) - r2,cp.distanceTo(P1) - r1);
		
		var P4_index = V_vertex_indices[Vmode][initial_changed_vertex][10];	
		var P4_side_net = new THREE.Vector3(
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][11] * 3 + 0]	-	flatnet_vertices.array[P4_index * 3 + 0],
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][11] * 3 + 1]	-	flatnet_vertices.array[P4_index * 3 + 1],
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][11] * 3 + 2]	-	flatnet_vertices.array[P4_index * 3 + 2] );
		var P4 = new THREE.Vector3(
			polyhedron_vertices.array[P4_index * 3 + 0],
			polyhedron_vertices.array[P4_index * 3 + 1],
			polyhedron_vertices.array[P4_index * 3 + 2] );
		//console.log(cp.distanceTo(P4) - P4_side_net.length());
		
		//there's a lot not working here
		//One possible option is to use different vertices around the V diagram, as it's possible that having a bunch too close together makes a small difference(not a big one though, don't get your hopes up)
		
		for( var i = 0; i < 22; i++) {
			if(vertex_identifications[vertex_tobechanged][i]) {
				polyhedron_vertices.array[i * 3 + 0] = cp.x;
				polyhedron_vertices.array[i * 3 + 1] = cp.y;
				polyhedron_vertices.array[i * 3 + 2] = cp.z;
			}
		}
		
		//if(Vmode === ASSOCIATED && !(cp.x < 1000)) console.log(); //there *appears* to be a problem with moving vertex 0 towards vertex 14. Also minimum angles are screwed.
		
		//console.log(ap_to_cp.length() - left_sidelength, bp_to_cp.length() - right_sidelength); //cp is fine, ap and bp get pretty bad
		//an idea: get the triangles from the net, compare them to the triangles on the polyhedron
		//make sure left_sidelength and right_sidelength accord!
	}
	
	polyhedron_vertices.needsUpdate = true;
	
	//now we need to get the minimum angles
	{
		for( var d_index = 3; d_index < 22; d_index++) {
			var theta = minimum_angles[i] + capsidopenness * (TAU/2 - minimum_angles[i]);
			
			var a_index = vertices_derivations[d_index][0];
			var b_index = vertices_derivations[d_index][1];
			var c_index = vertices_derivations[d_index][2];
			
			var a_p = new THREE.Vector3(
				polyhedron_vertices.array[a_index * 3 + 0],
				polyhedron_vertices.array[a_index * 3 + 1],
				polyhedron_vertices.array[a_index * 3 + 2] );
			var b_p = new THREE.Vector3(
				polyhedron_vertices.array[b_index * 3 + 0],
				polyhedron_vertices.array[b_index * 3 + 1],
				polyhedron_vertices.array[b_index * 3 + 2] );
			var c_p = new THREE.Vector3(
				polyhedron_vertices.array[c_index * 3 + 0],
				polyhedron_vertices.array[c_index * 3 + 1],
				polyhedron_vertices.array[c_index * 3 + 2] );
			var d_p = new THREE.Vector3(
				polyhedron_vertices.array[d_index * 3 + 0],
				polyhedron_vertices.array[d_index * 3 + 1],
				polyhedron_vertices.array[d_index * 3 + 2] );
				
			var a_to_b = new THREE.Vector3();
			a_to_b.subVectors(b_p,a_p);
			
			var c_a = new THREE.Vector3();
			var d_a = new THREE.Vector3();
			c_a.subVectors(c_p,a_p);
			d_a.subVectors(d_p,a_p);
			
			var c_hinge_origin = c_a.clone();
			var d_hinge_origin = d_a.clone();			
			d_hinge_origin.projectOnVector(a_to_b);
			c_hinge_origin.projectOnVector(a_to_b);
			
			var d_hinge = new THREE.Vector3();
			var c_hinge = new THREE.Vector3();
			d_hinge.subVectors(d_a,d_hinge_origin);
			c_hinge.subVectors(c_a,c_hinge_origin);
			
			minimum_angles[d_index] = Math.acos( d_hinge.dot(c_hinge) / c_hinge.length() / d_hinge.length() );
		}
	}
}

function move_vertices(vertex_tobechanged, starting_movement_vector, initial_changed_vertex)
{
	var V_angles_subtraction = Array(0,0,0,0);
	if(initial_changed_vertex === vertex_tobechanged) {
		V_angles_subtraction[0] = corner_angle_from_indices( W_triangle_indices[initial_changed_vertex][ 5 ], W_vertex_indices[initial_changed_vertex][11] );
		V_angles_subtraction[3] = corner_angle_from_indices( W_triangle_indices[initial_changed_vertex][ 3 ], W_vertex_indices[initial_changed_vertex][6] );
		
		Vmode = CORE;
	}
	else {
		V_angles_subtraction[0]= corner_angle_from_indices( W_triangle_indices[initial_changed_vertex][ 2 ], W_vertex_indices[initial_changed_vertex][5] );
		V_angles_subtraction[3] = corner_angle_from_indices( W_triangle_indices[initial_changed_vertex][ 0 ], W_vertex_indices[initial_changed_vertex][0] );
		
		Vmode = ASSOCIATED;
	}
	
	var V_angles = Array(0,0,0,0);
	for( var i = 0; i < 4; i++ ) {
		var W_index = 0;
		
		if(initial_changed_vertex === vertex_tobechanged)
			W_index = (i+5)%6;
		else
			W_index = i+2;
		
		V_angles[i] = TAU * 5/6 - W_surrounding_angles[W_index] - V_angles_subtraction[i];
	}
	
	flatnet_vertices.array[vertex_tobechanged * 3 + 0 ] += starting_movement_vector.x;
	flatnet_vertices.array[vertex_tobechanged * 3 + 1 ] += starting_movement_vector.y;
	
	var triangle_done = [0,0,0,0,0];
	
	//tick off the triangle(s) we've started with
	for( var i = 0; i < 5; i++ ) {
		var triangle_tobechecked = V_triangle_indices[Vmode][initial_changed_vertex][i];
		for( var j = 0; j < 3; j++ ) {
			if( net_triangle_vertex_indices[ triangle_tobechecked * 3 + j ] === vertex_tobechanged ) {
				triangle_done[i] = 1;
			}
		}
	}
	if( triangle_done[0] + triangle_done[1] + triangle_done[2] + triangle_done[3] + triangle_done[4] === 0 )
		console.log( "error: attempted to adjust triangles without any basis" );
	
	//we're going to go around until it's done
	while( triangle_done[0] + triangle_done[1] + triangle_done[2] + triangle_done[3] + triangle_done[4] !== 5) {
		var triangle_to_use;
		var triangle_to_fix; //note that these are entries in the "V vertices" array. The ACTUAL indices will come later.
		for( var i = 0; i < 4; i++) {
			if( triangle_done[i] && !triangle_done[i+1] ) {
				triangle_to_use = i;
				triangle_to_fix = i+1;
				break;
			}
			else if( triangle_done[i] === 0 && triangle_done[i+1] === 1) {
				triangle_to_use = i+1;
				triangle_to_fix = i;
				break;
			}
		}
		
		var vertex_to_use_index = V_vertex_indices[Vmode][initial_changed_vertex][triangle_to_use * 3 + 2];
		var vertex_to_fix_index = V_vertex_indices[Vmode][initial_changed_vertex][triangle_to_fix * 3 + 2];
		
		var outside_vertex_to_use_index;
		var outside_vertex_to_fix_index;
		var outside_vertex_opposing_index;
		
		if( triangle_to_fix > triangle_to_use ) {
			outside_vertex_to_use_index = V_vertex_indices[Vmode][initial_changed_vertex][triangle_to_use * 3 + 1];
			outside_vertex_to_fix_index = V_vertex_indices[Vmode][initial_changed_vertex][triangle_to_fix * 3 + 0]; //because we ascend clockwise (apart from the center), they're just next to each other
			outside_vertex_opposing_index = V_vertex_indices[Vmode][initial_changed_vertex][triangle_to_fix * 3 + 1];
		}
		else {
			outside_vertex_to_use_index = V_vertex_indices[Vmode][initial_changed_vertex][triangle_to_use * 3 + 0];
			outside_vertex_to_fix_index = V_vertex_indices[Vmode][initial_changed_vertex][triangle_to_fix * 3 + 1]; //because we ascend anticlockwise
			outside_vertex_opposing_index = V_vertex_indices[Vmode][initial_changed_vertex][triangle_to_fix * 3 + 0];			
		}
		
		var vertex_to_use = new THREE.Vector2(
			flatnet_vertices.array[vertex_to_use_index * 3 + 0 ],
			flatnet_vertices.array[vertex_to_use_index * 3 + 1 ] );
		var vertex_to_fix = new THREE.Vector2(
			flatnet_vertices.array[vertex_to_fix_index * 3 + 0 ],
			flatnet_vertices.array[vertex_to_fix_index * 3 + 1 ] );		
		
		var outside_vertex_to_use = new THREE.Vector2(
			flatnet_vertices.array[outside_vertex_to_use_index * 3 + 0 ],
			flatnet_vertices.array[outside_vertex_to_use_index * 3 + 1 ]);
		var outside_vertex_to_fix = new THREE.Vector2(
			flatnet_vertices.array[outside_vertex_to_fix_index * 3 + 0 ],
			flatnet_vertices.array[outside_vertex_to_fix_index * 3 + 1 ]);
		var outside_vertex_opposing = new THREE.Vector2(
			flatnet_vertices.array[outside_vertex_opposing_index * 3 + 0 ],
			flatnet_vertices.array[outside_vertex_opposing_index * 3 + 1 ]);
			
		var identified_edge_to_use = new THREE.Vector2();
		
		identified_edge_to_use.subVectors(outside_vertex_to_use, vertex_to_use);
		
		var angle_to_use = corner_angle_from_indices( V_triangle_indices[Vmode][initial_changed_vertex][ triangle_to_use ], outside_vertex_to_use_index );
		var imposed_angle;
		if( triangle_to_fix > triangle_to_use )
			imposed_angle = angle_to_use - V_angles[ triangle_to_use ];
		else
			imposed_angle = V_angles[triangle_to_use-1] - angle_to_use;
		
		var triangle_tofix_side = new THREE.Vector2(); //it'll be pointing toward outside_vertex_to_fix
		triangle_tofix_side.subVectors(outside_vertex_to_fix, outside_vertex_opposing );
		
		var final_edge = vector_from_bearing(triangle_tofix_side, identified_edge_to_use.length(), imposed_angle );
		final_edge.add(outside_vertex_to_fix);		
		
		flatnet_vertices.array[vertex_to_fix_index * 3 + 0 ] = final_edge.x;
		flatnet_vertices.array[vertex_to_fix_index * 3 + 1 ] = final_edge.y;
		
		triangle_done[triangle_to_fix] = 1;
		for( var i = 0; i < 5; i++ ) {
			triangle_mayhavebeendone = V_triangle_indices[Vmode][initial_changed_vertex][i];			
			for( var j = 0; j < 3; j++ ) {
				if( net_triangle_vertex_indices[ triangle_mayhavebeendone * 3 + j ] === vertex_to_fix_index ) {
					triangle_done[i] = 1;
				}
			}
		}
	}
	
	flatnet_vertices.needsUpdate = true;
}

function corner_angle_from_indices(triangle_index, corner_vertex_index) {
	var cornerAindex, cornerBindex;
	for( var i = 0; i < 3; i++) {
		if( corner_vertex_index === net_triangle_vertex_indices[ triangle_index * 3 + i ]) {
			cornerAindex = net_triangle_vertex_indices[ triangle_index * 3 + (i+1)%3 ];
			cornerBindex = net_triangle_vertex_indices[ triangle_index * 3 + (i+2)%3 ];			
			break;
		}
		
		if( i === 2 ) {
			console.log("Error: request was made for a triangle-angle at a corner that the triangle does not have");
			return 0;
		}
	}
	
	sideA = new THREE.Vector2( 
		flatnet_vertices.array[ 0 + 3 * cornerAindex ] - flatnet_vertices.array[ 0 + 3 * corner_vertex_index ],
		flatnet_vertices.array[ 1 + 3 * cornerAindex ] - flatnet_vertices.array[ 1 + 3 * corner_vertex_index ] );
	sideB = new THREE.Vector2( 
		flatnet_vertices.array[ 0 + 3 * cornerBindex ] - flatnet_vertices.array[ 0 + 3 * corner_vertex_index ],
		flatnet_vertices.array[ 1 + 3 * cornerBindex ] - flatnet_vertices.array[ 1 + 3 * corner_vertex_index ] );
		
	return Math.acos(get_cos( sideA, sideB) );
}

function update_surface() {
	for(var i = 0; i < 22*3; i++)
		surface_vertices.array[i] = flatnet_vertices.array[i];
	surface_vertices.needsUpdate = true;
}

function HandleVertexRearrangement() {
	var movement_vector = new THREE.Vector2(0,0);
	if( isMouseDown ) {
		if( vertex_tobechanged === 666) {
			var lowest_quadrance_so_far = 10;
			var closest_vertex_so_far = 666;
			for( var i = 0; i < 22; i++) {
				var quadrance = (flatnet_vertices.array[i*3+0] - (MousePosition.x+5)) * (flatnet_vertices.array[i*3+0] - (MousePosition.x+5))
								+ (flatnet_vertices.array[i*3+1] - MousePosition.y) * (flatnet_vertices.array[i*3+1] - MousePosition.y);
				if( quadrance < lowest_quadrance_so_far) {
					lowest_quadrance_so_far = quadrance;
					closest_vertex_so_far = i;
				}
			}
			
			var maximum_quadrance_to_be_selected = 0.005;
			if( lowest_quadrance_so_far < maximum_quadrance_to_be_selected) {
				vertex_tobechanged = closest_vertex_so_far;
			}
		}
		
		if( vertex_tobechanged !== 666) {
			movement_vector.x = (MousePosition.x+5) - flatnet_vertices.array[vertex_tobechanged * 3 + 0];
			movement_vector.y = MousePosition.y - flatnet_vertices.array[vertex_tobechanged * 3 + 1];
		}
	}
	else {		
		vertex_tobechanged = 666;
	}
	
	if( vertex_tobechanged === 666 || (movement_vector.x === 0 && movement_vector.y === 0) )
		return;
	
	//log the current positions
	var net_log = new Array(66);
	for( var i = 0; i < 66; i++)
		net_log[i] = flatnet_vertices.array[i];
	
	//preparation: get the angles surrounding the corners of the stitched-up W, which will remain constant
	for( var corner = 0; corner < 6; corner++ ) {
		W_surrounding_angles[corner] = 0;
		
		var corner_vertex_index = W_vertex_indices[vertex_tobechanged][ 2 + corner * 2 ];
		
		for( var triangle = 0; triangle < 20; triangle++ ) {
			var in_W_diagram = false;
			var in_V_diagram = false;
			var subtracting_vertex_index = 0;
			
			for(var k = 0; k < 8; k++ ) {
				if(triangle === W_triangle_indices[vertex_tobechanged][k])
					in_W_diagram = true;
			}		
			
			for( var j = 0; j < 5; j++ ){
				if( triangle === V_triangle_indices[CORE][corner_vertex_index][j] ) {
					in_V_diagram = true;
					subtracting_vertex_index = V_vertex_indices[CORE][corner_vertex_index][j*3+2];
				}
			}
			
			if( in_V_diagram && !in_W_diagram ) {
				W_surrounding_angles[corner] += corner_angle_from_indices(triangle, subtracting_vertex_index);
			}
		}
	}
	
	var ultimate_vector = new THREE.Vector2(0,0);
	var penultimate_vector;
	var prev_vector;
	var finalside_absolute;
	var origin_absolute;
	var ultimate_vector_absolute;
	
	for( var i = 0; i < 6; i++) {
		var corner1index = W_vertex_indices[vertex_tobechanged][ i * 2 + 0 ];
		var corner2index = W_vertex_indices[vertex_tobechanged][ i * 2 + 1 ];
		
		var corner1 = new THREE.Vector2( 
			flatnet_vertices.array[     3 * corner1index ],
			flatnet_vertices.array[ 1 + 3 * corner1index ] );
		var corner2 = new THREE.Vector2( 
			flatnet_vertices.array[     3 * corner2index ],
			flatnet_vertices.array[ 1 + 3 * corner2index ] );
			
		var side_Vector = corner2.clone();
		side_Vector.sub(corner1);
		var side_AdditionToUltimate;
		
		if(i===0)
			side_AdditionToUltimate = side_Vector.clone();
		else
			side_AdditionToUltimate = vector_from_bearing(prev_vector, side_Vector.length(), TAU*5/6 - W_surrounding_angles[i-1]);
		
		ultimate_vector.add(side_AdditionToUltimate);
		
		prev_vector = side_AdditionToUltimate.clone();
		
		if( i === 0 ) origin_absolute = corner1.clone();
		if( i === 4 ) penultimate_vector = ultimate_vector.clone();
		if( i === 5 ) finalside_absolute = side_Vector.clone(); //absolute in the sense of it being a side
		if( i === 5 ) ultimate_vector_absolute = corner2.clone();
	}
	//console.log(ultimate_vector); //the first arm is fine, at least
	
	move_vertices(vertex_tobechanged, movement_vector, vertex_tobechanged);
	
	var vertex_tobechanged_home_index = 666; //which is in the first triangle
	for(var i = 0; i < 22; i++) {
		if( vertex_identifications[vertex_tobechanged][i] ) {
			for( var j = 0; j < 3; j++ ) {
				ourtriangleindex = W_triangle_indices[vertex_tobechanged][0];
				if( net_triangle_vertex_indices[ ourtriangleindex * 3 + j ] === i) {
					vertex_tobechanged_home_index = i;
				}
			}
		}			
	}
	
	var left_defect = new THREE.Vector2(
		flatnet_vertices.array[ 3 * vertex_tobechanged_home_index + 0 ],
		flatnet_vertices.array[ 3 * vertex_tobechanged_home_index + 1 ] );
	left_defect.sub(origin_absolute);
	
	var nonexistant_corner = new THREE.Vector2(
		left_defect.x * 0.5 - HS3 * left_defect.y,
		left_defect.y * 0.5 + HS3 * left_defect.x);
	var right_defect = new THREE.Vector2(
		0.5 * (ultimate_vector.x - nonexistant_corner.x) + HS3 * (ultimate_vector.y - nonexistant_corner.y),
		0.5 * (ultimate_vector.y - nonexistant_corner.y) - HS3 * (ultimate_vector.x - nonexistant_corner.x));
	right_defect.add(nonexistant_corner);
	
	right_defect.sub(ultimate_vector);
	penultimate_vector.sub(ultimate_vector);
	
	var right_defect_anglefromside = get_angle(right_defect, penultimate_vector );
	
	var right_defect_absolute = vector_from_bearing(finalside_absolute, right_defect.length(), right_defect_anglefromside);
	right_defect_absolute.add(ultimate_vector_absolute);
	
	var right_defect_index = W_vertex_indices[vertex_tobechanged][ RIGHT_DEFECT ];
	
	var imposed_movement_vector = new THREE.Vector2(
		right_defect_absolute.x - flatnet_vertices.array[right_defect_index * 3 + 0 ],
		right_defect_absolute.y - flatnet_vertices.array[right_defect_index * 3 + 1 ]);
		
	move_vertices(right_defect_index, imposed_movement_vector, vertex_tobechanged);
	
	if(!correct_defects()) {
		for( var i = 0; i < 66; i++)
			flatnet_vertices.array[i] = net_log[i];
		return;
	}		
	
	update_polyhedron(vertex_tobechanged, vertex_tobechanged);
	update_polyhedron(right_defect_index, vertex_tobechanged);
}