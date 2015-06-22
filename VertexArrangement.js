function tetrahedron_top(P1,P2,P3, r1,r2,r3) {
	P3.sub(P1);
	P2.sub(P1);
	var P3_P2_angle = Math.acos(P3.dot(P2)/P2.length()/P3.length());
	
	var P1_t = new THREE.Vector3(0,0,0);
	var P2_t = new THREE.Vector3(P2.length(),0,0);
	var P3_t = new THREE.Vector3(P3.length() * Math.cos(P3_P2_angle), P3.length() * Math.sin(P3_P2_angle),0);
	
	var cp_t = new THREE.Vector3(0,0,0);
	cp_t.x = ( r1*r1 - r2*r2 + P2_t.x * P2_t.x ) / ( 2 * P2_t.x );
	cp_t.y = ( r1*r1 - r3*r3 + P3_t.x * P3_t.x + P3_t.y * P3_t.y ) / ( P3_t.y * 2 ) - ( P3_t.x / P3_t.y ) * cp_t.x;
	if(r1*r1 - cp_t.x*cp_t.x - cp_t.y*cp_t.y < 0) {
		//console.log("Impossible tetrahedron");
		return false;			
	}
	cp_t.z = Math.sqrt(r1*r1 - cp_t.x*cp_t.x - cp_t.y*cp_t.y);
	
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
	
	return cp;
}

