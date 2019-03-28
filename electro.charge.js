function Charge(){
	this.mesh = null;
	this.charge = null;
	this.force = new THREE.Vector3();
	this.acceleration = new THREE.Vector3();
	this.velocity = new THREE.Vector3();
	this.mass = 1;
	this.radius = 1;
	this.radiusSquared = 1;
	this.movable = false;
	this.appliesForce = false;
}
Charge.prototype.init = function(_params){
	var params = _params === undefined ? {} : _params;	
/*	var material = new THREE.SpriteMaterial({map: Textures.get("charge-pos"), color: 0xffffff});
	this.mesh = new THREE.Sprite(material);
	scene.add(this.mesh); */
	var mat = new THREE.MeshLambertMaterial({color:0xFF00FF});	
	var geo = new THREE.IcosahedronGeometry(1, 1);
	geo.computeFlatVertexNormals();
	this.mesh = new THREE.Mesh(geo, mat);
	scene.add(this.mesh);
	Simulation.charges.push(this);
	this.setCharge(def(params, "charge", 1));
	this.setMass(def(params, "mass", Math.abs(this.charge)));
	this.setMovable(def(params, "movable", false));
	this.setAppliesForce(def(params, "appliesForce", true));
	return this;
}
Charge.prototype.setCharge = function(v){
	this.charge = v;
	if(v > 0){
	//	this.mesh.material.map = Textures.get("charge-pos");	
		this.mesh.material.color.set(0xFF0000);
	} else if(v < 0){
	//	this.mesh.material.map = Textures.get("charge-neg");	
		this.mesh.material.color.set(0x0088FF);
	} else {
	//	this.mesh.material.map = Textures.get("charge-neu");
		this.mesh.material.color.set(0xCCCCCC);
	}
	var density = 1.0;
	var mass = Math.abs(this.charge);
	var volume = mass/density;
	var radius = Math.pow((volume*3)/(4*Math.PI), 1/3);
	this.setRadius(radius);
}
Charge.prototype.setMass = function(m){
	this.mass = m;
}
Charge.prototype.setRadius = function(r){
	this.mesh.scale.set(r,r,r);
	this.radius = r;
	this.radiusSquared = r*r;
}
Charge.prototype.fixedUpdate = function(){	
	if(!this.movable) return;
	this.velocity.addScaledVector(this.acceleration, Time.fixedStep);
	this.mesh.position.addScaledVector(this.velocity, Time.fixedStep);
/*	if(this.trail !== null){
		if(++this.trailStepCounter >= this.trailStep){
			this.trail.advance(this.mesh.position);
			this.trailStepCounter = 0;
		}
	} */
}
Charge.prototype.update = function(){
	
}
Charge.prototype.setAppliesForce = function(b){
	this.appliesForce = b;
}
Charge.prototype.setMovable = function(b){
	this.movable = b;
}
Charge.prototype.setColor = function(c){
	this.mesh.material.color.set(c);
}
