function UpdateQuasiSurface(){
	if(InputObject.isMouseDown)
		dodecaopeningspeed = 0.018;
	else
		dodecaopeningspeed = -0.018;
	
	dodeca_openness += dodecaopeningspeed;
	
	if(dodeca_openness > 1) {
		dodeca_openness = 1;
		dodecaopeningspeed = 0;
	}
	if(dodeca_openness < 0) {
		dodeca_openness = 0;
		dodecaopeningspeed = 0;
	}
	
	deduce_dodecahedron(dodeca_openness);
	
	dodeca.geometry.attributes.position.needsUpdate = true;
}

function MoveQuasiLattice(){
	//might do rotation whatevers here
	if(InputObject.isMouseDown) {
		var Mousedist = MousePosition.length();
		var OldMousedist = OldMousePosition.length(); //unless the center is going to change?
		if( Mousedist < HS3 * 10/3) { //we don't do anything if you're too far from the actual demo TODO replace with demo_radius
			cutout_vector0.multiplyScalar(Mousedist / OldMousedist);
			cutout_vector1.multiplyScalar(Mousedist / OldMousedist);
			
			var MouseAngle = Math.atan2(MousePosition.y, MousePosition.x );
			if(MousePosition.x === 0 && MousePosition.y === 0)
				MouseAngle = 0; //well, undefined
			
			var OldMouseAngle = Math.atan2( OldMousePosition.y, OldMousePosition.x );
			if(OldMousePosition.x === 0 && OldMousePosition.y === 0)
				OldMouseAngle = 0;
			
			var LatticeAngleChange = OldMouseAngle - MouseAngle;
			
			var QuasiLatticeAngle = Math.atan2(cutout_vector0.y, cutout_vector0.x);
			var newQuasiLatticeAngle = QuasiLatticeAngle + LatticeAngleChange;
			var veclength = cutout_vector0.length();
			cutout_vector0.x = veclength * Math.cos(newQuasiLatticeAngle);
			cutout_vector0.y = veclength * Math.sin(newQuasiLatticeAngle);
			cutout_vector1.x = veclength * Math.cos(newQuasiLatticeAngle - TAU / 5);
			cutout_vector1.y = veclength * Math.sin(newQuasiLatticeAngle - TAU / 5);
		}
	}
		
	//re disappearance, since we're talking about a sphere it's kinda complex.
	//you could find and fill in every trinity of points with a triangle.
	//problem: leaves a hold in the pentagons
	//Maybe quadrilaterals. This may screw up on a curved surface and would cover everything 4 times
	//could try having a flatshaded dodecahedron in there
	//or could have an extra thing for all the pentagons
	//it would be best to detect what kind of shape you have there, as you may want to colour shapes differently
	
	var factor = cutout_vector1.y * cutout_vector0.x - cutout_vector1.x * cutout_vector0.y;
	quasi_shear_matrix[0] = cutout_vector1.y / factor;
	quasi_shear_matrix[1] = cutout_vector1.x /-factor;
	quasi_shear_matrix[2] = cutout_vector0.y /-factor;
	quasi_shear_matrix[3] = cutout_vector0.x / factor;
}

