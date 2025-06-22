from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Create a number plane
        plane = NumberPlane(
            x_range=[-4, 4, 1],
            y_range=[-4, 4, 1],
            background_line_style={"stroke_opacity": 0.4}
        )
        self.play(Create(plane))

        # Define the transformation matrix
        matrix = np.array([[2, 1], [1, 1]])

        # Define original vectors
        original_vectors = [
            Line(ORIGIN, RIGHT, color=YELLOW),
            Line(ORIGIN, UP, color=GREEN)
        ]

        # Display original vectors
        self.play(*[Create(vec) for vec in original_vectors])
        self.wait(1)

        # Transform vectors using the matrix
        transformed_vectors = [
            Line(ORIGIN, matrix @ np.array([1, 0]), color=YELLOW),
            Line(ORIGIN, matrix @ np.array([0, 1]), color=GREEN)
        ]

        # Animate the transformation
        self.play(
            *[Transform(orig, trans) for orig, trans in zip(original_vectors, transformed_vectors)]
        )
        self.wait(1)

        # Transform grid lines
        grid_lines = VGroup(*[
            Line(plane.c2p(x, -4), plane.c2p(x, 4), color=BLUE)
            for x in np.arange(-4, 5, 1)
        ] + [
            Line(plane.c2p(-4, y), plane.c2p(4, y), color=BLUE)
            for y in np.arange(-4, 5, 1)
        ])

        # Apply transformation to grid lines
        transformed_grid_lines = VGroup(*[
            Line(
                matrix @ np.array([line.get_start()[0], line.get_start()[1]]),
                matrix @ np.array([line.get_end()[0], line.get_end()[1]]),
                color=BLUE
            )
            for line in grid_lines
        ])

        # Animate grid transformation
        self.play(
            Transform(grid_lines, transformed_grid_lines),
            run_time=3
        )
        self.wait(2)

        # Add labels for clarity
        original_label = MathTex("Original").to_edge(UP + LEFT)
        transformed_label = MathTex("Transformed").to_edge(UP + RIGHT)

        self.play(Write(original_label))
        self.wait(1)
        self.play(Transform(original_label, transformed_label))
        self.wait(2)

        # Fade out all elements
        self.play(
            FadeOut(plane),
            FadeOut(original_vectors[0]),
            FadeOut(original_vectors[1]),
            FadeOut(grid_lines),
            FadeOut(original_label)
        )
        self.wait(1)