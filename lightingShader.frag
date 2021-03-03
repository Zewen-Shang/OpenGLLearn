#version 330 core
out vec4 FragColor;
in vec3 Normal;
in vec3 FragPos;
in vec2 TexCoords;
uniform vec3 lightPos,viewPos;

struct Material{
    sampler2D  diffuse;
    sampler2D specular;
    float shininess;
};

uniform Material material;

struct Light{
    vec3 position;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;

    float constant;
    float linear;
    float quadratic;
};

uniform Light light;

void main()
{
    float distance = length(light.position - FragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + 
    light.quadratic * (distance * distance));

    vec3 ambient = vec3(texture(material.diffuse,TexCoords))* attenuation * light.ambient;

    vec3 lightDir = normalize(light.position - FragPos);
    vec3 diffuse = max(0.0f,dot(lightDir,Normal)) * attenuation * vec3(texture(material.diffuse,TexCoords)) * light.diffuse;

    vec3 viewDir = normalize(viewPos - FragPos);
    float spec = max(0.0,dot(normalize(viewDir + lightDir),Normal));
    vec3 specular = pow(spec,material.shininess) * attenuation * vec3(texture(material.specular,TexCoords)) * light.specular;

    FragColor = vec4((ambient + diffuse + specular),1.0f);
}