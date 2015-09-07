/*	The below gets you radii, from which you can get minimum_angles
	which should be called polyhedron dihedral angles
	
	So you need to write something that gets the dihedral angle of a tetrahedron from edge lengths
*/

//stepsize is step width
//T is triangulation
//epsilon is error
//r is the set of radii
//curvatures is a 12D vector with all the curvatures curvatures_i coming from r. Get its length to zero!
//curvatures_i = TAU - omega_i. Omega_i is the defect when the tetrahedra are glued around edge i

//you had better be sure that your inputs are con-bloody-vex.

//TODO "length[i][j]"



//numeric.solve([[1,2],[3,4]],[17,39]) == [5,6]

function get_curvatures(radii) {
	var curvature_array = Array([0,0,0,0,0,0,0,0,0,0,0,0]);
	for( var i = 0; i < 12; i++) {
		for( var j = 0; j < 12; j++) {
			if(length[i][j] === 666 )
				continue;
			
			for( var k = j+1; k < 12; k++) { //if k is strictly greater than j we avoid counting jk twice
				if(length[j][k] === 666 || length[k][i] === 666 )
					continue;
				
				var cos_gamma_ijk = get_cos_rule(length[j][k],length[i][j], length[k][i]);
				var cos_rho_ij = get_cos_rule(radii[i], radii[j], length[i][j]);
				var cos_rho_ik = get_cos_rule(radii[i], radii[k], length[i][k]);
				var cos_omega_ijk = ( cos_gamma_ijk - cos_rho_ij * cos_rho_ik ) / Math.sqrt(1 - cos_rho_ij*cos_rho_ij - cos_rho_ik*cos_rho_ik - cos_rho_ik*cos_rho_ik*cos_rho_ij*cos_rho_ij );
				
				curvature_array[i] += Math.acos(cos_omega_ijk); //should probably count how many times this is added to
			}
		}
	}
	return curvature_array;
}

function quadrance(vector_values) {
	var result = 0;
	
	for( var i = 0; i < vector_values.length; i++)
		result += vector_values[i] * vector_values[i];
	
	return result;
}

//refer to diagram in thesis - i->j is anticlockwise around face
function get_cos_tetrahedron_dihedral_angle_from_indices(i,j) {
	var k = //we need that k that is clockwise of j, which we may get from old stuff.
		
	
	var cos_rho_ij = get_cos_rule(radii[i], radii[j], length[i][j]);
	var cos_rho_ik = get_cos_rule(radii[i], radii[k], length[i][k]);
	var cos_gamma_ijk = get_cos_rule(length[j][k],length[i][j], length[k][i]);
	var sin_rho_ij = Math.sqrt(1-cos_rho_ij*cos_rho_ij);
	var sin_gamma_ijk = Math.sqrt(1-cos_gamma_ijk*cos_gamma_ijk);
	
	return (cos_rho_ik - cos_gamma_ijk * cos_rho_ij)/(sin_gamma_ijk*cos_rho_ij);
}

function get_dihedral_angles() {
	var stepsizemax = 0.75;	
	var stepsize = stepsizemax;
	
	var radii = Array([100,100,100, 100,100,100, 100,100,100, 100,100,100]); //initial values, chosen rather randomly. Potential speedup by decreasing this?	
	var curvatures_current = get_curvatures(radii);	
	var curvatures_intended = Array();
	
	var epsilon = 0.01; //randomly chosen
	
	while( quadrance(curvatures_current) > epsilon)  {
		for( var i = 0; i < curvatures_current.length; i++)
			curvatures_intended[i] = (1 - stepsize) * curvatures_current[i];
		
		var radii_intended = newton_solve(radii, curvatures_intended); //assign 666 to this if we get nowt.	
		//we get radii_intended : curvatures(radii_intended) === curvatures_intended
		
		if( radii_intended !== 666 ){ //depends on what newton_solve returns if there's nothing
			var concave_edges = Array();
			for( var i = 0; i < radii.length; i++) {
				for( var j = i+1; j < radii.length; j++){
					var angle1 = Math.acos(get_cos_tetrahedron_dihedral_angle_from_indices(i,j));
					var angle2 = Math.acos(get_cos_tetrahedron_dihedral_angle_from_indices(j,i));		
					
					if(angle1 + angle2 >= TAU / 2 ) {
						console.log("Fuck, edge " + i + " has gone concave");
						concave_edges.push(i);
						return; //we could do something about it. Or try a smaller step size?
					}
				}
			}
			if( concave_edges.length === 0 ) { //hooray, we took a step size the correct amount
				for( var i = 0; i < curvatures_current.length; i++)
					radii[i] = radii_intended[i];
					
				curvatures_current = get_curvatures(radii);
				stepsize = stepsizemax;
			}
		}
		else //unsolvable, step size was too much
			stepsize = stepsize*stepsize;
	}

	for(var i = 0; i< minimum_angles.length; i++){
		//you need to get the two points on either end of the length
		minimum_angles[i] = Math.acos(get_cos_tetrahedron_dihedral_angle_from_indices(i,j)) + Math.acos(get_cos_tetrahedron_dihedral_angle_from_indices(j,i));
	}	
}

