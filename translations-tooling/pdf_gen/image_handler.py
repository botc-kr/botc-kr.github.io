import logging
import requests
import hashlib
from pathlib import Path
from PIL import Image
from io import BytesIO
from typing import Dict, Optional

class ImageHandler:
    """Handles image processing and retrieval with local caching"""
    def __init__(self, assets_path: str = "assets", cache_dir: str = ".cache"):
        self.assets_path = Path(assets_path)
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
    def _get_cache_path(self, url: str) -> Path:
        """Generate a unique cache path for a given URL"""
        # Create a unique filename using URL hash
        url_hash = hashlib.md5(url.encode()).hexdigest()
        return self.cache_dir / f"{url_hash}.png"
        
    def get_image(self, item: Dict[str, str]) -> Optional[Image.Image]:
        """Get image from local storage or download from URL"""
        icon_id = item["id"]
        
        # First try to find in assets directory
        path_patterns = [
            f"icons/Icon_{icon_id}.png",
            f"icons/Icon_{'_'.join(icon_id.split('_')[2:])}.png",
            f"icons/Icon_{icon_id.split('_')[-1]}.png"
        ]
        for pattern in path_patterns:
            full_path = self.assets_path / pattern
            if full_path.exists():
                logging.info(f"Found image at: {full_path}")
                return Image.open(full_path)
                
        # If not in assets, try to get from cache or download
        return self._download_image(item.get("image"))
        
    def _download_image(self, url: str) -> Optional[Image.Image]:
        """Download image from URL with caching"""
        if not url:
            return None
            
        # Check cache first
        cache_path = self._get_cache_path(url)
        if cache_path.exists():
            logging.info(f"Loading cached image from: {cache_path}")
            return Image.open(cache_path)
            
        # If not in cache, download and cache
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            image = Image.open(BytesIO(response.content))
            
            # Save to cache
            image.save(cache_path)
            logging.info(f"Cached image to: {cache_path}")
            
            return image
        except requests.RequestException as e:
            logging.error(f"Error downloading image from {url}: {e}")
            return None
        except Exception as e:
            logging.error(f"Error processing image from {url}: {e}")
            return None