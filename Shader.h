#pragma once
#include <glad/glad.h>; // 包含glad来获取所有的必须OpenGL头文件

#include <string>
#include <fstream>
#include <sstream>
#include <iostream>

#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>


class Shader
{
public:
	unsigned int ID;
	Shader(const GLchar* vertexPath, const GLchar* fragmentPath);
	
	void use();
	void setBool(const std::string& name, bool value) const;
	void setInt(const std::string& name, int value) const;
	void setFloat(const std::string& name, float value) const;
	void setMatrix4(const std::string& name, glm::mat4 mat)const;
	void setVec3(const std::string& name, const glm::vec3& value) const;
};

