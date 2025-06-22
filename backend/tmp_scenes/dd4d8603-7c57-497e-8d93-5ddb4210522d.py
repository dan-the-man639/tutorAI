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
        
        # Define the function f(x) = x^2
        def f(x):
            return x**2
        
        # Plot the function
        graph = axes.plot(lambda x: f(x), x_range=[0, 3], color=BLUE)
        
        # Define points A and B
        a, b = 0, 3
        A = axes.coords_to_point(a, f(a))
        B = axes.coords_to_point(b, f(b))
        
        # Create dots for points A and B
        dot_A = Dot(A, color=RED)
        dot_B = Dot(B, color=RED)
        
        # Create labels for points A and B
        label_A = MathTex("A", color=RED).next_to(dot_A, DOWN)
        label_B = MathTex("B", color=RED).next_to(dot_B, DOWN)
        
        # Draw the secant line between A and B
        secant_line = Line(A, B, color=YELLOW)
        
        # Calculate the average rate of change (slope of secant line)
        avg_slope = (f(b) - f(a)) / (b - a)
        
        # Find a point c where the derivative equals the average slope
        c = math.sqrt(avg_slope)
        C = axes.coords_to_point(c, f(c))
        dot_C = Dot(C, color=GREEN)
        label_C = MathTex("C", color=GREEN).next_to(dot_C, UP)
        
        # Calculate the slope of the tangent line at point C
        tangent_slope = 2 * c
        
        # Create the tangent line at C
        tangent_line = Line(
            C + LEFT * 2, C + RIGHT * 2,
            color=GREEN
        ).rotate(math.atan(tangent_slope), about_point=C)
        
        # Add all elements to the scene
        self.play(Create(axes), Create(graph))
        self.play(Create(dot_A), Create(dot_B), Write(label_A), Write(label_B))
        self.play(Create(secant_line))
        self.play(Create(dot_C), Write(label_C))
        self.play(Create(tangent_line))
        
        # Explain the Mean Value Theorem
        explanation = VGroup(
            MathTex(r"\text{Mean Value Theorem:}"),
            MathTex(r"\exists \, c \in (a, b) \, \text{such that} \, f'(c) = \frac{f(b) - f(a)}{b - a}")
        ).arrange(DOWN).to_edge(UP)
        
        self.play(Write(explanation))
        self.wait(3)
        
        # Fade out everything
        self.play(FadeOut(VGroup(axes, graph, dot_A, dot_B, dot_C, label_A, label_B, label_C, secant_line, tangent_line, explanation)))