function Map_To_Quasisphere() {
	var lowest_unused_vertex = 0;
	
	var c0_to_1 = cutout_vector1.clone();
	c0_to_1.sub(cutout_vector0);
	var c0_c1_summed_unit = cutout_vector0.clone();
	c0_c1_summed_unit.add(cutout_vector1);
	c0_c1_summed_unit.normalize();
	
	var axis = new THREE.Vector3(0,0,-1);
	var adjacent_triangle_cutout_vector = new THREE.Vector3(cutout_vector1.x, cutout_vector1.y, 0);
	adjacent_triangle_cutout_vector.applyAxisAngle(axis, TAU/5);
	
	//TODO round off errors may mean things on the triangle edge are not in the triangle
	for( var i = 0; i < quasilattice_default_vertices.length; i++ ) {
		if( !point_in_triangle(	quasilattice_default_vertices[i].x, quasilattice_default_vertices[i].y,
								0, 0, cutout_vector0.x, cutout_vector0.y, cutout_vector1.x, cutout_vector1.y, 
								true)
		 && !point_in_triangle(	quasilattice_default_vertices[i].x, quasilattice_default_vertices[i].y,
								0, 0, cutout_vector1.x, cutout_vector1.y, adjacent_triangle_cutout_vector.x, adjacent_triangle_cutout_vector.y, 
								true)
		   ) continue;
		
		quasicutout_intermediate_vertices[lowest_unused_vertex].copy(quasilattice_default_vertices[i]);
		quasicutouts_vertices_components[lowest_unused_vertex][0] = quasicutout_intermediate_vertices[lowest_unused_vertex].x * quasi_shear_matrix[0] + quasicutout_intermediate_vertices[lowest_unused_vertex].y * quasi_shear_matrix[1];
		quasicutouts_vertices_components[lowest_unused_vertex][1] = quasicutout_intermediate_vertices[lowest_unused_vertex].x * quasi_shear_matrix[2] + quasicutout_intermediate_vertices[lowest_unused_vertex].y * quasi_shear_matrix[3];
		quasicutouts_vertices_components[lowest_unused_vertex][2] = 0;
		lowest_unused_vertex++;
		
		//we may make an extra point, if you're to the left of the middle and close to the bottom
		var c0_to_point = quasilattice_default_vertices[i].clone();
		c0_to_point.sub(cutout_vector0);
		var c1_to_point = quasilattice_default_vertices[i].clone();
		c1_to_point.sub(cutout_vector1);
		if( c0_to_point.lengthSq() > c1_to_point.lengthSq() ) {
			var dist_from_bottom = quasilattice_default_vertices[i].distanceTo(cutout_vector0) * get_sin_Vector2(c0_to_point, c0_to_1);
			
			if(dist_from_bottom < 1) {
				var horizontal_dist_from_corner = Math.sqrt(c0_to_point.lengthSq() - dist_from_bottom * dist_from_bottom );
				var closest_point_on_bottom = c0_to_1.clone();
				closest_point_on_bottom.normalize();
				closest_point_on_bottom.multiplyScalar(c0_to_1.length() - horizontal_dist_from_corner ); //mirrored
				closest_point_on_bottom.add(cutout_vector1);
				
				quasicutout_intermediate_vertices[lowest_unused_vertex].copy(c0_c1_summed_unit);
				quasicutout_intermediate_vertices[lowest_unused_vertex].multiplyScalar(dist_from_bottom);
				quasicutout_intermediate_vertices[lowest_unused_vertex].add(closest_point_on_bottom);
				
				quasicutouts_vertices_components[lowest_unused_vertex][0] = closest_point_on_bottom.x * quasi_shear_matrix[0] + closest_point_on_bottom.y * quasi_shear_matrix[1];
				quasicutouts_vertices_components[lowest_unused_vertex][1] = closest_point_on_bottom.x * quasi_shear_matrix[2] + closest_point_on_bottom.y * quasi_shear_matrix[3];
				quasicutouts_vertices_components[lowest_unused_vertex][2] = dist_from_bottom;
				lowest_unused_vertex++;
			}
		}
	}
	
//	var lowest_unused_edgepair = 0;
//	
//	var quasisphere_edgelength_wiggleroom = 0.01; //tweakable
//	for( var i = 0; i < lowest_unused_vertex; i++) {
//		if( !point_in_triangle(	quasicutout_intermediate_vertices[i].x, quasicutout_intermediate_vertices[i].y,
//				0, 0, cutout_vector0.x, cutout_vector0.y, cutout_vector1.x, cutout_vector1.y, 
//				1)
//		   ) continue;
//		for( var j = i+1; j < lowest_unused_vertex; j++) {
//			if( Math.abs(quasicutout_intermediate_vertices[i].distanceTo(quasicutout_intermediate_vertices[j]) - 1) < quasisphere_edgelength_wiggleroom ) {
//				quasicutout_line_pairs[ lowest_unused_edgepair*2 ] = i;
//				quasicutout_line_pairs[lowest_unused_edgepair*2+1] = j;
//				lowest_unused_edgepair++;
//			}
//		}
//	}
//	for(var i = lowest_unused_edgepair*2; i < quasicutout_line_pairs.length; i++)
//		quasicutout_line_pairs[i] = 0;
//
//	for(var i = 0; i< quasicutouts_vertices_components.length; i++) {
//		for( var j =0; j < 3; j++)
//			quasicutouts_vertices_components[i][j] = 0;
//	}
//	quasicutouts_vertices_components[0][0] = 0.5/Math.sin(TAU/10);
//	quasicutouts_vertices_components[1][1] = 0.5/Math.sin(TAU/10);
	
	//Now there are redundant vertices, which are not connected to any edge. Getting rid of those is a bit of a pain, however, so only do it if you have to. Then you could move the component calculation down
	
	var dihedral_angle = 2 * Math.atan(PHI);
	dihedral_angle = dihedral_angle + dodeca_openness * (TAU/2 - dihedral_angle);
	var alpha = Math.tan(dihedral_angle - TAU / 4);
	
	var lowest_unused_quasicutout = 0;
	for( var i = 0; i < dodeca_triangle_vertex_indices.length; i++) {
		if((i + 5)%11 < 5) continue; //if you were to add the back pentagon you'd need to add to this
		
		var rightindex = dodeca_triangle_vertex_indices[i][0];
		var leftindex = dodeca_triangle_vertex_indices[i][1]; 
		var topindex = dodeca_triangle_vertex_indices[i][2];
		
		var vectors = Array(4);
		vectors[0] = new THREE.Vector3(
			dodeca_vertices_numbers[rightindex*3+0] - dodeca_vertices_numbers[topindex*3+0],
			dodeca_vertices_numbers[rightindex*3+1] - dodeca_vertices_numbers[topindex*3+1],
			dodeca_vertices_numbers[rightindex*3+2] - dodeca_vertices_numbers[topindex*3+2] );
		vectors[1] = new THREE.Vector3(
			dodeca_vertices_numbers[leftindex*3+0] - dodeca_vertices_numbers[topindex*3+0],
			dodeca_vertices_numbers[leftindex*3+1] - dodeca_vertices_numbers[topindex*3+1],
			dodeca_vertices_numbers[leftindex*3+2] - dodeca_vertices_numbers[topindex*3+2] );
		
		vectors[2] = vectors[0].clone();
		vectors[2].cross(vectors[1]);
		var forward_component = vectors[0].clone();
		forward_component.add(vectors[1]);
		forward_component.normalize();
		forward_component.multiplyScalar(alpha);
		vectors[2].add(forward_component);
		vectors[2].normalize();
	
		vectors[3] = new THREE.Vector3(
			dodeca_vertices_numbers[topindex*3+0],
			dodeca_vertices_numbers[topindex*3+1],
			dodeca_vertices_numbers[topindex*3+2]);		
		
		for( var j = 0; j< quasicutouts[lowest_unused_quasicutout].geometry.attributes.position.array.length; j++)
			quasicutouts[lowest_unused_quasicutout].geometry.attributes.position.array[j] = 0;
		
		for( var vertex_index = 0; vertex_index < lowest_unused_vertex; vertex_index++) {
			for( var component = 0; component < 4; component++) {
				quasicutouts[lowest_unused_quasicutout].geometry.attributes.position.array[vertex_index*3+0] += quasicutouts_vertices_components[vertex_index][component] * vectors[component].x;
				quasicutouts[lowest_unused_quasicutout].geometry.attributes.position.array[vertex_index*3+1] += quasicutouts_vertices_components[vertex_index][component] * vectors[component].y;
				quasicutouts[lowest_unused_quasicutout].geometry.attributes.position.array[vertex_index*3+2] += quasicutouts_vertices_components[vertex_index][component] * vectors[component].z;
			}
		}
		
		quasicutouts[lowest_unused_quasicutout].geometry.attributes.position.needsUpdate = true;
		lowest_unused_quasicutout++;
	}
	logged = 1;
}

