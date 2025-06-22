from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Create axes
        axes = Axes(
            x_range=[0, 3, 1],
            y_range=[0, 9, 3],
            axis_config={"include_numbers": True},
        )
        
        # Define the function
        def func(x):
            return x**2

        # Plot the function
        graph = axes.plot(func, x_range=[0, 3], color=BLUE)

        # Create Riemann rectangles
        dx = 0.5
        rectangles = axes.get_riemann_rectangles(
            graph,
            x_range=[0, 3],
            dx=dx,
            stroke_width=1,
            stroke_color=WHITE,
            fill_opacity=0.5,
        )

        # Create a label for the function
        func_label = MathTex("f(x) = x^2").next_to(axes, UP)

        # Create a label for the integral
        integral_label = MathTex(
            "\\int_0^3 x^2 \\, dx"
        ).next_to(axes, DOWN)

        # Add elements to the scene
        self.play(Create(axes), Write(func_label))
        self.play(Create(graph))
        self.play(Create(rectangles))
        self.wait(2)

        # Transition to finer Riemann sum
        finer_dx = 0.1
        finer_rectangles = axes.get_riemann_rectangles(
            graph,
            x_range=[0, 3],
            dx=finer_dx,
            stroke_width=1,
            stroke_color=WHITE,
            fill_opacity=0.5,
        )

        self.play(Transform(rectangles, finer_rectangles))
        self.wait(2)

        # Show the integral label
        self.play(Write(integral_label))
        self.wait(2)

        # Highlight the connection
        connection_text = Text(
            "Riemann Sum Approaches Integral",
            font_size=24
        ).to_edge(DOWN)

        self.play(Write(connection_text))
        self.wait(3)

        # Fade out all elements
        self.play(
            FadeOut(axes),
            FadeOut(graph),
            FadeOut(rectangles),
            FadeOut(func_label),
            FadeOut(integral_label),
            FadeOut(connection_text)
        )