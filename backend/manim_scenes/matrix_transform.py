from manim import *
import numpy as np

class MatrixTransformScene(Scene):
    def construct(self):
        # default 2x2 rotation 45 degrees
        theta = 45 * DEGREES
        matrix = [[np.cos(theta), -np.sin(theta)], [np.sin(theta), np.cos(theta)]]

        square = Square(side_length=2).shift(LEFT * 2)
        self.play(Create(square))
        self.wait(0.5)

        self.play(square.animate.apply_matrix(matrix).set_color(ORANGE).shift(RIGHT * 4))
        self.wait(2) 