function deduce_dodecahedron(openness) {	
	var elevation = -openness*0.5*Math.sqrt(5/2+11/10*Math.sqrt(5));
	
	dodeca_vertices_numbers[0*3+0] = 0;
	dodeca_vertices_numbers[0*3+1] = 0;
	dodeca_vertices_numbers[0*3+2] = elevation;
	
	dodeca_vertices_numbers[1*3+0] = 0;
	dodeca_vertices_numbers[1*3+1] = 0.5/Math.sin(TAU/10);
	dodeca_vertices_numbers[1*3+2] = elevation;
	
	dodeca_vertices_numbers[2*3+0] = PHI/2;
	dodeca_vertices_numbers[2*3+1] = 0.5/Math.sin(TAU/10) - Math.cos(3/20*TAU);
	dodeca_vertices_numbers[2*3+2] = elevation;
	
	var dihedral_angle = 2 * Math.atan(PHI);
	for( var i = 3; i < 46; i++) {
		var theta = TAU / 2;
		if( ((i - 3) % 9 === 0 && i <= 30) ||
			((i - 7) % 9 === 0 && i <= 34) ||
			i === 38 || i === 42
		   )
			theta = dihedral_angle + openness * (TAU/2 - dihedral_angle);
		
		var a_index = dodeca_derivations[i][0];
		var b_index = dodeca_derivations[i][1];
		var c_index = dodeca_derivations[i][2];
		
		var a = new THREE.Vector3( //this is our origin
			dodeca_vertices_numbers[a_index * 3 + 0],
			dodeca_vertices_numbers[a_index * 3 + 1],
			dodeca_vertices_numbers[a_index * 3 + 2]);
		
		var crossbar_unit = new THREE.Vector3(
			dodeca_vertices_numbers[b_index * 3 + 0],
			dodeca_vertices_numbers[b_index * 3 + 1],
			dodeca_vertices_numbers[b_index * 3 + 2]);
		crossbar_unit.sub(a);			
		crossbar_unit.normalize();
	
		var c = new THREE.Vector3(
			dodeca_vertices_numbers[c_index * 3 + 0],
			dodeca_vertices_numbers[c_index * 3 + 1],
			dodeca_vertices_numbers[c_index * 3 + 2]);
		c.sub(a);
		var hinge_origin_length = c.length() * get_cos(crossbar_unit, c);		
		var hinge_origin = new THREE.Vector3(
			crossbar_unit.x * hinge_origin_length,
			crossbar_unit.y * hinge_origin_length,
			crossbar_unit.z * hinge_origin_length);
		
		var c_hinge = new THREE.Vector3();
		c_hinge.subVectors( c, hinge_origin);
		var hinge_length = c_hinge.length();
		var hinge_component = c_hinge.clone();
		hinge_component.multiplyScalar( Math.cos(theta));
			
		var downward_vector_unit = new THREE.Vector3();		
		downward_vector_unit.crossVectors(crossbar_unit, c);
		downward_vector_unit.normalize();
		var downward_component = downward_vector_unit.clone();
		downward_component.multiplyScalar(Math.sin(theta) * hinge_length);
		
		var d = new THREE.Vector3();
		d.addVectors(downward_component, hinge_component);
		d.add( hinge_origin );
		d.add( a );
		
		dodeca_vertices_numbers[i*3+0] = d.x;
		dodeca_vertices_numbers[i*3+1] = d.y;
		dodeca_vertices_numbers[i*3+2] = d.z;
	}
}

