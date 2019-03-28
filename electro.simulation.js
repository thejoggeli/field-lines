function Simulation(){}
Simulation.charges = [];
Simulation.running = false;
Simulation.constant = 1.0;
Simulation.direction = new THREE.Vector3();
Simulation.timeScale = 1;
Simulation.timeScaleExponent = 0;
Simulation.init = function(){}
Simulation.calculatePhysics = function(){
	for(var i = 0; i < Simulation.charges.length; i++){
		Simulation.charges[i].force.set(0,0,0);
		Simulation.charges[i].acceleration.set(0,0,0);
	}
	for(var i = 0; i < Simulation.charges.length-1; i++){
		var a = Simulation.charges[i];
		for(var j = i+1; j < Simulation.charges.length; j++){
			var b = Simulation.charges[j];
			var distanceSquared = a.mesh.position.distanceToSquared(b.mesh.position);
			var force = Simulation.constant*a.charge*b.charge/distanceSquared;
			Simulation.direction.subVectors(a.mesh.position, b.mesh.position);
			Simulation.direction.normalize();
			if(b.appliesForce) a.force.addScaledVector(Simulation.direction, force);
			if(a.appliesForce){
				Simulation.direction.negate();
				b.force.addScaledVector(Simulation.direction, force);
			}
		}
	}
	for(var i = 0; i < Simulation.charges.length; i++){
		Simulation.charges[i].acceleration.addScaledVector(Simulation.charges[i].force , 1/Simulation.charges[i].mass);
	}
}
Simulation.update = function(){
	Time.limit = false;
	if(!Simulation.running) return;
	Time.updateTimer += Time.deltaTime;
	var startTime = Time.getTime();
	var currentTime = Time.getTime();
	while(Time.updateTimer > Time.fixedStep){	
		Time.totalUpdates++;
		Time.upsCounter++;	
		Simulation.calculatePhysics();
		for(var b in Simulation.charges){
			var body = Simulation.charges[b];
			body.fixedUpdate();
		}
					
	/*	var charge = Simulation.charges[0];
		if(charge.aaa === undefined) charge.aaa = 0;
		charge.aaa += Time.fixedStep;
		charge.mesh.position.x = Math.sin(charge.aaa) * 15;
		charge.mesh.position.z = Math.cos(charge.aaa) * 15; 
	//	Simulation.charges[0].mesh.position.y = Math.sin(Time.sinceStart) * 2;
		Field.clear();
		Field.createLines(Simulation.charges[0]);  */
		
		currentTime = Time.getTime();
		if(currentTime-startTime >= (1/30)){
			Time.limit = true;
			Time.updateTimer %= Time.fixedStep;
		} else {
			Time.updateTimer -= Time.fixedStep;			
		}
	}	
}
Simulation.start = function(){
	this.running = true;
	Time.updateTimer = 0;
	Simulation.applyTimeScale();
}
Simulation.stop = function(){
	this.running = false;
	Time.updateTimer = 0;
	Time.scale = 1;
}
Simulation.setTimeScale = function(s){
	Simulation.timeScaleExponent = s;
	Simulation.timeScale = Math.pow(2, Simulation.timeScaleExponent);
	if(Simulation.running){
		Simulation.applyTimeScale();		
	}
}
Simulation.applyTimeScale = function(){
	Time.scale = Simulation.timeScale;
}
