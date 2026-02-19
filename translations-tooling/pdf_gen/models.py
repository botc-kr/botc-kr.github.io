from dataclasses import dataclass
from typing import List, Dict, Any, Optional
from enum import Enum


class TeamType(Enum):
    """Enum for valid team types"""
    TOWNSFOLK = "townsfolk"
    OUTSIDER = "outsider"
    MINION = "minion"
    DEMON = "demon"
    FABLED = "fabled"


@dataclass
class CharacterData:
    """Data model for character information"""
    id: str
    name: str
    ability: str
    team: TeamType
    image_url: Optional[str] = None


@dataclass
class MetaData:
    """Data model for meta information"""
    name: str
    author: Optional[str] = None


@dataclass
class PDFData:
    """Complete data model for PDF generation"""
    meta: MetaData
    characters: List[CharacterData]


@dataclass
class TableRow:
    """Data model for table row"""
    image: Any  # ReportLab Image or Paragraph
    name: str
    ability: str


@dataclass
class TeamSection:
    """Data model for team section"""
    team: TeamType
    characters: List[CharacterData]
    team_image_path: Optional[str] = None 