function initialize_QS_stuff() {
	cutout_vector0 = new THREE.Vector3(0,0.5/Math.sin(TAU/10),0);
	cutout_vector1 = new THREE.Vector3(PHI/2,0.5/Math.sin(TAU/10)-Math.cos(3/20*TAU),0);
	
	for(var i = 0; i < quasicutout_intermediate_vertices.length; i++ )
		quasicutout_intermediate_vertices[i] = new THREE.Vector3(0,0,0);	
	for(var i = 0; i < quasicutouts_vertices_components.length; i++)
		quasicutouts_vertices_components[i] = new Array(0,0,0,1);
	quasicutout_line_pairs = new Uint16Array([
   	    0,1
   	]);
	
	var materialx = new THREE.LineBasicMaterial({
 		color: 0x0000ff
 	});
	
 	for( var i = 0; i < quasicutouts.length; i++) {
 		quasicutouts[i] = new THREE.Line( new THREE.BufferGeometry(), materialx, THREE.LinePieces );
 		quasicutouts[i].geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(18 * 3), 3 ) );
 		quasicutouts[i].geometry.addAttribute( 'index', new THREE.BufferAttribute( quasicutout_line_pairs, 1 ) );
 		for( var j = 0; j < 3; j++){
 			quasicutouts[i].geometry.attributes.position.array[j*3] = (j % 2) * 0.05; 
 			quasicutouts[i].geometry.attributes.position.array[j*3+1] = (Math.floor(j/2)+i) * 0.05;
 	 	}
	}
 	
 	var materialy = new THREE.LineBasicMaterial({
 		color: 0x00ffff
 	});
 	var dodeca_line_pairs = new Uint16Array([
 	    2,1,	1,11,	11,20,	20,29,	29,2,
 	    2,4,	4,5,	5,6,	6,1,
 	    1,13,	13,14,	14,15,	15,11,
 	    11,22,	22,23,	23,24,	24,20,
 	    20,31,	31,32,	32,33,	33,29,
 	    29,39,	39,40,	40,41,	41,2,
 	    
 	    4,8,	8,9,	9,10,	10,5,
 	    13,17,	17,18,	18,19,	19,14,
 	    22,26,	26,27,	27,28,	28,23,
 	    31,35,	35,36,	36,37,	37,32,
 	    39,43,	43,44,	44,45,	45,40
 		]);
 	
 	dodeca_geometry = new THREE.BufferGeometry();
 	dodeca_geometry.addAttribute( 'position', new THREE.BufferAttribute( dodeca_vertices_numbers, 3 ) );
 	dodeca_geometry.addAttribute( 'index', new THREE.BufferAttribute( dodeca_line_pairs, 1 ) );
 	dodeca = new THREE.Line( dodeca_geometry, materialy, THREE.LinePieces );
 	
 	var axis = new THREE.Vector3(0,0,-1);
	var pentagon = Array(5);
	pentagon[0] = new THREE.Vector3(0,0.5/Math.sin(TAU/10),0);
	for(var i = 1; i < 5; i++) {
		pentagon[i] = pentagon[0].clone();
		pentagon[i].applyAxisAngle(axis, i*TAU/5);
	}
	
	var quasilattice_generator = Array(5);
	for(var i = 0; i < 5; i++) {
		quasilattice_generator[i] = pentagon[(i+1)%5].clone();
		quasilattice_generator[i].sub( pentagon[i] );
	}
	
	quasilattice_default_vertices[0] = pentagon[0].clone();
	quasilattice_default_vertices[1] = quasilattice_default_vertices[0].clone(); quasilattice_default_vertices[1].add(quasilattice_generator[3]); quasilattice_default_vertices[1].sub(quasilattice_generator[1]);
	quasilattice_default_vertices[2] = quasilattice_default_vertices[0].clone(); quasilattice_default_vertices[2].add(quasilattice_generator[3]); quasilattice_default_vertices[2].add(quasilattice_generator[0]);
	
	quasilattice_default_vertices[4] = quasilattice_default_vertices[2].clone(); quasilattice_default_vertices[4].add(quasilattice_generator[4]);
	
	quasilattice_default_vertices[3] = quasilattice_default_vertices[4].clone(); quasilattice_default_vertices[3].sub(quasilattice_generator[3]);
	
	quasilattice_default_vertices[5] = quasilattice_default_vertices[4].clone(); quasilattice_default_vertices[5].sub(quasilattice_generator[2]);
	
	quasilattice_default_vertices[7] = quasilattice_default_vertices[4].clone(); quasilattice_default_vertices[7].add(quasilattice_generator[3]);
	
	quasilattice_default_vertices[9] = quasilattice_default_vertices[7].clone(); quasilattice_default_vertices[9].add(quasilattice_generator[4]);
	quasilattice_default_vertices[10] = quasilattice_default_vertices[9].clone(); quasilattice_default_vertices[10].add(quasilattice_generator[0]);
	
	quasilattice_default_vertices[6] = quasilattice_default_vertices[10].clone(); quasilattice_default_vertices[6].sub(quasilattice_generator[3]);
	
	quasilattice_default_vertices[8] = quasilattice_default_vertices[9].clone(); quasilattice_default_vertices[8].add(quasilattice_generator[2]);
	
	quasilattice_default_vertices[11] = quasilattice_default_vertices[6].clone(); quasilattice_default_vertices[11].sub(quasilattice_generator[2]);
	
	quasilattice_default_vertices[12] = quasilattice_default_vertices[8].clone(); quasilattice_default_vertices[12].add(quasilattice_generator[3]);
	quasilattice_default_vertices[13] = quasilattice_default_vertices[12].clone(); quasilattice_default_vertices[13].add(quasilattice_generator[4]);
	quasilattice_default_vertices[14] = quasilattice_default_vertices[9].clone(); quasilattice_default_vertices[14].sub(quasilattice_generator[1]);
	
	quasilattice_default_vertices[15] = quasilattice_default_vertices[14].clone(); quasilattice_default_vertices[15].sub(quasilattice_generator[2]);
	quasilattice_default_vertices[16] = quasilattice_default_vertices[15].clone(); quasilattice_default_vertices[16].sub(quasilattice_generator[3]);
	quasilattice_default_vertices[17] = quasilattice_default_vertices[16].clone(); quasilattice_default_vertices[17].add(quasilattice_generator[0]);
	
	//these are both the number found in one-fifth of the lattice
	var num_points = 18;
	var num_edges = 29;
	
	for( var i = 1; i < 5; i++){
		for(var j = 0; j < num_points; j++) {
			quasilattice_default_vertices[i*num_points+j] = quasilattice_default_vertices[j].clone();
			quasilattice_default_vertices[i*num_points+j].applyAxisAngle(axis, i*TAU/5);			
		}
	}
	
	var midpoint = quasilattice_default_vertices[0].clone();
	midpoint.lerp(quasilattice_default_vertices[2], 0.5);
	var midpoint2 = midpoint.clone();
	midpoint2.applyAxisAngle(axis, TAU/5);
	midpoint.lerp(midpoint2, 0.5);
	var additionallength = midpoint.distanceTo(midpoint2) * Math.tan(TAU/10);
	midpoint.multiplyScalar(1+additionallength/midpoint.length());
	cutout_vector0.copy(midpoint);
	midpoint.applyAxisAngle(axis, TAU/5);
	cutout_vector1.copy(midpoint);
	
	//snapping: you have to snap to places where there are only points and midpoints-of-edges on the pentagon edge? No, there are other places too
	//there has to be SOME connection to the neighboring pentagon
	//you could just enumerate them all and then put points there for the cutout vectors to gravitate to
	
	quasilattice_pairs[0*2+0] = 0; quasilattice_pairs[0*2+1] = num_points;
	quasilattice_pairs[1*2+0] = 2; quasilattice_pairs[1*2+1] = num_points;
	quasilattice_pairs[2*2+0] = 2; quasilattice_pairs[2*2+1] = num_points + 2;
	
	quasilattice_pairs[3*2+0] = 2; quasilattice_pairs[3*2+1] = 4;
	quasilattice_pairs[4*2+0] = 3; quasilattice_pairs[4*2+1] = num_points;
	quasilattice_pairs[5*2+0] = 3; quasilattice_pairs[5*2+1] = 4;
	
	quasilattice_pairs[6*2+0] = 1; quasilattice_pairs[6*2+1] = 7;
	quasilattice_pairs[7*2+0] = 4; quasilattice_pairs[7*2+1] = 7;
	quasilattice_pairs[8*2+0] = 4; quasilattice_pairs[8*2+1] = 5;
	
	quasilattice_pairs[9*2+0] = 3; quasilattice_pairs[9*2+1] = num_points + 1;
	quasilattice_pairs[10*2+0] = 5; quasilattice_pairs[10*2+1] = num_points + 1;
	quasilattice_pairs[11*2+0] = 1; quasilattice_pairs[11*2+1] = 8;
	
	quasilattice_pairs[12*2+0] = 7; quasilattice_pairs[12*2+1] = 9;
	quasilattice_pairs[13*2+0] = 5; quasilattice_pairs[13*2+1] = 10;
	quasilattice_pairs[14*2+0] = 6; quasilattice_pairs[14*2+1] = num_points + 1;
	
	quasilattice_pairs[15*2+0] = 8; quasilattice_pairs[15*2+1] = 12;
	quasilattice_pairs[16*2+0] = 8; quasilattice_pairs[16*2+1] = 9;
	quasilattice_pairs[17*2+0] = 9; quasilattice_pairs[17*2+1] = 10;
	
	quasilattice_pairs[18*2+0] = 10; quasilattice_pairs[18*2+1] = 6;
	quasilattice_pairs[19*2+0] = 11; quasilattice_pairs[19*2+1] = 6;
	quasilattice_pairs[20*2+0] = 11; quasilattice_pairs[20*2+1] = num_points + 12;
	
	quasilattice_pairs[21*2+0] = 12; quasilattice_pairs[21*2+1] = 13;
	quasilattice_pairs[22*2+0] = 14; quasilattice_pairs[22*2+1] = 13;
	quasilattice_pairs[23*2+0] = 14; quasilattice_pairs[23*2+1] = 15;
	
	quasilattice_pairs[24*2+0] = 16; quasilattice_pairs[24*2+1] = 15;
	quasilattice_pairs[25*2+0] = 14; quasilattice_pairs[25*2+1] = 9;
	quasilattice_pairs[26*2+0] = 16; quasilattice_pairs[26*2+1] = 10;
	
	quasilattice_pairs[27*2+0] = 16; quasilattice_pairs[27*2+1] = 17;
	quasilattice_pairs[28*2+0] = 17; quasilattice_pairs[28*2+1] = 11;
	
	for( var i = 1; i < 5; i++){
		for(var j = 0; j < num_edges; j++) {
			quasilattice_pairs[i*num_edges+j*2+0] = (quasilattice_pairs[j*2+0] + i*num_points) % (num_points*5);
			quasilattice_pairs[i*num_edges+j*2+1] = (quasilattice_pairs[j*2+1] + i*num_points) % (num_points*5);
		}
	}
	
	//you could connect things up along the edge by going through the vertices near it and seeing whether their distance is close to 1.
	
	//first one is right corner, second is left corner, last is top
	dodeca_triangle_vertex_indices = new Array(
	    [1,2,0],
	    
	    [2,1,3],
	    [4,2,3],
	    [5,4,3],
	    [6,5,3],
	    [1,6,3],
	    
	    [4,5,7],
	    [8,4,7],
	    [9,8,7],
	    [10,9,7],
	    [5,10,7],
	    
	    [11,1,0],
	    
	    [1,11,12],
	    [13,1,12],
	    [14,13,12],
	    [15,14,12],
	    [11,15,12],
	    
	    [13,14,16],
	    [17,13,16],
	    [18,17,16],
	    [19,18,16],
	    [14,19,16],
	    
	    [20,11,0],
	    
	    [11,20,21],
	    [22,11,21],
	    [23,22,21],
	    [24,23,21],
	    [20,24,21],
	    
	    [22,23,25],
	    [26,22,25],
	    [27,26,25],
	    [28,27,25],
	    [23,28,25],
	    
	    [29,20,0],
	    
	    [20,29,30],
	    [31,20,30],
	    [32,31,30],
	    [33,32,30],
	    [29,33,30],
	    
	    [31,32,34],
	    [34,31,34],
	    [36,35,34],
	    [37,36,34],
	    [32,37,34],
	    
	    [2,29,0],
	    
	    [29,2,38],
	    [39,29,38],
	    [40,39,38],
	    [41,40,38],
	    [2,41,38],
	    
	    [39,40,42],
	    [43,39,42],
	    [44,43,42],
	    [45,44,42],
	    [40,45,42]);
	
	dodeca_derivations = new Array(
			[666,666,666],
			[666,666,666],
			[666,666,666],
			
			[1,2,0],
			[3,2,1],
			[3,4,2],
			[3,5,4],
			
			[5,4,3],
			[7,4,5],
			[7,8,4],
			[7,9,8],
			
			[0,1,2],
			
			[11,1,0],
			[12,1,11],
			[12,13,1],
			[12,14,13],
			
			[14,13,12],
			[16,13,14],
			[16,17,13],
			[16,18,17],
			
			[0,11,1],
			
			[20,11,0],
			[21,11,20],
			[21,22,11],
			[21,23,22],
			
			[23,22,21],
			[25,22,23],
			[25,26,22],
			[25,27,26],
			
			[0,20,11],
			
			[29,20,0],
			[30,20,29],
			[30,31,20],
			[30,32,31],
			
			[32,31,30],
			[34,31,32],
			[34,35,31],
			[34,36,35],
			
			[2,29,0],
			[38,29,2],
			[38,39,29],
			[38,40,39],
			
			[40,39,38],
			[42,39,40],
			[42,43,39],
			[42,44,43]);
	
	deduce_dodecahedron(0);
}