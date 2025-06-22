from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Define matrices A and B
        matrix_a = MathTex(
            r"A = \begin{bmatrix} a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \end{bmatrix}"
        ).to_edge(LEFT)
        matrix_b = MathTex(
            r"B = \begin{bmatrix} b_{11} & b_{12} \\ b_{21} & b_{22} \\ b_{31} & b_{32} \end{bmatrix}"
        ).to_edge(RIGHT)

        # Define resulting matrix C
        matrix_c = MathTex(
            r"C = \begin{bmatrix} c_{11} & c_{12} \\ c_{21} & c_{22} \end{bmatrix}"
        ).next_to(matrix_a, DOWN, buff=1.5)

        # Show matrices A and B
        self.play(Write(matrix_a), Write(matrix_b))
        self.wait(2)

        # Highlight the first row of A and the first column of B
        row_a1 = SurroundingRectangle(matrix_a[0][4:7], color=YELLOW)
        col_b1 = SurroundingRectangle(matrix_b[0][3:10:3], color=YELLOW)
        self.play(Create(row_a1), Create(col_b1))
        self.wait(1)

        # Calculate C11
        c11_calc = MathTex(
            r"c_{11} = a_{11} \cdot b_{11} + a_{12} \cdot b_{21} + a_{13} \cdot b_{31}"
        ).next_to(matrix_c, RIGHT, buff=1)
        self.play(Write(c11_calc))
        self.wait(2)

        # Highlight the second column of B
        col_b2 = SurroundingRectangle(matrix_b[0][4:11:3], color=GREEN)
        self.play(Transform(col_b1, col_b2))
        self.wait(1)

        # Calculate C12
        c12_calc = MathTex(
            r"c_{12} = a_{11} \cdot b_{12} + a_{12} \cdot b_{22} + a_{13} \cdot b_{32}"
        ).next_to(c11_calc, DOWN, buff=0.5)
        self.play(Write(c12_calc))
        self.wait(2)

        # Highlight the second row of A
        row_a2 = SurroundingRectangle(matrix_a[0][8:11], color=BLUE)
        self.play(Transform(row_a1, row_a2))
        self.wait(1)

        # Calculate C21
        c21_calc = MathTex(
            r"c_{21} = a_{21} \cdot b_{11} + a_{22} \cdot b_{21} + a_{23} \cdot b_{31}"
        ).next_to(c12_calc, DOWN, buff=0.5)
        self.play(Write(c21_calc))
        self.wait(2)

        # Highlight the first column of B again
        self.play(Transform(col_b2, col_b1))
        self.wait(1)

        # Calculate C22
        c22_calc = MathTex(
            r"c_{22} = a_{21} \cdot b_{12} + a_{22} \cdot b_{22} + a_{23} \cdot b_{32}"
        ).next_to(c21_calc, DOWN, buff=0.5)
        self.play(Write(c22_calc))
        self.wait(2)