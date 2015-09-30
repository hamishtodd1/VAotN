function update_3DLattice() {
	if(InputObject.isMouseDown) {
		var MovementVector = MousePosition.clone();
		MovementVector.sub(OldMousePosition);
		
		var MovementAxis = new THREE.Vector3(-MovementVector.y, MovementVector.x, 0);
		MovementAxis.normalize();
		
		//goldenicos[0].rotateOnAxis(MovementAxis,MovementVector.length() / 5);
		
		for( var i = 0; i < golden_rhombohedra.length; i++){
			golden_rhombohedra[i].position.applyAxisAngle(MovementAxis,MovementVector.length() / 5);
			
			var myaxis = MovementAxis.clone();
			golden_rhombohedra[i].worldToLocal(myaxis);
			var myposition = new THREE.Vector3(0,0,0);
			golden_rhombohedra[i].worldToLocal(myposition);
			myaxis.sub(myposition);
			myaxis.normalize();
			golden_rhombohedra[i].rotateOnAxis(myaxis,MovementVector.length() / 5);
		}
	}
	
	//if explodedness =1 they're all out, if it's 0 they're at their fixed radius.
	//the second layer of rhombohedra has the extra aspect that clusters are a certain distance from a special point
//	var rhombohedra_dist = rhombohedra_min_dist + clamp(explodedness - rhombohedra_convergence_time,0) * rhombohedra_convergence_speed;
//	for(var i = 0; i<golden_rhombohedra.length; i++){
//		golden_rhombohedra[i].position.normalize();
//		golden_rhombohedra[i].position.multiplyScalar(rhombohedra_dist);
//	}
}

function clamp(val, minval){
	if( val > minval) return val;
	else return minval;
}

//we have layers of shapes. Their distance is a radius


