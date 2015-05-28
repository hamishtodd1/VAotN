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
			console.log( "Error: defect at net vertex " + corner + " off by " + error);
			return 0;
		}
	}
	return 1;
}

//we're going to assume the net is sorted.
function update_polyhedron(vertex_tobechanged) {
	//update that one vertex
	{
		//it's triangle 1 and 2 (array indices) in the V diagram
		var o_index;
		var a_index;
		var b_index;
		
		var op = new THREE.Vector3(
			polyhedron_vertices.array[o_index * 3 + 0],
			polyhedron_vertices.array[o_index * 3 + 1],
			polyhedron_vertices.array[o_index * 3 + 2] );
		var ap = new THREE.Vector3(
			polyhedron_vertices.array[a_index * 3 + 0],
			polyhedron_vertices.array[a_index * 3 + 1],
			polyhedron_vertices.array[a_index * 3 + 2] );
		var bp = new THREE.Vector3(
			polyhedron_vertices.array[b_index * 3 + 0],
			polyhedron_vertices.array[b_index * 3 + 1],
			polyhedron_vertices.array[b_index * 3 + 2] );
			
		var right_sidelength = 666;
		var left_sidelength = 666; //something from the triangles on the V diagram
		
		var ap_to_bp = new THREE.Vector3();
		ap_to_bp.subVectors(bp,ap);
		crosslength = ap_to_bp.length();
		
		var ap_to_x1_length = (	Math.pow(left_sidelength, 2)
							  -	Math.pow(right_sidelength, 2)
							  + Math.pow(crosslength, 2) )
							  / (2*crosslength);
							  
		var x1 = new THREE.Vector3();
		var ap_to_x1 = ap_to_bp.clone();
		ap_to_x1.normalize();
		ap_to_x1.multiplyScalar(ap_to_x1_length);
		x1.addVectors(a_p, ap_to_x1);
		
		h1 = Math.sqrt(Math.pow(left_sidelength,2) + ap_to_x1_length);
		
		var xo = new THREE.Vector3();
		xo.subVectors(x1, op);
		
		var costheta =	( Math.pow( c_sidelength, 2)
						- Math.pow(h1, 2)
						- Math.pow(xo.length()) )
						/ (2*h1*xo.length());
		
		var x2_subtraction = xo.clone();
		x2_subtraction.normalize();
		x2_subtraction.multiplyScalar(h1*costheta);
		var x2 = new THREE.Vector3();
		x2.subVectors(xo, x2_subtraction);
		
		var h2 = Math.sqrt(h1*h1- Math.pow( Math.abs(x2.length() - x1.length() ),2));
		
		var b_relative = THREE.Vector3();
		var a_relative = THREE.Vector3();		
		a_relative.subVectors(ap,op);
		b_relative.subVectors(bp,op);
		var upward_vector = new THREE.Vector3();
		upward_vector.crossVectors(b_relative, a_relative);
		upward_vector.normalize();
		upward_vector.multiplyScalar(h2);
		
		var cp = new THREE.Vector3();
		cp.addVectors(x2, upward_vector);
		cp.add(op);
		
		for( var i = 0; i < 22; i++) {
			if(vertex_identifications[vertex_tobechanged][i]) {
				polyhedron_vertices.array[i * 3 + 0] = cp.x;
				polyhedron_vertices.array[i * 3 + 1] = cp.y;
			}
		}
	}
	
	//now we need to get the minimum angles
	{
		for( var d_index = 3; d_index < 22; d_index++) {
			var theta = minimum_angles[i] + capsidopenness * (TAU/2 - minimum_angles[i]);
			
			var a_index = vertices_derivations[i][0];
			var b_index = vertices_derivations[i][1];
			var c_index = vertices_derivations[i][2];
			
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
			a_to_b.subVectors(b,a);
			
			var c_a = new THREE.Vector3();
			var d_a = new THREE.Vector3();
			c_a.subVectors(c,a);
			d_a.subVectors(d,a);
			
			var c_hinge_origin = c_a.clone();
			var d_hinge_origin = d_a.clone();			
			d_hinge_origin.projectOnVector(a_to_b);
			c_hinge_origin.projectOnVector(a_to_b);
			
			var d_hinge = new THREE.Vector3();
			var c_hinge = new THREE.Vector3();
			d_hinge.subVectors(d_a,d_hinge_origin);
			c_hinge.subVectors(c_a,c_hinge_origin);
			
			minimum_angles(d_index) = Math.acos( d_hinge.dot(c_hinge) / c_hinge.length() / d_hinge.length() );
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
			if( triangle_done[i] === 1 && triangle_done[i+1] === 0) {
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
		
		var angle_to_use = corner_angle_from_indices( V_triangle_indices[Vmode][initial_changed_vertex][ triangle_to_use ], V_vertex_indices[Vmode][initial_changed_vertex][triangle_to_use * 3 + 1] );
		var imposed_angle;
		if( triangle_to_fix > triangle_to_use )
			imposed_angle = V_angles[ triangle_to_use ] - angle_to_use;
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
		movement_vector.x = MousePosition.x - flatnet_vertices.array[vertex_tobechanged * 3 + 0];
		movement_vector.y = MousePosition.y - flatnet_vertices.array[vertex_tobechanged * 3 + 1];
		
		if( vertex_tobechanged === 666) {
			var lowest_quadrance_so_far = 10;
			var closest_vertex_so_far = 666;
			for( var i = 0; i < 22; i++) {
				var quadrance = (flatnet_vertices.array[i*3+0] - MousePosition.x) * (flatnet_vertices.array[i*3+0] - MousePosition.x)
								+ (flatnet_vertices.array[i*3+1] - MousePosition.y) * (flatnet_vertices.array[i*3+0] - MousePosition.y);
				if( quadrance < lowest_quadrance_so_far) {
					lowest_quadrance_so_far = quadrance;
					closest_vertex_so_far = i;
				}
			}
			
			var maximum_quadrance_to_be_selected = 0.25;
			if( lowest_quadrance_so_far < maximum_quadrance_to_be_selected) {
				vertex_tobechanged = closest_vertex_so_far;
			}
		}
		
		if( vertex_tobechanged !== 666) {
			movement_vector.x = MousePosition.x - flatnet_vertices.array[vertex_tobechanged * 3 + 0];
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
		
		//if(!logged)console.log(side_AdditionToUltimate);
		
		ultimate_vector.add(side_AdditionToUltimate);
		
		prev_vector = side_AdditionToUltimate.clone();
		
		if( i === 0 ) origin_absolute = corner1.clone();
		if( i === 4 ) penultimate_vector = ultimate_vector.clone();
		if( i === 5 ) finalside_absolute = side_Vector.clone(); //absolute in the sense of it being a side
		if( i === 5 ) ultimate_vector_absolute = corner2.clone();
	}
	//console.log(ultimate_vector.y);
	
	move_vertices(vertex_tobechanged, movement_vector, vertex_tobechanged);
	
	var left_defect = new THREE.Vector2(
		flatnet_vertices.array[     3 * vertex_tobechanged ],
		flatnet_vertices.array[ 1 + 3 * vertex_tobechanged ] );
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
		
	//if(!logged) console.log(right_defect_index);
		
	move_vertices(right_defect_index, imposed_movement_vector, vertex_tobechanged);
	
	if(!correct_defects()) {
		for( var i = 0; i < 66; i++)
			flatnet_vertices.array[i] = net_log[i];
	}		
	
	update_polyhedron();
	
	flatnet_vertices.needsUpdate = true;
}