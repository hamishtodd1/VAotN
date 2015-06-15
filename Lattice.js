function updatelattice() {
	var costheta = Math.cos(LatticeAngle);
	var sintheta = Math.sin(LatticeAngle);
	
	for(var i = 0; i < number_of_lattice_points; i++) {		
		flatlattice_vertices.setX(i, (flatlattice_default_vertices[i*3] * costheta - flatlattice_default_vertices[i*3+1] * sintheta) * LatticeScale);
		flatlattice_vertices.setY(i, (flatlattice_default_vertices[i*3] * sintheta + flatlattice_default_vertices[i*3+1] * costheta) * LatticeScale);
	}
	
	flatlattice_vertices.needsUpdate = true;
}

function Lattice_freewheel() {
	return;
}

//you could move the net. There again, the lattice has to move on the screen, so.
function HandleLatticeMovement() {
	if(!isMouseDown){
		LatticeGrabbed = false;
		Lattice_freewheel();
	} else {
		if( vertex_tobechanged !== 666) //temporary, think of a better system
			return;
			
		var Mousedist = MousePosition.distanceTo(flatlattice_center);
		if( Mousedist < HS3 * 10/3) {
			LatticeGrabbed = true;
			
			var OldMousedist = OldMousePosition.distanceTo(flatlattice_center); //unless the center is going to change?
			
			LatticeScale *= Mousedist / OldMousedist;
			
			var MouseAngle = Math.atan2( (MousePosition.x - flatlattice_center.x), (MousePosition.y - flatlattice_center.y) );
			var OldMouseAngle = Math.atan2( (OldMousePosition.x - flatlattice_center.x), (OldMousePosition.y - flatlattice_center.y) );
			
			LatticeAngle += OldMouseAngle - MouseAngle;
		}
	}
	
	updatelattice();
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