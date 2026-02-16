class PDFGenerationError(Exception):
    """Base exception for PDF generation errors"""
    pass


class FontRegistrationError(PDFGenerationError):
    """Raised when font registration fails"""
    pass


class ImageProcessingError(PDFGenerationError):
    """Raised when image processing fails"""
    pass


class DataValidationError(PDFGenerationError):
    """Raised when input data validation fails"""
    pass


class ConfigurationError(PDFGenerationError):
    """Raised when configuration is invalid"""
    pass 