#version 330 core

in vec2 UV;

layout(location = 0) out vec3 color;

uniform sampler2D blurTexture;
uniform vec2 direction;
uniform float radius;
uniform float resolution;

void main() {
    vec4 sum = vec4(0.0);
    vec2 tc = UV;
    float blurMagnitude = radius/resolution;
    float hstep = direction.x;
    float vstep = direction.y;

    // 9-tap filter with predefined gaussian weights
    sum += texture(blurTexture, vec2(tc.x - 4.0*blurMagnitude*hstep, tc.y - 4.0*blurMagnitude*vstep)) * 0.0162162162;
    sum += texture(blurTexture, vec2(tc.x - 3.0*blurMagnitude*hstep, tc.y - 3.0*blurMagnitude*vstep)) * 0.0540540541;
    sum += texture(blurTexture, vec2(tc.x - 2.0*blurMagnitude*hstep, tc.y - 2.0*blurMagnitude*vstep)) * 0.1216216216;
    sum += texture(blurTexture, vec2(tc.x - 1.0*blurMagnitude*hstep, tc.y - 1.0*blurMagnitude*vstep)) * 0.1945945946;
    sum += texture(blurTexture, vec2(tc.x, tc.y)) * 0.2270270270;
    sum += texture(blurTexture, vec2(tc.x + 1.0*blurMagnitude*hstep, tc.y + 1.0*blurMagnitude*vstep)) * 0.1945945946;
    sum += texture(blurTexture, vec2(tc.x + 2.0*blurMagnitude*hstep, tc.y + 2.0*blurMagnitude*vstep)) * 0.1216216216;
    sum += texture(blurTexture, vec2(tc.x + 3.0*blurMagnitude*hstep, tc.y + 3.0*blurMagnitude*vstep)) * 0.0540540541;
    sum += texture(blurTexture, vec2(tc.x + 4.0*blurMagnitude*hstep, tc.y + 4.0*blurMagnitude*vstep)) * 0.0162162162;

    color = sum.rgb;
}
