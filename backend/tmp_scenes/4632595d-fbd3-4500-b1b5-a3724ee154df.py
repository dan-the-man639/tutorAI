from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Create a NumberPlane to represent the grid
        plane = NumberPlane(
            x_range=[-5, 5, 1],
            y_range=[-5, 5, 1],
            background_line_style={"stroke_opacity": 0.4}
        )
        self.play(Create(plane))

        # Define the basis vectors
        i_hat = Line(start=ORIGIN, end=RIGHT, color=YELLOW)
        j_hat = Line(start=ORIGIN, end=UP, color=RED)
        self.play(Create(i_hat), Create(j_hat))

        # Define the transformation matrix
        transformation_matrix = np.array([[2, 1], [1, 1]])

        # Apply the transformation to the basis vectors
        new_i_hat = Line(
            start=ORIGIN,
            end=transformation_matrix @ np.array([1, 0]),
            color=YELLOW
        )
        new_j_hat = Line(
            start=ORIGIN,
            end=transformation_matrix @ np.array([0, 1]),
            color=RED
        )

        # Animate the transformation of the basis vectors
        self.play(Transform(i_hat, new_i_hat), Transform(j_hat, new_j_hat))

        # Create a grid of points to visualize the transformation
        grid_points = VGroup(*[
            Dot(point=plane.c2p(x, y), radius=0.05)
            for x in np.arange(-4, 5, 1)
            for y in np.arange(-4, 5, 1)
        ])
        self.play(FadeIn(grid_points))

        # Apply the transformation to each point in the grid
        transformed_points = VGroup(*[
            Dot(point=plane.c2p(*(transformation_matrix @ np.array([x, y]))), radius=0.05)
            for x in np.arange(-4, 5, 1)
            for y in np.arange(-4, 5, 1)
        ])
        self.play(Transform(grid_points, transformed_points))

        # Wait to observe the final transformation
        self.wait(2)