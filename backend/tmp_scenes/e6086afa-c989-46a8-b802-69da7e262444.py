from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Create a number plane for reference
        plane = NumberPlane(
            x_range=[-5, 5, 1],
            y_range=[-5, 5, 1],
            background_line_style={"stroke_opacity": 0.4}
        )
        self.play(Create(plane))

        # Define a square with vertices
        square_vertices = np.array([
            [1, 1, 0],
            [3, 1, 0],
            [3, 3, 0],
            [1, 3, 0]
        ])
        square = Polygon(*square_vertices, color=BLUE)
        self.play(Create(square))

        # Define a transformation matrix for scaling
        scale_matrix = np.array([
            [1.5, 0, 0],
            [0, 1.5, 0],
            [0, 0, 1]
        ])

        # Apply the transformation to each vertex
        transformed_vertices = np.dot(square_vertices, scale_matrix.T)
        transformed_square = Polygon(*transformed_vertices, color=GREEN)

        # Show the transformation
        self.play(Transform(square, transformed_square))
        self.wait(2)

        # Define a transformation matrix for rotation (90 degrees)
        angle = math.radians(90)
        rotation_matrix = np.array([
            [math.cos(angle), -math.sin(angle), 0],
            [math.sin(angle), math.cos(angle), 0],
            [0, 0, 1]
        ])

        # Apply the rotation to the transformed vertices
        rotated_vertices = np.dot(transformed_vertices, rotation_matrix.T)
        rotated_square = Polygon(*rotated_vertices, color=RED)

        # Show the rotation
        self.play(Transform(square, rotated_square))
        self.wait(2)

        # Fade out everything
        self.play(FadeOut(plane), FadeOut(square))