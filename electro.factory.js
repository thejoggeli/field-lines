function Factory(){}

Factory.makeArrow = function(_params){
	var params = _params === undefined ? {} : _params;
	defx(params, "color", 0xFFFFFF);
	defx(params, "length_a", 4);
	defx(params, "length_b", 2);
	var group = new THREE.Group();
	var material = new THREE.MeshBasicMaterial({
		color: params.color,
	});
	var c1 = new THREE.CylinderGeometry(0.5, 0.5, params.length_a, 6);
	var c2 = new THREE.CylinderGeometry(0.0, 0.75, params.length_b, 6);
	var m1 = new THREE.Mesh(c1, material);	
	var m2 = new THREE.Mesh(c2, material);	
	group.add(m1);
	m1.add(m2);
	m1.position.z += params.length_a;
	m2.position.y += params.length_a * 0.5 + params.length_b * 0.5;
	c1.computeFlatVertexNormals();	
	c2.computeFlatVertexNormals();
	m1.rotation.x = Math.PI/2;
	return group;	
}

Factory.makeFieldLine = function(points){
	var material = new MeshLineMaterial({
		color:0xFFFFFF,
		lineWidth: 0.05,
		sizeAttenuation: 1,
	//	transparent:true,
	//	opacity:0.75,
	});
	var geometry = new THREE.Geometry();
	geometry.vertices = points;
	var line = new MeshLine();
	line.setGeometry(geometry);
	var mesh = new THREE.Mesh(line.geometry, material);
	mesh.line = line;
	mesh.points = points;
	return mesh;
}