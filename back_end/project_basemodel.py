from pydantic import BaseModel

class ProjectCreate(BaseModel):
    project_name: str
    client: str
    amount_requested: float
    interest_rate: float
    duration_years: int
    status: str
