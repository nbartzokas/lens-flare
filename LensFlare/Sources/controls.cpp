#include <GLFW/glfw3.h>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
using namespace glm;

#include "controls.hpp"

float accel = 1.05f;
float speed = 0.05f;
float maxSpeed = 0.01f;
float minSpeed = 0.0005f;
bool mouseButtonDown = false;
double mouseInitX = 0.0f;
double mouseInitY = 0.0f;

void mouseButtonCallback(GLFWwindow* window, int button, int action, int mods){
    if (button == GLFW_MOUSE_BUTTON_RIGHT){
        if (action == GLFW_PRESS) {
            glfwGetCursorPos(window, &mouseInitX, &mouseInitY);
            mouseButtonDown = true;
        }
        if (action == GLFW_RELEASE) mouseButtonDown = false;
    }
}

void setupControls(GLFWwindow *window){
    glfwSetMouseButtonCallback(window, mouseButtonCallback);
}

void updateControls(GLFWwindow *window, float windowWidth, float windowHeight, float maxWidth, float maxHeight, vec2 &viewXY){

    if (mouseButtonDown){
        double mouseX, mouseY;
        glfwGetCursorPos(window, &mouseX, &mouseY);
        viewXY.x += speed * ( mouseX - mouseInitX );
        viewXY.y -= speed * ( mouseY - mouseInitY );
    }
    
    // constrain movement to edges of texture
//    viewXY.x = clamp(viewXY.x,0.0f,(float)maxWidth-(float)windowWidth);
//    viewXY.y = clamp(viewXY.y,0.0f,(float)maxHeight-(float)windowHeight);

}
