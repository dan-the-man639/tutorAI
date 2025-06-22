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

        # Define original vectors
        original_vectors = VGroup(
            Arrow(ORIGIN, RIGHT, buff=0, color=YELLOW),
            Arrow(ORIGIN, UP, buff=0, color=YELLOW)
        )
        self.play(Create(original_vectors))

        # Define a transformation matrix
        matrix = np.array([[2, 1], [1, 2]])

        # Apply the transformation to the vectors
        transformed_vectors = VGroup(
            Arrow(ORIGIN, matrix @ np.array([1, 0]), buff=0, color=RED),
            Arrow(ORIGIN, matrix @ np.array([0, 1]), buff=0, color=RED)
        )
        self.play(Transform(original_vectors, transformed_vectors))

        # Transform the grid
        transformed_grid = plane.copy()
        transformed_grid.apply_matrix(matrix)
        self.play(Transform(plane, transformed_grid))

        # Add labels for clarity
        original_label = MathTex(r"\vec{v}_1", color=YELLOW).next_to(original_vectors[0].get_end(), DOWN)
        transformed_label = MathTex(r"T(\vec{v}_1)", color=RED).next_to(transformed_vectors[0].get_end(), DOWN)
        self.play(Write(original_label), Write(transformed_label))

        self.wait(2)