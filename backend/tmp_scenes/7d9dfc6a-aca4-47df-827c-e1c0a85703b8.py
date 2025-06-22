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
        
        # Define points a and b
        a = 2
        b = 8
        point_a = Dot(axes.c2p(a, func(a)), color=YELLOW)
        point_b = Dot(axes.c2p(b, func(b)), color=YELLOW)
        
        # Draw secant line
        secant_slope = (func(b) - func(a)) / (b - a)
        secant_line = Line(
            start=axes.c2p(a, func(a)),
            end=axes.c2p(b, func(b)),
            color=GREEN
        )
        
        # Find c where the tangent slope equals the secant slope
        def find_c():
            for x in np.linspace(a, b, 1000):
                if math.isclose(Derivative(func)(x), secant_slope, rel_tol=1e-2):
                    return x
            return None
        
        c = find_c()
        point_c = Dot(axes.c2p(c, func(c)), color=RED)
        
        # Draw tangent line at c
        tangent_slope = Derivative(func)(c)
        tangent_line = Line(
            start=axes.c2p(c - 1, func(c) - tangent_slope),
            end=axes.c2p(c + 1, func(c) + tangent_slope),
            color=ORANGE
        )
        
        # Add labels
        label_a = MathTex("a").next_to(point_a, DOWN)
        label_b = MathTex("b").next_to(point_b, DOWN)
        label_c = MathTex("c").next_to(point_c, UP)
        
        # Add all elements to the scene
        self.play(Create(axes))
        self.play(Create(graph))
        self.play(Create(point_a), Create(point_b))
        self.play(Write(label_a), Write(label_b))
        self.play(Create(secant_line))
        self.wait(1)
        self.play(Create(point_c), Write(label_c))
        self.play(Create(tangent_line))
        self.wait(2)
        
        # Explanation text
        explanation = VGroup(
            Text("Mean Value Theorem:"),
            Text("There exists a point c where"),
            Text("the tangent slope equals the secant slope.")
        ).arrange(DOWN).to_edge(RIGHT)
        
        self.play(Write(explanation))
        self.wait(3)
        
        # Fade out all elements
        self.play(FadeOut(VGroup(axes, graph, point_a, point_b, point_c, 
                                 secant_line, tangent_line, label_a, label_b, 
                                 label_c, explanation)))