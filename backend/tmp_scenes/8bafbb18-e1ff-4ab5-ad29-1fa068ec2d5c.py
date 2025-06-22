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
        graph = axes.plot(func, x_range=[0, 10], color=BLUE)
        
        # Define points a and b
        a, b = 2, 8
        point_a = axes.c2p(a, func(a))
        point_b = axes.c2p(b, func(b))
        
        # Create dots for points a and b
        dot_a = Dot(point_a, color=RED)
        dot_b = Dot(point_b, color=RED)
        
        # Create a line connecting a and b
        secant_line = Line(point_a, point_b, color=YELLOW)
        
        # Calculate the slope of the secant line
        secant_slope = (func(b) - func(a)) / (b - a)
        
        # Find point c where the tangent slope equals the secant slope
        def find_c():
            for x in np.linspace(a, b, 1000):
                if math.isclose(Derivative(func)(x), secant_slope, rel_tol=1e-2):
                    return x
            return None
        
        c = find_c()
        if c is not None:
            point_c = axes.c2p(c, func(c))
            dot_c = Dot(point_c, color=GREEN)
            
            # Calculate the slope of the tangent at c
            tangent_slope = Derivative(func)(c)
            
            # Create the tangent line at c
            tangent_line = Line(
                start=point_c + np.array([-1, -tangent_slope, 0]),
                end=point_c + np.array([1, tangent_slope, 0]),
                color=GREEN
            )
            
            # Add all elements to the scene
            self.play(Create(axes), Create(graph))
            self.play(Create(dot_a), Create(dot_b), Create(secant_line))
            self.wait(1)
            self.play(Create(dot_c), Create(tangent_line))
            self.wait(2)