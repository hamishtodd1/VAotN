var QC_atoms_numbers = new Float32Array(3 * 462);

function generate_QCatom_locations(){
	/*
	 * Get everything in one icosa triangle, so everything except y and db
	 * Then y and db.
	 */
	//the three corners of a rhombic triacontahedron that immediately surround its dodeca vertex (a vertex of radius 1)
	var original_dodeca_vertex = 12; //if you change this, need to change the normalized virtualico vertices too!
	var vertex_on_the_way_to_opposite_original_vertex = 8;
	var useful_ico_vertices = Array(0,1,5)
	var to_triaconta_far_corners = Array(3);
	for(var i = 0; i < 3; i++)
		to_triaconta_far_corners[i] = normalized_virtualico_vertices[useful_ico_vertices[i]].clone();
	for(var i = 0; i < to_triaconta_far_corners.length; i++){
		to_triaconta_far_corners[i].multiplyScalar(Math.sqrt(PHI * Math.sqrt(5)/3));
		to_triaconta_far_corners[i].sub(normalized_virtualdodeca_vertices[original_dodeca_vertex]);
	}
	
	var dodeca_types = Array(4);
	for(var i = 0; i < dodeca_types.length; i++)
		dodeca_types[i] = normalized_virtualdodeca_vertices[original_dodeca_vertex].clone();
	
	dodeca_types[0].multiplyScalar(43);		//lp
	dodeca_types[1].multiplyScalar(70);		//dr
	dodeca_types[2].multiplyScalar(92);		//b
	dodeca_types[3].multiplyScalar(112); 	//lg
	
	{
		//going to make three points that are the same level as [3].
		//we're looking to add some amount
		var dgverts = Array(3);
		for(var i = 0; i < dgverts.length; i++ ) {
			dgverts[i] = dodeca_types[3].clone();
			dgverts[i].add(to_triaconta_far_corners[i]);
			dgverts[i].setLength(dist_along_tria_edge(dodeca_types[3].length(),114));
		}
	}
	
	var num_in_dod_cluster = dodeca_types.length + dgverts.length;
	QCatom_positions = Array(20 * num_in_dod_cluster + 0);
	for(var dodeca_vertex_offset = 0; dodeca_vertex_offset < 20 * num_in_dod_cluster; dodeca_vertex_offset += num_in_dod_cluster){
		for(var i = 0; i < dodeca_types.length; i++)
			QCatom_positions[dodeca_vertex_offset + i] = dodeca_types[i].clone();
		for(var i = 0; i < dgverts.length; i++)
			QCatom_positions[dodeca_vertex_offset + dodeca_types.length + i] = dgverts[i].clone();
	}
	
	/* You're going to rotate around a weird axis at a right angle to you and in the plane of 18
	 * You're going to rotate around the three faces immediately surrounding the original vertex (the axes are just the 0,1,5 virtualico vertices)
	 */
	var crazy_axis_intermediate = new THREE.Vector3();
	crazy_axis_intermediate.crossVectors(normalized_virtualdodeca_vertices[original_dodeca_vertex],normalized_virtualdodeca_vertices[vertex_on_the_way_to_opposite_original_vertex]);
	var crazy_axis = new THREE.Vector3();
	crazy_axis.crossVectors(crazy_axis_intermediate,normalized_virtualdodeca_vertices[original_dodeca_vertex]);
	crazy_axis.normalize();
	
//	for(var i = num_in_dod_cluster * 10; i< num_in_dod_cluster * 20 + 0; i++)
//		QCatom_positions[i].applyAxisAngle(crazy_axis,Math.PI);
	for(var i = 0; i < 3; i++){ //for each the axis
		console.log(normalized_virtualico_vertices[useful_ico_vertices[i]].angleTo(dgverts[0]));
		for(var j = 0; j < 3; j++) {//for each rotation amount
			var ourcluster = 1+i*3+j;
			for(var k = 0; k < num_in_dod_cluster; k++){//for each in the cluster
				QCatom_positions[ourcluster*num_in_dod_cluster+k].applyAxisAngle(normalized_virtualico_vertices[useful_ico_vertices[i]],(j+1)*TAU/5);
				QCatom_positions[(ourcluster+10)*num_in_dod_cluster+k].applyAxisAngle(normalized_virtualico_vertices[useful_ico_vertices[i]],(j+1)*TAU/5);
			}
		}
	}
	
	for(var i = 0; i < QCatom_positions.length; i++)
		insert_quasiatom(QCatom_positions[i],i);
	for(var i = QCatom_positions.length * 3; i < QC_atoms.geometry.attributes.position.array.length; i++)
		QC_atoms.geometry.attributes.position.array[i] = 0;
}

function insert_quasiatom(ourposition,lowest_unused_index){
	var multfactor = 0.03;
	QC_atoms.geometry.attributes.position.setXYZ(lowest_unused_index, ourposition.x * multfactor, ourposition.y * multfactor, ourposition.z * multfactor );
	
	var wavelength = ourposition.lengthSq();
	wavelength /= 10.9; //apparently as large as we get
	wavelength *= (781-380);
	wavelength += 380;
	if((wavelength >= 380) && (wavelength<440)){
        QC_atoms.geometry.attributes.color.setXYZ(lowest_unused_index,	-(wavelength - 440) / (440 - 380),	0,	1);
    }else if((wavelength >= 440) && (wavelength<490)){
        QC_atoms.geometry.attributes.color.setXYZ(lowest_unused_index,	0,	(wavelength - 440) / (490 - 440),	1);
    }else if((wavelength >= 490) && (wavelength<510)){
        QC_atoms.geometry.attributes.color.setXYZ(lowest_unused_index,	0,	1,	-(wavelength - 510) / (510 - 490));
    }else if((wavelength >= 510) && (wavelength<580)){
        QC_atoms.geometry.attributes.color.setXYZ(lowest_unused_index,	(wavelength - 510) / (580 - 510),	1,	0);
    }else if((wavelength >= 580) && (wavelength<645)){
        QC_atoms.geometry.attributes.color.setXYZ(lowest_unused_index,	1,	-(wavelength - 645) / (645 - 580),	0);
    }else if((wavelength >= 645) && (wavelength<781)){
    	QC_atoms.geometry.attributes.color.setXYZ(lowest_unused_index,	1,	0,	0);
    }else{
    	QC_atoms.geometry.attributes.color.setXYZ(lowest_unused_index,	0,	0,	0);
    };
}

function dist_along_tria_edge(triaconta_minorvertex_radius,desired_r){
	triaconta_majorvertex_radius = triaconta_minorvertex_radius * Math.sqrt(PHI * Math.sqrt(5)/3);
	
	if( desired_r < triaconta_minorvertex_radius || triaconta_majorvertex_radius < desired_r)
		console.error("yeah no");
	
	var ourangle = 1.8045;
	var completed_square_factor = desired_r * desired_r - Square(triaconta_minorvertex_radius * Math.sin(ourangle));
	var sol1 = triaconta_minorvertex_radius * Math.cos(ourangle) + completed_square_factor;
	var sol2 = triaconta_minorvertex_radius * Math.cos(ourangle) - completed_square_factor;
	if(sol2 > 0){
		console.error("two positive solutions?");
		return sol2;
	}
	if(sol1 > 0)
		return sol1;
}