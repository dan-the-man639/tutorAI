from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Create a NumberPlane for reference
        plane = NumberPlane(x_range=[-5, 5, 1], y_range=[-5, 5, 1], background_line_style={"stroke_opacity": 0.4})
        self.play(Create(plane))
        
        # Define a triangle (polygon) with vertices
        triangle = Polygon(np.array([1, 1, 0]), np.array([3, 1, 0]), np.array([2, 3, 0]), color=BLUE)
        self.play(Create(triangle))
        
        # Label vertices
        labels = VGroup(
            Text("A").next_to(triangle.get_vertices()[0], DOWN),
            Text("B").next_to(triangle.get_vertices()[1], DOWN),
            Text("C").next_to(triangle.get_vertices()[2], UP)
        )
        self.play(Write(labels))
        
        # Define a transformation matrix for scaling
        scale_matrix = np.array([
            [1.5, 0, 0],
            [0, 1.5, 0],
            [0, 0, 1]
        ])
        
        # Apply transformation to vertices
        transformed_vertices = [scale_matrix @ vertex for vertex in triangle.get_vertices()]
        transformed_triangle = Polygon(*transformed_vertices, color=GREEN)
        
        # Show transformation
        self.play(Transform(triangle, transformed_triangle))
        
        # Update labels for transformed vertices
        transformed_labels = VGroup(
            Text("A'").next_to(transformed_triangle.get_vertices()[0], DOWN),
            Text("B'").next_to(transformed_triangle.get_vertices()[1], DOWN),
            Text("C'").next_to(transformed_triangle.get_vertices()[2], UP)
        )
        self.play(Transform(labels, transformed_labels))
        
        # Wait before ending
        self.wait(2)