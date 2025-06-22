from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Create a number plane
        plane = NumberPlane(
            x_range=[-3, 3, 1],
            y_range=[-3, 3, 1],
            background_line_style={"stroke_opacity": 0.4}
        )
        
        # Define the transformation matrix
        transformation_matrix = np.array([[1, 2], [0.5, 1]])

        # Create vectors for the original grid
        original_vectors = VGroup(
            *[Line(ORIGIN, np.array([x, y, 0]), color=BLUE)
              for x in range(-3, 4) for y in range(-3, 4)]
        )

        # Apply the transformation to the vectors
        transformed_vectors = original_vectors.copy()
        for vector in transformed_vectors:
            start, end = vector.get_start_and_end()
            new_end = np.dot(transformation_matrix, end[:2])
            vector.put_start_and_end_on(start, np.array([*new_end, 0]))

        # Create labels for the transformation matrix
        matrix_label = MathTex(r"\begin{bmatrix} 1 & 2 \\ 0.5 & 1 \end{bmatrix}")
        matrix_label.to_corner(UL)

        # Add the original grid and vectors to the scene
        self.play(Create(plane), Create(original_vectors))
        self.wait(2)

        # Transform the vectors and show the transformation matrix
        self.play(Transform(original_vectors, transformed_vectors), Write(matrix_label))
        self.wait(2)

        # Fade out everything
        self.play(FadeOut(plane), FadeOut(original_vectors), FadeOut(matrix_label))