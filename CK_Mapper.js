//The argument for donuts on the vertices is pretty strong http://jvi.asm.org/content/82/21/10341/F4.expansion.html
//Keep the points, virtually but not visually. When a point is on the surface, bring its whole donut onto it

function map_mid_edge_points(LatticeRotationAndScaleMatrix,
		HexagonLatticePosition,  hexagonlattice_vertexindex,
		nettriangle){
	HexagonLattice_defaultvertices[hexagonlattice_vertexindex  ].copy(HexagonLatticePosition);
	
	apply2Dmatrix( SquareToHexMatrix, HexagonLattice_defaultvertices[hexagonlattice_vertexindex  ] );
	HexagonLattice_defaultvertices[hexagonlattice_vertexindex  ].multiplyScalar(Lattice_ring_density_factor);
	
	map_hex_point(hexagonlattice_vertexindex,   nettriangle, LatticeRotationAndScaleMatrix);
}

function map_hex_point(myindex, latticevertex_nettriangle, LatticeRotationAndScaleMatrix){
	HexagonLattice.geometry.vertices[myindex].copy(HexagonLattice_defaultvertices[myindex]);
	
	if(latticevertex_nettriangle !== 666){
		apply2Dmatrix(LatticeRotationAndScaleMatrix,HexagonLattice.geometry.vertices[myindex]);
		map_from_lattice_to_surface( HexagonLattice.geometry.vertices[myindex], latticevertex_nettriangle );
	}
}

