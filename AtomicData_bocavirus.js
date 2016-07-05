/*
 * TODO
 * -colors
 * -very minor jitter (?) on DNA and maybe protein
 * -pentagon caps, not triangle.
 * 
 * -lots of pictures
-bocavirus zooms out
-bocavirus colors change
-bocavirus pentamers flash
 * 
 * -lights
 * 
 * "twelve sides" glow. 4 groups of 3, around tetrahedral axes.
 * "clusters of five", same glow for the three clusters nearest the camera
 */

/*
 * Springy DNA - really worth doing, the first interactive thing they see
 * for every strand, basis vectors at both their ends, plus another basis vector that is the cross product of those basis vectors
 * When the player rotates, it gives momentum to the dodeca vertices. They're trapped in a narrow cone. 
 */

function update_bocavirus() {
	//if you're on DNA_CAGE_MODE then we unfold, if you're on STATIC_PROTEIN_MODE we fold.
	
	//Potential speedup: merge proteins
	
	if(isMouseDown) {
		bocavirus_MovementAngle = Mouse_delta.length() / 3;
		bocavirus_MovementAxis.set(-Mouse_delta.y, Mouse_delta.x, 0);
		bocavirus_MovementAxis.normalize();
	}
	else {
		bocavirus_MovementAngle *= 0.93;
	}
	
	var DNA_cage_axis = bocavirus_MovementAxis.clone();
	DNA_cage.worldToLocal(DNA_cage_axis);
	DNA_cage.rotateOnAxis(DNA_cage_axis, bocavirus_MovementAngle);
	DNA_cage.updateMatrixWorld();
	
	for(var i = 0; i < neo_bocavirus_proteins.length; i++)
	{
		var tempaxis = bocavirus_MovementAxis.clone();
		neo_bocavirus_proteins[i].worldToLocal(tempaxis);
		neo_bocavirus_proteins[i].rotateOnAxis(tempaxis, bocavirus_MovementAngle);
		neo_bocavirus_proteins[i].updateMatrixWorld();
	}
	
//	for(var i = 0; i<bocavirus_proteins.length; i++){
//		fix_protein_to_anchors_vecs(
//				bocavirus_vertices[i*3+0],
//				bocavirus_vertices[i*3+1],
//				bocavirus_vertices[i*3+2],
//				bocavirus_proteins[i]);
//	}
}

