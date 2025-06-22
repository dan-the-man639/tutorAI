from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Create axes
        axes = Axes(
            x_range=[0, 3, 1],
            y_range=[0, 9, 3],
            axis_config={"include_numbers": True}
        )
        
        # Define the function
        def func(x):
            return x**2
        
        # Plot the function
        graph = axes.plot(lambda x: func(x), x_range=[0, 3], color=BLUE)
        
        # Create Riemann rectangles
        dx = 0.5
        rectangles = VGroup()
        for i in range(6):
            x0 = i * dx
            x1 = (i + 1) * dx
            height = func(x0 + dx / 2)
            rect = axes.get_riemann_rectangles(
                graph, x_range=[x0, x1], dx=dx, input_sample_type="center"
            )
            rectangles.add(rect)
        
        # Create integral area
        integral_area = axes.get_area(graph, x_range=[0, 3], color=YELLOW, opacity=0.5)
        
        # Create labels
        riemann_label = MathTex(r"\text{Riemann Sum}").next_to(rectangles, UP)
        integral_label = MathTex(r"\text{Integral}").next_to(integral_area, UP)
        
        # Display the graph and rectangles
        self.play(Create(axes), Create(graph))
        self.wait(1)
        self.play(Create(rectangles), Write(riemann_label))
        self.wait(2)
        
        # Transition to integral
        self.play(Transform(rectangles, integral_area), Transform(riemann_label, integral_label))
        self.wait(2)
        
        # Fade out everything
        self.play(FadeOut(VGroup(axes, graph, rectangles, riemann_label)))