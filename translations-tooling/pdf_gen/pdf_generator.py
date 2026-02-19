import os
import logging
from typing import List, Dict, Any
from reportlab.lib.pagesizes import A4
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from .config import FontConfig
from .constants import (
    MARGIN_BOTTOM,
    MARGIN_LEFT,
    MARGIN_RIGHT,
    MARGIN_TOP,
    PAGE_SIZE,
    TEAM_TEXT_HEADER_SPACING,
)
from .exceptions import FontRegistrationError, PDFGenerationError
from .models import PDFData, TeamSection
from .data_processor import DataProcessor
from .table_builder import TableBuilder
from .footer_handler import FooterHandler
from .styles import StyleManager
from .image_handler import ImageHandler


class FontManager:
    """Manages font registration and configuration"""
    
    def __init__(self, config: FontConfig):
        self.config = config
        self._font_mappings = {
            "NanumGothic": config.regular,
            "NanumGothic-Bold": config.bold,
            "Dumbledor": config.dumbledor,
            "ChungjuKimSaeng": config.title
        }

    def register_fonts(self) -> None:
        """Register all required fonts"""
        for font_name, font_path in self._font_mappings.items():
            if not os.path.exists(font_path):
                raise FontRegistrationError(f"Font file '{font_path}' not found.")
            try:
                pdfmetrics.registerFont(TTFont(font_name, font_path))
                logging.info(f"Successfully registered font: {font_name}")
            except Exception as e:
                raise FontRegistrationError(f"Failed to register font {font_name}: {e}")


class PDFGenerator:
    """Main PDF generation class with improved architecture"""
    
    def __init__(
        self, 
        font_manager: FontManager, 
        style_manager: StyleManager, 
        image_handler: ImageHandler
    ):
        self.font_manager = font_manager
        self.style_manager = style_manager
        self.image_handler = image_handler
        self.table_builder = TableBuilder(style_manager, image_handler)
        self.data_processor = DataProcessor()
        
        # Register fonts
        self.font_manager.register_fonts()

    def create_pdf(self, data: List[Dict[str, Any]], output_filename: str) -> None:
        """Create PDF document from provided data"""
        try:
            # Process and validate data
            pdf_data = self.data_processor.validate_and_process_data(data)
            
            # Create document
            doc = self._create_document(output_filename)
            
            # Build elements
            elements = self._build_pdf_elements(pdf_data)
            
            # Build PDF
            doc.build(elements, onFirstPage=FooterHandler.add_footer, onLaterPages=FooterHandler.add_footer)
            
            logging.info(f"PDF successfully created: {output_filename}")
            
        except Exception as e:
            logging.error(f"Failed to create PDF: {e}")
            raise PDFGenerationError(f"PDF generation failed: {e}")

    def _create_document(self, output_filename: str) -> SimpleDocTemplate:
        """Create and configure PDF document"""
        return SimpleDocTemplate(
            output_filename,
            pagesize=PAGE_SIZE,
            rightMargin=MARGIN_RIGHT,
            leftMargin=MARGIN_LEFT,
            topMargin=MARGIN_TOP,
            bottomMargin=MARGIN_BOTTOM,
            compress=2,
        )

    def _build_pdf_elements(self, pdf_data: PDFData) -> List:
        """Build all PDF elements"""
        elements = []
        
        # Add meta information
        elements.extend(self._create_meta_elements(pdf_data.meta))
        
        # Add team sections
        team_sections = self.data_processor.group_characters_by_team(pdf_data.characters)
        elements.extend(self._create_team_elements(team_sections))
        
        return elements

    def _create_meta_elements(self, meta_data) -> List:
        """Create meta information elements"""
        meta_table = self.table_builder.create_meta_table(
            meta_data.name, 
            meta_data.author
        )
        return [meta_table]

    def _create_team_elements(self, team_sections: List[TeamSection]) -> List:
        """Create team section elements"""
        elements = []
        
        for team_section in team_sections:
            # Add team header image
            team_image = self.table_builder.get_team_image(team_section.team.value)
            if team_image:
                elements.append(team_image)
                # Fallback text headers (e.g. missing fabled.png) need extra gap to avoid overlap.
                if isinstance(team_image, Paragraph):
                    elements.append(Spacer(1, TEAM_TEXT_HEADER_SPACING))
            
            # Add team table
            team_table = self.table_builder.create_team_table(team_section)
            elements.append(team_table)
        
        return elements
