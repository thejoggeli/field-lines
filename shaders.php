<?php
	
	function get_shader_src($file){
								
		$src = file_get_contents("shaders/" . $file);
		
		$regex = "/\#import \"[\w\/\.]+\"/";
		
		$matches;
		preg_match_all($regex, $src, $matches);
		
		foreach($matches[0] as $match){
			$filename = "nothing";
			preg_match('/"([^"]+)"/', $match, $filename); 	
			$content = file_get_contents("shaders/" . $filename[1]);
			$src = str_replace($match, $content, $src);
		}
		
		return $src;
	}
	
	function load_shader($name){
		echo "<script type='x-shader/x-vertex' id='$name-vertex'>" . get_shader_src("$name.vert") . "</script>\n";
		echo "<script type='x-shader/x-fragment' id='$name-fragment'>" . get_shader_src("$name.frag") . "</script>\n";
	}
	
	function get_shader_bindings($file){		
		$path = "shaders/" . $file;
		if(file_exists($path)){
			return $path;
		}
		return null;
	}


?>