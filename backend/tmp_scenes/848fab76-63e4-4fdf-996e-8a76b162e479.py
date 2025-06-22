from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Create a NumberPlane as the background
        plane = NumberPlane(
            x_range=[-5, 5, 1],
            y_range=[-5, 5, 1],
            background_line_style={"stroke_opacity": 0.4}
        )
        
        # Define a square using lines
        square = VGroup(
            Line(plane.c2p(0, 0), plane.c2p(1, 0)),
            Line(plane.c2p(1, 0), plane.c2p(1, 1)),
            Line(plane.c2p(1, 1), plane.c2p(0, 1)),
            Line(plane.c2p(0, 1), plane.c2p(0, 0))
        )
        
        # Define a transformation matrix
        transformation_matrix = np.array([[2, 1], [1, 1]])
        
        # Apply the transformation to each point of the square
        transformed_square = VGroup(*[
            Line(
                plane.c2p(*np.dot(transformation_matrix, plane.p2c(line.get_start()))),
                plane.c2p(*np.dot(transformation_matrix, plane.p2c(line.get_end())))
            )
            for line in square
        ])
        
        # Add the plane and initial square to the scene
        self.add(plane)
        self.play(Create(square))
        self.wait(1)
        
        # Transform the square using the matrix
        self.play(Transform(square, transformed_square))
        self.wait(2)
        
        # Add labels for the transformation matrix
        matrix_label = MathTex(r"\begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}")
        matrix_label.to_corner(UL)
        self.play(Write(matrix_label))
        self.wait(2)
        
        # Highlight the transformation effects
        rotation_text = Text("Rotation & Shear", font_size=24)
        rotation_text.next_to(matrix_label, DOWN)
        self.play(Write(rotation_text))
        self.wait(2)
        
        # Fade out all elements
        self.play(FadeOut(square), FadeOut(matrix_label), FadeOut(rotation_text), FadeOut(plane))