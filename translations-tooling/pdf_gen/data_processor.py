import logging
from typing import List, Dict, Any, Optional
from .models import CharacterData, MetaData, PDFData, TeamType, TeamSection
from .constants import VALID_TEAMS, META_ID
from .exceptions import DataValidationError


class DataProcessor:
    """Handles data processing and validation for PDF generation"""
    
    @staticmethod
    def validate_and_process_data(raw_data: List[Dict[str, Any]]) -> PDFData:
        """Validate and process raw data into structured format"""
        if not raw_data:
            raise DataValidationError("Input data cannot be empty")
        
        meta_data = DataProcessor._extract_meta_data(raw_data)
        characters = DataProcessor._extract_characters(raw_data)
        
        return PDFData(meta=meta_data, characters=characters)
    
    @staticmethod
    def _extract_meta_data(raw_data: List[Dict[str, Any]]) -> MetaData:
        """Extract meta information from raw data"""
        meta_item = next(
            (item for item in raw_data if item.get("id") == META_ID), 
            None
        )
        
        if not meta_item:
            logging.warning("Meta information not found in the JSON data.")
            return MetaData(name="Unknown")
        
        return MetaData(
            name=meta_item.get("name", ""),
            author=meta_item.get("author")
        )
    
    @staticmethod
    def _extract_characters(raw_data: List[Dict[str, Any]]) -> List[CharacterData]:
        """Extract character data from raw data"""
        characters = []
        
        for item in raw_data:
            if not item or item.get("id") == META_ID:
                continue
                
            team = item.get("team")
            if team not in VALID_TEAMS:
                logging.warning(f"Invalid team '{team}' for character {item.get('id')}")
                continue
            
            try:
                character = CharacterData(
                    id=item.get("id", ""),
                    name=item.get("name", "N/A"),
                    ability=item.get("ability", "N/A"),
                    team=TeamType(team),
                    image_url=item.get("image")
                )
                characters.append(character)
            except ValueError as e:
                logging.error(f"Error processing character {item.get('id')}: {e}")
                continue
        
        return characters
    
    @staticmethod
    def group_characters_by_team(characters: List[CharacterData]) -> List[TeamSection]:
        """Group characters by team and sort according to team order"""
        team_groups: Dict[TeamType, List[CharacterData]] = {}
        
        # Initialize all teams
        for team in TeamType:
            team_groups[team] = []
        
        # Group characters by team
        for character in characters:
            team_groups[character.team].append(character)
        
        # Create team sections in order
        team_sections = []
        for team in TeamType:
            if team_groups[team]:
                team_sections.append(TeamSection(
                    team=team,
                    characters=team_groups[team]
                ))
        
        return team_sections 