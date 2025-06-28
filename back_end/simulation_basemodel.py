from pydantic import BaseModel


class Simulation(BaseModel):
    interest_rate: float
    duration_years: int