function Map_lattice() {
//	camera.position.z = 1;
	var LatticeRotationAndScaleMatrix = new Float32Array([ //not quite sure why it needs to be divided by density factor.
		 LatticeScale / Lattice_ring_density_factor * Math.cos(LatticeAngle),
		-LatticeScale / Lattice_ring_density_factor * Math.sin(LatticeAngle),
		 LatticeScale / Lattice_ring_density_factor * Math.sin(LatticeAngle),
		 LatticeScale / Lattice_ring_density_factor * Math.cos(LatticeAngle)
		]);
	
	/*
	 * four triangles and no duplicated vertices. Optimize with copy - MAYBE
	 * For each side of the hexagon
	 * get its vertices. Get the triangles they are in.
	 * 	case: all four in one triangle
	 * 	case: two in one triangle, two in another
	 * 	case: one in one triangle, other three in another. The opposite vertex
	 * go around each of the four sides connecting them, get inte
	 */
	
	var edgecorner_nettriangles = new Uint16Array(4);
	
	for(var i = 0; i < number_of_lattice_points; i++) {
		//these should be separate from the vertices that you map!
		for(var j = 0; j < 4; j++)
			edgecorner_nettriangles[j] = locate_in_squarelattice_net(squarelattice_hexagonvertices[ SOMETHING ]);
		
		if(	edgecorner_nettriangles[0] === edgecorner_nettriangles[1] && 
			edgecorner_nettriangles[0] === edgecorner_nettriangles[2] && 
			edgecorner_nettriangles[0] === edgecorner_nettriangles[3] )
		{
			//all in one triangle, nicccce
			
		}
		else if(edgecorner_nettriangles[0] === edgecorner_nettriangles[1] &&
				edgecorner_nettriangles[2] === edgecorner_nettriangles[3])
		{
			//split lengthways
		}
		else if(edgecorner_nettriangles[0] === edgecorner_nettriangles[2] &&
				edgecorner_nettriangles[1] === edgecorner_nettriangles[3])
		{
			//split widthways
		}
		else
		{
			var pariahvertex;
			
			for(var j = 0; j < 4; j++){
				for(var k = 0; k < 4; k++){
					if( k !== j && edgecorner_nettriangles[j] === edgecorner_nettriangles[k] )
						break;
					
					if(k === 3)
						pariahvertex = j;
				}
			}
			
			var countervertex = 3 - pariahvertex;
			
			//we get the intersections with each side
			for(var j = 0; j < 4; j++){
				
			}
			
			//we then go through the four triangles, mapping their vertices separately.
			//0 is pariah triangle: pariahvertex, then intersection, then other intersection
			//countertriangle: countervertex, intersection, intersection
			//then the two others, corner, countervertex, intersection.
		}
	}
	
	
	
	var hexcorner_nettriangles = new Uint16Array(12);
	
	for(var i = 0; i < number_of_lattice_points; i++) { //for each hexagon
		for(var j = 0; j < 12; j++){
			hexcorner_nettriangles[j] = locate_in_squarelattice_net(squarelattice_hexagonvertices[ i*6*6 + j * 3 ]);
		}
		
		
		
		for(var j = 0; j < 12; j++){ //for each edge, inner or outer, of that hexagon
			var edge_startpoint_index = i*3*12 + j * 3;
			
			map_hex_point(edge_startpoint_index, hexcorner_nettriangles[j],LatticeRotationAndScaleMatrix);
			
			if(	hexcorner_nettriangles[ j ] === hexcorner_nettriangles[(j+2)%12])
			{
				map_hex_point(edge_startpoint_index + 1, hexcorner_nettriangles[j],LatticeRotationAndScaleMatrix);
				map_hex_point(edge_startpoint_index + 2, hexcorner_nettriangles[j],LatticeRotationAndScaleMatrix);
			}
			else{
				var triangle_for_side_intersection = hexcorner_nettriangles[j] === 666 ? hexcorner_nettriangles[(j+2)%12] : hexcorner_nettriangles[j];
				var edge_endpoint_index = i*3*12 + ((j+2)%12) * 3;
				
				for(var k = 0; k < 3; k++){
					var intersectionpoint = line_line_intersection(
							squarelatticevertex_rounded_triangle_vertex(triangle_for_side_intersection, k),
							squarelattice_hexagonvertices[edge_startpoint_index],
							squarelatticevertex_rounded_triangle_vertex(triangle_for_side_intersection, (k+1)%3),
							squarelattice_hexagonvertices[edge_endpoint_index  ]);
					
					if(intersectionpoint === 0)
						continue;
					
					map_mid_edge_points(LatticeRotationAndScaleMatrix,
							intersectionpoint,
							edge_startpoint_index + 1,
							hexcorner_nettriangles[   j   ]);
					
					var newintersectionpoint;
					
					//if they're both in triangles, they might be separated triangles, so we need a second intersection
					if(hexcorner_nettriangles[(j+2)%12] !== 666)
						triangle_for_side_intersection = hexcorner_nettriangles[(j+2)%12];
					for(var m = 0; m < 3; m++){
						newintersectionpoint = line_line_intersection(
								squarelatticevertex_rounded_triangle_vertex(triangle_for_side_intersection, m),
								squarelattice_hexagonvertices[edge_startpoint_index],
								squarelatticevertex_rounded_triangle_vertex(triangle_for_side_intersection,(m+1)%3),
								squarelattice_hexagonvertices[edge_endpoint_index  ] );
						
						if(newintersectionpoint !== 0)								
							break;
						else if(m === 2)
							console.error("no intersection");
					}
					
					map_mid_edge_points(LatticeRotationAndScaleMatrix,
							intersectionpoint,
							edge_startpoint_index + 2,
							hexcorner_nettriangles[(j+2)%12]);
				}
			}
		}
	}
	
	
	//potential optimisation: break out of the loop when you're past a certain radius. That only helps small capsids though.
	//potential optimisation: just put one in each net triangle and extrapolate
	for(var i = 0; i < number_of_lattice_points; i++) {
		var latticevertex_nettriangle = locate_in_squarelattice_net(squarelattice_vertices[i]);
		
		if( latticevertex_nettriangle !== 666 ) {
			var mappedpoint = map_XY_from_lattice_to_surface(
					flatlattice_vertices.array[ i*3+0 ], flatlattice_vertices.array[ i*3+1 ],
					latticevertex_nettriangle );
			if(capsidopenness != 1) 
				surflattice_geometry.attributes.position.setXYZ(i, mappedpoint.x, mappedpoint.y, mappedpoint.z );
			else //just as normal with extra z to appear above the edges
				surflattice_geometry.attributes.position.setXYZ(i, mappedpoint.x, mappedpoint.y, mappedpoint.z + 0.01 );
			
//			for(var j = 0; j < 6*6; j++){
//				HexagonLattice.geometry.vertices[i*6*6 + j].copy(HexagonLattice_defaultvertices[i*6*6 + j]);
//				apply2Dmatrix(LatticeRotationAndScaleMatrix,HexagonLattice.geometry.vertices[i*6*6 + j]);
//				map_from_lattice_to_surface( HexagonLattice.geometry.vertices[i*6*6 + j], latticevertex_nettriangle );
//			}
			
			lattice_colors[i*3+0] = 1;
			lattice_colors[i*3+1] = 0;
			lattice_colors[i*3+2] = 0;
		}
		else {
			surflattice_geometry.attributes.position.setXYZ(i, Lattice_ring_density_factor*flatlattice_default_vertices[ i*3+0 ],Lattice_ring_density_factor*flatlattice_default_vertices[ i*3+1 ],0);
			
			for(var j = 0; j < 6*6; j++)
				HexagonLattice.geometry.vertices[i*6*6 + j].copy(HexagonLattice_defaultvertices[i*6*6 + j]);
			
			lattice_colors[i*3+0] = 1;
			lattice_colors[i*3+1] = 0.682;
			lattice_colors[i*3+2] = 0.682;
		}
	}
	logged = 1;
	
	surflattice.geometry.attributes.position.needsUpdate = true;
	surflattice.geometry.attributes.color.needsUpdate = true;
	HexagonLattice.geometry.verticesNeedUpdate = true;
}

