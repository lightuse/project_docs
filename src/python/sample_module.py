
"""
Sample module for documentation demonstration.

This module provides example classes and functions to showcase
the documentation generation capabilities.
"""

class SampleClass:
    """
    A sample class for documentation purposes.
    
    This class demonstrates how docstrings are processed by Sphinx
    and integrated into the MKDocs documentation site.
    
    Attributes:
        name (str): The name of the sample instance
        value (int): A numerical value associated with the instance
    """
    
    def __init__(self, name: str, value: int = 0):
        """
        Initialize a SampleClass instance.
        
        Args:
            name: The name for this instance
            value: Initial value (defaults to 0)
        """
        self.name = name
        self.value = value
    
    def process(self, data: list) -> dict:
        """
        Process a list of data items.
        
        Args:
            data: List of items to process
            
        Returns:
            Dictionary containing processing results
            
        Raises:
            ValueError: If data is empty
        """
        if not data:
            raise ValueError("Data cannot be empty")
        
        return {
            "processed_count": len(data),
            "processor": self.name,
            "status": "completed"
        }


def utility_function(input_str: str, uppercase: bool = False) -> str:
    """
    A utility function for string processing.
    
    Args:
        input_str: The input string to process
        uppercase: Whether to convert to uppercase
        
    Returns:
        Processed string
        
    Example:
        >>> utility_function("hello", uppercase=True)
        'HELLO'
    """
    result = input_str.strip()
    if uppercase:
        result = result.upper()
    return result
