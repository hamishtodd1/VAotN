function irreg_deduce_surface(openness ){
	//ok what we REALLY want is to rotate it so that the central vertex has the same x and y as the eventual 3D center
	//we deduce the surface, get the 3Dcenter-to-centralvertex vector
	//length of that vector * (1-openness) is the z of the central vertex
	//get the angle between the edge connecting vertices 0 and 1 and the plane through vertex 0 perp to that previous vector. Call the angle theta 
	//TAU/4 - theta is the angle between that edge and the plane parallel to the camera's plane
	//do same thing for edge connecting 0 and 2.
	//at capsidopenness = 1 we must have first vertex = flatnet first vertex 
	
	//Stick the flatnet vertices into the first three. Deduce the rest.
	//Using three radii, get the location of the center.
	//Rotate such that center is in middle of screen (as it was before), as is vertex 0.
	//get angle between vector connecting vertices 1 and 0 and 18 and 0 in 2D
	//rotate such that that is on either side of the line between them on flatnet's gap.
	
	var central_rotationaxis = new THREE.Vector3(0,0,1);
	
	var vertex0 = new THREE.Vector3(flatnet_vertices.array[0*3+0],flatnet_vertices.array[0*3+1],flatnet_vertices.array[0*3+2]);
	var vertex1 = new THREE.Vector3(flatnet_vertices.array[1*3+0],flatnet_vertices.array[1*3+1],flatnet_vertices.array[1*3+2]);
	var vertex2 = new THREE.Vector3(flatnet_vertices.array[2*3+0],flatnet_vertices.array[2*3+1],flatnet_vertices.array[2*3+2]);
	
	var flatnet_midgap = vertex1.clone();
	flatnet_midgap.applyAxisAngle(central_rotationaxis, -TAU/12 );
	
	var center = tetrahedron_top(
			vertex0, vertex1, vertex2,
			varyingsurface_orientingradius[0],varyingsurface_orientingradius[1],varyingsurface_orientingradius[2]);
	if(center.z>0) center.z *= -1;
	var desired_center_location = new THREE.Vector3(0,0,-center.length());
	
	var first_rotationaxis = center.clone();
	first_rotationaxis.cross(desired_center_location);
	first_rotationaxis.normalize();
	var first_rotationangle = (1-openness) * Math.acos(center.dot(desired_center_location) / center.lengthSq()); //you may want a smaller or larger quantity of this
	vertex0.applyAxisAngle(first_rotationaxis, first_rotationangle);
	vertex1.applyAxisAngle(first_rotationaxis, first_rotationangle);
	vertex2.applyAxisAngle(first_rotationaxis, first_rotationangle);
	vertex0.z += (1-openness) * varyingsurface_orientingradius[0]; //nooo
	vertex1.z += (1-openness) * varyingsurface_orientingradius[0];
	vertex2.z += (1-openness) * varyingsurface_orientingradius[0];
	
	varyingsurface.geometry.attributes.position.array[0] = vertex0.x;
	varyingsurface.geometry.attributes.position.array[1] = vertex0.y;
	varyingsurface.geometry.attributes.position.array[2] = vertex0.z;
	varyingsurface.geometry.attributes.position.array[3] = vertex1.x;
	varyingsurface.geometry.attributes.position.array[4] = vertex1.y;
	varyingsurface.geometry.attributes.position.array[5] = vertex1.z;
	varyingsurface.geometry.attributes.position.array[6] = vertex2.x;
	varyingsurface.geometry.attributes.position.array[7] = vertex2.y;
	varyingsurface.geometry.attributes.position.array[8] = vertex2.z;
	
	deduce_most_of_surface(openness, varyingsurface.geometry.attributes.position); //Speedup opportunity: only work out vertex 18
	
	var vertex18flattened = new THREE.Vector3(varyingsurface.geometry.attributes.position.array[18*3+0],varyingsurface.geometry.attributes.position.array[18*3+1], 0);
	var vertex1flattened = vertex1.clone();
	vertex1flattened.z = 0;
	var gapangle = vertex18flattened.angleTo(vertex1flattened);
	var angle_offby = vertex1flattened.angleTo(flatnet_midgap) - gapangle / 2;
	
	vertex1.applyAxisAngle(central_rotationaxis, -angle_offby);
	vertex2.applyAxisAngle(central_rotationaxis, -angle_offby);
	
	varyingsurface.geometry.attributes.position.array[0] = vertex0.x;
	varyingsurface.geometry.attributes.position.array[1] = vertex0.y;
	varyingsurface.geometry.attributes.position.array[2] = vertex0.z;
	varyingsurface.geometry.attributes.position.array[3] = vertex1.x;
	varyingsurface.geometry.attributes.position.array[4] = vertex1.y;
	varyingsurface.geometry.attributes.position.array[5] = vertex1.z;
	varyingsurface.geometry.attributes.position.array[6] = vertex2.x;
	varyingsurface.geometry.attributes.position.array[7] = vertex2.y;
	varyingsurface.geometry.attributes.position.array[8] = vertex2.z;
	
	deduce_most_of_surface(openness, varyingsurface.geometry.attributes.position);
}