function get_Jacobian(radii){
	var jacobian = Array(12);
	for(var i = 0; i < 12; i++){
		jacobian[i] = Array(12);
		jacobian[i][i] = 0;
		for( var j = 0; j < 12; j++){
			if(i===j) continue; //a special case
			
			if( length[i][j] === 666)
				jacobian[i][j] = 0;
			else {
				var cos_alpha_ij = get_cos_tetrahedron_dihedral_angle_from_indices(i,j);
				var cos_alpha_ji = get_cos_tetrahedron_dihedral_angle_from_indices(j,i);
				
				var cos_rho_ij = get_cos_rule(radii[i], radii[j], length[i][j]);
				var cos_rho_ik = get_cos_rule(radii[i], radii[k], length[i][k]);
				var sin_rho_ij = Math.sqrt(1-cos_rho_ij*cos_rho_ij);
				var sin_rho_ik = Math.sqrt(1-cos_rho_ik*cos_rho_ik); //optimization: save and reuse these
				
				var cot_alpha_ij = cos_alpha_ij / Math.sqrt( 1 - cos_alpha_ij*cos_alpha_ij);
				var cot_alpha_ji = cos_alpha_ji / Math.sqrt( 1 - cos_alpha_ji*cos_alpha_ji);
				
				jacobian[i][j] = ( cot_alpha_ij + cot_alpha_ji ) / (length[i][j] * sin_rho_ij * sin_rho_ji);
				
				var cos_phi_ij = get_cos_rule(length[i][j], radii[i], radii[j]);
				
				jacobian[i][i] -= cos_phi_ij * jacobian[i][j];
			}
		}				
	}
	return jacobian;
}

//this gets us the radii such that curvature = 0.
//ok remember you're running this not for get_curvature, but for (get_curvature-intended curvature), which happens to have the same jacobian
function newton_solve(guessed_radii, intended_curvature) {
	var hoped_result;
	var augmented_matrix;
	var delta_radii;
	var intended_radii;
	for( var i = 0; i < 12; i++)
		intended_radii[i] = guessed_radii[i];
	var iterations = 0;
	var epsilon = 0.01;
	while( quadrance(delta_radii) / quadrance(intended_radii) > epsilon && iterations < 20) {
		hoped_result = get_curvatures(intended_radii);
		for( var i = 0; i < 12; i++)
			hoped_result[i] -= intended_curvature;
		
		augmented_matrix = get_Jacobian(intended_radii);
		for( var i = 0; i < 12; i++)
			augmented_matrix[i][12] = -hoped_result[i];
		
		delta_radii = gauss(augmented_matrix); //if jacobians were a perfect representation of derivatives rather than a linear approximation, this'd be all we need.
		
		for( var i = 0; i < 12; i++)
			intended_radii[i] += delta_radii[i];
		
		//During this, we may also want to check the thirty triangle inequalities concerning two radii and an edge
		
		iterations++;
	}
	
	if(iterations > 9)
		return 666;
	else return intended_radii;
}