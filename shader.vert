#version 330 core
layout (location = 0) in vec3 aPos;

out vec2 TexCoord;

uniform mat4 model,view,proj;

void main()
{
    gl_Position = proj * view * model * vec4(aPos, 1.0);
}