function Update_net_variables() {
	var old_net_vertices_closest_lattice_vertex = Array(net_vertices_closest_lattice_vertex.length);
	for(var i = 0; i<net_vertices_closest_lattice_vertex.length; i++)
		old_net_vertices_closest_lattice_vertex[i] = net_vertices_closest_lattice_vertex[i];
	var centralaxis = new THREE.Vector3(0, 0, 1);
	for( var i = 0; i < 22; i++) {
		var netvertex = new THREE.Vector3(flatnet_vertices.array[ i*3+0 ],flatnet_vertices.array[ i*3+1 ],0);
		netvertex.multiplyScalar(1/LatticeScale);
		netvertex.applyAxisAngle(centralaxis,-LatticeAngle);

		net_vertices_closest_lattice_vertex[i] = index_of_closest_default_lattice_vertex(netvertex.x,netvertex.y);
	}
	
	//speedup opportunity: this part only exists for one situation, where LatticeScale is very low and such. Could be more specific
	for(var i = 0; i<net_triangle_vertex_indices.length / 3; i++){
		if(		net_vertices_closest_lattice_vertex[net_triangle_vertex_indices[i*3+0]] == net_vertices_closest_lattice_vertex[net_triangle_vertex_indices[i*3+1]]
			 || net_vertices_closest_lattice_vertex[net_triangle_vertex_indices[i*3+0]] == net_vertices_closest_lattice_vertex[net_triangle_vertex_indices[i*3+2]]
			 || net_vertices_closest_lattice_vertex[net_triangle_vertex_indices[i*3+1]] == net_vertices_closest_lattice_vertex[net_triangle_vertex_indices[i*3+2]] ) {
			for(var i = 0; i<net_vertices_closest_lattice_vertex.length; i++)
				net_vertices_closest_lattice_vertex[i] = old_net_vertices_closest_lattice_vertex[i];
			break;
		}
	}
	
	for(var i = 0; i < 20; i++) {
		var side0vertex_index = vertices_derivations[i+2][0];
		var side1vertex_index = vertices_derivations[i+2][1]; //always counter-clockwise
		
		var origincorner = get_vector(i+2,SURFACE);
		var corner0 = get_vector(side0vertex_index,SURFACE);
		var corner1 = get_vector(side1vertex_index,SURFACE);
		
		surface.localToWorld(origincorner);
		surface.localToWorld(corner0);
		surface.localToWorld(corner1);
		
		surface_triangle_side_unit_vectors[i][0].subVectors(corner0,origincorner);
		surface_triangle_side_unit_vectors[i][1].subVectors(corner1,origincorner);
		surface_triangle_side_unit_vectors[i][0].normalize();
		surface_triangle_side_unit_vectors[i][1].normalize();
		
		var flatnet_triangle_side_unit_vector0 = new THREE.Vector2(
				flatnet_vertices.array[side0vertex_index*3 + 0] - flatnet_vertices.array[(i+2)*3 + 0],
				flatnet_vertices.array[side0vertex_index*3 + 1] - flatnet_vertices.array[(i+2)*3 + 1]			
			);
		var flatnet_triangle_side_unit_vector1 = new THREE.Vector2(
				flatnet_vertices.array[side1vertex_index*3 + 0] - flatnet_vertices.array[(i+2)*3 + 0],
				flatnet_vertices.array[side1vertex_index*3 + 1] - flatnet_vertices.array[(i+2)*3 + 1]
			);
		flatnet_triangle_side_unit_vector0.normalize();
		flatnet_triangle_side_unit_vector1.normalize();
		
		var factor = flatnet_triangle_side_unit_vector1.y * flatnet_triangle_side_unit_vector0.x - flatnet_triangle_side_unit_vector1.x * flatnet_triangle_side_unit_vector0.y;
		shear_matrix[i][0] = flatnet_triangle_side_unit_vector1.y / factor;
		shear_matrix[i][1] = flatnet_triangle_side_unit_vector1.x /-factor;
		shear_matrix[i][2] = flatnet_triangle_side_unit_vector0.y /-factor;
		shear_matrix[i][3] = flatnet_triangle_side_unit_vector0.x / factor;
	}
}

