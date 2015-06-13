//--------------Fundamental shit
var scene = new THREE.Scene();
var window_width = 1200, window_height = 600;

//var camera = new THREE.PerspectiveCamera( 75, window_width / window_height, 0.1, 1000 );
var orthographic_cuboid_width = 16;
var camera = new THREE.OrthographicCamera( orthographic_cuboid_width / -2, orthographic_cuboid_width / 2, orthographic_cuboid_width / 4, orthographic_cuboid_width / -4, 0.1, 1000 );
camera.position.z = 5;
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window_width, window_height );
document.body.appendChild( renderer.domElement );



//--------------Still quite fundamental
var isMouseDown = false;
var vertex_tobechanged = 666;

var HS3 = Math.sqrt(3)/2;
var PHI = (Math.sqrt(5) + 1) / 2;
var TAU = Math.PI * 2;

var capsidopenness = 1;
var capsidclock = 0;

var logged = 0;

var showdebugstuff = 0;
var net_warnings = 0;

//-----------not just constants
var net_triangle_vertex_indices;

var line_index_pairs = new Uint16Array(60 * 2);

var flatnet;
var flatnet_vertices_numbers;
var flatnet_vertices;
var flatnet_geometry;

var FLATNET = 0;
var SURFACE = 1;
var POLYHEDRON = 2;

//we need the polyhedron both to be seen and to help us get the minimum angles
var polyhedron;
var polyhedron_vertices_numbers = new Float32Array(22 * 3);
var polyhedron_vertices;
var polyhedron_geometry;

var surface;
var surface_vertices_numbers;
var surface_vertices;
var surface_geometry;

var surface_triangle_side_unit_vectors = new Array();
var shear_matrix = new Array(20);

//Not including the central vertex.
var number_of_hexagon_rings = 10; //mimivirus needs exactly 100. Try and work out how many a human can distinguish though
var number_of_lattice_points = 1 + 3 * number_of_hexagon_rings*(number_of_hexagon_rings+1);
var flatlattice;
var flatlattice_vertices_numbers = new Float32Array(3 * number_of_lattice_points);
var flatlattice_vertices;
var flatlattice_default_vertices = Array(number_of_lattice_points*3);
var flatlattice_geometry;
var flatlattice_center = new THREE.Vector2(-5,0)

var surflattice;
var surflattice_vertices_numbers = new Float32Array(3 * number_of_lattice_points);
var surflattice_vertices;
var surflattice_geometry;

var vertices_derivations;
var minimum_angles = new Array(22); //between these two, we derive the polyhedron and surface

var circle;
var circleGeometry;

var vertex_identifications = new Array();
var W_triangle_indices = new Array();
var W_vertex_indices = new Array();
var W_surrounding_angles = new Float32Array([0,0,0,0,0,0]);
var V_vertex_indices = new Array();
var V_triangle_indices = new Array();
var V_angles = new Array(22);

var V_squasher;

var CENTRAL_TRIANGLE = 6;
var CENTRAL_TRIANGLE_CORNER = 12;
var RIGHT_DEFECT = 13;
var CORE = 0;
var ASSOCIATED = 1;

var raycaster = new THREE.Raycaster();
var MousePosition = new THREE.Vector2();
var OldMousePosition = new THREE.Vector2();