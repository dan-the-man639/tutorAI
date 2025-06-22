from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Create axes
        axes = Axes(
            x_range=[0, 4, 1],
            y_range=[0, 10, 2],
            axis_config={"include_numbers": True}
        )
        
        # Define the function f(x) = x^2
        def func(x):
            return x**2
        
        # Plot the function
        graph = axes.plot(func, x_range=[0, 3], color=BLUE)
        
        # Points A and B
        a, b = 1, 3
        fa, fb = func(a), func(b)
        
        # Create dots for points A and B
        dot_a = Dot(axes.coords_to_point(a, fa), color=YELLOW)
        dot_b = Dot(axes.coords_to_point(b, fb), color=YELLOW)
        
        # Create labels for points A and B
        label_a = MathTex("A", "(1, 1)").next_to(dot_a, DOWN)
        label_b = MathTex("B", "(3, 9)").next_to(dot_b, UP)
        
        # Secant line from A to B
        secant_line = Line(
            axes.coords_to_point(a, fa),
            axes.coords_to_point(b, fb),
            color=GREEN
        )
        
        # Calculate the average rate of change
        avg_rate_of_change = (fb - fa) / (b - a)
        
        # Find c where f'(c) = avg_rate_of_change
        c = 2
        fc = func(c)
        
        # Create dot and label for point C
        dot_c = Dot(axes.coords_to_point(c, fc), color=RED)
        label_c = MathTex("C", "(2, 4)").next_to(dot_c, RIGHT)
        
        # Calculate the slope of the tangent at c
        slope_at_c = 2 * c
        
        # Create tangent line at C
        tangent_line = Line(
            axes.coords_to_point(c - 1, fc - slope_at_c),
            axes.coords_to_point(c + 1, fc + slope_at_c),
            color=ORANGE
        )
        
        # Add all elements to the scene
        self.play(Create(axes), Create(graph))
        self.play(Create(dot_a), Write(label_a))
        self.play(Create(dot_b), Write(label_b))
        self.play(Create(secant_line))
        self.play(Create(dot_c), Write(label_c))
        self.play(Create(tangent_line))
        
        # Wait before ending the scene
        self.wait(2)