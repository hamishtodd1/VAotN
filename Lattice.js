function updatelattice(theta, scale) {
	var costheta = Math.cos(theta);
	var sintheta = Math.sin(theta);
	
	for(var i = 0; i < number_of_lattice_points; i++) {		
		flatlattice_vertices.setX(i, (flatlattice_default_vertices[i*3] * costheta - flatlattice_default_vertices[i*3+1] * sintheta) * scale);
		flatlattice_vertices.setY(i, (flatlattice_default_vertices[i*3] * sintheta + flatlattice_default_vertices[i*3+1] * costheta) * scale);
	}
}

//you could move the net. There again, the lattice has to move on the screen, so.
function HandleLatticeMovement() {
}

function Map_lattice() {
	//potential optimization: break out of the loop when you're past a certain radius. That only helps small capsids though.
	//potential optimization: just put one in each net triangle and extrapolate
	for(var i = 0; i < number_of_lattice_points; i++) {
		var triangle = locate_in_net(flatlattice_vertices.array[ i*3+0 ], flatlattice_vertices.array[ i*3+1 ]);
		if( triangle !== 666) {
			var mappedpoint = map_from_lattice_to_surface(
				flatlattice_vertices.array[ i*3+0 ], flatlattice_vertices.array[ i*3+1 ],
				triangle);
				
				//if(!logged)console.log(mappedpoint);
			
			surflattice_vertices.setXYZ(i, mappedpoint.x, mappedpoint.y, mappedpoint.z );
		}
		else
			surflattice_vertices.setXYZ(i, 0,0,0);
	}
	
	surflattice_vertices.needsUpdate = true;
	logged = 1;
}