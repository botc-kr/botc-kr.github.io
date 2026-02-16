from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from .constants import (
    COLOR_PRIMARY, COLOR_SECONDARY, FONT_SIZE_FOOTER_SMALL, 
    FONT_SIZE_FOOTER_NORMAL, FOOTER_COPYRIGHT, FOOTER_NOTE
)


class FooterHandler:
    """Handles footer creation for PDF pages"""
    
    @staticmethod
    def add_footer(canvas, doc) -> None:
        """Add footer to PDF page"""
        canvas.saveState()
        page_width = A4[0]
        
        # Draw copyright text
        FooterHandler._draw_copyright_text(canvas)
        
        # Draw note text
        FooterHandler._draw_note_text(canvas, page_width)
        
        canvas.restoreState()
    
    @staticmethod
    def _draw_copyright_text(canvas) -> None:
        """Draw copyright text in footer"""
        canvas.setFont("NanumGothic", FONT_SIZE_FOOTER_SMALL)
        canvas.setFillColor(COLOR_SECONDARY)
        canvas.drawString(20, 5, FOOTER_COPYRIGHT)
    
    @staticmethod
    def _draw_note_text(canvas, page_width: float) -> None:
        """Draw note text in footer"""
        canvas.setFont("NanumGothic", FONT_SIZE_FOOTER_NORMAL)
        canvas.setFillColor(COLOR_PRIMARY)
        canvas.drawRightString(page_width - 20, 5, FOOTER_NOTE) 