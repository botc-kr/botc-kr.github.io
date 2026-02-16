"""
Example usage of the refactored PDF Generator

This example demonstrates how to use the new modular PDF generation system.
"""

import logging
from typing import List, Dict, Any
from .pdf_generator import PDFGenerator, FontManager
from .styles import StyleManager
from .image_handler import ImageHandler
from .config import FontConfig

# Configure logging
logging.basicConfig(level=logging.INFO)


def create_pdf_example():
    """Example of creating a PDF using the refactored system"""
    
    # Sample data
    sample_data: List[Dict[str, Any]] = [
        {
            "id": "_meta",
            "name": "Sample Script",
            "author": "John Doe"
        },
        {
            "id": "townsfolk_1",
            "name": "의사",
            "ability": "매일 밤, 살아있는 플레이어 중 하나를 선택하여 그 플레이어가 죽었는지 확인합니다.",
            "team": "townsfolk",
            "image": "https://example.com/doctor.png"
        },
        {
            "id": "outsider_1", 
            "name": "광대",
            "ability": "당신은 죽을 수 없습니다.",
            "team": "outsider"
        }
    ]
    
    try:
        # Initialize components
        font_config = FontConfig()
        font_manager = FontManager(font_config)
        style_manager = StyleManager()
        image_handler = ImageHandler()
        
        # Create PDF generator
        pdf_generator = PDFGenerator(
            font_manager=font_manager,
            style_manager=style_manager,
            image_handler=image_handler
        )
        
        # Generate PDF
        output_filename = "sample_output.pdf"
        pdf_generator.create_pdf(sample_data, output_filename)
        
        print(f"PDF successfully created: {output_filename}")
        
    except Exception as e:
        print(f"Error creating PDF: {e}")
        logging.error(f"PDF creation failed: {e}")


if __name__ == "__main__":
    create_pdf_example() 