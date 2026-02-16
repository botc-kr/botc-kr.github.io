import os
import logging
from typing import List
from reportlab.platypus import Table, TableStyle, Paragraph, Image as ReportLabImage
from reportlab.lib.pagesizes import A4
from PIL import Image
from io import BytesIO

from .models import CharacterData, TeamSection, TableRow
from .constants import (
    TABLE_COL_WIDTHS, TABLE_ROW_HEIGHT, TEAM_IMAGE_HEIGHT,
    MEMBER_IMAGE_SIZE, DISPLAY_IMAGE_SIZE, JPEG_QUALITY,
    ASSETS_IMAGES_PATH, TITLE_LEFT_PADDING
)
from .styles import StyleManager
from .image_handler import ImageHandler
from .exceptions import ImageProcessingError


class TableBuilder:
    """Handles table creation for PDF generation"""
    
    def __init__(self, style_manager: StyleManager, image_handler: ImageHandler):
        self.style_manager = style_manager
        self.image_handler = image_handler
        self.styles = style_manager.create_styles()
    
    def create_meta_table(self, title: str, author: str) -> Table:
        """Create meta information table"""
        title_para = self.style_manager.create_mixed_font_paragraph(
            title.upper(), self.styles["MetaTitle"]
        )
        
        left_col_width = A4[0] - 20
        right_col_width = A4[0] * 0.3
        
        if not author:
            return self._create_single_column_meta_table(title_para, left_col_width)
        
        author_para = self.style_manager.create_mixed_font_paragraph(
            f"by {author}", self.styles["MetaAuthor"]
        )
        return self._create_two_column_meta_table(
            title_para, author_para, left_col_width, right_col_width
        )
    
    def _create_single_column_meta_table(self, title_para: Paragraph, width: float) -> Table:
        """Create single column meta table"""
        return Table(
            [[title_para]], 
            colWidths=[width],
            style=TableStyle([
                ("ALIGN", (0, 0), (0, 0), "LEFT"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (0, 0), TITLE_LEFT_PADDING),
            ])
        )
    
    def _create_two_column_meta_table(
        self, title_para: Paragraph, author_para: Paragraph, 
        left_width: float, right_width: float
    ) -> Table:
        """Create two column meta table"""
        return Table(
            [[title_para, author_para]], 
            colWidths=[left_width - right_width, right_width],
            style=TableStyle([
                ("ALIGN", (0, 0), (0, 0), "LEFT"),
                ("ALIGN", (1, 0), (1, 0), "RIGHT"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (0, 0), TITLE_LEFT_PADDING),
                ("RIGHTPADDING", (1, 0), (1, 0), 0),
            ])
        )
    
    def create_team_table(self, team_section: TeamSection) -> Table:
        """Create table for team members"""
        table_data = []
        
        for character in team_section.characters:
            image = self._process_character_image(character)
            name = Paragraph(character.name, self.styles["KoreanName"])
            ability = Paragraph(character.ability, self.styles["Korean"])
            table_data.append([image, name, ability])
        
        return Table(
            table_data,
            colWidths=TABLE_COL_WIDTHS,
            rowHeights=TABLE_ROW_HEIGHT,
            style=TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (0, -1), -10),
                ("RIGHTPADDING", (-1, 0), (-1, -1), 10),
            ])
        )
    
    def _process_character_image(self, character: CharacterData) -> Paragraph | ReportLabImage:
        """Process character image with optimization"""
        try:
            # Convert character data to dict format for image handler
            item_dict = {
                "id": character.id,
                "image": character.image_url
            }
            
            img = self.image_handler.get_image(item_dict)
            if not img:
                return Paragraph("No image", self.styles["Korean"])
            
            return self._optimize_and_convert_image(img)
            
        except Exception as e:
            logging.error(f"Error processing image for character {character.id}: {e}")
            return Paragraph("Image error", self.styles["Korean"])
    
    def _optimize_and_convert_image(self, img: Image.Image) -> ReportLabImage:
        """Optimize and convert image for PDF"""
        # Resize if image is larger than target size
        if img.size[0] > MEMBER_IMAGE_SIZE[0] or img.size[1] > MEMBER_IMAGE_SIZE[1]:
            img = img.resize(MEMBER_IMAGE_SIZE, Image.LANCZOS)
        
        # Convert to RGB if necessary (handle transparency)
        img = self._convert_to_rgb(img)
        
        # Save as optimized JPEG
        img_byte_arr = BytesIO()
        img.save(
            img_byte_arr, 
            format='JPEG', 
            quality=JPEG_QUALITY,
            optimize=True
        )
        
        return ReportLabImage(
            BytesIO(img_byte_arr.getvalue()),
            width=DISPLAY_IMAGE_SIZE[0],
            height=DISPLAY_IMAGE_SIZE[1]
        )
    
    def _convert_to_rgb(self, img: Image.Image) -> Image.Image:
        """Convert image to RGB format, handling transparency"""
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            # Handle transparent background
            background = Image.new('RGB', img.size, 'white')
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1])
            return background
        
        return img.convert('RGB')
    
    def get_team_image(self, team: str) -> ReportLabImage | Paragraph | None:
        """Get team header image"""
        team_image_path = os.path.join(ASSETS_IMAGES_PATH, f"{team}.png")
        
        if os.path.exists(team_image_path):
            try:
                team_image = Image.open(team_image_path)
                team_image.thumbnail((A4[0], TEAM_IMAGE_HEIGHT))
                return ReportLabImage(
                    team_image_path, 
                    width=team_image.size[0], 
                    height=team_image.size[1]
                )
            except Exception as e:
                logging.error(f"Error loading team image {team_image_path}: {e}")
        
        logging.warning(f"Team image not found: {team_image_path}")
        return Paragraph(team.capitalize(), self.styles["KoreanName"]) 