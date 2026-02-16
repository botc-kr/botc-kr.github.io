import os
import json
import logging
import sys
import argparse
from .config import FontConfig
from .pdf_generator import FontManager
from .styles import StyleManager
from .image_handler import ImageHandler
from .pdf_generator import PDFGenerator

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description="Convert JSON to PDF with team filtering and sorting."
    )
    parser.add_argument("input_json", help="Path to the input JSON file")
    parser.add_argument(
        "-o",
        "--output",
        help="Path to the output PDF file (optional)",
    )
    
    args = parser.parse_args()

    try:
        # Initialize components
        font_manager = FontManager(FontConfig())
        font_manager.register_fonts()
        
        style_manager = StyleManager()
        image_handler = ImageHandler()
        pdf_generator = PDFGenerator(font_manager, style_manager, image_handler)

        # Process input
        with open(args.input_json, "r", encoding="utf-8") as f:
            data = json.load(f)

        if not isinstance(data, list):
            data = [data]

        # Generate output filename
        output_filename = args.output or f"{os.path.splitext(os.path.basename(args.input_json))[0]}.pdf"

        # Generate PDF
        pdf_generator.create_pdf(data, output_filename)
        logging.info(f"PDF has been created successfully: {output_filename}")
        
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s"
    )
    main()