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
            return 0.1 * (x - 5) ** 2 + 2

        # Plot the function
        graph = axes.plot(func, x_range=[0, 10], color=BLUE)

        # Create Riemann sum rectangles
        num_rects = 5
        dx = 10 / num_rects
        rectangles = VGroup()
        for i in range(num_rects):
            x0 = i * dx
            x1 = (i + 1) * dx
            height = func(x0)
            rect = axes.get_riemann_rectangles(
                graph,
                x_range=[x0, x1],
                dx=dx,
                input_sample_type="left",
                fill_opacity=0.5
            )
            rectangles.add(rect)

        # Create integral area
        integral_area = axes.get_area(graph, x_range=[0, 10], color=GREEN, opacity=0.3)

        # Add labels
        riemann_label = MathTex(r"\text{Riemann Sum}").next_to(rectangles, UP)
        integral_label = MathTex(r"\text{Integral}").next_to(integral_area, DOWN)

        # Animate
        self.play(Create(axes), Write(riemann_label))
        self.play(Create(graph))
        self.play(Create(rectangles))
        self.wait(2)
        self.play(Transform(rectangles, integral_area), Transform(riemann_label, integral_label))
        self.wait(2)

        # Show finer Riemann sum approximation
        finer_rectangles = VGroup()
        num_finer_rects = 20
        dx_finer = 10 / num_finer_rects
        for i in range(num_finer_rects):
            x0 = i * dx_finer
            x1 = (i + 1) * dx_finer
            height = func(x0)
            rect = axes.get_riemann_rectangles(
                graph,
                x_range=[x0, x1],
                dx=dx_finer,
                input_sample_type="left",
                fill_opacity=0.5
            )
            finer_rectangles.add(rect)

        self.play(Transform(rectangles, finer_rectangles))
        self.wait(2)

        # Show the limit concept
        limit_label = MathTex(r"\lim_{n \to \infty} \text{Riemann Sum} = \text{Integral}").to_edge(DOWN)
        self.play(Write(limit_label))
        self.wait(3)