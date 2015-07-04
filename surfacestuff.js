function HandleCapsidOpenness(openness, vertices_numbers) {
	if(InputObject.isMouseDown) {
		capsidopenness += capsidopeningspeed;
		if(capsidopenness > 1) {
			capsidopenness = 1;
			capsidopeningspeed = 0.018;
		}
	}
	else {
		capsidopenness -= capsidopeningspeed;
		if(capsidopenness < 0) {
			capsidopenness = 0;
			capsidopeningspeed = 0.018;
		}
	}
	
	deduce_surface(capsidopenness, surface_vertices);
	
	surface_vertices.needsUpdate = true;
}

function deduce_first_triangle(openness, vertices_numbers, rotation) {
	var origin_height = (1-capsidopenness) * Math.sqrt( PHI*PHI+1) / 2;
	
	vertices_numbers.setXYZ(0, 0, 0, origin_height);
	
	var p = Math.atan(PHI) + capsidopenness * (TAU/4 - Math.atan(PHI));
	var v = new THREE.Vector3( Math.sin(p), 0, -Math.cos(p));
	v.setY(-Math.sin(rotation)*v.x);
	v.setX( Math.cos(rotation)*v.x);
	vertices_numbers.setXYZ(1, v.x, v.y, v.z + origin_height );
	
	var q = Math.atan(PHI/(PHI-1)) + capsidopenness* (TAU/4-Math.atan(PHI/(PHI-1)));
	var sideways_vector = new THREE.Vector3(Math.sin(rotation),Math.cos(rotation),0);
	sideways_vector.multiplyScalar(Math.sin(q));		
	var downward_vector = new THREE.Vector3(0,0,0);
	downward_vector.crossVectors(sideways_vector,v);
	downward_vector.normalize();
	downward_vector.multiplyScalar(Math.cos(q));		
	
	var Ou = v.clone();
	var u_projected_on_v_length = 0.5; //get from net
	Ou.multiplyScalar(u_projected_on_v_length);
	
	var u = new THREE.Vector3();
	u.addVectors(downward_vector, sideways_vector);
	var Ou_to_u_length = HS3; //get from net
	u.multiplyScalar(Ou_to_u_length);
	u.add(Ou);
	vertices_numbers.setXYZ(2, u.x, u.y, u.z + origin_height );
	
	var v2 = new THREE.Vector2(v.x,v.y);
	var u2 = new THREE.Vector2(u.x,u.y);
	return Math.acos(v2.dot(u2) / v2.length() / u2.length());
}
	
function deduce_surface(openness, vertices_numbers) {	
	//the first three vertices
	{		
		var triangle_projected_angle = deduce_first_triangle(openness, vertices_numbers, 0);
		deduce_first_triangle(openness, vertices_numbers, 2.5 * triangle_projected_angle - TAU/3);
	}
	
	for( var i = 3; i < 22; i++) {
		var theta = minimum_angles[i] + openness * (TAU/2 - minimum_angles[i]);
		
		var a_index = vertices_derivations[i][0];
		var b_index = vertices_derivations[i][1];
		var c_index = vertices_derivations[i][2];
		
		var a = new THREE.Vector3( //this is our origin
			vertices_numbers.array[a_index * 3 + 0],
			vertices_numbers.array[a_index * 3 + 1],
			vertices_numbers.array[a_index * 3 + 2]);	
			
		var a_net = new THREE.Vector3( //this is our origin
			flatnet_vertices.array[a_index * 3 + 0],
			flatnet_vertices.array[a_index * 3 + 1],
			0);	
		
		var crossbar_unit = new THREE.Vector3(
			vertices_numbers.array[b_index * 3 + 0],
			vertices_numbers.array[b_index * 3 + 1],
			vertices_numbers.array[b_index * 3 + 2]);
		crossbar_unit.sub(a);			
		crossbar_unit.normalize();
		
		var net_crossbar_unit = new THREE.Vector3(
			flatnet_vertices.array[b_index*3+0],
			flatnet_vertices.array[b_index*3+1],
			0);
		net_crossbar_unit.sub(a_net);
		net_crossbar_unit.normalize();
		
		var d_net = new THREE.Vector3( 
			flatnet_vertices.array[i*3+0],
			flatnet_vertices.array[i*3+1],
			0);
		d_net.sub(a_net);
		var d_hinge_origin_length = d_net.length() * get_cos( d_net, net_crossbar_unit);	
		
		var d_hinge_origin = new THREE.Vector3(
			crossbar_unit.x * d_hinge_origin_length,
			crossbar_unit.y * d_hinge_origin_length,
			crossbar_unit.z * d_hinge_origin_length);
			
		var d_hinge_origin_net = new THREE.Vector3(
			net_crossbar_unit.x * d_hinge_origin_length,
			net_crossbar_unit.y * d_hinge_origin_length,
			net_crossbar_unit.z * d_hinge_origin_length);
			
		var d_hinge_net = d_net.clone();
		d_hinge_net.sub( d_hinge_origin_net );

		var c = new THREE.Vector3(
			vertices_numbers.array[c_index * 3 + 0],
			vertices_numbers.array[c_index * 3 + 1],
			vertices_numbers.array[c_index * 3 + 2]);
		c.sub(a);
		var c_hinge_origin_length = c.length() * get_cos(crossbar_unit, c);		
		var c_hinge_origin = new THREE.Vector3(
			crossbar_unit.x * c_hinge_origin_length,
			crossbar_unit.y * c_hinge_origin_length,
			crossbar_unit.z * c_hinge_origin_length);
			
		var c_hinge_unit = new THREE.Vector3();
		c_hinge_unit.subVectors( c, c_hinge_origin);
		c_hinge_unit.normalize();
		var c_hinge_component = c_hinge_unit.clone();
		c_hinge_component.multiplyScalar( Math.cos(theta) * d_hinge_net.length());
			
		var downward_vector_unit = new THREE.Vector3();		
		downward_vector_unit.crossVectors(crossbar_unit, c);
		downward_vector_unit.normalize();
		var downward_component = downward_vector_unit.clone();
		downward_component.multiplyScalar(Math.sin(theta) * d_hinge_net.length());
		
		var d = new THREE.Vector3();
		d.addVectors(downward_component, c_hinge_component);
		d.add( d_hinge_origin );
		d.add( a );
		
		vertices_numbers.setXYZ(i, d.x,d.y,d.z);
	}
}

