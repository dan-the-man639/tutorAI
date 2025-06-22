from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Set up the axes
        axes = Axes(
            x_range=[0, 10, 1],
            y_range=[0, 10, 1],
            axis_config={"include_numbers": True}
        )
        
        # Define the function
        def func(x):
            return 0.1 * (x - 2) * (x - 8) + 4
        
        # Plot the function
        graph = axes.plot(func, x_range=[0, 10], color=BLUE)
        
        # Define points a and b
        a, b = 2, 8
        fa, fb = func(a), func(b)
        
        # Create dots for points a and b
        dot_a = Dot(axes.coords_to_point(a, fa), color=RED)
        dot_b = Dot(axes.coords_to_point(b, fb), color=RED)
        
        # Create a line connecting a and b
        secant_line = Line(
            axes.coords_to_point(a, fa),
            axes.coords_to_point(b, fb),
            color=YELLOW
        )
        
        # Calculate the average slope
        average_slope = (fb - fa) / (b - a)
        
        # Find c where the derivative equals the average slope
        c = 5
        fc = func(c)
        
        # Create a dot for point c
        dot_c = Dot(axes.coords_to_point(c, fc), color=GREEN)
        
        # Calculate the slope at c
        derivative_at_c = 0.1 * (2 * c - 10)
        
        # Create a tangent line at c
        tangent_line = Line(
            axes.coords_to_point(c - 1, fc - derivative_at_c),
            axes.coords_to_point(c + 1, fc + derivative_at_c),
            color=ORANGE
        )
        
        # Create labels
        label_a = MathTex("a").next_to(dot_a, DOWN)
        label_b = MathTex("b").next_to(dot_b, DOWN)
        label_c = MathTex("c").next_to(dot_c, UP)
        label_avg_slope = MathTex("m_{avg}").next_to(secant_line, UP)
        label_tangent_slope = MathTex("m_{tan}").next_to(tangent_line, UP)
        
        # Add all elements to the scene
        self.play(Create(axes))
        self.play(Create(graph))
        self.play(Create(dot_a), Write(label_a))
        self.play(Create(dot_b), Write(label_b))
        self.play(Create(secant_line), Write(label_avg_slope))
        self.play(Create(dot_c), Write(label_c))
        self.play(Create(tangent_line), Write(label_tangent_slope))
        
        # Wait to view the final scene
        self.wait(2)