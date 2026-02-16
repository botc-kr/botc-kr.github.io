from dataclasses import dataclass

@dataclass
class FontConfig:
    """Font configuration for the PDF generator"""
    regular: str = "assets/fonts/NanumGothic.ttf"
    bold: str = "assets/fonts/NanumGothic-Bold.ttf"
    dumbledor: str = "assets/fonts/dum1.ttf"
    title: str = "assets/fonts/ChungjuKimSaeng.ttf"