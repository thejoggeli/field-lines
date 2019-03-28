<?php
	require_once("shaders.php");
?>
<!DOCTYPE html>
<html><head>
	<title>Planets Remastered</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<script src="jquery-3.2.1.min.js"></script>
	<script src="jquery.cookie.js"></script>
	<script src="THREE.js"></script>
	<script src="THREE.MeshLine.js"></script>
	<script src="THREE.OrbitControls.js"></script>
	<script src="gfw.js"></script>
	<script src="storage.js"></script>
	<script src="electro.main.js"></script>
	<script src="electro.textures.js"></script>
	<script src="electro.ui.js"></script>
	<script src="electro.charge.js"></script>
	<script src="electro.simulation.js"></script>
	<script src="electro.field.js"></script>
	<script src="electro.factory.js"></script>
	<link rel="stylesheet" type="text/css" href="gfw.css">
	<link rel="stylesheet" type="text/css" href="game.css">
</head><body>
	<div id="left-anchor" class="noselect">
		<div id="monitor-box">
			<div class="monitor-header">Monitor</div>
		</div>
		<div id="controls-box">
			<div class="controls-header">Controls</div>
		</div>
		<button class="save-state" style="display:none">Save state</button>
	</div>
	<div class="toast">
		<div class="inner">
			<span class="toast-text">Toast</div>
		</div>
	</div>
	<div id="ui">
	</div>
</body></html>