function map_XY_from_lattice_to_surface(x,y, net_triangle_index) {
	var mappedpoint = new THREE.Vector3(x,y,0);
	map_from_lattice_to_surface(mappedpoint, net_triangle_index);	
	return mappedpoint;
}

function map_from_lattice_to_surface(vec, net_triangle_index) {
	//you could have an "if net_triangle_index === 666 return x y"?
	vec.x -= flatnet_vertices.array[(net_triangle_index+2)*3 + 0];
	vec.y -= flatnet_vertices.array[(net_triangle_index+2)*3 + 1];
	
	var side0_component_length = vec.x * shear_matrix[net_triangle_index][0] + vec.y * shear_matrix[net_triangle_index][1];
	var side1_component_length = vec.x * shear_matrix[net_triangle_index][2] + vec.y * shear_matrix[net_triangle_index][3];
	
	var side0_component = surface_triangle_side_unit_vectors[net_triangle_index][0].clone();
	var side1_component = surface_triangle_side_unit_vectors[net_triangle_index][1].clone();
	side0_component.multiplyScalar(side0_component_length);
	side1_component.multiplyScalar(side1_component_length);
	
	side0_component.multiplyScalar(Lattice_ring_density_factor/LatticeScale);
	side1_component.multiplyScalar(Lattice_ring_density_factor/LatticeScale);
	
	vec.addVectors(side0_component,side1_component);
	vec.x += surface_vertices.array[(net_triangle_index+2) * 3 + 0];
	vec.y += surface_vertices.array[(net_triangle_index+2) * 3 + 1];
	vec.z += surface_vertices.array[(net_triangle_index+2) * 3 + 2];
}

//obviously, much speedup opportunities
function locate_in_net() {
	//potential optimization: put these in a tree so you only need to make like 5 checks, not 20.
	//Would need reconciliation with irregularity. Though in that situation you'd probably have a smaller lattice
	for(var i = 0; i < 20; i++ ) {			
		if( point_in_triangle(
				x,y,
				flatnet_vertices.array[net_triangle_vertex_indices[i*3+0] * 3 + 0], flatnet_vertices.array[net_triangle_vertex_indices[i*3+0] * 3 + 1],
				flatnet_vertices.array[net_triangle_vertex_indices[i*3+1] * 3 + 0], flatnet_vertices.array[net_triangle_vertex_indices[i*3+1] * 3 + 1],
				flatnet_vertices.array[net_triangle_vertex_indices[i*3+2] * 3 + 0], flatnet_vertices.array[net_triangle_vertex_indices[i*3+2] * 3 + 1],
				true) )
			return i;
	}
	
	return 666;
}

function locate_in_squarelattice_net(vec) {	
	//so this merits use when net vertices are close to lattice vertices
	//when the capsid isn't closed, it doesn't really matter what lattice vertices are considered to be within it
	//may as well continue using it for the whole lattice at all times, so it's easier.
	for(var i = 0; i < net_triangle_vertex_indices.length / 3; i++ ) {
		if( point_in_triangle_vecs(
				vec.x,vec.y,
				squarelatticevertex_rounded_triangle_vertex(i, 0),
				squarelatticevertex_rounded_triangle_vertex(i, 1),
				squarelatticevertex_rounded_triangle_vertex(i, 2),
				true) )
			return i;
	}
	
	return 666;
}

function squarelatticevertex_rounded_triangle_vertex(triangleindex, corner){
	return squarelattice_vertices[  net_vertices_closest_lattice_vertex[  net_triangle_vertex_indices[triangleindex*3+corner]  ] ];
}