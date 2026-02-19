from reportlab.lib.units import inch, mm
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from typing import Final

# Page configuration
PAGE_SIZE: Final = A4
MARGIN_RIGHT: Final = 1 * mm
MARGIN_LEFT: Final = 1 * mm
MARGIN_TOP: Final = 0 * mm
MARGIN_BOTTOM: Final = 0 * mm

# Table configuration
TEAM_IMAGE_HEIGHT: Final = 72
TEAM_TEXT_HEADER_SPACING: Final = 8
MEMBER_IMAGE_SIZE: Final = (int(2 * inch), int(2 * inch))
DISPLAY_IMAGE_SIZE: Final = (0.51 * inch, 0.51 * inch)
TABLE_COL_WIDTHS: Final = [0.4 * inch, 1.0 * inch, A4[0] - 2.0 * inch]
TABLE_ROW_HEIGHT: Final = 0.4 * inch

# Title padding
TITLE_LEFT_PADDING: Final = 10 * mm

# Font sizes
FONT_SIZE_FOOTER_SMALL: Final = 7
FONT_SIZE_FOOTER_NORMAL: Final = 9

# Colors
COLOR_PRIMARY: Final = HexColor("#5c1f22")
COLOR_SECONDARY: Final = HexColor("#999999")

# Image quality
JPEG_QUALITY: Final = 85

# File paths
ASSETS_IMAGES_PATH: Final = "assets/images"
ASSETS_ICONS_PATH: Final = "assets/icons"

# Valid teams
VALID_TEAMS: Final = ["townsfolk", "outsider", "minion", "demon", "fabled"]

# Footer text
FOOTER_COPYRIGHT: Final = "© StevenMedway, bloodontheclocktower.com | Korean PDF by botc-kr.github.io"
FOOTER_NOTE: Final = "*첫날 밤 제외"

# Meta information
META_ID: Final = "_meta" 
