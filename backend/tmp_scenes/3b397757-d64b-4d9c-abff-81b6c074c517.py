from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Create axes
        axes = Axes(
            x_range=[0, 10, 1],
            y_range=[0, 10, 1],
            axis_config={"include_numbers": True}
        )
        
        # Define the function
        def func(x):
            return 0.1 * (x - 5) ** 3 + 5
        
        # Plot the function
        graph = axes.plot(lambda x: func(x), x_range=[0, 10], color=BLUE)
        
        # Calculate the average rate of change
        a, b = 2, 8
        f_a, f_b = func(a), func(b)
        avg_rate_of_change = (f_b - f_a) / (b - a)
        
        # Draw the secant line
        secant_line = Line(
            axes.c2p(a, f_a), axes.c2p(b, f_b), color=YELLOW
        )
        
        # Find a point c where the instantaneous rate of change equals the average rate of change
        # For simplicity, we assume c is around 5
        c = 5
        slope_at_c = Derivative(lambda x: func(x))(c)
        
        # Draw the tangent line at c
        tangent_line = Line(
            axes.c2p(c - 1, func(c) - slope_at_c),
            axes.c2p(c + 1, func(c) + slope_at_c),
            color=RED
        )
        
        # Create labels
        label_a = MathTex("a").next_to(axes.c2p(a, 0), DOWN)
        label_b = MathTex("b").next_to(axes.c2p(b, 0), DOWN)
        label_c = MathTex("c").next_to(axes.c2p(c, 0), DOWN)
        label_avg = MathTex("f'(c) = \\frac{f(b) - f(a)}{b - a}").to_edge(UP)
        
        # Create dots
        dot_a = Dot(axes.c2p(a, f_a), color=GREEN)
        dot_b = Dot(axes.c2p(b, f_b), color=GREEN)
        dot_c = Dot(axes.c2p(c, func(c)), color=GREEN)
        
        # Add all elements to the scene
        self.play(Create(axes), Create(graph))
        self.play(Create(secant_line), Write(label_avg))
        self.play(Create(tangent_line))
        self.play(FadeIn(dot_a, dot_b, dot_c))
        self.play(Write(label_a), Write(label_b), Write(label_c))
        self.wait(2)