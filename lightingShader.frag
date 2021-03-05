#version 330 core

#define NR_DIR_LIGHTS 4
#define NR_POINT_LIGHTS 4

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

struct DirLight{
    vec3 direction;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

uniform DirLight dirLight;

vec3 CalcDirLight(DirLight light){
    vec3 lightDir = normalize(light.direction);
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 normal = normalize(Normal);

    vec3 ambient = texture(material.diffuse,TexCoords).rgb * light.ambient;

    vec3 diffuse = max(0.0f,dot(normalize(light.direction),normalize(Normal))) * texture(material.diffuse,TexCoords).rgb * light.diffuse;

    vec3 specular = pow(max(0.0f,dot(normal,normalize(lightDir + viewDir))),material.shininess)
    * texture(material.specular,TexCoords).rgb * light.specular;

    return ambient + diffuse + specular;
}

struct PointLight{
    vec3 position;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;

    float constant;
    float linear;
    float quadratic;
};

uniform PointLight pointLights[NR_POINT_LIGHTS];

vec3 CalcPointLight(PointLight light){

    float distance = length(light.position - FragPos);
    float attenuation = 1.0f / (light.constant + light.linear * distance + light.quadratic * distance * distance);
    vec3 lightDir = normalize(light.position - FragPos);
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 normal = normalize(Normal);

    vec3 ambient = texture(material.diffuse,TexCoords).rgb * light.ambient;

    vec3 diffuse = attenuation * max(0.0f,dot(normal,lightDir)) * texture(material.diffuse,TexCoords).rgb * light.diffuse;

    vec3 specular = pow(max(0.0f,dot(normalize(viewDir + lightDir),normal)),material.shininess)
    * texture(material.specular,TexCoords).rgb * light.specular;

    return ambient + diffuse + specular;
}

struct SpotLight{
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

uniform SpotLight spotLight;

vec3 CalcSpotLight(SpotLight light){
    float distance = length(light.position - FragPos);
    float attenuation = 1.0f / (light.constant + light.linear * distance + light.quadratic * distance * distance);
    vec3 lightDir = normalize(light.position - FragPos);
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 normal = normalize(Normal);

    float theta = dot(lightDir,-normalize(light.direction));
    vec3 ambient = texture(material.diffuse,TexCoords).rgb * light.ambient;
    vec3 diffuse = vec3(0.0f);
    vec3 specular = vec3(0.0f);

    if(theta > light.cutOff){
        diffuse = attenuation * max(0.0f,dot(normal,lightDir)) * texture(material.diffuse,TexCoords).rgb * light.diffuse;

        specular = pow(max(0.0f,dot(normalize(viewDir + lightDir),normal)),material.shininess)
        * texture(material.specular,TexCoords).rgb * light.specular;
    }
    return ambient + diffuse + specular;
}

void main()
{
    vec3 result = vec3(0.0f);

    result += CalcDirLight(dirLight);
    result += CalcSpotLight(spotLight);
    for(int i=0;i<NR_POINT_LIGHTS;i++){
        result += CalcPointLight(pointLights[i]);
    }

    FragColor = vec4(result,1.0f);
}