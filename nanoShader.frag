#version 330 core
out vec4 FragColor;
in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoords;

uniform vec3 viewPos;
uniform sampler2D texture_diffuse1;
uniform sampler2D texture_specular1;

struct DirLight{
    vec3 direction;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

uniform DirLight dirLight;

vec3 CalcDirLight(DirLight light){
    vec3 lightDir = -normalize(light.direction);
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 normal = normalize(Normal);

    vec3 ambient = texture(texture_diffuse1,TexCoords).rgb * light.ambient;
    vec3 diffuse = max(0.0f,dot(normal,lightDir)) * texture(texture_diffuse1,TexCoords).rgb * light.diffuse;
    vec3 specular = max(0.0f,dot(normal,normalize(lightDir + viewDir))) * texture(texture_specular1,TexCoords).rgb * light.specular;
    
    return ambient + diffuse + specular;
}

void main()
{    
    vec3 result = CalcDirLight(dirLight);
    FragColor = vec4(result,1.0f);
}