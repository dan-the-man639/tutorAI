from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Define the cubic function f(x) = x^3 - 3x^2 + 2x
        def f(x):
            return x**3 - 3*x**2 + 2*x

        # Define the derivative f'(x) = 3x^2 - 6x + 2
        def f_prime(x):
            return 3*x**2 - 6*x + 2

        # Define the interval [a, b]
        a = 0
        b = 2

        # Calculate f(a) and f(b)
        f_a = f(a)
        f_b = f(b)

        # Calculate the average rate of change
        avg_rate_of_change = (f_b - f_a) / (b - a)

        # Create axes
        axes = Axes(
            x_range=[-1, 3, 1],
            y_range=[-1, 3, 1],
            axis_config={"include_numbers": True}
        )

        # Plot the function
        graph = axes.plot(lambda x: f(x), x_range=[a, b], color=BLUE)

        # Create secant line
        secant_line = axes.plot(
            lambda x: avg_rate_of_change * (x - a) + f_a,
            x_range=[a, b],
            color=YELLOW
        )

        # Calculate the point c where f'(c) = avg_rate_of_change
        # Solve 3c^2 - 6c + 1 = 0
        c_values = np.roots([3, -6, 1])
        c = c_values[(c_values > a) & (c_values < b)][0]

        # Calculate the tangent line at c
        slope_at_c = f_prime(c)
        tangent_line = axes.plot(
            lambda x: slope_at_c * (x - c) + f(c),
            x_range=[c - 1, c + 1],
            color=GREEN
        )

        # Create dots for points a, b, and c
        dot_a = Dot(axes.coords_to_point(a, f_a), color=RED)
        dot_b = Dot(axes.coords_to_point(b, f_b), color=RED)
        dot_c = Dot(axes.coords_to_point(c, f(c)), color=ORANGE)

        # Create labels
        label_a = MathTex("a").next_to(dot_a, DOWN)
        label_b = MathTex("b").next_to(dot_b, DOWN)
        label_c = MathTex("c").next_to(dot_c, UP)

        # Create text for Mean Value Theorem
        mvt_text = Text("Mean Value Theorem", font_size=36).to_edge(UP)

        # Add all elements to the scene
        self.play(Create(axes), Write(mvt_text))
        self.play(Create(graph))
        self.play(Create(secant_line), FadeIn(dot_a), FadeIn(dot_b))
        self.play(Write(label_a), Write(label_b))
        self.play(Create(tangent_line), FadeIn(dot_c))
        self.play(Write(label_c))
        self.wait(2)