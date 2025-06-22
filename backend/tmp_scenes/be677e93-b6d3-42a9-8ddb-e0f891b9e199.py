from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Setup the axes
        axes = Axes(
            x_range=[0, 10, 1],
            y_range=[0, 10, 1],
            axis_config={"include_numbers": True}
        )
        labels = axes.get_axis_labels(x_label="x", y_label="f(x)")
        self.play(Create(axes), Write(labels))

        # Define the function f(x) = x^2
        def func(x):
            return x**2

        # Plot the function
        graph = axes.plot(func, x_range=[0, 3], color=BLUE)
        self.play(Create(graph))

        # Define points a and b
        a = 1
        b = 3
        point_a = Dot(axes.coords_to_point(a, func(a)), color=YELLOW)
        point_b = Dot(axes.coords_to_point(b, func(b)), color=YELLOW)
        self.play(FadeIn(point_a), FadeIn(point_b))

        # Draw the secant line between a and b
        secant_line = Line(
            axes.coords_to_point(a, func(a)),
            axes.coords_to_point(b, func(b)),
            color=GREEN
        )
        self.play(Create(secant_line))

        # Calculate the average rate of change
        avg_rate_of_change = (func(b) - func(a)) / (b - a)
        avg_rate_text = MathTex(
            f"\\text{{Average Rate: }} \\frac{{f(b) - f(a)}}{{b - a}} = {avg_rate_of_change:.2f}"
        ).to_edge(UP)
        self.play(Write(avg_rate_text))

        # Find point c where f'(c) = avg_rate_of_change
        def derivative(x):
            return 2 * x

        c = avg_rate_of_change / 2
        point_c = Dot(axes.coords_to_point(c, func(c)), color=RED)
        self.play(FadeIn(point_c))

        # Draw the tangent line at c
        slope_at_c = derivative(c)
        tangent_line = Line(
            axes.coords_to_point(c - 1, func(c) - slope_at_c),
            axes.coords_to_point(c + 1, func(c) + slope_at_c),
            color=ORANGE
        )
        self.play(Create(tangent_line))

        # Display the instantaneous rate of change
        inst_rate_text = MathTex(
            f"\\text{{Instantaneous Rate: }} f'(c) = {slope_at_c:.2f}"
        ).next_to(avg_rate_text, DOWN)
        self.play(Write(inst_rate_text))

        # Highlight the relationship
        relation_text = MathTex(
            f"f'(c) = \\frac{{f(b) - f(a)}}{{b - a}}"
        ).next_to(inst_rate_text, DOWN)
        self.play(Write(relation_text))

        # Wait before ending
        self.wait(3)