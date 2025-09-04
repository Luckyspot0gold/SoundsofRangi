import numpy as np
import matplotlib.pyplot as plt
from io import BytesIO
import base64

class CymaticVisualizer:
    def __init__(self, size=500):
        self.size = size
        
    def render(self, frequency, amplitude=1.0, cmap='inferno'):
        x = np.linspace(-np.pi, np.pi, self.size)
        y = np.linspace(-np.pi, np.pi, self.size)
        X, Y = np.meshgrid(x, y)
        Z = np.sin(frequency * X) * np.sin(frequency * Y) * amplitude
        
        fig, ax = plt.subplots(figsize=(5, 5))
        ax.imshow(Z, cmap=cmap)
        ax.axis('off')
        fig.tight_layout(pad=0)
        
        buf = BytesIO()
        fig.savefig(buf, format='png', bbox_inches='tight', pad_inches=0)
        plt.close(fig)
        buf.seek(0)
        
        img_data = base64.b64encode(buf.read()).decode('utf-8')
        return f"data:image/png;base64,{img_data}"