function update_movementzone() {
	//we have an array of 20 points, paired in 10 line segments.
	
	//jiminy, you might have to put limitations on relating to the associated vertex as well
	
	//you're going to have to rotate the whole thing to stick on to the edge that is stuck in place.
	
	var max_movementzone = Array(20); //
	
	//we get the V diagram stuff, our basis
	for( var i = 0; i<10; i++) {
		V_index = i + Math.floor(i/2); //want it so that there are no numbers congruent to 2 mod 3 in there, so we're on the outside.
		vertex_index = V_vertex_indices[CORE][vertex_tobechanged][V_index];
		
		max_movementzone[ i * 2 + 0 ] = flatnet_vertices.array[vertex_index * 3 + 0];
		max_movementzone[ i * 2 + 1 ] = flatnet_vertices.array[vertex_index * 3 + 1];
	}
	
	var line_is_fixed = Array(10);
	for(var i = 0; i < 10; i++)
		line_is_fixed[i] = 0;
	
	for( var i = 0; i < 5; i++) {
		var this_side = new THREE.Vector2(	max_movementzone[(i)*4+2 + 0] - max_movementzone[i*4 + 0],
											max_movementzone[(i)*4+2 + 1] - max_movementzone[i*4 + 1]);
		var next_side = new THREE.Vector2(	max_movementzone[(i+1)*4+2 + 0] - max_movementzone[i*4 + 0],
											max_movementzone[(i)*4+2 + 1] - max_movementzone[i*4 + 1]);
										
		var mintheta = ( V_angles[vertex_tobechanged][i] - polyhedron_angle ) / 2;
										
		var line_point1 = new THREE.Vector2( max_movementzone[i*4+2 + 0], max_movementzone[i*4+2 + 1] );		
		var line_point2 = vector_from_bearing(ourside, 1, mintheta);
		
		//intersect it with the polygon. If it doesn't intersect the polygon put the points on the same point
		
		ourside.negate();
		
		var line_point1 = new THREE.Vector2( max_movementzone[i*4 + 0], max_movementzone[i*4 + 1] );		
		var line_point2 = vector_from_bearing(ourside, 1, someothertheta);
	}
	
	//gamefeel idea: if you pull far on the vertex and it's against the wall of the movementzone, the whole net will be pulled slightly in the direction you pull
	//also make it vibrate maybe
	
	//initialize them to the positions of the points on the net surrounding the vertex
	//Hmm, or rather, to the places they would be if the net weren't split up
	
	
	//create line, check which line segments it cuts
	//it should cut at least, and maybe most, two line segments, so the points on the ends that it cuts off can go to make the new corners.
	//check all points to see if they're to the right of the line. If not, move them to one of the new corners
	//no, you can't predict it like that, when you slice off a corner you increase the number of corners in that area by 1. vertices won't be in order.
	
	
	
	//LEEEEEET's just turn off everything except keeping identified edge lengths the same and see what happens
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
		
		var P1_index = V_vertex_indices[Vmode][initial_changed_vertex][6];
		var P2_index = V_vertex_indices[Vmode][initial_changed_vertex][10]; //P2 could also be 9.
		var P3_index = V_vertex_indices[Vmode][initial_changed_vertex][3];
		var P4_index = V_vertex_indices[Vmode][initial_changed_vertex][7];
		
		//it's triangle 1 and 2 (array indices) in the V diagram		
		var P1_side_net = new THREE.Vector3(
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][8] * 3 + 0]	-	flatnet_vertices.array[P1_index * 3 + 0],
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][8] * 3 + 1]	-	flatnet_vertices.array[P1_index * 3 + 1],
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][8] * 3 + 2]	-	flatnet_vertices.array[P1_index * 3 + 2] );
		var P2_side_net = new THREE.Vector3(
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][11] * 3 + 0]	-	flatnet_vertices.array[P2_index * 3 + 0],
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][11] * 3 + 1]	-	flatnet_vertices.array[P2_index * 3 + 1],
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][11] * 3 + 2]	-	flatnet_vertices.array[P2_index * 3 + 2] );
		var P3_side_net = new THREE.Vector3(
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][5] * 3 + 0]	-	flatnet_vertices.array[P3_index * 3 + 0],
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][5] * 3 + 1]	-	flatnet_vertices.array[P3_index * 3 + 1],
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][5] * 3 + 2]	-	flatnet_vertices.array[P3_index * 3 + 2] );
		var P4_side_net = new THREE.Vector3(
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][8] * 3 + 0]	-	flatnet_vertices.array[P4_index * 3 + 0],
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][8] * 3 + 1]	-	flatnet_vertices.array[P4_index * 3 + 1],
			flatnet_vertices.array[V_vertex_indices[Vmode][initial_changed_vertex][8] * 3 + 2]	-	flatnet_vertices.array[P4_index * 3 + 2] );
			
		var r1 = P1_side_net.length();
		var r2 = P2_side_net.length();
		var r3 = P3_side_net.length();
		var r4 = P4_side_net.length();
		
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
		var P4 = new THREE.Vector3(
			polyhedron_vertices.array[P4_index * 3 + 0],
			polyhedron_vertices.array[P4_index * 3 + 1],
			polyhedron_vertices.array[P4_index * 3 + 2] );
		
		var cp_without_4 = tetrahedron_top(P1,P2,P3, r1,r2,r3).clone();
		var cp_without_1 = tetrahedron_top(P2,P3,P4, r2,r3,r4).clone();
		var tetrahedron_wiggle_room = 0.01;
		if( !cp_without_4 || !cp_without_1 || cp_without_4.distanceTo(cp_without_1) > tetrahedron_wiggle_room) {
			var discrepancy_percentage = cp_without_4.distanceTo(cp_without_1) / ((r1+r4)/2) * 100;
			discrepancy_percentage = Math.floor(discrepancy_percentage * 10) / 10;
			//console.log("difficulty folding: tetrahedra off by " + discrepancy_percentage + "%");
			return false;
		}
		cp_without_1.lerp(cp_without_4, 0.5);
		
		for( var i = 0; i < 22; i++) {
			if(vertex_identifications[vertex_tobechanged][i]) {
				polyhedron_vertices.array[i * 3 + 0] = cp_without_1.x;
				polyhedron_vertices.array[i * 3 + 1] = cp_without_1.y;
				polyhedron_vertices.array[i * 3 + 2] = cp_without_1.z;
			}
		}
	}
	
	polyhedron_vertices.needsUpdate = true;
	
	//minimum angles
	{
		for( var d_index = 0; d_index < 22; d_index++) { //22*3?
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
			a_to_b.normalize();
			
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
	
	return true;
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
	
	for( var i = 0; i < 4; i++ ) {
		var W_index = 0;
		
		if(initial_changed_vertex === vertex_tobechanged)
			W_index = (i+5)%6;
		else
			W_index = i+2;
		
		V_angles[vertex_tobechanged][i] = TAU * 5/6 - W_surrounding_angles[W_index] - V_angles_subtraction[i];
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
			imposed_angle = angle_to_use - V_angles[vertex_tobechanged][ triangle_to_use ];
		else
			imposed_angle = V_angles[vertex_tobechanged][triangle_to_use-1] - angle_to_use;
		
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
	var cornerAindex = 666, cornerBindex = 666;
	for( var i = 0; i < 3; i++) {
		if( corner_vertex_index === net_triangle_vertex_indices[ triangle_index * 3 + i ]) {
			cornerAindex = net_triangle_vertex_indices[ triangle_index * 3 + (i+1)%3 ];
			cornerBindex = net_triangle_vertex_indices[ triangle_index * 3 + (i+2)%3 ];			
			break;
		}
		
		if( i === 2 ) {
			console.log("error: request was made for a triangle-angle at a corner that the triangle does not have");
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

function squash_mouse(vertex_tobechanged ) {
	var using_right_side = 0;
	if(V_squasher[vertex_tobechanged][6] === 666 )
		using_right_side = 1;
	
	var vertex_tobechanged_vector = new THREE.Vector2(
		flatnet_vertices.array[ 0 + 3 * vertex_tobechanged ],
		flatnet_vertices.array[ 1 + 3 * vertex_tobechanged ] );
	
	var angleA = corner_angle_from_indices(V_squasher[vertex_tobechanged][1], V_squasher[vertex_tobechanged][3]);
	var angleB = corner_angle_from_indices(V_squasher[vertex_tobechanged][2], V_squasher[vertex_tobechanged][4]);
	
	var side_to_locus_angle = TAU*5/12 - angleA - angleB;
	if( using_right_side ) side_to_locus_angle = corner_angle_from_indices(V_squasher[vertex_tobechanged][0], V_squasher[vertex_tobechanged][5]) - side_to_locus_angle;
	
	var side = new THREE.Vector2(
		flatnet_vertices.array[ 0 + 3 * V_squasher[vertex_tobechanged][6+using_right_side] ],
		flatnet_vertices.array[ 1 + 3 * V_squasher[vertex_tobechanged][6+using_right_side] ] );
	side.sub(vertex_tobechanged_vector);
	side.negate();
		
	var locus_unit_vector = vector_from_bearing(side, 1, -side_to_locus_angle * ( 1 - 2*using_right_side) );
	
	var MousePosition_relative = MousePosition.clone();
	MousePosition_relative.x += 5; //coz that's where the net is
	MousePosition_relative.sub(vertex_tobechanged_vector);
		
	var projected_position = locus_unit_vector.clone();
	projected_position.multiplyScalar( MousePosition_relative.dot(locus_unit_vector) );
	projected_position.add(vertex_tobechanged_vector);
	
	return projected_position;
}

function HandleVertexRearrangement() {
	var movement_vector = new THREE.Vector2(0,0);
	if( InputObject.isMouseDown && !LatticeGrabbed ) {
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
	
	// if(		!correct_defects()
		 // ||	!update_polyhedron(vertex_tobechanged, vertex_tobechanged)
		 // ||	!update_polyhedron(right_defect_index, vertex_tobechanged)
		// ) {
		// for( var i = 0; i < 66; i++)
			// flatnet_vertices.array[i] = net_log[i];
		// return;
	// }
	// compare_polyhedron_with_net();
}