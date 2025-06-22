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

        # Define the original vectors
        original_vectors = [
            Line(ORIGIN, RIGHT, color=YELLOW),
            Line(ORIGIN, UP, color=YELLOW)
        ]
        self.play(Create(VGroup(*original_vectors)))

        # Define the transformation matrix
        matrix = np.array([[2, 1], [1, 2]])

        # Apply the transformation to the vectors
        transformed_vectors = [
            Line(ORIGIN, matrix @ RIGHT, color=RED),
            Line(ORIGIN, matrix @ UP, color=RED)
        ]
        self.play(Transform(VGroup(*original_vectors), VGroup(*transformed_vectors)))

        # Define a grid of points to visualize the transformation
        grid_points = [Dot(plane.c2p(x, y), radius=0.05) for x in range(-4, 5) for y in range(-4, 5)]
        self.play(FadeIn(VGroup(*grid_points)))

        # Apply the transformation to the grid points
        transformed_grid_points = [
            Dot(plane.c2p(*(matrix @ np.array([x, y]))), radius=0.05, color=BLUE)
            for x in range(-4, 5) for y in range(-4, 5)
        ]
        self.play(Transform(VGroup(*grid_points), VGroup(*transformed_grid_points)))

        # Wait before ending the scene
        self.wait(2)