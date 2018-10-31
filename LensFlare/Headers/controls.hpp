#ifndef CONTROLS_HPP
#define CONTROLS_HPP

// Include GLFW
#include <GLFW/glfw3.h>

// Include GLM
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

void setupControls(GLFWwindow *window);
void updateControls(GLFWwindow *window, float windowWidth, float windowHeight, float maxWidth, float maxHeight, glm::vec2 &viewXY);

#endif
