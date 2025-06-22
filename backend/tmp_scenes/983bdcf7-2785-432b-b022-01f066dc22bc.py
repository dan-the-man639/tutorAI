from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Create a number plane
        plane = NumberPlane(
            x_range=[-5, 5, 1],
            y_range=[-5, 5, 1],
            background_line_style={"stroke_opacity": 0.4}
        )
        self.play(Create(plane))

        # Define basis vectors
        i_hat = np.array([1, 0])
        j_hat = np.array([0, 1])

        # Draw basis vectors
        i_vector = Line(ORIGIN, i_hat, color=YELLOW)
        j_vector = Line(ORIGIN, j_hat, color=RED)
        self.play(Create(i_vector), Create(j_vector))

        # Define a linear transformation matrix
        matrix = np.array([[2, 1],
                           [1, 2]])

        # Transform basis vectors
        i_transformed = matrix @ i_hat
        j_transformed = matrix @ j_hat

        # Draw transformed vectors
        i_vector_transformed = Line(ORIGIN, i_transformed, color=YELLOW)
        j_vector_transformed = Line(ORIGIN, j_transformed, color=RED)

        # Animate transformation
        self.play(Transform(i_vector, i_vector_transformed),
                  Transform(j_vector, j_vector_transformed))

        # Draw transformed grid
        transformed_plane = NumberPlane(
            x_range=[-5, 5, 1],
            y_range=[-5, 5, 1],
            background_line_style={"stroke_opacity": 0.4}
        )
        transformed_plane.apply_matrix(matrix)
        self.play(Transform(plane, transformed_plane))

        # Example vector to transform
        vector = np.array([2, 1])
        vector_line = Line(ORIGIN, vector, color=BLUE)
        self.play(Create(vector_line))

        # Transform the example vector
        vector_transformed = matrix @ vector
        vector_line_transformed = Line(ORIGIN, vector_transformed, color=BLUE)

        # Animate the transformation of the example vector
        self.play(Transform(vector_line, vector_line_transformed))

        # Wait before ending the scene
        self.wait(2)