varying vec2 iCoords;
varying vec3 iPosition;
varying mat4 iMatrix;
uniform float iTime;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>

vec3 getNormal(vec2 coords){
	return vec3(coords.x, coords.y, sqrt(1.0-coords.x*coords.x-coords.y*coords.y));
}

vec3 getColor(vec3 normal){
	return vec3(
		abs(sin(normal.x*PI)*1.0),
		abs(cos(normal.y*0.5)*0.5),
		abs(cos(normal.z)*0.5+sin(iTime))
	);
}

void main() {
	vec2 coords = vec2(iCoords)*2.0-1.0;
	float len = length(coords);
	if(len > 1.0){
		gl_FragColor = vec4(0.0);
	} else {
		vec3 normal = getNormal(coords);
		vec3 color = getColor((vec4(normal, 1.0) * iMatrix).xyz);
		vec3 result = color * ambientLightColor;
		#if (NUM_POINT_LIGHTS > 0)
		PointLight pointLight;
	/*	for (int i = 0; i < NUM_POINT_LIGHTS; i++) {
			pointLight = pointLights[i];
			vec3 lightVector = pointLight.position - iPosition;
			vec3 lightDirection = normalize(lightVector);
			float nDotL = max(dot(lightDirection, normal), 0.0);
			vec3 diffuse = nDotL * pointLight.color;
			result += diffuse*color;
		} */
		
		#endif
		
		gl_FragColor = vec4(result, 1.0);
	}

}
