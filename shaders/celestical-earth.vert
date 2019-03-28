varying vec2 iCoords;
varying vec3 iPosition;
varying mat4 iMatrix;

void main() {	
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);	
	iCoords = uv;
	iPosition = (modelMatrix * vec4(position, 1.0)).xyz;
	iMatrix = viewMatrix;
}
