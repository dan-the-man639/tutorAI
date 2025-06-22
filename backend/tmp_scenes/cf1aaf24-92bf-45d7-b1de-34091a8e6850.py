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

        # Display matrices A and B
        self.play(Write(matrix_a), Write(matrix_b))
        self.wait(2)

        # Explain matrix multiplication compatibility
        compatibility_text = Text("Matrix A columns = Matrix B rows", font_size=24)
        compatibility_text.next_to(matrix_b, UP, buff=1)
        self.play(Write(compatibility_text))
        self.wait(2)

        # Define the resulting matrix C
        result_matrix = MathTex(r"C = \begin{bmatrix} C_{11} & C_{12} \\ C_{21} & C_{22} \end{bmatrix}")
        result_matrix.next_to(matrix_b, RIGHT, buff=1)

        # Display the resulting matrix C
        self.play(Write(result_matrix))
        self.wait(2)

        # Explain element computation for C[0][0]
        c11_calc = MathTex(r"C_{11} = a \cdot g + b \cdot i + c \cdot k")
        c11_calc.next_to(result_matrix, DOWN, buff=1)
        self.play(Write(c11_calc))
        self.wait(2)

        # Explain element computation for C[0][1]
        c12_calc = MathTex(r"C_{12} = a \cdot h + b \cdot j + c \cdot l")
        c12_calc.next_to(c11_calc, DOWN, buff=0.5)
        self.play(Write(c12_calc))
        self.wait(2)

        # Explain element computation for C[1][0]
        c21_calc = MathTex(r"C_{21} = d \cdot g + e \cdot i + f \cdot k")
        c21_calc.next_to(c12_calc, DOWN, buff=0.5)
        self.play(Write(c21_calc))
        self.wait(2)

        # Explain element computation for C[1][1]
        c22_calc = MathTex(r"C_{22} = d \cdot h + e \cdot j + f \cdot l")
        c22_calc.next_to(c21_calc, DOWN, buff=0.5)
        self.play(Write(c22_calc))
        self.wait(2)

        # Final result matrix
        final_result = MathTex(r"C = \begin{bmatrix} a \cdot g + b \cdot i + c \cdot k & a \cdot h + b \cdot j + c \cdot l \\ d \cdot g + e \cdot i + f \cdot k & d \cdot h + e \cdot j + f \cdot l \end{bmatrix}")
        final_result.next_to(result_matrix, RIGHT, buff=1)

        # Display the final result
        self.play(Transform(result_matrix, final_result))
        self.wait(3)