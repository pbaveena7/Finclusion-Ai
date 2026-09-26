from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
import csv
import os
from pydantic import BaseModel

router = APIRouter()

# Global cache for the dataset
_dataset = []

def load_dataset():
    global _dataset
    if _dataset:
        return
        
    filepath = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'finclusion_100k_dataset.csv')
    
    if not os.path.exists(filepath):
        print(f"Dataset not found at {filepath}. Please generate it first.")
        return
        
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            _dataset = list(reader)
        print(f"Successfully loaded {len(_dataset)} records into memory.")
    except Exception as e:
        print(f"Error loading dataset: {e}")

class AssetResponse(BaseModel):
    id: str
    name: str
    category: str
    risk: str
    nav: float
    returns_1y: float
    returns_3y: float
    returns_5y: float
    expense_ratio: float
    aum_crores: float
    launch_date: str

class PaginatedResponse(BaseModel):
    total: int
    page: int
    page_size: int
    data: List[AssetResponse]

@router.get("/search", response_model=PaginatedResponse)
async def search_assets(
    q: Optional[str] = None,
    category: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    if not _dataset:
        load_dataset()
        
    if not _dataset:
        raise HTTPException(status_code=404, detail="Dataset not initialized")

    filtered = _dataset
    
    # Filter by category (e.g. 'Equity', 'Debt', 'Government Scheme')
    if category and category.lower() != 'all':
        filtered = [item for item in filtered if item['category'].lower() == category.lower()]
        
    # Filter by search query
    if q:
        q_lower = q.lower()
        filtered = [item for item in filtered if q_lower in item['name'].lower()]

    total = len(filtered)
    
    # Sort by AUM (largest first) to show "popular" ones first
    # Or keep original order. Let's sort by AUM.
    # filtered.sort(key=lambda x: float(x['aum_crores']), reverse=True)
    
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    
    paginated = filtered[start_idx:end_idx]
    
    # Convert types
    parsed_data = []
    for item in paginated:
        parsed_data.append(AssetResponse(
            id=item['id'],
            name=item['name'],
            category=item['category'],
            risk=item['risk'],
            nav=float(item['nav']),
            returns_1y=float(item['returns_1y']),
            returns_3y=float(item['returns_3y']),
            returns_5y=float(item['returns_5y']),
            expense_ratio=float(item['expense_ratio']),
            aum_crores=float(item['aum_crores']),
            launch_date=item['launch_date']
        ))
        
    return PaginatedResponse(
        total=total,
        page=page,
        page_size=page_size,
        data=parsed_data
    )
