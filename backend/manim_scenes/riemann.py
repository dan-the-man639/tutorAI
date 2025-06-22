from manim import *
import math

class RiemannSumScene(Scene):
    CONFIG = {
        "function": lambda x: x**2,
        "a": 0,
        "b": 4,
        "rects": 8,
    }

    def construct(self):
        func = self.CONFIG.get("function")
        a = self.CONFIG.get("a")
        b = self.CONFIG.get("b")
        n = self.CONFIG.get("rects")

        axes = Axes(x_range=[a, b, 1], y_range=[0, func(b) + 5, 5], tips=False)
        graph = axes.plot(func, color=BLUE)
        self.play(Create(axes), Create(graph))

        dx = (b - a) / n
        rects = VGroup()
        for i in range(n):
            x_i = a + i * dx
            height = func(x_i)
            rect = Rectangle(width=dx, height=height, fill_opacity=0.5, fill_color=GREEN, stroke_width=0)
            rect.move_to(axes.c2p(x_i + dx/2, height/2))
            rects.add(rect)
        self.play(Create(rects))
        self.wait(1)

        # Animate rectangles collapsing into area (integral fill)
        filled_area = axes.get_area(graph, x_range=(a, b), color=GREEN, opacity=0.5)
        self.play(Transform(rects, filled_area))
        self.wait(2) 