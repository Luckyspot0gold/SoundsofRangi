import numpy as np
import matplotlib.pyplot as plt

class CymaticVisualizer:
    def __init__(self, grid_size=400):
        self.grid_size = grid_size

    def generate_pattern(self, frequency, amplitude=1.0):
        """
        Generate cymatic-like standing wave pattern based on frequency.
        """
        x = np.linspace(-np.pi, np.pi, self.grid_size)
        y = np.linspace(-np.pi, np.pi, self.grid_size)
        X, Y = np.meshgrid(x, y)

        # Standing wave interference pattern
        Z = np.sin(frequency * X) * np.sin(frequency * Y)

        # Scale by amplitude
        Z *= amplitude

        return X, Y, Z

    def show_pattern(self, frequency, amplitude=1.0, cmap="inferno"):
        X, Y, Z = self.generate_pattern(frequency, amplitude)

        plt.imshow(Z, cmap=cmap, extent=[-1, 1, -1, 1])
        plt.axis("off")
        plt.show()

# ---- DEMO ----
cymatic = CymaticVisualizer()
cymatic.show_pattern(frequency=6.5, amplitude=1.0)
