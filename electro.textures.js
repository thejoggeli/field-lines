function Textures(){}
Textures.loader = new THREE.TextureLoader();
Textures.map = {};
Textures.buffer = {};
Textures.loadedTarget = 0;
Textures.loadedCount = 0;
Textures.add = function(name, file){
	Textures.buffer[name] = file;	
	Textures.loadedTarget++;
}
Textures.load = function(callback){
	for(var t in Textures.buffer){
		var file = Textures.buffer[t];
		Textures.map[t] = Textures.loader.load("resources/" + file, function(t_){
			Textures.loadedCount++;
			if(Textures.loadedCount == Textures.loadedTarget){
				callback();
			}
		});
	}
}
Textures.get = function(name){
	return Textures.map[name];
}