function CheckButton() {
	var mouse_dist_from_buttoncenter = Math.sqrt( (Button.position.x-MousePosition.x) * (Button.position.x-MousePosition.x) + (Button.position.y-MousePosition.y) * (Button.position.y-MousePosition.y) );  
	if( mouse_dist_from_buttoncenter < 0.3){
		if( isMouseDown && !isMouseDown_previously ){
			if(varyingsurface_openmode === true){
				varyingsurface_openmode = false;
			} else {
				varyingsurface_openmode = true;
			}
		}
	}
	
	if(varyingsurface_openmode){
		Button.material.color.r = 0;
		Button.material.color.g = 1;
	}
	else{
		Button.material.color.r = 1;
		Button.material.color.g = 0;
	}
}

function update_varyingsurface() {
	if(varyingsurface_openmode)
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
	
	irreg_deduce_surface(capsidopenness, varyingsurface.geometry.attributes.position);
	
	//we rotate by a quaternion if user moves
	if(capsidopenness == 0 ){
		//we do mouse movement thing
		var mouse_dist_from_buttoncenter = Math.sqrt( (Button.position.x-MousePosition.x) * (Button.position.x-MousePosition.x) + (Button.position.y-MousePosition.y) * (Button.position.y-MousePosition.y) );  
		if( mouse_dist_from_buttoncenter >= 0.3 && isMouseDown) {			
			var MovementAxis = new THREE.Vector3(-Mouse_delta.y, Mouse_delta.x, 0);
			MovementAxis.normalize();
			
			varyingsurface.worldToLocal(MovementAxis);
			var extraquaternion = new THREE.Quaternion();
			extraquaternion.setFromAxisAngle( MovementAxis, Mouse_delta.length() / 3 );
			
			varyingsurface.quaternion.multiply(extraquaternion);
			for( var i = 0; i < varyingsurface_cylinders.length; i++)
				varyingsurface_cylinders[i].quaternion.multiply(extraquaternion);
			for( var i = 0; i < varyingsurface_spheres.length; i++)
				varyingsurface_spheres[i].quaternion.multiply(extraquaternion);
			
			varyingsurface.updateMatrixWorld();
		}
	}
	else {
		var base_quaternion = new THREE.Quaternion(0,0,0,1);
		var interpolationfactor = 0.03 + 0.97 * Math.pow(capsidopenness,10); //may want to massively reduce this power
		
		varyingsurface.quaternion.slerp(base_quaternion, interpolationfactor); //if capsidopenness = 1 we want it to be entirely the base quaternion, i.e. t = 1
		for( var i = 0; i < varyingsurface_cylinders.length; i++)
			varyingsurface_cylinders[i].quaternion.slerp(base_quaternion, interpolationfactor);
		for( var i = 0; i < varyingsurface_spheres.length; i++)
			varyingsurface_spheres[i].quaternion.slerp(base_quaternion, interpolationfactor);
	}
	
	for(var i = 0; i < surfperimeter_line_index_pairs.length / 2; i++) {
		var Aindex = surfperimeter_line_index_pairs[i*2];
		var Bindex = surfperimeter_line_index_pairs[i*2+1];
		
		A = new THREE.Vector3(
				varyingsurface.geometry.attributes.position.array[Aindex*3+0],
				varyingsurface.geometry.attributes.position.array[Aindex*3+1],
				varyingsurface.geometry.attributes.position.array[Aindex*3+2]);
		B = new THREE.Vector3(
				varyingsurface.geometry.attributes.position.array[Bindex*3+0],
				varyingsurface.geometry.attributes.position.array[Bindex*3+1],
				varyingsurface.geometry.attributes.position.array[Bindex*3+2]);
		
		surfperimeter_spheres[i].position.copy(A);
		
		put_tube_in_buffer(A,B, varyingsurface_cylinders[i].geometry.attributes.position.array, varyingsurface_edges_default_radius);
		varyingsurface_cylinders[i].geometry.attributes.position.needsUpdate = true;
	}
	for(var i = 0; i < surfinterior_line_index_pairs.length / 2; i++) {
		var Aindex = surfinterior_line_index_pairs[i*2];
		var Bindex = surfinterior_line_index_pairs[i*2+1];
		
		A = new THREE.Vector3(
				varyingsurface.geometry.attributes.position.array[Aindex*3+0],
				varyingsurface.geometry.attributes.position.array[Aindex*3+1],
				varyingsurface.geometry.attributes.position.array[Aindex*3+2]);
		B = new THREE.Vector3(
				varyingsurface.geometry.attributes.position.array[Bindex*3+0],
				varyingsurface.geometry.attributes.position.array[Bindex*3+1],
				varyingsurface.geometry.attributes.position.array[Bindex*3+2]);
		
		//TODO radius appears to change??
		put_tube_in_buffer(A,B, varyingsurface_cylinders[surfperimeter_line_index_pairs.length / 2 + i].geometry.attributes.position.array, varyingsurface_edges_default_radius);
		varyingsurface_cylinders[surfperimeter_line_index_pairs.length / 2 + i].geometry.attributes.position.needsUpdate = true;
	}
	var sphereopacity = capsidopenness == 0 ? 0 : capsidopenness * Math.cos((ourclock.elapsedTime - ourclock.startTime)*4); 
	for(var i = 0; i<varyingsurface_spheres.length; i++){
		varyingsurface_spheres[i].position.set(varyingsurface.geometry.attributes.position.array[i*3+0],varyingsurface.geometry.attributes.position.array[i*3+1],varyingsurface.geometry.attributes.position.array[i*3+2]);
		varyingsurface.localToWorld(varyingsurface_spheres[i].position);
		varyingsurface_spheres[i].material.opacity = sphereopacity;
	}

	varyingsurface.geometry.attributes.position.needsUpdate = true;
}