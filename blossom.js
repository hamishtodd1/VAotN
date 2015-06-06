function HandleCapsidOpenness(openness, vertices_numbers) {
	var capsidopeningspeed = 0.01;

	// if( !isMouseDown ) {
		// if( capsidopenness === 1)
 			// return;
		// capsidopenness += capsidopeningspeed;
		// if( capsidopenness >= 1 )
			// capsidopenness = 1;
	// }
	// else {
		// if( capsidopenness === 0)
 			// return;
		// capsidopenness -= capsidopeningspeed;
		// if( capsidopenness <= 0 )
			// capsidopenness = 0;
	// }
	
	capsidclock += 1;
	var static_capsid_wait = 70;
	var moving_capsid_wait = 1/capsidopeningspeed;
	if(capsidclock < static_capsid_wait )
		capsidopenness = 0;
	else if(capsidclock < static_capsid_wait + moving_capsid_wait ) {
		capsidopenness += capsidopeningspeed;
		if(capsidopenness > 1) {
			capsidopenness = 1;
			capsidclock = static_capsid_wait + moving_capsid_wait + 1;
		}
	}
	else if( capsidclock > static_capsid_wait * 2 + moving_capsid_wait){
		capsidopenness -= capsidopeningspeed;
		if(capsidopenness < 0) {
			capsidopenness = 0;
			capsidclock = 0;
		}
	}
	
	deduce_surface(capsidopenness, surface_vertices.array);
	
	surface_vertices.needsUpdate = true;
}
	
function deduce_surface(openness, vertices_numbers) {	
	//the first three vertices
	{
		var startingangle = 2 * Math.atan(PHI/(PHI-1));
		var theta = startingangle * capsidopenness / 2;
		//remember edge length is 1
		
		for( var i = 0; i < 22 * 3; i++ )
			surface_vertices_numbers[i] = flatnet_vertices_numbers[i];
		
		/*surface_vertices_numbers[0 + 0] = 0;
		surface_vertices_numbers[0 + 1] = 0;
		surface_vertices_numbers[0 + 2] = capsidopenness * Math.sqrt( (5 + Math.sqrt(5) ) / 2);
		
		surface_vertices_numbers[3 + 0] = 0;
		surface_vertices_numbers[3 + 1] = Math.sin(theta);
		surface_vertices_numbers[3 + 2] = surface_vertices_numbers[2] - Math.cos(theta);*/
	}
	
	//if there's a mismatch between the poly and the net, then there'll be one between the poly and the surface, because the surface is the net folded up
	for( var i = 3; i < 22; i++) {
		var theta = minimum_angles[i] + openness * (TAU/2 - minimum_angles[i]);
		
		var a_index = vertices_derivations[i][0];
		var b_index = vertices_derivations[i][1];
		var c_index = vertices_derivations[i][2];
		
		var a = new THREE.Vector3( //this is our origin
			vertices_numbers[a_index * 3 + 0],
			vertices_numbers[a_index * 3 + 1],
			vertices_numbers[a_index * 3 + 2]);	
			
		var a_net = new THREE.Vector3( //this is our origin
			flatnet_vertices.array[a_index * 3 + 0],
			flatnet_vertices.array[a_index * 3 + 1],
			0);	
		
		var crossbar_unit = new THREE.Vector3(
			vertices_numbers[b_index * 3 + 0],
			vertices_numbers[b_index * 3 + 1],
			vertices_numbers[b_index * 3 + 2]);
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
			vertices_numbers[c_index * 3 + 0],
			vertices_numbers[c_index * 3 + 1],
			vertices_numbers[c_index * 3 + 2]);
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
		downward_component.multiplyScalar(Math.sin(theta) * d_hinge_net.length())
		
		var d = new THREE.Vector3();
		d.addVectors(downward_component, c_hinge_component);
		d.add( d_hinge_origin );
		d.add( a );
		
		vertices_numbers[ i * 3 + 0] = d.x;
		vertices_numbers[ i * 3 + 1] = d.y;
		vertices_numbers[ i * 3 + 2] = d.z
	}
}