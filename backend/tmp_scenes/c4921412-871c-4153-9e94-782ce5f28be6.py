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
        fa, fb = func(a), func(b)

        # Create dots at points a and b
        dot_a = Dot(axes.coords_to_point(a, fa), color=RED)
        dot_b = Dot(axes.coords_to_point(b, fb), color=RED)

        # Create a line representing the average rate of change
        secant_line = Line(
            axes.coords_to_point(a, fa),
            axes.coords_to_point(b, fb),
            color=YELLOW
        )

        # Calculate the slope of the secant line
        avg_slope = (fb - fa) / (b - a)

        # Find a point c where the derivative equals the average slope
        def derivative(x):
            return 0.2 * (x - 5)

        # Find c such that derivative(c) = avg_slope
        c = 5 + avg_slope / 0.2
        fc = func(c)

        # Create a dot at point c
        dot_c = Dot(axes.coords_to_point(c, fc), color=GREEN)

        # Create a tangent line at point c
        tangent_slope = derivative(c)
        tangent_line = Line(
            axes.coords_to_point(c - 1, fc - tangent_slope),
            axes.coords_to_point(c + 1, fc + tangent_slope),
            color=GREEN
        )

        # Add all elements to the scene
        self.play(Create(axes))
        self.play(Create(graph))
        self.play(Create(dot_a), Create(dot_b), Create(secant_line))
        self.play(Create(dot_c), Create(tangent_line))

        # Add labels
        label_a = MathTex("a").next_to(dot_a, DOWN)
        label_b = MathTex("b").next_to(dot_b, DOWN)
        label_c = MathTex("c").next_to(dot_c, UP)
        label_avg_slope = MathTex("m_{avg}").next_to(secant_line, UP)
        label_tangent_slope = MathTex("m_{tangent}").next_to(tangent_line, UP)

        self.play(Write(label_a), Write(label_b), Write(label_c))
        self.play(Write(label_avg_slope), Write(label_tangent_slope))

        # Wait before ending the scene
        self.wait(3)