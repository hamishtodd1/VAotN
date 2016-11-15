var reused_slide_indices = [];
var Storypage = 0;
var Story_states = [];
var lattice_fadein_time = 0;

function init_story()
{
	Story_states.push({
		startingtime: -1, //this is just the prototype state, not really used!
		
		MODE: SLIDE_MODE,
		
		pause_at_end: 0, //at end because when you unpause it's usually a new thought
		unpause_after: -1, //but you only want it to unpause if it's the pause that YOU'VE done :P
		
		slide_number: -1,
		
		//TODO use this on, for example, transition from part 1 to 2
		go_to_time: -1, //alternatively just edit the video. Don't skip back, we ascend through the states
		
		offer_virus_selection: 0,
		
		enforced_irreg_state: -1,
		
		enforced_CK_quaternion: new THREE.Quaternion(5,5,5,5),
		
		CK_surface_color: new THREE.Color( 0.11764705882352941, 0.9882352941176471, 0.9529411764705882 ),
		pentamers_color: new THREE.Color( 147/255,0,8/255 ),
		hexamers_color: new THREE.Color( 208/255,58/255,59/255 ),
		
		irreg_open: -1,
		irreg_button_invisible: 0,
		unpause_on_vertex_knowledge: 0,
		
		unpause_on_hepatitis_scale: 0,
		
		CK_scale_only: 0,
		
		unpause_on_rotation_knowledge: 0,
		
		enforced_cutout_vector0_player: new THREE.Vector3(-1,0,0),
		
		prevent_playing: 0 //could also use this to stop them from continuing if they haven't rotated bocavirus etc
	});
}