function init_cubicLattice_stuff() {
	var dodecahedron_vertices = Array(20);
	dodecahedron_vertices[0] = new THREE.Vector3(1,-1,1);
	dodecahedron_vertices[1] = new THREE.Vector3(0,-1/PHI, PHI);
	dodecahedron_vertices[2] = new THREE.Vector3(-1,-1,1);
	dodecahedron_vertices[3] = new THREE.Vector3(-PHI,0, 1/PHI);
	dodecahedron_vertices[4] = new THREE.Vector3(-PHI,0,-1/PHI);
	dodecahedron_vertices[5] = new THREE.Vector3(-1,1,-1);
	dodecahedron_vertices[6] = new THREE.Vector3(0, 1/PHI,-PHI);
	dodecahedron_vertices[7] = new THREE.Vector3(1,1,-1);
	dodecahedron_vertices[8] =  new THREE.Vector3( 1/PHI, PHI,0);
	dodecahedron_vertices[9] =  new THREE.Vector3(-1/PHI, PHI,0);
	dodecahedron_vertices[10] = new THREE.Vector3(-1,1,1);
	dodecahedron_vertices[11] = new THREE.Vector3(0, 1/PHI, PHI);
	dodecahedron_vertices[12] = new THREE.Vector3(1,1,1);
	dodecahedron_vertices[13] = new THREE.Vector3( PHI,0, 1/PHI);
	dodecahedron_vertices[14] = new THREE.Vector3( PHI,0,-1/PHI);
	dodecahedron_vertices[15] = new THREE.Vector3(1,-1,-1);
	dodecahedron_vertices[16] = new THREE.Vector3(0,-1/PHI,-PHI);
	dodecahedron_vertices[17] = new THREE.Vector3(-1,-1,-1);
	dodecahedron_vertices[18] = new THREE.Vector3(-1/PHI,-PHI,0);
	dodecahedron_vertices[19] = new THREE.Vector3( 1/PHI,-PHI,0);
	for(var i = 0; i< dodecahedron_vertices.length; i++)
		dodecahedron_vertices[i].normalize();
	var virtual_icosahedron_vertices = Array(12);
	virtual_icosahedron_vertices[0] = new THREE.Vector3(0, 1, PHI);
	virtual_icosahedron_vertices[1] = new THREE.Vector3( PHI,0, 1);
	virtual_icosahedron_vertices[2] = new THREE.Vector3(0,-1, PHI);
	virtual_icosahedron_vertices[3] = new THREE.Vector3(-PHI,0, 1);
	virtual_icosahedron_vertices[4] = new THREE.Vector3(-1, PHI,0);
	virtual_icosahedron_vertices[5] = new THREE.Vector3( 1, PHI,0);
	virtual_icosahedron_vertices[6] = new THREE.Vector3( PHI,0,-1);
	virtual_icosahedron_vertices[7] = new THREE.Vector3( 1,-PHI,0);
	virtual_icosahedron_vertices[8] = new THREE.Vector3(-1,-PHI,0);
	virtual_icosahedron_vertices[9] = new THREE.Vector3(-PHI,0,-1);
	virtual_icosahedron_vertices[10] = new THREE.Vector3(0, 1,-PHI);
	virtual_icosahedron_vertices[11] = new THREE.Vector3(0,-1,-PHI);
	for(var i = 0; i < virtual_icosahedron_vertices.length; i++)
		virtual_icosahedron_vertices[i].normalize();
	
	var quasicrystalmaterial = new THREE.LineBasicMaterial({
		size: 0.065,
		color: 0x0000ff //can add shading
	});
	
	var p = 2*((1+Math.sqrt(5))/Math.sqrt(10+2*Math.sqrt(5)));
	var q = 4/Math.sqrt(10+2*Math.sqrt(5));
	var rhombohedron_h = Math.sqrt(1-(16/(30+6*Math.sqrt(5))));
	var rhombohedron_r = 4/Math.sqrt(30+2*Math.sqrt(5));
	var rhombohedron_s = 4/Math.sqrt(10+2*Math.sqrt(5));
	
	var rhombohedron_line_pairs = new Uint32Array([
       0,1,		0,2,	0,3,
       1,4,		1,5,	2,5,	2,6,	3,6,	3,4,
       7,4,		7,5,	7,6]);
	var rhombohedron_vertices_numbers = new Float32Array([
	   0,0,rhombohedron_h*1.5,
	   0,rhombohedron_r,0.5*rhombohedron_h,
	   rhombohedron_s/2,-rhombohedron_r/2,0.5*rhombohedron_h,
	   -rhombohedron_s/2,-rhombohedron_r/2,0.5*rhombohedron_h,
	   
	   -rhombohedron_s/2,rhombohedron_r/2,-0.5*rhombohedron_h,
	   rhombohedron_s/2,rhombohedron_r/2,-0.5*rhombohedron_h,
	   0,-rhombohedron_r,-0.5*rhombohedron_h,
	   0,0,rhombohedron_h*-1.5]);
	
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
		golden_rhombohedra[i] = new THREE.Line( new THREE.BufferGeometry(), quasicrystalmaterial, THREE.LinePieces );
		golden_rhombohedra[i].geometry.addAttribute( 'position', new THREE.BufferAttribute( rhombohedron_vertices_numbers, 3 ) );
		golden_rhombohedra[i].geometry.addAttribute( 'index', new THREE.BufferAttribute( rhombohedron_line_pairs, 1 ) );
		
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
		
		var dodecahedron_edge = dodecahedron_vertices[(i+1)%20].clone();
		dodecahedron_edge.sub(dodecahedron_vertices[i]);
		
		var first_rotation_axis = new THREE.Vector3(0,0,1);
		var first_rotation_angle = Math.acos(dodecahedron_vertices[i].dot(first_rotation_axis));
		first_rotation_axis.cross(dodecahedron_vertices[i]);
		first_rotation_axis.normalize();
		var first_rotation_quaternion = new THREE.Quaternion();
		golden_rhombohedra[i].rotateOnAxis( first_rotation_axis, first_rotation_angle );
		golden_rhombohedra[i].updateMatrixWorld();
		
		var corner_to_origin = dodecahedron_vertices[i].clone();
		corner_to_origin.negate();
		var corner_spindle = dodecahedron_edge.clone();
		corner_spindle.cross(corner_to_origin);
		var desired_rhombohedron_Y = corner_to_origin.clone();
		desired_rhombohedron_Y.cross(corner_spindle);
		console.log(desired_rhombohedron_Y);
		golden_rhombohedra[i].worldToLocal(desired_rhombohedron_Y);
		console.log(desired_rhombohedron_Y);
		
		var Y = new THREE.Vector3(0,1,0); //of course this isn't at a right angle to cornertoorigin
		var second_rotation_axis = desired_rhombohedron_Y.clone();
		second_rotation_axis.cross(Y);
		second_rotation_axis.normalize();
		var second_rotation_angle = Math.acos(desired_rhombohedron_Y.dot(Y) / desired_rhombohedron_Y.length());

		golden_rhombohedra[i].rotateOnAxis( second_rotation_axis, -second_rotation_angle );
		
		var rhomdisplacement = dodecahedron_vertices[i].clone();
		rhomdisplacement.multiplyScalar(1.2);
		golden_rhombohedra[i].position.add(rhomdisplacement);
	}
	
	//what we're planning is 20 rhomohedra, then 12 icosahedra, then 20*12=240 rhombohedra, then 20 triacontahedra (or switch those)? then icosahedra, then more icosahedra? or tria
	
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
		golden_triacontahedra[i] = new THREE.Line( new THREE.BufferGeometry(), quasicrystalmaterial, THREE.LinePieces );
		golden_triacontahedra[i].geometry.addAttribute( 'position', new THREE.BufferAttribute( triacontahedron_vertices_numbers, 3 ) );
		golden_triacontahedra[i].geometry.addAttribute( 'index', new THREE.BufferAttribute( triacontahedron_line_pairs, 1 ) );
	}
	
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
   	
   	for( var i = 0; i < goldenicos.length; i++) { 
   		goldenicos[i] = new THREE.Line( new THREE.BufferGeometry(), quasicrystalmaterial, THREE.LinePieces );
   		goldenicos[i].geometry.addAttribute( 'position', new THREE.BufferAttribute( goldenico_vertices_numbers, 3 ) );
   		goldenicos[i].geometry.addAttribute( 'index', new THREE.BufferAttribute( goldenico_line_pairs, 1 ) );
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