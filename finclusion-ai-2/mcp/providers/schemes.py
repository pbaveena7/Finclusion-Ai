from typing import Dict, Any
from ai.schemes.engine import SchemeEngine

class SchemesProvider:
    """Provides Discovery and Recommendations for Government Schemes."""
    
    def __init__(self):
        self.engine = SchemeEngine()
        
    @property
    def provider_name(self) -> str:
        return "Finclusion Official Scheme Engine"
        
    def discover_schemes(self, **kwargs) -> Dict[str, Any]:
        """
        Routes the MCP tool call to the SchemeEngine.
        kwargs can include age, gender, primary_goal.
        """
        response = self.engine.discover_schemes(**kwargs)
        return response.model_dump()
