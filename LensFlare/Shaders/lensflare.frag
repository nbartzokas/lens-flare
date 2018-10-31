#version 330 core

in vec2 UV;

out vec3 color;

uniform float aspectRatio;
uniform float chromaticDistortion;
uniform float colorGradientAlpha;
uniform float dustAlpha;
uniform sampler2D dustTexture;
uniform float ghostsAlpha;
uniform float ghostsDispersal;
uniform int ghostsNumber;
uniform float ghostsWeight;
uniform sampler2D gradientTexture;
uniform float haloAlpha;
uniform float haloWidth;
uniform float haloWeight;
uniform sampler2D renderTexture;
uniform float starAlpha;
uniform mat4 starRotation;
uniform sampler2D starTexture;
uniform float thesholdBias;
uniform float thesholdScale;

//  www.iquilezles.org/www/articles/functions/functions.htm
float cubicPulse( float c, float w, float x ){
    x = abs(x - c);
    if( x>w ) return 0.0;
    x /= w;
    return 1.0 - x*x*(3.0-2.0*x);
}

vec3 textureDistorted(sampler2D tex, vec2 texcoord, vec2 direction, vec3 distortion) {
    return vec3(
        texture(tex, texcoord + direction * distortion.r).r,
        texture(tex, texcoord + direction * distortion.g).g,
        texture(tex, texcoord + direction * distortion.b).b
    );
}

vec3 sampleScaledBiasedTexture(sampler2D tex, vec2 uv){
    return max(vec3(0.0), texture( renderTexture, uv ).xyz + thesholdBias) * thesholdScale;
}

vec3 sampleScaledBiasedTexture(sampler2D tex, vec2 uv, vec2 direction, vec3 distortion){
    return max(vec3(0.0), textureDistorted( renderTexture, uv, direction, distortion ).xyz + thesholdBias) * thesholdScale;
}

void main(){

    vec2 texelSize = 1.0 / vec2(textureSize(renderTexture, 0));
    
    vec2 texcoord = -UV + vec2(1.0); // flip image
    vec2 ghostVec = (vec2(0.5) - texcoord) * ghostsDispersal;
    vec3 distortion = vec3(-texelSize.x * chromaticDistortion, 0.0, texelSize.x * chromaticDistortion);
    vec2 direction = normalize(ghostVec);
    vec2 circVec = vec2(ghostVec.x*aspectRatio, ghostVec.y);
    float offset = 0.5 * (1.0 - aspectRatio);
    float offsetY = 0.5 * (1.0 - 1.0/aspectRatio);

    // ghosts
    for (int i = 0; i < ghostsNumber; ++i) {
        vec2 offset = fract(texcoord + ghostVec * float(i));

        // falloff from center
        float weight = length(vec2(0.5) - offset) / length(vec2(0.5));
        weight = pow(1.0 - weight, ghostsWeight);

        color += ghostsAlpha * sampleScaledBiasedTexture(renderTexture, offset, direction, distortion) * weight;
    }

    // halo
    vec2 haloVec = vec2(0.5) - UV;
    haloVec.x *= aspectRatio;
    haloVec = normalize(haloVec);
    haloVec.x /= aspectRatio;
    haloVec *= haloWidth;
    float d = distance( vec2(UV.x*aspectRatio+offset,UV.y), vec2(0.5) );
    float weight = cubicPulse( haloWidth, haloWeight, d );
    color += haloAlpha * sampleScaledBiasedTexture(renderTexture, UV + haloVec, direction, distortion).xyz * weight;
    
    // star
    vec2 starUV = (starRotation * vec4(UV.x , UV.y / aspectRatio + offsetY, 0.0, 1.0)).xy;
    color *= 1.0 + starAlpha * textureDistorted(starTexture, starUV, direction, distortion).xyz;

    // color gradient
    vec2 circUV = vec2(UV.x , UV.y / aspectRatio + offsetY);
    float xy = length(vec2(0.5) - circUV) / length(vec2(0.5));
    color *= mix( vec3(1.0), vec3(1.0)-texture(gradientTexture, vec2(xy) ).xyz, colorGradientAlpha );

    // dust
    color *= mix( vec3(1.0), texture(dustTexture, UV).xyz, dustAlpha );

}
