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
        matrix = np.array([[1, 1], [0, 1]])
        
        # Create vectors for the standard basis
        i_hat = Line(ORIGIN, RIGHT, color=YELLOW)
        j_hat = Line(ORIGIN, UP, color=BLUE)
        
        # Apply the transformation to the basis vectors
        transformed_i_hat = Line(ORIGIN, matrix @ np.array([1, 0]), color=YELLOW)
        transformed_j_hat = Line(ORIGIN, matrix @ np.array([0, 1]), color=BLUE)
        
        # Create labels for the vectors
        i_label = MathTex("\\hat{i}", color=YELLOW).next_to(i_hat, DOWN)
        j_label = MathTex("\\hat{j}", color=BLUE).next_to(j_hat, LEFT)
        transformed_i_label = MathTex("T(\\hat{i})", color=YELLOW).next_to(transformed_i_hat, DOWN)
        transformed_j_label = MathTex("T(\\hat{j})", color=BLUE).next_to(transformed_j_hat, LEFT)
        
        # Create a group for the original vectors and their labels
        original_vectors = VGroup(i_hat, j_hat, i_label, j_label)
        
        # Create a group for the transformed vectors and their labels
        transformed_vectors = VGroup(transformed_i_hat, transformed_j_hat, transformed_i_label, transformed_j_label)
        
        # Display the original grid and vectors
        self.play(Create(plane), Create(original_vectors))
        self.wait(2)
        
        # Transform the grid and vectors
        self.play(Transform(original_vectors, transformed_vectors))
        self.wait(2)
        
        # Fade out everything
        self.play(FadeOut(plane), FadeOut(original_vectors))