function update_cubicLattice() {
	if(InputObject.isMouseDown) {
		var MovementVector = MousePosition.clone();
		MovementVector.sub(OldMousePosition);
		
		var MovementAxis = new THREE.Vector3(-MovementVector.y, MovementVector.x, 0);
		MovementAxis.normalize();
		
		cubicLattice.rotateOnAxis(MovementAxis,MovementVector.length() / 8);
	}
}

//we have layers of shapes. Their distance is a radius


function init_cubicLattice_stuff() {
//	
//	var rhombohedron_line_pairs = new Uint32Array([
//	                                   0,1,		0,2,	0,3,
//	                                   1,4,		2,5,	3,6,
//	                                   1,6,		2,4,	3,5,
//	                                   7,4,		7,5,	7,6]);
//	var rhombohedron_vertices_numbers = new Float32Array([
//	                                   0,0,0,
//	                                   1,0,0,
//	                                   1/Math.sqrt(5),2/Math.sqrt(5),0,
//	                                   0.5, (PHI-1)/2, PHI/2,
//	                                   
//	                                   0.5 + 1/Math.sqrt(5), (PHI-1)/2 + 2/Math.sqrt(5), PHI/2,
//	                                   1.5, (PHI-1)/2, PHI/2,
//	                                   1.5 + 1/Math.sqrt(5), (PHI-1)/2 + 2/Math.sqrt(5), PHI/2 ]);
//	
//	var center = new THREE.Vector3(0,0,0);
//	for(var i = 0; i < 6; i++){
//		center.x += rhombohedron_vertices_numbers[i*3+0];
//		center.y += rhombohedron_vertices_numbers[i*3+1];
//		center.z += rhombohedron_vertices_numbers[i*3+2];
//	}
//	center.multiplyScalar()
//	for(var i = 0; i < 6; i++){
//		rhombohedron_vertices_numbers[i*3+0] -= center.x;
//		center.y += rhombohedron_vertices_numbers[i*3+1];
//		center.z += rhombohedron_vertices_numbers[i*3+2];
//	}
//	
//	for( var i = 0; i < golden_rhombohedra.length; i++) { 
//		golden_rhombohedra[i] = new THREE.Line( new THREE.BufferGeometry(), materialx, THREE.LinePieces );
//		golden_rhombohedra[i].geometry.addAttribute( 'position', new THREE.BufferAttribute( rhombohedron_vertices_numbers, 3 ) );
//		golden_rhombohedra[i].geometry.addAttribute( 'index', new THREE.BufferAttribute( rhombohedron_line_pairs, 1 ) );
//	}
	
	var cubicLattice_geometry = new THREE.Geometry();
	
	for( var i = 0; i < cubicLattice_width; i++){
		for( var j = 0; j < cubicLattice_width; j++){
			for( var k = 0; k < cubicLattice_width; k++){
				//if you want an octahedral lattice
//				if( i % 2 === 0 && j % 2 === 0 && k % 2 === 0 ) continue;
//				if( i % 2 === 1 && j % 2 === 1 && k % 2 === 0 ) continue;
//				if( i % 2 === 1 && j % 2 === 0 && k % 2 === 1 ) continue;
//				if( i % 2 === 0 && j % 2 === 1 && k % 2 === 1 ) continue;
				
				cubicLattice_geometry.vertices.push(new THREE.Vector3(
						(i - cubicLattice_width / 2 + 0.5) * 3.6 / cubicLattice_width,
						(j - cubicLattice_width / 2 + 0.5) * 3.6 / cubicLattice_width,
						(k - cubicLattice_width / 2 + 0.5) * 3.6 / cubicLattice_width ) );
			}
		}
	}
	
	var cubicLatticematerial = new THREE.PointCloudMaterial({
		size: 0.065,
		vertexColors: THREE.VertexColors
	});
	for( var i = 0; i < cubicLattice_width*cubicLattice_width*cubicLattice_width; i++){
		cubicLattice_geometry.colors[i] = new THREE.Color( 1, 0.5, 0 );
	}
	
	//cubicLattice_geometry.addAttribute( 'color', new THREE.BufferAttribute(cubicLattice_colors, 3) );
	cubicLattice = new THREE.PointCloud( cubicLattice_geometry, cubicLatticematerial );
}