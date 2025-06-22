from manim import *
import math
import numpy as np

class PromptScene(Scene):
    def construct(self):
        # Define matrices A and B
        matrix_a = MathTex(r"A = \begin{bmatrix} a & b & c \\ d & e & f \end{bmatrix}")
        matrix_b = MathTex(r"B = \begin{bmatrix} g & h \\ i & j \\ k & l \end{bmatrix}")
        
        # Position matrices
        matrix_a.to_edge(LEFT)
        matrix_b.next_to(matrix_a, RIGHT, buff=1)

        # Display matrices
        self.play(Write(matrix_a), Write(matrix_b))
        self.wait(2)

        # Define result matrix C
        result_matrix = MathTex(r"C = \begin{bmatrix} C_{11} & C_{12} \\ C_{21} & C_{22} \end{bmatrix}")
        result_matrix.next_to(matrix_b, RIGHT, buff=1)

        # Display result matrix
        self.play(Write(result_matrix))
        self.wait(2)

        # Highlight first row of A and first column of B
        row_a1 = SurroundingRectangle(matrix_a[0][2:5], color=YELLOW)
        col_b1 = SurroundingRectangle(VGroup(matrix_b[0][2], matrix_b[0][6], matrix_b[0][10]), color=YELLOW)

        self.play(Create(row_a1), Create(col_b1))
        self.wait(1)

        # Calculate C[0][0]
        c_11 = MathTex(r"C_{11} = a \cdot g + b \cdot i + c \cdot k")
        c_11.next_to(result_matrix, DOWN, buff=1)

        self.play(Write(c_11))
        self.wait(2)

        # Highlight first row of A and second column of B
        col_b2 = SurroundingRectangle(VGroup(matrix_b[0][3], matrix_b[0][7], matrix_b[0][11]), color=YELLOW)
        self.play(Transform(col_b1, col_b2))
        self.wait(1)

        # Calculate C[0][1]
        c_12 = MathTex(r"C_{12} = a \cdot h + b \cdot j + c \cdot l")
        c_12.next_to(c_11, DOWN)

        self.play(Write(c_12))
        self.wait(2)

        # Highlight second row of A and first column of B
        row_a2 = SurroundingRectangle(matrix_a[0][6:9], color=YELLOW)
        self.play(Transform(row_a1, row_a2), Transform(col_b1, SurroundingRectangle(VGroup(matrix_b[0][2], matrix_b[0][6], matrix_b[0][10]), color=YELLOW)))
        self.wait(1)

        # Calculate C[1][0]
        c_21 = MathTex(r"C_{21} = d \cdot g + e \cdot i + f \cdot k")
        c_21.next_to(c_12, DOWN)

        self.play(Write(c_21))
        self.wait(2)

        # Highlight second row of A and second column of B
        self.play(Transform(col_b1, col_b2))
        self.wait(1)

        # Calculate C[1][1]
        c_22 = MathTex(r"C_{22} = d \cdot h + e \cdot j + f \cdot l")
        c_22.next_to(c_21, DOWN)

        self.play(Write(c_22))
        self.wait(2)

        # Final result
        final_result = MathTex(r"C = \begin{bmatrix