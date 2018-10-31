#version 330 core

in vec2 UV;

layout(location = 0) out vec3 color;

uniform sampler2D sceneTexture;
uniform sampler2D effectsTexture;

void main() {
    color = texture(sceneTexture, UV).rgb + texture(effectsTexture, UV).rgb;
}
