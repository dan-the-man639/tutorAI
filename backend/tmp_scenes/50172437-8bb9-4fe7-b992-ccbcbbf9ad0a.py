from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Create a NumberPlane for reference
        plane = NumberPlane(
            x_range=[-5, 5, 1],
            y_range=[-5, 5, 1],
            background_line_style={"stroke_opacity": 0.4}
        )
        self.play(Create(plane))

        # Define original vertices of a triangle
        original_vertices = [np.array([1, 1, 0]), np.array([3, 1, 0]), np.array([2, 3, 0])]
        original_triangle = Polygon(*original_vertices, color=BLUE)
        self.play(Create(original_triangle))

        # Display original vertex coordinates
        original_labels = VGroup(
            *[MathTex(f"({v[0]}, {v[1]})").next_to(v, UP) for v in original_vertices]
        )
        self.play(Write(original_labels))

        # Define a transformation matrix for scaling
        scale_matrix = np.array([
            [1.5, 0, 0],
            [0, 1.5, 0],
            [0, 0, 1]
        ])

        # Apply the transformation to each vertex
        transformed_vertices = [scale_matrix @ np.append(v, 1) for v in original_vertices]
        transformed_triangle = Polygon(*transformed_vertices, color=GREEN)

        # Display transformation matrix
        matrix_tex = MathTex(
            r"\begin{bmatrix} 1.5 & 0 & 0 \\ 0 & 1.5 & 0 \\ 0 & 0 & 1 \end{bmatrix}"
        ).to_edge(UP)
        self.play(Write(matrix_tex))

        # Transform the triangle
        self.play(Transform(original_triangle, transformed_triangle))

        # Display transformed vertex coordinates
        transformed_labels = VGroup(
            *[MathTex(f"({v[0]:.1f}, {v[1]:.1f})").next_to(v, UP) for v in transformed_vertices]
        )
        self.play(Transform(original_labels, transformed_labels))

        # Wait before ending the scene
        self.wait(2)