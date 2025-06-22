from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Define matrices A and B
        matrix_a = MathTex(r"A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}")
        matrix_b = MathTex(r"B = \begin{bmatrix} 5 & 6 \\ 7 & 8 \end{bmatrix}")
        
        # Position matrices
        matrix_a.to_edge(LEFT, buff=1)
        matrix_b.next_to(matrix_a, RIGHT, buff=1)

        # Display matrices
        self.play(Write(matrix_a), Write(matrix_b))
        self.wait(1)

        # Define result matrix C
        matrix_c = MathTex(r"C = \begin{bmatrix} c_{11} & c_{12} \\ c_{21} & c_{22} \end{bmatrix}")
        matrix_c.next_to(matrix_b, RIGHT, buff=1)

        # Display result matrix
        self.play(Write(matrix_c))
        self.wait(1)

        # Highlight first row of A and first column of B
        row_a1 = SurroundingRectangle(matrix_a[0][2:4], color=YELLOW)
        col_b1 = SurroundingRectangle(matrix_b[0][2::3], color=YELLOW)

        self.play(Create(row_a1), Create(col_b1))
        self.wait(1)

        # Calculate c11
        c11_calc = MathTex(r"c_{11} = 1 \cdot 5 + 2 \cdot 7 = 19")
        c11_calc.next_to(matrix_c, DOWN, buff=1)

        self.play(Write(c11_calc))
        self.wait(1)

        # Update c11 in matrix C
        c11_update = MathTex(r"19")
        c11_update.move_to(matrix_c[0][2])

        self.play(Transform(matrix_c[0][2], c11_update))
        self.wait(1)

        # Highlight first row of A and second column of B
        col_b2 = SurroundingRectangle(matrix_b[0][3::3], color=YELLOW)

        self.play(Transform(col_b1, col_b2))
        self.wait(1)

        # Calculate c12
        c12_calc = MathTex(r"c_{12} = 1 \cdot 6 + 2 \cdot 8 = 22")
        c12_calc.next_to(c11_calc, DOWN, buff=0.5)

        self.play(Write(c12_calc))
        self.wait(1)

        # Update c12 in matrix C
        c12_update = MathTex(r"22")
        c12_update.move_to(matrix_c[0][3])

        self.play(Transform(matrix_c[0][3], c12_update))
        self.wait(1)

        # Highlight second row of A and first column of B
        row_a2 = SurroundingRectangle(matrix_a[0][4:6], color=YELLOW)

        self.play(Transform(row_a1, row_a2), Transform(col_b1, col_b1))
        self.wait(1)

        # Calculate c21
        c21_calc = MathTex(r"c_{21} = 3 \cdot 5 + 4 \cdot 7 = 43")
        c21_calc.next_to(c12_calc, DOWN, buff=0.5)

        self.play(Write(c21_calc))
        self.wait(1)

        # Update c21 in matrix C
        c21_update = MathTex(r"43")
        c21_update.move_to(matrix_c[0][5])

        self.play(Transform(matrix_c[0][5], c21_update))