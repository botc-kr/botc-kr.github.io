import re
from typing import Dict
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.colors import HexColor
from reportlab.platypus import Paragraph

class StyleManager:
    """Manages PDF styles and formatting"""
    @staticmethod
    def create_styles() -> Dict[str, ParagraphStyle]:
        """Create and return custom styles for PDF generation"""
        styles = getSampleStyleSheet()
        custom_styles = {
            "Korean": ParagraphStyle(
                name="Korean",
                fontName="NanumGothic",
                fontSize=9,
                leading=11
            ),
            "KoreanName": ParagraphStyle(
                name="KoreanName",
                fontName="NanumGothic-Bold",
                fontSize=10,
                leading=12
            ),
            "MetaTitle": ParagraphStyle(
                name="MetaTitle",
                fontName="Dumbledor",
                fontSize=14,
                leading=16,
                alignment=TA_LEFT,
                textColor=HexColor("#5c1f22")
            ),
            "MetaAuthor": ParagraphStyle(
                name="MetaAuthor",
                fontName="Dumbledor",
                fontSize=12,
                leading=14,
                alignment=TA_RIGHT,
                textColor=HexColor("#5c1f22")
            )
        }

        for style in custom_styles.values():
            styles.add(style)
        return styles

    @staticmethod
    def split_korean_english(text: str) -> list:
        """Split text into Korean and non-Korean parts"""
        pattern = '([가-힣]+|[^가-힣]+)'
        return re.findall(pattern, text)

    def create_mixed_font_paragraph(self, text: str, base_style: ParagraphStyle) -> Paragraph:
        """Create a paragraph with mixed Korean and English fonts"""
        parts = self.split_korean_english(text)
        formatted_text = []
        
        for part in parts:
            if re.match('[가-힣]+', part):
                formatted_text.append(
                    f'<font face="ChungjuKimSaeng" size="{base_style.fontSize - 2}">{part}</font>'
                )
            else:
                formatted_text.append(
                    f'<font face="Dumbledor">{part}</font>'
                )

        return Paragraph(''.join(formatted_text), base_style)