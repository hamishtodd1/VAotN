/**
 * 
 */

function core(){
	var movement_vector = new THREE.Vector2(0,0);
	var movementangle = 0;
	var movementdist = 1;

	var mirrorvertexA = 0;
	var mirrorvertexB = 2;
	var mirrorvertexAratio;
	var mirrorvertexBratio;
	
	{
		var mirrorvertexAleft = new THREE.Vector2( pentagon_vertices.array[(mirrorvertexA+4)%5 * 3 + 0 ],pentagon_vertices.array[(mirrorvertexA+4)%5 * 3 + 1 ] );
		var mirrorvertexAright = new THREE.Vector2( pentagon_vertices.array[(mirrorvertexA+1)%5 * 3 + 0 ],pentagon_vertices.array[(mirrorvertexA+1)%5 * 3 + 1 ] );
		var mirrorvertexAbase = new THREE.Vector2();
		mirrorvertexAbase.addVectors(mirrorvertexAright,mirrorvertexAleft);
		mirrorvertexAbase.multiplyScalar(0.5);
		
		var mirrorvertexAv = new THREE.Vector2( pentagon_vertices.array[mirrorvertexA * 3 + 0 ],pentagon_vertices.array[mirrorvertexA * 3 + 1 ] );
		var mirrorvertexAup = new THREE.Vector2();
		mirrorvertexAup.subVectors(mirrorvertexAv, mirrorvertexAbase);
		mirrorvertexAratio = mirrorvertexAup.length() / mirrorvertexAleft.distanceTo(mirrorvertexAright);
		
		var mirrorvertexBleft = new THREE.Vector2( pentagon_vertices.array[(mirrorvertexB+4)%5 * 3 + 0 ],pentagon_vertices.array[(mirrorvertexB+4)%5 * 3 + 1 ] );
		var mirrorvertexBright = new THREE.Vector2( pentagon_vertices.array[(mirrorvertexB+1)%5 * 3 + 0 ],pentagon_vertices.array[(mirrorvertexB+1)%5 * 3 + 1 ] );
		var mirrorvertexBbase = new THREE.Vector2();
		mirrorvertexBbase.addVectors(mirrorvertexBright,mirrorvertexBleft);
		mirrorvertexBbase.multiplyScalar(0.5);
		
		var mirrorvertexBv = new THREE.Vector2( pentagon_vertices.array[mirrorvertexB * 3 + 0 ],pentagon_vertices.array[mirrorvertexB * 3 + 1 ] );
		var mirrorvertexBup = new THREE.Vector2();
		mirrorvertexBup.subVectors(mirrorvertexBv, mirrorvertexBbase);
		mirrorvertexBratio = mirrorvertexBup.length() / mirrorvertexBleft.distanceTo(mirrorvertexBright);
	}
	
	if( isMouseDown && MousePosition.x < -2 ) {
		if( vertex_tobechanged === 666) {
			var lowest_quadrance_so_far = 10;
			var closest_vertex_so_far = 666;
			for( var i = 0; i < 5; i++) {
				var quadrance = (pentagon_vertices.array[i*3+0] - (MousePosition.x+5)) * (pentagon_vertices.array[i*3+0] - (MousePosition.x+5))
								+ (pentagon_vertices.array[i*3+1] - MousePosition.y) * (pentagon_vertices.array[i*3+1] - MousePosition.y);
				if( quadrance < lowest_quadrance_so_far) {
					lowest_quadrance_so_far = quadrance;
					closest_vertex_so_far = i;
				}
			}
			
			var maximum_quadrance_to_be_selected = 0.005;
			if( lowest_quadrance_so_far < maximum_quadrance_to_be_selected) {
				vertex_tobechanged = closest_vertex_so_far;
			}
		}
		
		if( vertex_tobechanged !== 666) {
			movement_vector.x = (MousePosition.x+5) - pentagon_vertices.array[vertex_tobechanged * 3 + 0];
			movement_vector.y = MousePosition.y - pentagon_vertices.array[vertex_tobechanged * 3 + 1];
			
			var oldmouseangle = Math.atan2(pentagon_vertices.array[vertex_tobechanged * 3 + 0], pentagon_vertices.array[vertex_tobechanged * 3 + 1]);
			var mouseangle = Math.atan2(MousePosition.x+5,MousePosition.y);
			movementangle = mouseangle - oldmouseangle;
			
			var oldmousedist = Math.sqrt( 	pentagon_vertices.array[vertex_tobechanged * 3 + 0] * pentagon_vertices.array[vertex_tobechanged * 3 + 0] +
											pentagon_vertices.array[vertex_tobechanged * 3 + 1] * pentagon_vertices.array[vertex_tobechanged * 3 + 1] );
			var mousedist = Math.sqrt( 	MousePosition.y * MousePosition.y +
										(MousePosition.x+5) * (MousePosition.x+5) );
			movementdist = mousedist / oldmousedist;
		}
	}
	else {		
		vertex_tobechanged = 666;
	}
	
	if( vertex_tobechanged === 666 || (movement_vector.x === 0 && movement_vector.y === 0) )
		return;
	
	if(vertex_tobechanged === mirrorvertexA || vertex_tobechanged === mirrorvertexB) {
		pentagon_vertices.array[vertex_tobechanged * 3 + 0 ] *= movementdist;
		pentagon_vertices.array[vertex_tobechanged * 3 + 1 ] *= movementdist;
		
		for(var i = 0; i < 5; i++) {
			var x = pentagon_vertices.array[i*3 + 0];
			var y = pentagon_vertices.array[i*3 + 1];
			pentagon_vertices.array[i*3 + 0] = Math.cos(-movementangle) * x - Math.sin(-movementangle) * y; 
			pentagon_vertices.array[i*3 + 1] = Math.sin(-movementangle) * x + Math.cos(-movementangle) * y;
		}
	}
	else {	
		pentagon_vertices.array[vertex_tobechanged * 3 + 0 ] += movement_vector.x;
		pentagon_vertices.array[vertex_tobechanged * 3 + 1 ] += movement_vector.y;
		
		var mirrorvertexAleft = new THREE.Vector2( pentagon_vertices.array[(mirrorvertexA+4)%5 * 3 + 0 ],pentagon_vertices.array[(mirrorvertexA+4)%5 * 3 + 1 ] );
		var mirrorvertexAright = new THREE.Vector2( pentagon_vertices.array[(mirrorvertexA+1)%5 * 3 + 0 ],pentagon_vertices.array[(mirrorvertexA+1)%5 * 3 + 1 ] );
		var mirrorvertexAbase = new THREE.Vector2();
		mirrorvertexAbase.addVectors(mirrorvertexAright,mirrorvertexAleft);
		mirrorvertexAbase.multiplyScalar(0.5);
		
		var mirrorvertexAlefttoright = new THREE.Vector2();
		mirrorvertexAlefttoright.subVectors(mirrorvertexAright, mirrorvertexAleft);
		var mirrorvertexAup = new THREE.Vector2(-mirrorvertexAlefttoright.y,mirrorvertexAlefttoright.x);
		mirrorvertexAup.normalize();
		var mirrorvertexAuplength = mirrorvertexAratio * mirrorvertexAleft.distanceTo(mirrorvertexAright);
		mirrorvertexAup.multiplyScalar(mirrorvertexAuplength);
		var mirrorvertexAv = new THREE.Vector2();
		mirrorvertexAv.addVectors(mirrorvertexAbase, mirrorvertexAup);
		pentagon_vertices.array[mirrorvertexA * 3 + 0 ] = mirrorvertexAv.x;
		pentagon_vertices.array[mirrorvertexA * 3 + 1 ] = mirrorvertexAv.y;
		
		var mirrorvertexBleft = new THREE.Vector2( pentagon_vertices.array[(mirrorvertexB+4)%5 * 3 + 0 ],pentagon_vertices.array[(mirrorvertexB+4)%5 * 3 + 1 ] );
		var mirrorvertexBright = new THREE.Vector2( pentagon_vertices.array[(mirrorvertexB+1)%5 * 3 + 0 ],pentagon_vertices.array[(mirrorvertexB+1)%5 * 3 + 1 ] );
		var mirrorvertexBbase = new THREE.Vector2();
		mirrorvertexBbase.addVectors(mirrorvertexBright,mirrorvertexBleft);
		mirrorvertexBbase.multiplyScalar(0.5);
		
		var mirrorvertexBlefttoright = new THREE.Vector2();
		mirrorvertexBlefttoright.subVectors(mirrorvertexBright, mirrorvertexBleft);
		var mirrorvertexBup = new THREE.Vector2(-mirrorvertexBlefttoright.y,mirrorvertexBlefttoright.x);
		mirrorvertexBup.normalize();
		var mirrorvertexBuplength = mirrorvertexBratio * mirrorvertexBleft.distanceTo(mirrorvertexBright);
		mirrorvertexBup.multiplyScalar(mirrorvertexBuplength);
		var mirrorvertexBv = new THREE.Vector2();
		mirrorvertexBv.addVectors(mirrorvertexBbase, mirrorvertexBup);
		pentagon_vertices.array[mirrorvertexB * 3 + 0 ] = mirrorvertexBv.x;
		pentagon_vertices.array[mirrorvertexB * 3 + 1 ] = mirrorvertexBv.y;
	}
	
	pentagon_vertices.needsUpdate = true;
}