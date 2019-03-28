function Field(){}
Field.vectors = [];
Field.lines = [];
Field.cones = [];
Field.force = new THREE.Vector3();
Field.bounce = new THREE.Vector3();
Field.direction = new THREE.Vector3();
Field.coneMaterial = new THREE.MeshBasicMaterial({color:0xFFFFFF});
Field.coneGeometry = new THREE.CylinderGeometry(0, 0.15, 0.6, 16);
Field.createVectors = function(){	
	var bounds = {
		min: {x: -10, y: -10, z: 0},
		max: {x: +10, y: +10, z: 0},
	};
	var step = 1;
	
	var material = new THREE.SpriteMaterial({map: Textures.get("arrow"), color: 0xffffff});
	
	for(var x = bounds.min.x; x <= bounds.max.x; x+=step){		
	for(var y = bounds.min.y; y <= bounds.max.y; y+=step){		
	for(var z = bounds.min.z; z <= bounds.max.z; z+=step){	
		var mesh = new THREE.Sprite(material);
		var group = new THREE.Group();
		mesh.position.set(0.5, 0, 0);
		mesh.scale.y = 0.25;
		group.rotation.y = 60;
		group.position.set(x, y, z);
		group.add(mesh);
		scene.add(group);
		Field.vectors.push(group);
	}}}	
}
Field.createLines = function(charge, detail){
	var dirs;
	if(detail == 1){
		dirs = [			
			new THREE.Vector3(1,0,0),
			new THREE.Vector3(0,1,0),
			new THREE.Vector3(0,0,1),
			new THREE.Vector3(-1,0,0),
			new THREE.Vector3(0,-1,0),
			new THREE.Vector3(0,0,-1),			
			new THREE.Vector3(1,1,0),
			new THREE.Vector3(-1,1,0),
			new THREE.Vector3(0,1,1),
			new THREE.Vector3(0,1,-1),
			new THREE.Vector3(1,0,-1),
			new THREE.Vector3(1,0,1),
			new THREE.Vector3(-1,0,-1),
			new THREE.Vector3(-1,0,1),
			new THREE.Vector3(1,-1,0),
			new THREE.Vector3(-1,-1,0),
			new THREE.Vector3(0,-1,1),
			new THREE.Vector3(0,-1,-1), 
		]
	} else {
		dirs = [
			new THREE.Vector3(1,0,0),
			new THREE.Vector3(0,1,0),
			new THREE.Vector3(0,0,1),
			new THREE.Vector3(-1,0,0),
			new THREE.Vector3(0,-1,0),
			new THREE.Vector3(0,0,-1),	
		];	
	}
	var points;
	var step = 0.5;
	var force = Field.force;
	var dir = Field.direction;
	var sign = Math.sign(charge.charge);
	var coneMat = Field.coneMaterial;
	var coneGeo = Field.coneGeometry;
	var bounceTresh = step*2;
	for(var d = 0; d < dirs.length; d++){
		points = [];
		dir.copy(dirs[d]);
		var point = charge.mesh.position.clone();
		point.addScaledVector(dir, charge.radius/2);
		points.push(point.clone());
		var kk = 40;
		for(var i = 0; i < 5000; i++){
			var stop = false;
			force.set(0,0,0);
			for(var j = 0; j < Simulation.charges.length; j++){
				var c = Simulation.charges[j];
				if(!c.appliesForce) continue;
				var distanceSquared = c.mesh.position.distanceToSquared(point);
				dir.subVectors(point, c.mesh.position);
				dir.multiplyScalar(sign);
				dir.normalize();
				var f = (Simulation.constant * c.charge) / distanceSquared;
				force.addScaledVector(dir, f);
				if(c != charge && distanceSquared < c.radiusSquared){
					stop = true;
				}
			}
			
			force.normalize();
			point.addScaledVector(force, step);
			// bounce detection	
			if(i > 1){
				Field.bounce.copy(points[i-2]);
				var bdis = Field.bounce.distanceTo(point);
				if(bdis < bounceTresh){
					stop = true;
				}
			}			
			if(stop || point.distanceTo(charge.mesh.position) > 50){
				break;
			}
			points.push(point.clone());		
			if(kk % 50 == 0){
				var cone = new THREE.Group();
				var mesh = new THREE.Mesh(coneGeo, coneMat);
				mesh.rotation.x = Math.PI/2 * sign;
				cone.add(mesh);
				cone.position.copy(point);
				force.add(point);
				cone.lookAt(force)
				scene.add(cone);
				Field.cones.push(cone);  
			}	
			kk++;
		}		
		var line = Factory.makeFieldLine(points);
		scene.add(line);
		Field.lines.push(line); 
	}
}
Field.clear = function(){
	for(var i in Field.vectors){
		scene.remove(Field.vectors[i]);
	}
	for(var i in Field.lines){
		Field.lines[i].material.dispose();
		Field.lines[i].geometry.dispose();
		Field.lines[i].line.geometry.dispose();
		scene.remove(Field.lines[i]);
	}
	for(var i in Field.cones){
		var group = Field.cones[i];
		for (var j = group.children.length - 1; j >= 0; j--) {
			group.remove(group.children[j]);
		}
		scene.remove(group);
	}
	Field.lines = [];
	Field.cones = [];
	Field.vectors = [];
}