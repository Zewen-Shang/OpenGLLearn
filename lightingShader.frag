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
    vec3 direction;
    float cutOff;

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

    vec3 lightDir = normalize(light.position - FragPos);
    
    float theta = dot(lightDir,-light.direction);

    vec3 ambient = texture(material.diffuse,TexCoords).rgb * attenuation * light.ambient;
    vec3 diffuse = vec3(0.0f);
    vec3 specular = vec3(0.0f);

    if(theta > light.cutOff){
        diffuse = max(0.0f,dot(lightDir,Normal)) * attenuation * texture(material.diffuse,TexCoords).rgb * light.diffuse;
        vec3 viewDir = normalize(viewPos - FragPos);
        float spec = max(0.0,dot(normalize(viewDir + lightDir),Normal));
        specular = pow(spec,material.shininess) * attenuation * texture(material.specular,TexCoords).rgb * light.specular;
    }





    FragColor = vec4((ambient + diffuse + specular),1.0f);
}