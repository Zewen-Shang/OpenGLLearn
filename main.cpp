#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include "Shader.h"
#include "camera.h"
#include "mesh.h"
#include "model.h"
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>
#include <assimp/Importer.hpp>
#include <assimp/scene.h>
#include <assimp/postprocess.h>
#include <iostream>


void framebuffer_size_callback(GLFWwindow* window, int width, int height);
void processInput(GLFWwindow* window);

// settings
const unsigned int SCR_WIDTH = 600;
const unsigned int SCR_HEIGHT = 600;


float lastFrame = 0.0f;

bool mouse_first = true;

double lastx = SCR_WIDTH/2.0f, lasty = SCR_HEIGHT / 2.0F;
void mouse_callback(GLFWwindow* window, double xpos, double ypos);
void scoll_callback(GLFWwindow* window, double xpos, double ypos);

Camera camera(glm::vec3(0.0f, 0.0f, 3.0f));

int main()
{

    glfwInit();
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

    GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "LearnOpenGL", NULL, NULL);
    if (window == NULL)
    {
        std::cout << "Failed to create GLFW window" << std::endl;
        glfwTerminate();
        return -1;
    }
    glfwMakeContextCurrent(window);
    glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
    /*控制鼠标输入*/
    glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);
    glfwSetCursorPosCallback(window, mouse_callback);
    /*注册滚轮变化*/
    glfwSetScrollCallback(window, scoll_callback);

    if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
    {
        std::cout << "Failed to initialize GLAD" << std::endl;
        return -1;
    }

    // tell stb_image.h to flip loaded texture's on the y-axis (before loading model).
    stbi_set_flip_vertically_on_load(true);

    glEnable(GL_DEPTH_TEST);

    /************Shader Begin*********/
    Shader nanoShader("./nanoShader.vert", "./nanoShader.frag");
    /************Shader End*********/

    Model nanoModel("./nanosuit/nanosuit.obj");

    while (!glfwWindowShouldClose(window))
    {

        float currentFrame = glfwGetTime();
        processInput(window);
        lastFrame = currentFrame;
        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT|GL_DEPTH_BUFFER_BIT);

        nanoShader.use();
        // view/projection transformations
        glm::mat4 projection = glm::perspective(glm::radians(camera.Zoom), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.1f, 100.0f);
        glm::mat4 view = camera.GetViewMatrix();
        nanoShader.setMat4("projection", projection);
        nanoShader.setMat4("view", view);
        nanoShader.setVec3("viewPos", camera.Position);

        nanoShader.setVec3("dirLight.direction",glm::vec3( -0.2f, -1.0f, -0.3f));
        nanoShader.setVec3("dirLight.ambient", glm::vec3(0.05f, 0.05f, 0.05f));
        nanoShader.setVec3("dirLight.diffuse", glm::vec3(0.4f, 0.4f, 0.4f));
        nanoShader.setVec3("dirLight.specular", glm::vec3(0.5f, 0.5f, 0.5f));

        // render the loaded model
        glm::mat4 model = glm::mat4(1.0f);
        model = glm::translate(model, glm::vec3(0.0f, 0.0f, 0.0f)); // translate it down so it's at the center of the scene
        model = glm::scale(model, glm::vec3(1.0f, 1.0f, 1.0f));	// it's a bit too big for our scene, so scale it down
        nanoShader.setMat4("model", model);
        nanoModel.Draw(nanoShader);

        glfwSwapBuffers(window);
        glfwPollEvents();
    }

    glfwTerminate();
    return 0;
}

void processInput(GLFWwindow* window)
{
    float current_time = glfwGetTime();
    float delta_time = current_time - lastFrame;
    lastFrame = current_time;
    if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
        glfwSetWindowShouldClose(window, true);
    if (glfwGetKey(window,GLFW_KEY_W) == GLFW_PRESS) {
        camera.ProcessKeyboard(FORWARD, delta_time);
    }
    if (glfwGetKey(window, GLFW_KEY_S) == GLFW_PRESS) {
        camera.ProcessKeyboard(BACKWARD, delta_time);
    }
    if (glfwGetKey(window, GLFW_KEY_D) == GLFW_PRESS) {
        camera.ProcessKeyboard(RIGHT, delta_time);
    }
    if (glfwGetKey(window, GLFW_KEY_A) == GLFW_PRESS) {
        camera.ProcessKeyboard(LEFT, delta_time);
    }
}

void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
    glViewport(0, 0, width, height);
}

void mouse_callback(GLFWwindow* window, double xpos, double ypos) {
    if (mouse_first) {
        lastx = xpos;
        lasty = ypos;
        mouse_first = false;
    }
    float x_offset = xpos - lastx;
    float y_offset = lasty - ypos;

    camera.ProcessMouseMovement(x_offset, y_offset);

    lastx = xpos;
    lasty = ypos;
}

void scoll_callback(GLFWwindow* window, double xpos, double ypos) {
    camera.ProcessMouseScroll(ypos);
}