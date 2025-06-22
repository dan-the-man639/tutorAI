from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Create axes
        axes = Axes(
            x_range=[0, 10, 1],
            y_range=[0, 10, 1],
            axis_config={"include_numbers": True},
        )
        
        # Define the function
        def func(x):
            return 0.1 * (x - 5) ** 3 + 5
        
        # Plot the function
        graph = axes.plot(func, x_range=[0, 10], color=BLUE)
        
        # Calculate the average rate of change
        a, b = 2, 8
        f_a, f_b = func(a), func(b)
        avg_rate_of_change = (f_b - f_a) / (b - a)
        
        # Draw the secant line representing the average rate of change
        secant_line = axes.plot(lambda x: avg_rate_of_change * (x - a) + f_a, x_range=[a, b], color=YELLOW)
        
        # Find a point c where the instantaneous rate of change equals the average rate of change
        c = 5
        slope_at_c = Derivative(func)(c)
        
        # Draw the tangent line at point c
        tangent_line = axes.plot(lambda x: slope_at_c * (x - c) + func(c), x_range=[c - 1, c + 1], color=GREEN)
        
        # Create dots for points A, B, and C
        dot_a = Dot(axes.coords_to_point(a, f_a), color=RED)
        dot_b = Dot(axes.coords_to_point(b, f_b), color=RED)
        dot_c = Dot(axes.coords_to_point(c, func(c)), color=RED)
        
        # Create labels for points A, B, and C
        label_a = MathTex("A").next_to(dot_a, DOWN)
        label_b = MathTex("B").next_to(dot_b, DOWN)
        label_c = MathTex("C").next_to(dot_c, UP)
        
        # Add all elements to the scene
        self.play(Create(axes), Create(graph))
        self.play(Create(secant_line), Create(dot_a), Create(dot_b), Write(label_a), Write(label_b))
        self.play(Create(tangent_line), Create(dot_c), Write(label_c))
        self.wait(2)