function init_DNA_cage(){
	DNA_cage = new THREE.LineSegments( new THREE.BufferGeometry(), new THREE.LineBasicMaterial({color: 0xf0f00f,vertexColors: THREE.VertexColors}), THREE.LineSegmentsPieces);
	 
	var avg = new THREE.Vector3();
	for(var i = 0; i<DNA_vertices_numbers.length / 3; i++){
		avg.x += DNA_vertices_numbers[i*3+0];
		avg.y += DNA_vertices_numbers[i*3+1];
		avg.z += DNA_vertices_numbers[i*3+2];
	}
	avg.multiplyScalar(3/DNA_vertices_numbers.length);
	var scaleFactor = 0.87*2.3/109; //chosen quite arbitrarily, can change a lot
	for(var i = 0; i<DNA_vertices_numbers.length / 3; i++){
		DNA_vertices_numbers[i*3+0] -= avg.x;
		DNA_vertices_numbers[i*3+1] -= avg.y;
		DNA_vertices_numbers[i*3+2] -= avg.z;
		
		DNA_vertices_numbers[i*3+0] *= scaleFactor;
		DNA_vertices_numbers[i*3+1] *= scaleFactor;
		DNA_vertices_numbers[i*3+2] *= scaleFactor;
	}
	
	
	var yaw_correction_rotation = -0.076; //gotten "heuristically"
	var pitch_correction_rotation = 0.07;
	for(var i = 0; i<60; i++){
		var strand_avg = new THREE.Vector3();
		for(var j = 0; j<50; j++){
			strand_avg.x += DNA_vertices_numbers[(i*50+j)*3+0];
			strand_avg.y += DNA_vertices_numbers[(i*50+j)*3+1];
			strand_avg.z += DNA_vertices_numbers[(i*50+j)*3+2];
		}
		strand_avg.multiplyScalar( 1 / 50);
		
		var yaw_correction_axis = strand_avg.clone();
		yaw_correction_axis.normalize(); //not a great way of doing it.
		for(var j = 0; j<50; j++){
			var ourpoint = new THREE.Vector3(DNA_vertices_numbers[(i*50+j)*3+0],DNA_vertices_numbers[(i*50+j)*3+1],DNA_vertices_numbers[(i*50+j)*3+2]);
			ourpoint.applyAxisAngle(yaw_correction_axis,yaw_correction_rotation);
			
			DNA_vertices_numbers[(i*50+j)*3+0] = ourpoint.x;
			DNA_vertices_numbers[(i*50+j)*3+1] = ourpoint.y;
			DNA_vertices_numbers[(i*50+j)*3+2] = ourpoint.z;
		}

		//so what would be nice would be to rotate them a bit so that you remove those kinks. Some cross product.
		var firstbackbonepoint_index = i * 50;
		var lastbackbonepoint_index = i * 50 + 48;
		var firstbackbonepoint_to_lastbackbonepoint = new THREE.Vector3(
			DNA_vertices_numbers[lastbackbonepoint_index*3+0]-DNA_vertices_numbers[firstbackbonepoint_index*3+0],
			DNA_vertices_numbers[lastbackbonepoint_index*3+1]-DNA_vertices_numbers[firstbackbonepoint_index*3+1],
			DNA_vertices_numbers[lastbackbonepoint_index*3+2]-DNA_vertices_numbers[firstbackbonepoint_index*3+2]);
		var pitch_axis_origin = firstbackbonepoint_to_lastbackbonepoint.clone();
		pitch_axis_origin.multiplyScalar(0.5);
		pitch_axis_origin.x += DNA_vertices_numbers[firstbackbonepoint_index*3+0];
		pitch_axis_origin.y += DNA_vertices_numbers[firstbackbonepoint_index*3+1];
		pitch_axis_origin.z += DNA_vertices_numbers[firstbackbonepoint_index*3+2];
		var pitch_axis = new THREE.Vector3();
		pitch_axis.crossVectors(pitch_axis_origin,firstbackbonepoint_to_lastbackbonepoint);
		pitch_axis.normalize();
		
		for(var j = 0; j<50; j++){
			var ourpoint = new THREE.Vector3(DNA_vertices_numbers[(i*50+j)*3+0],DNA_vertices_numbers[(i*50+j)*3+1],DNA_vertices_numbers[(i*50+j)*3+2]);
			ourpoint.sub(pitch_axis_origin);
			ourpoint.applyAxisAngle(pitch_axis,pitch_correction_rotation);
			ourpoint.add(pitch_axis_origin);
			
			DNA_vertices_numbers[(i*50+j)*3+0] = ourpoint.x;
			DNA_vertices_numbers[(i*50+j)*3+1] = ourpoint.y;
			DNA_vertices_numbers[(i*50+j)*3+2] = ourpoint.z;
		}
	}
	

	
	DNA_cage.geometry.addAttribute( 'position', new THREE.BufferAttribute( DNA_vertices_numbers, 3 ) );
	
	
	var DNA_colors = new Float32Array(DNA_vertices_numbers.length);
	var DNA_line_pairs = new Uint16Array(DNA_vertices_numbers.length / 3 * 2);
	
	for(var i = 0; i<60;i++){ //each of the 60 strands has 50 "atoms"
		for(var j = 0; j<50; j++){
			if(j==49){
				var closest_quadrance_so_far = 10000;
				var closest_index_so_far = 666;
				
				for( var k = 0; k < 60; k++){
					if(k==i)
						continue;
					
					if(quadrance_between_DNA_points(i*50+j,k*50) < closest_quadrance_so_far){
						closest_index_so_far = k*50;
						closest_quadrance_so_far = quadrance_between_DNA_points(i*50+j,k*50);
					}
					if(quadrance_between_DNA_points(i*50+j,k*50+48) < closest_quadrance_so_far){
						closest_index_so_far = k*50+48;
						closest_quadrance_so_far = quadrance_between_DNA_points(i*50+j,k*50+48);
					}
				}
				
				//imaginary backbone
				DNA_line_pairs[ 2*(i*50+j) ] = i*50+j-1;
				DNA_line_pairs[2*(i*50+j)+1] = closest_index_so_far;
				
				//color is a base
				DNA_colors[(i*50+j)*3+0] = 245/255; DNA_colors[(i*50+j)*3+1] = 220/255; DNA_colors[(i*50+j)*3+2] = 176/255;
			}
			else if(j%2==0) {//base
				DNA_line_pairs[ 2*(i*50+j) ] = i*50+j;
				DNA_line_pairs[2*(i*50+j)+1] = i*50+j+1;
				
				//color is backbone
				DNA_colors[(i*50+j)*3+0] = 208/255; DNA_colors[(i*50+j)*3+1] = 87/255; DNA_colors[(i*50+j)*3+2] = 106/255;
			}
			else {//backbone
				DNA_line_pairs[ 2*(i*50+j) ] = i*50+j-1;
				DNA_line_pairs[2*(i*50+j)+1] = i*50+j+1;
				
				//color is a base
				DNA_colors[(i*50+j)*3+0] = 245/255; DNA_colors[(i*50+j)*3+1] = 220/255; DNA_colors[(i*50+j)*3+2] = 176/255;
			}
		}
	}
	DNA_cage.geometry.addAttribute( 'color', new THREE.BufferAttribute(DNA_colors, 3) );
	DNA_cage.geometry.setIndex( new THREE.BufferAttribute( DNA_line_pairs, 1 ) );
	
	//because it ain't perfect
	DNA_cage.quaternion.set(-0.0028151799901586245, -0.03798590756432208, -0.09772936010824641, 0.9944838448969249);
}

function quadrance_between_DNA_points(index1,index2){
	var dX = DNA_cage.geometry.attributes.position.array[index1*3+0] - DNA_cage.geometry.attributes.position.array[index2*3+0];
	var dY = DNA_cage.geometry.attributes.position.array[index1*3+1] - DNA_cage.geometry.attributes.position.array[index2*3+1];
	var dZ = DNA_cage.geometry.attributes.position.array[index1*3+2] - DNA_cage.geometry.attributes.position.array[index2*3+2];
	
	return dX*dX + dY*dY + dZ*dZ;
}

