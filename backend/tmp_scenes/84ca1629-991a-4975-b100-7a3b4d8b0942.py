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
        
        # Define points A and B
        a, b = 2, 8
        point_a = axes.c2p(a, func(a))
        point_b = axes.c2p(b, func(b))
        
        # Create dots for points A and B
        dot_a = Dot(point_a, color=RED)
        dot_b = Dot(point_b, color=RED)
        
        # Create labels for A and B
        label_a = MathTex("A", color=RED).next_to(dot_a, DOWN)
        label_b = MathTex("B", color=RED).next_to(dot_b, DOWN)
        
        # Calculate average rate of change
        avg_slope = (func(b) - func(a)) / (b - a)
        
        # Create secant line
        secant_line = Line(point_a, point_b, color=YELLOW)
        
        # Find c where the tangent line is parallel to the secant line
        def find_c():
            for x in np.linspace(a, b, 1000):
                if math.isclose(Derivative(func)(x), avg_slope, rel_tol=1e-2):
                    return x
            return None
        
        c = find_c()
        point_c = axes.c2p(c, func(c))
        dot_c = Dot(point_c, color=GREEN)
        label_c = MathTex("C", color=GREEN).next_to(dot_c, UP)
        
        # Create tangent line at c
        tangent_slope = Derivative(func)(c)
        tangent_line = Line(
            point_c + LEFT * 2,
            point_c + RIGHT * 2,
            color=GREEN
        ).rotate(math.atan(tangent_slope), about_point=point_c)
        
        # Add all elements to the scene
        self.play(Create(axes), Create(graph))
        self.play(Create(dot_a), Write(label_a))
        self.play(Create(dot_b), Write(label_b))
        self.play(Create(secant_line))
        self.wait(1)
        
        # Highlight the point C and tangent line
        self.play(Create(dot_c), Write(label_c))
        self.play(Create(tangent_line))
        self.wait(2)
        
        # Explanation text
        explanation = VGroup(
            Text("Mean Value Theorem:"),
            MathTex(r"\exists c \in (a, b) \text{ such that } f'(c) = \frac{f(b) - f(a)}{b - a}")
        ).arrange(DOWN).to_edge(UP)
        
        self.play(Write(explanation))
        self.wait(3)
        
        # Fade out all elements
        self.play(FadeOut(VGroup(axes, graph, dot_a, dot_b, dot_c, label_a, label_b, label_c, secant_line, tangent_line, explanation)))
        self.wait(1)