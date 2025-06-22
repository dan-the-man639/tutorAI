from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Create a number plane to represent the grid
        plane = NumberPlane(
            x_range=[-5, 5, 1],
            y_range=[-5, 5, 1],
            background_line_style={"stroke_opacity": 0.4}
        )
        
        # Define the transformation matrix
        matrix = np.array([[2, 1], [1, 2]])
        
        # Define basis vectors
        i_hat = np.array([1, 0])
        j_hat = np.array([0, 1])
        
        # Transform basis vectors
        transformed_i_hat = matrix @ i_hat
        transformed_j_hat = matrix @ j_hat
        
        # Create lines for basis vectors
        i_line = Line(start=ORIGIN, end=i_hat, color=YELLOW)
        j_line = Line(start=ORIGIN, end=j_hat, color=GREEN)
        
        # Create lines for transformed basis vectors
        transformed_i_line = Line(start=ORIGIN, end=transformed_i_hat, color=YELLOW)
        transformed_j_line = Line(start=ORIGIN, end=transformed_j_hat, color=GREEN)
        
        # Add the plane and basis vectors to the scene
        self.play(Create(plane))
        self.play(Create(i_line), Create(j_line))
        self.wait(1)
        
        # Transform the basis vectors
        self.play(Transform(i_line, transformed_i_line), Transform(j_line, transformed_j_line))
        self.wait(1)
        
        # Create a grid of points to visualize the transformation
        points = VGroup(*[
            Dot(plane.c2p(x, y), color=BLUE)
            for x in np.arange(-4, 5, 1)
            for y in np.arange(-4, 5, 1)
        ])
        
        # Add the grid of points to the scene
        self.play(FadeIn(points))
        self.wait(1)
        
        # Apply the transformation to each point
        transformed_points = VGroup(*[
            Dot(plane.c2p(*(matrix @ np.array([x, y]))), color=RED)
            for x in np.arange(-4, 5, 1)
            for y in np.arange(-4, 5, 1)
        ])
        
        # Transform the grid of points
        self.play(Transform(points, transformed_points))
        self.wait(2)