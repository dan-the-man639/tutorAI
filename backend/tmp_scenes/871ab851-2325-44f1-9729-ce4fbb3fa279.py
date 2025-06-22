from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Define the axes
        axes = Axes(
            x_range=[0, 10, 1],
            y_range=[0, 10, 1],
            axis_config={"include_numbers": True}
        )
        
        # Define the function
        def func(x):
            return 0.1 * (x - 5)**2 + 2

        # Plot the function
        graph = axes.plot(func, x_range=[0, 10], color=BLUE)
        
        # Define points a and b
        a, b = 2, 8
        point_a = Dot(axes.c2p(a, func(a)), color=YELLOW)
        point_b = Dot(axes.c2p(b, func(b)), color=YELLOW)
        
        # Draw the secant line
        secant_line = Line(
            axes.c2p(a, func(a)), 
            axes.c2p(b, func(b)), 
            color=GREEN
        )
        
        # Calculate the average rate of change
        avg_rate_of_change = (func(b) - func(a)) / (b - a)
        
        # Find c where the instantaneous rate of change equals the average rate
        def derivative(x):
            return 0.2 * (x - 5)
        
        c = a
        while c < b:
            if math.isclose(derivative(c), avg_rate_of_change, abs_tol=0.01):
                break
            c += 0.01
        
        # Draw the tangent line at c
        tangent_slope = derivative(c)
        tangent_line = Line(
            axes.c2p(c - 1, func(c) - tangent_slope),
            axes.c2p(c + 1, func(c) + tangent_slope),
            color=RED
        )
        
        # Create a dot at point c
        point_c = Dot(axes.c2p(c, func(c)), color=RED)
        
        # Add labels
        label_a = MathTex("a").next_to(point_a, DOWN)
        label_b = MathTex("b").next_to(point_b, DOWN)
        label_c = MathTex("c").next_to(point_c, UP)
        
        # Display the elements
        self.play(Create(axes), Create(graph))
        self.play(Create(point_a), Write(label_a))
        self.play(Create(point_b), Write(label_b))
        self.play(Create(secant_line))
        self.play(Create(point_c), Write(label_c))
        self.play(Create(tangent_line))
        
        # Wait before ending
        self.wait(3)