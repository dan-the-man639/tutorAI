from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Setup axes
        axes = Axes(
            x_range=[-1, 4, 1],
            y_range=[-1, 4, 1],
            axis_config={"include_numbers": True}
        )
        self.play(Create(axes))

        # Define the function
        def func(x):
            return 0.5 * x**2 - x + 1

        # Plot the function
        graph = axes.plot(func, x_range=[0, 3], color=BLUE)
        self.play(Create(graph))

        # Calculate the slope of the secant line
        x_a, x_b = 0, 3
        y_a, y_b = func(x_a), func(x_b)
        secant_slope = (y_b - y_a) / (x_b - x_a)

        # Draw the secant line
        secant_line = axes.plot(lambda x: secant_slope * (x - x_a) + y_a, x_range=[x_a, x_b], color=GREEN)
        self.play(Create(secant_line))

        # Find c where the tangent slope equals the secant slope
        def derivative(x):
            return x - 1

        c = 1 + math.sqrt(0.25)
        tangent_slope = derivative(c)

        # Draw the tangent line at x = c
        tangent_line = axes.plot(lambda x: tangent_slope * (x - c) + func(c), x_range=[c - 1, c + 1], color=RED)
        self.play(Create(tangent_line))

        # Highlight the point c
        dot_c = Dot(axes.coords_to_point(c, func(c)), color=YELLOW)
        self.play(FadeIn(dot_c))

        # Add labels
        label_a = MathTex("a").next_to(axes.c2p(x_a, y_a), DOWN)
        label_b = MathTex("b").next_to(axes.c2p(x_b, y_b), DOWN)
        label_c = MathTex("c").next_to(dot_c, UP)
        self.play(Write(label_a), Write(label_b), Write(label_c))

        # Add text explanation
        explanation = Text(
            "Mean Value Theorem: There exists a point c\n"
            "where the tangent is parallel to the secant line.",
            font_size=24
        ).to_edge(DOWN)
        self.play(Write(explanation))

        self.wait(3)