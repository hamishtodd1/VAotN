function HandleCapsidOpenness(openness, vertices_numbers) {
	if(InputObject.isMouseDown)
		capsidopeningspeed = 0.018;
	else
		capsidopeningspeed = -0.018;
	
	capsidopenness += capsidopeningspeed;
	
	if(capsidopenness > 1) {
		capsidopenness = 1;
		capsidopeningspeed = 0;
	}
	if(capsidopenness < 0) {
		capsidopenness = 0;
		capsidopeningspeed = 0;
	}
	
	deduce_surface(capsidopenness, surface_vertices);
	
	surface_vertices.needsUpdate = true;
	
	//you should definitely have this happen for the protein as well
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
	//when player clicks, it rotates so an axis points at them, then opens. Could be a nice anticipation, like the foot-stamp - make edges glow, or have particles from around it get sucked in
	
	var normalturningspeed = TAU/5/2; //this is the amount you want to do in a second
	normalturningspeed *= delta_t;	
	
	if(capsidopenness ===0) {
		surfaceangle += normalturningspeed;
	}
	else { //we want to get surfaceangle to zero
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

function put_tube_in_buffer(A,B, mybuffer, radius ) {
	if(radius==undefined)
		radius = 0.02; 
	
	var A_to_B = new THREE.Vector3(B.x-A.x, B.y-A.y, B.z-A.z);
	var perp = new THREE.Vector3(A_to_B.y*A_to_B.y+A_to_B.z*A_to_B.z, A_to_B.y*-A_to_B.x,A_to_B.z*-A_to_B.x);
	perp.normalize();
	for( var i = 0; i < mybuffer.length/3/2; i++) {
		var theta = i * TAU/(mybuffer.length/3/2);
		var radiuscomponent = perp.clone();
		radiuscomponent.multiplyScalar(radius);
		radiuscomponent.applyAxisAngle(A_to_B, theta);
		
		mybuffer[ i*2 * 3 + 0] = A.x + radiuscomponent.x;
		mybuffer[ i*2 * 3 + 1] = A.y + radiuscomponent.y;
		mybuffer[ i*2 * 3 + 2] = A.z + radiuscomponent.z;
		
		mybuffer[(i*2+1) * 3 + 0] = B.x + radiuscomponent.x;
		mybuffer[(i*2+1) * 3 + 1] = B.y + radiuscomponent.y;
		mybuffer[(i*2+1) * 3 + 2] = B.z + radiuscomponent.z;
	}
}

function ziplocation(a1,a2,b1,b2,zipwidth){
	dist1 = a1.distanceTo(b1);
	dist2 = a2.distanceTo(b2);
	if(dist1 > zipwidth && dist2 > zipwidth) return "not on here";
	
	var proportion_along_midline;
	var zippoint;
	if(dist1>dist2){
		proportion_along_midline = (zipwidth-dist2)/(dist1-dist2);
		if(proportion_along_midline > 1 || proportion_along_midline < 0) return "invalid";
		
		zippoint = a2.clone();
		zippoint.lerp(b2,0.5);
		
		var endzippoint = a1.clone();
		endzippoint.lerp(b1,0.5);
		
		zippoint.lerp(endzippoint,proportion_along_midline);
	}
	else {
		proportion_along_midline = (zipwidth-dist1)/(dist2-dist1);
		if(proportion_along_midline > 1 || proportion_along_midline < 0) return "invalid";
		
		zippoint = a1.clone();
		zippoint.lerp(b1,0.5);
		
		var endzippoint = a2.clone();
		endzippoint.lerp(b2,0.5);
		
		zippoint.lerp(endzippoint,proportion_along_midline);
	}
	
	return zippoint;
}

function change_radius(sphere, radius) {
	var current_radius = Math.sqrt( Math.pow(sphere.geometry.attributes.position.array[0],2)+Math.pow(sphere.geometry.attributes.position.array[1],2)+Math.pow(sphere.geometry.attributes.position.array[2],2) );
	for( var i = 0; i < sphere.geometry.attributes.position.array.length; i++) {
		sphere.geometry.attributes.position.array[i] *= radius / current_radius;
	}
	sphere.geometry.attributes.position.needsUpdate = true;
}

function update_surfperimeter() {
	var surfperimeterradius = 0;
	var proportion_of_opening_for_swell = 1;
	if( capsidopenness < proportion_of_opening_for_swell )
		surfperimeterradius = capsidopenness / proportion_of_opening_for_swell * surfperimeter_default_radius;
	else
		surfperimeterradius = surfperimeter_default_radius;
	
	var a1index, a2index, b1index, b2index;
	var a1,a2,b1,b2;
	a1 = new THREE.Vector3(0,0,0);
	for( var i = 0; i < surfperimeter_cylinders.length; i++){
		put_tube_in_buffer(a1,a1, surfperimeter_cylinders[i].geometry.attributes.position.array);
		surfperimeter_spheres[i].position.copy(a1);
		
		surfperimeter_cylinders[i].geometry.attributes.position.needsUpdate = true;
		surfperimeter_spheres[i].geometry.attributes.position.needsUpdate = true;
	}
	if(capsidopenness != 0 ) {
		for(var i = 0; i < 22; i++) {
			var Aindex = surfperimeter_line_index_pairs[i*2];
			var Bindex = surfperimeter_line_index_pairs[i*2+1];
			
			A = new THREE.Vector3(
					surface_vertices.array[Aindex*3+0],
					surface_vertices.array[Aindex*3+1],
					surface_vertices.array[Aindex*3+2]);
			B = new THREE.Vector3(
					surface_vertices.array[Bindex*3+0],
					surface_vertices.array[Bindex*3+1],
					surface_vertices.array[Bindex*3+2]);
			
			change_radius(surfperimeter_spheres[i], surfperimeterradius);
			surfperimeter_spheres[i].position.copy(A);
			
			put_tube_in_buffer(A,B, surfperimeter_cylinders[i].geometry.attributes.position.array, surfperimeterradius);
		}
	}
	
	var proportion_of_opening_for_blast = 0.36;
	var blast_location = capsidopenness / proportion_of_opening_for_blast * 3;
	var blast_end = (capsidopenness+0.07) / proportion_of_opening_for_blast * 3;
	
	for( var grooveside = 0; grooveside < 10; grooveside++) {
		var groove = Math.floor(grooveside / 2);
		
		if( blast_end > 3 || blast_location === 0 || capsidopeningspeed < 0 ){
			put_tube_in_buffer(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0), blast_cylinders[grooveside].geometry.attributes.position.array, surfperimeter_default_radius);
			blast_cylinders[grooveside].geometry.attributes.position.needsUpdate = true;
			continue;
		}
		
		for( var level = 0; level < groovepoints[groove].length/2-1; level++) {
			if( level < Math.floor(blast_location) || level > Math.floor(blast_end)  )
				continue;
			
			var a1index = a2index = 0;
			if( level < groovepoints[groove].length/2-1) { //if we have a "valid" value
				if( grooveside % 2 === 0) {
					a1index = groovepoints[groove][level*2+0];
					a2index = groovepoints[groove][level*2+2];
				}
				else {
					a1index = groovepoints[groove][level*2+1];
					a2index = groovepoints[groove][level*2+3];
				}
			}
			var a1 = new THREE.Vector3(
					surface_vertices.array[a1index*3+0],
					surface_vertices.array[a1index*3+1],
					surface_vertices.array[a1index*3+2]);
			var a2 = new THREE.Vector3(
					surface_vertices.array[a2index*3+0],
					surface_vertices.array[a2index*3+1],
					surface_vertices.array[a2index*3+2]);
			
			var blastflash_beginning = a2.clone();
			blastflash_beginning.sub(a1);
			var blastflash_end = blastflash_beginning.clone();
			
			blastflash_beginning.multiplyScalar(blast_location - level);
			blastflash_end.multiplyScalar(blast_end - level);
			blastflash_beginning.add(a1);
			blastflash_end.add(a1);
			
			if(blast_end - level > 1)
				blastflash_end.copy(a2);
			if(blast_location - level < 0)
				blastflash_beginning.copy(a1);
					
			put_tube_in_buffer(blastflash_beginning,blastflash_end, blast_cylinders[grooveside].geometry.attributes.position.array, surfperimeter_default_radius * 1.5);
			
			blast_cylinders[grooveside].geometry.attributes.position.needsUpdate = true;
		}
	}
}