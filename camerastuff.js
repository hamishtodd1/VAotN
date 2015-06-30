function UpdateCamera() {
//	if(InputObject.isMouseDown)
//		cameradist += 0.08;
//	else
//		cameradist -= 0.08;
	
	if(cameradist < min_cameradist)
		cameradist = min_cameradist;
	
	//it should follow the mouse a little bit. Finger?
	//take distance of mouse from center of screen, square root that, and move the camera towards the mouse by a multiple of that amount
	//maybe have screenshake "energy"? like things can cause it to vibrate until it stops.
	//think of it as a wooden peg maybe, that is basically rigid, but can be twanged in any direction
	//remember if you have any other objects in there, they have to shake too.
	//so what sort of "object" are all these things? are they hanging on the wall? Sitting on an airhockey table?
	//but camera can go from graceful mathematically-correct thing to feeling like a physics object.
	//Hey, aztez pulled the camera around by the side, you should too
	//objects could come in from top, camera could tilt up to see them
	//maybe think about Ikaruga's camera?
	//one nice movement is the "WHOOSH-stooooop..."
	//little screenshakes for little things, big ones for big things
	//could have the camera move over to focus on something that you hover your mouse over
	//hey, why not have things massively zoomed in in comparison with what they currently are? make the capsid an awesome thing. Oh yeah, lecture integration	
	
	
	//could have the lines go wavy	
	//click on lattice, little flash and explosion
	//want to think of the equivalent of a dead body, something that reminds you of shit that just happened. Ghost of your previous capsid position?
	//sleep()	
	//when you make a mistake, something nice should happen too. In nuclear throne there are cactuses that react to missed bullets
	
	//can you think of a way to engineer a situation where you really DON'T want to click on certain vertices? Would be interesting for a bit
	
	
	vertical_fov = 2 * Math.atan(playing_field_height/(2*cameradist));
		
	camera.position.z = cameradist;
	//console.log(camera.position.z);
	camera.fov = vertical_fov * 360 / TAU;
	camera.updateProjectionMatrix();
	camera.updateMatrix();
}