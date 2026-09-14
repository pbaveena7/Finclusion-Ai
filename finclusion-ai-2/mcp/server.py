import json
import asyncio
import sys
from typing import Dict, Any
from datetime import datetime

from mcp.tools import FINCLUSION_MCP_TOOLS
from mcp.market.providers.yfinance_impl import YFinanceProvider
from mcp.providers.calculators import CalculatorsProvider
from mcp.providers.safety import SafetyProvider
from mcp.providers.schemes import SchemesProvider

class MCPServer:
    """The massive MCP Server routing 18 tools to their respective providers."""
    
    def __init__(self):
        self.market_provider = YFinanceProvider()
        self.calc_provider = CalculatorsProvider()
        self.safety_provider = SafetyProvider()
        self.schemes_provider = SchemesProvider()
        
    def _wrap_response(self, data: Any, source: str) -> Dict[str, Any]:
        """Ensures every tool response has a source and timestamp as requested."""
        return {
            "source": source,
            "timestamp": datetime.now().isoformat(),
            "data": data
        }

    async def handle_request(self, method: str, params: Dict[str, Any]) -> Dict[str, Any]:
        try:
            if method == "list_tools":
                return {"jsonrpc": "2.0", "result": {"tools": FINCLUSION_MCP_TOOLS}}
                
            # MARKET TOOLS
            if method == "get_stock_price":
                res = await self.market_provider.get_quote(params["symbol"])
                return {"jsonrpc": "2.0", "result": self._wrap_response(res.model_dump(), self.market_provider.provider_name)}
            
            # CALCULATORS
            elif method == "calculate_sip":
                res = self.calc_provider.calculate_sip(params["monthly_investment"], params["annual_rate"], params["years"])
                return {"jsonrpc": "2.0", "result": self._wrap_response(res, self.calc_provider.provider_name)}
                
            elif method == "calculate_emi":
                # Handle optional params for advanced loan engine
                res = self.calc_provider.calculate_emi(
                    principal=params["principal"],
                    annual_rate=params["annual_rate"],
                    years=params["years"],
                    processing_fee_percent=params.get("processing_fee_percent", 0.0),
                    monthly_income=params.get("monthly_income"),
                    existing_emi=params.get("existing_emi", 0.0),
                    prepayment_amount=params.get("prepayment_amount", 0.0)
                )
                return {"jsonrpc": "2.0", "result": self._wrap_response(res, self.calc_provider.provider_name)}
                
            # SAFETY & SCHEMES
            elif method == "check_fraud_signals":
                res = self.safety_provider.check_fraud_signals(params["entity_name"])
                return {"jsonrpc": "2.0", "result": self._wrap_response(res, self.safety_provider.provider_name)}
                
            elif method == "search_government_scheme":
                res = self.schemes_provider.discover_schemes(**params)
                return {"jsonrpc": "2.0", "result": self._wrap_response(res, self.schemes_provider.provider_name)}
                
            # PERSONAL FINANCE
            elif method == "calculate_financial_health":
                res = self.calc_provider.calculate_financial_health(**params)
                return {"jsonrpc": "2.0", "result": self._wrap_response(res, self.calc_provider.provider_name)}
                
            # CATCH ALL UNIMPLEMENTED PROTOTYPE TOOLS
            elif method in [t["name"] for t in FINCLUSION_MCP_TOOLS]:
                return {"jsonrpc": "2.0", "result": self._wrap_response({"status": "Prototype: Method acknowledged but logic pending."}, "System")}
                
            else:
                return {"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}}
                
        except KeyError as e:
            return {"jsonrpc": "2.0", "error": {"code": -32602, "message": f"Missing required parameter: {str(e)}"}]
        except Exception as e:
            return {"jsonrpc": "2.0", "error": {"code": -32000, "message": str(e)}}

    async def start_stdio_loop(self):
        print("Finclusion 18-Tool MCP Server initialized. Waiting for JSON-RPC...", file=sys.stderr)
        while True:
            try:
                line = await asyncio.get_event_loop().run_in_executor(None, sys.stdin.readline)
                if not line: break
                line = line.strip()
                if not line: continue
                request = json.loads(line)
                response = await self.handle_request(request.get("method"), request.get("params", {}))
                if "id" in request: response["id"] = request["id"]
                print(json.dumps(response))
                sys.stdout.flush()
            except Exception as e:
                print(f"Error: {e}", file=sys.stderr)

if __name__ == "__main__":
    asyncio.run(MCPServer().start_stdio_loop())