function HandleCapsidRotation() {
	//plan: it rotates slowly on two axes, such that it is always ready to have an axis point directly up
	//no, rotates just about the axis through vertices 6 and the origin
	//when player clicks, it rotates so an axis points at them, then opens. Could be a nice anticipation, like the foot-stamp - make edges glow, or have particles from around it get sucked in
	
	var normalturningspeed = TAU/5/2; //this is the amount you want to do in a second
	normalturningspeed *= delta_t;	
	
	if(capsidopenness ===0) {
		surfaceangle += normalturningspeed;
	}
	else { //we want to get it to zero
		while(surfaceangle > TAU / 10)
			surfaceangle -= TAU/5; //unnoticeable
		
		//when capsidopenness = 1, we want turningspeed to be -surfaceangle. We also want it to be a minimum of TAU/5/2 
		var turningspeed = Math.pow(capsidopenness, 5) * -surfaceangle;
		if(Math.abs(turningspeed) < normalturningspeed) {
			if(turningspeed > 0)
				turningspeed = normalturningspeed;
			else
				turningspeed = -normalturningspeed;
		}
		
		surfaceangle += turningspeed;
		
		if(Math.abs(surfaceangle) <= Math.abs(turningspeed) )
			surfaceangle = 0;
	}
	
	var axis = new THREE.Vector3( 	surface_vertices.array[6*3+0] - surface_vertices.array[19*3+0],
									surface_vertices.array[6*3+1] - surface_vertices.array[19*3+1],
									surface_vertices.array[6*3+2] - surface_vertices.array[19*3+2]);
	axis.normalize();
	
	for( var i = 0; i < 22; i++){
		var d = get_vector(i, SURFACE);
		d.applyAxisAngle(axis, surfaceangle);
		surface_vertices.setXYZ(i, d.x,d.y,d.z);
	}
}

function update_surfperimeter() {
	for( var i = 0; i < surfperimeter_cylinders.length; i++) {
		if(logged!=1)console.log(surfperimeter_cylinders[i].geometry.attributes.position.array);
		//they zigzag, so odd i's will be at one end and even at the other
		for( var j = 0; j < surfperimeter_cylinders[i].geometry.attributes.position.array.length / 3; j+=2) {
			surfperimeter_cylinders[i].geometry.attributes.position.array[  j  *3+0] = surface_vertices.array[surfperimeter_line_index_pairs[i*2+0]*3+0];
			surfperimeter_cylinders[i].geometry.attributes.position.array[  j  *3+1] = surface_vertices.array[surfperimeter_line_index_pairs[i*2+0]*3+1];
			surfperimeter_cylinders[i].geometry.attributes.position.array[  j  *3+2] = surface_vertices.array[surfperimeter_line_index_pairs[i*2+0]*3+2];
			
			surfperimeter_cylinders[i].geometry.attributes.position.array[(j+1)*3+0] = surface_vertices.array[surfperimeter_line_index_pairs[i*2+1]*3+0];
			surfperimeter_cylinders[i].geometry.attributes.position.array[(j+1)*3+1] = surface_vertices.array[surfperimeter_line_index_pairs[i*2+1]*3+1];
			surfperimeter_cylinders[i].geometry.attributes.position.array[(j+1)*3+2] = surface_vertices.array[surfperimeter_line_index_pairs[i*2+1]*3+2];
		}
		
		//they're infinitely thin. Ugh. Rotation to attach points?
		surfperimeter_cylinders[i].geometry.attributes.position.needsUpdate = true;
	}
	logged = 1;
}