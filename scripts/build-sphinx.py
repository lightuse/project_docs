#!/usr/bin/env python3
"""
Sphinx documentation builder script
Builds Python API documentation and converts to Markdown for MKDocs integration
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path

# Configuration
SPHINX_SOURCE_DIR = "src/python"
SPHINX_BUILD_DIR = "docs/_build"
SPHINX_OUTPUT_DIR = "docs/api/python"
SPHINX_CONFIG_DIR = "sphinx_config"

def ensure_directories():
    """Ensure required directories exist"""
    directories = [
        SPHINX_BUILD_DIR,
        SPHINX_OUTPUT_DIR,
        SPHINX_CONFIG_DIR
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)

def create_sphinx_config():
    """Create Sphinx configuration"""
    config_content = '''
# Configuration file for the Sphinx documentation builder.

import os
import sys
sys.path.insert(0, os.path.abspath('../../src/python'))

# -- Project information -----------------------------------------------------
project = 'Python API Documentation'
copyright = '2025, Your Organization'
author = 'Your Organization'
release = '1.0.0'

# -- General configuration ---------------------------------------------------
extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.viewcode',
    'sphinx.ext.napoleon',
    'sphinx.ext.intersphinx',
    'myst_parser',
]

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

# -- Options for HTML output ------------------------------------------------
html_theme = 'sphinx_rtd_theme'
html_static_path = ['_static']

# -- Extension configuration -------------------------------------------------
autodoc_default_options = {
    'members': True,
    'member-order': 'bysource',
    'special-members': '__init__',
    'undoc-members': True,
    'exclude-members': '__weakref__'
}

napoleon_google_docstring = True
napoleon_numpy_docstring = True
napoleon_include_init_with_doc = False
napoleon_include_private_with_doc = False

# Intersphinx mapping
intersphinx_mapping = {
    'python': ('https://docs.python.org/3', None),
}
'''
    
    config_path = Path(SPHINX_CONFIG_DIR) / "conf.py"
    with open(config_path, 'w', encoding='utf-8') as f:
        f.write(config_content)

def create_index_rst():
    """Create index.rst file"""
    index_content = '''
Python API Documentation
========================

Welcome to the Python API documentation.

.. toctree::
   :maxdepth: 2
   :caption: Contents:

   modules

Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
'''
    
    index_path = Path(SPHINX_CONFIG_DIR) / "index.rst"
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(index_content)

def run_sphinx_apidoc():
    """Run sphinx-apidoc to generate module documentation"""
    if not Path(SPHINX_SOURCE_DIR).exists():
        print(f"Warning: Source directory {SPHINX_SOURCE_DIR} does not exist")
        print("Creating sample Python module...")
        create_sample_module()
    
    cmd = [
        'sphinx-apidoc',
        '-f',  # Force overwrite
        '-o', SPHINX_CONFIG_DIR,
        SPHINX_SOURCE_DIR
    ]
    
    try:
        subprocess.run(cmd, check=True)
        print("✓ sphinx-apidoc completed successfully")
    except subprocess.CalledProcessError as e:
        print(f"Error running sphinx-apidoc: {e}")
        return False
    return True

def run_sphinx_build():
    """Run sphinx-build to generate HTML documentation"""
    cmd = [
        'sphinx-build',
        '-b', 'html',
        SPHINX_CONFIG_DIR,
        SPHINX_BUILD_DIR
    ]
    
    try:
        subprocess.run(cmd, check=True)
        print("✓ sphinx-build completed successfully")
    except subprocess.CalledProcessError as e:
        print(f"Error running sphinx-build: {e}")
        return False
    return True

def convert_to_markdown():
    """Convert generated HTML to Markdown for MKDocs"""
    # For now, copy HTML files to output directory
    # In a more sophisticated setup, you might use pandoc or custom conversion
    
    if Path(SPHINX_BUILD_DIR).exists():
        if Path(SPHINX_OUTPUT_DIR).exists():
            shutil.rmtree(SPHINX_OUTPUT_DIR)
        shutil.copytree(SPHINX_BUILD_DIR, SPHINX_OUTPUT_DIR)
        print("✓ Sphinx documentation copied to output directory")
    
    # Create a simple index.md for MKDocs navigation
    index_md = '''# Python API Documentation

This section contains automatically generated Python API documentation.

[Browse Full Documentation](index.html)

## Modules

The Python API documentation includes:

- **Core Modules**: Main application logic
- **Utilities**: Helper functions and utilities  
- **Models**: Data models and schemas
- **Services**: Business logic services

!!! note
    This documentation is automatically generated from Python docstrings using Sphinx.
    For the most up-to-date information, refer to the source code.
'''
    
    index_path = Path(SPHINX_OUTPUT_DIR) / "index.md"
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(index_md)

def create_sample_module():
    """Create a sample Python module for demonstration"""
    sample_dir = Path(SPHINX_SOURCE_DIR)
    sample_dir.mkdir(parents=True, exist_ok=True)
    
    # Create __init__.py
    init_path = sample_dir / "__init__.py"
    with open(init_path, 'w') as f:
        f.write('"""Sample Python package for documentation demo."""\n\n__version__ = "1.0.0"\n')
    
    # Create sample module
    sample_module = '''
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
'''
    
    module_path = sample_dir / "sample_module.py"
    with open(module_path, 'w', encoding='utf-8') as f:
        f.write(sample_module)
    
    print("✓ Sample Python module created")

def main():
    """Main execution function"""
    print("Building Python documentation with Sphinx...")
    
    # Ensure directories exist
    ensure_directories()
    
    # Create Sphinx configuration
    create_sphinx_config()
    create_index_rst()
    
    # Generate module documentation
    if not run_sphinx_apidoc():
        sys.exit(1)
    
    # Build HTML documentation
    if not run_sphinx_build():
        sys.exit(1)
    
    # Convert/copy to MKDocs directory
    convert_to_markdown()
    
    print("✅ Python documentation build completed successfully!")

if __name__ == "__main__":
    main()
