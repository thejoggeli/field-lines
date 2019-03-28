$(document).ready(function(){
	Monitor.setup({showTitle: false});	// setup Gfw 
	Gfw.setup({scaling:true, height:1024});
	Gfw.createCanvas("main", {"renderMode": RenderMode.None});
	Gfw.getCanvas("main").setActive();
	Gfw.onUpdate = onUpdate;
	Gfw.onRender = onRender;
	Gfw.onResize = onResize;
	// load
	Textures.add("charge-pos", "charge-pos-512.png");
	Textures.add("charge-neg", "charge-neg-512.png");
	Textures.add("charge-neu", "charge-neu-512.png");
	Textures.add("arrow", "arrow.png");
	Textures.load(function(){
		console.log("onload");
		// init	
		onInit();
		Gfw.start();			
	});
});

function onInit(){
	Toast.info("Welcome to the Planets", 3);
		
	// scene
	scene = new THREE.Scene();
	
	// renderer
	renderer = new THREE.WebGLRenderer({canvas:Gfw.getCanvas("main").element, antialias:true});
	renderer.setClearColor(new THREE.Color(0), 1);
	
	// camera
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000);
	camera.position.set(-15,15,15);
	camera.lookAt(new THREE.Vector3(0,0,0));
	cameraControls = new THREE.OrbitControls(camera, Gfw.inputOverlay[0]);
		
	// ambi light
    ambientLight = new THREE.AmbientLight(0xFFFFFF);
    ambientLight.intensity = 0.15;
    scene.add(ambientLight);
	
	// dir light
	directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.85);
	scene.add(directionalLight);
	
/*	fog = new THREE.Fog(0x0, 50, 60)
	scene.fog = fog; */
	
	grid = new THREE.GridHelper(1000, 1000, 0x444444, 0x444444);
	grid.visible = false;
	scene.add(grid);
	
	Time.fixedStep = 1/60;
	Time.updateTimer = 0;
	Time.lastUpsTime = 0;
	Time.upsCounter = 0;
	Time.ups = 0;
	Time.scaleExponent = 0;
	Time.maxDeltaTime = Infinity;
	Time.totalUpdates = 0;
	
	Simulation.init();
	
	// setup
/*	var c1 = new Charge().init({charge:1});
	c1.mesh.position.set(-5,0,0);
	var c2 = new Charge().init({charge:1});
	c2.mesh.position.set(5,0,0);
	var c3 = new Charge().init({charge:-4});
	c3.mesh.position.set(0,5,0); */
	
/*	var charge;
	charge = new Charge().init({charge:1});
	charge.mesh.position.set(-5,0,0);
	charge = new Charge().init({charge:-1});
	charge.mesh.position.set(5,10,0);
	charge = new Charge().init({charge:-1});
	charge.mesh.position.set(5,-10,0); 
	charge = new Charge().init({charge:-1});
	charge.mesh.position.set(0,0,0);  */
	
//	Field.createVectors();
//	Field.createLines(Simulation.charges[0]);
//	Field.createLines(c2);
	
/*	var charge;
	var pos = [];
	for(var i = 0; i < 11; i++){
		charge = new Charge().init({charge:1});
		charge.mesh.position.set(i*2, 0, -15);
		pos.push(charge);		
		charge = new Charge().init({charge:-1});
		charge.mesh.position.set(i*2, 0, 15);
	}

	for(var i = 0; i < pos.length; i++){
		Field.createLines(pos[i]);
	} */
	
	var charge;
	charge = new Charge().init({charge:10});
	charge.mesh.position.set(-5,0,5);
	charge = new Charge().init({charge:-1});
	charge.mesh.position.set(-5,0,-5);
	charge = new Charge().init({charge:-1});
	charge.mesh.position.set(5,0,5);
	charge = new Charge().init({charge:-1});
	charge.mesh.position.set(5,0,-5);
	
	Field.createLines(Simulation.charges[0], 1);
	
/*	var line = Field.lines[3];
	for(var i = 10; i < line.points.length; i += 5){
		var c4 = new Charge().init({charge:0.1});
		c4.setMovable(true);
		c4.setAppliesForce(false);
		c4.setColor(0xFFFF00);
		var p = line.points[i];
		c4.mesh.position.copy(p);
	} */
		
}

function onResize(){
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.far = 1000000;
	camera.near = 0.1;
	camera.fov = 60; // 90/(window.innerWidth/window.innerHeight)*(16.0/9.0); // left-right fov at 16:9 = 90°
	
	camera.updateProjectionMatrix();
	console.log("resize");
}

function onUpdate(){
	if(Input.keyDown(32)){
		grid.visible = !grid.visible;
	}
	if(Time.sinceStart - Time.lastUpsTime > 1){
		Time.ups = Time.upsCounter;
		Time.upsCounter = 0;
		Time.lastUpsTime = Time.sinceStart;
	}
	if(Input.keyDown(49)){
		Simulation.setTimeScale(Simulation.timeScaleExponent-1);
	} else if(Input.keyDown(50) && !Time.limit){
		Simulation.setTimeScale(Simulation.timeScaleExponent+1);
	}
	if(Input.keyDown(51)){
		if(Simulation.running){
			Simulation.stop();
		} else {
			Simulation.start();
		}
	};

/*	Field.clear();
	for(var i = 0; i < Simulation.charges.length; i+=2){
		Simulation.charges[i].mesh.position.z = Math.sin(Time.sinceStart)*5 - 15;
		Simulation.charges[i].mesh.position.y = Math.sin(Time.sinceStart)*15;
		Simulation.charges[i].setCharge(Math.sin(Time.sinceStart)*2);
	}
	for(var i = 0; i < Simulation.charges.length; i+=2){
		Field.createLines(Simulation.charges[i]);
	} */
	
//	Simulation.charges[0].setCharge(Math.sin(Time.sinceStart*0.25)*10);
	Simulation.charges[0].mesh.position.y = Math.sin(Time.sinceStart*0.5)*5;
	Field.clear();
	Field.createLines(Simulation.charges[0], 1);
	
	Simulation.update();	
	for(var b in Simulation.charges){
		var charge = Simulation.charges[b];
		charge.update();		
	}	
	var gridDistance = Math.abs(grid.position.y - camera.position.y);
	var gridScale = Math.ceil(Math.log2(gridDistance/8.0));
	gridScale = Math.pow(2, gridScale);
	if(gridScale < 2) gridScale = 2;
	grid.scale.set(gridScale, gridScale, gridScale);
	directionalLight.position.copy(camera.position);
	directionalLight.rotation.copy(camera.rotation);
	// monitor stuffs
	Monitor.set("FPS", Time.fps);
	Monitor.set("UPS", Time.ups);
	Monitor.set("Updates", Time.totalUpdates);
	Monitor.set("Speed", Simulation.timeScale + (Simulation.running ? "" : " (paused)"));
	Monitor.set("Limit", Time.limit ? "true" : "false");
}

function onRender(){
	renderer.render(scene, camera);
}





















