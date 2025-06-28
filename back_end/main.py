from decimal import Decimal
from fastapi import Depends, FastAPI, HTTPException, Query
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from requests import Session

from simulation_basemodel import Simulation
from database import SessionLocal
from project_basemodel import ProjectCreate
from models import Project
from utils import generate_id

from fastapi.responses import FileResponse, JSONResponse
from openpyxl import Workbook

import gspread
from oauth2client.service_account import ServiceAccountCredentials

smartfin=FastAPI()

smartfin.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@smartfin.get("/")
async def hello():
    return "Hello smartfin"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@smartfin.get("/Project_List/")
def read_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    return projects

@smartfin.post("/Add_project")
async def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    generated_id = generate_id()
    db_project = Project(id=generated_id,**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@smartfin.delete("/Project_Delete")
async def delete_project(id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Oops! Project not found.")
   
    db.delete(project)
    db.commit()
    return {f"message": "You removed a Project with an id of : {project.id}"}





@smartfin.get("/Loan_Simulator/{project_id}")
def simulate_loan(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    try:
        monthly, total = calculate_loan(
            float(project.amount_requested),
            float(project.interest_rate),
            int(project.duration_years)
        )
        return {
            "project_id": project_id,
            "monthly_payment": monthly,
            "total_cost": total
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")


        
@smartfin.get("/Export_Projects/projects")
def export_projects(format: str = Query("excel"), details: str = Query("basic"), db: Session = Depends(get_db)):
    projects = get_projects_with_or_without_loans(details, db)

    if format == "excel":
        return export_to_excel(projects)
    elif format == "google":
        result = export_to_google_sheets(projects)
        print("Returned from export_to_google_sheets:", result)
        return JSONResponse(content=result)








def calculate_loan(P: float, rate: float, duration_years: int):
    r = rate / 100 / 12
    n = duration_years * 12

    if n == 0:
        raise ValueError("Loan duration must be more than 0")

    if r == 0:
        monthly_payment = P / n
    else:
        monthly_payment = P * r * ((1 + r) ** n) / (((1 + r) ** n) - 1)

    total_cost = monthly_payment * n

    return round(monthly_payment, 2), round(total_cost, 2) #rounded to 2 decimal places (like 4390.28)



  
def get_projects_with_or_without_loans(details: str, db: Session):
    projects = db.query(Project).all()
    results = []

    for p in projects:
        proj_dict = {
            "id": p.id,
            "project_name": p.project_name,
            "client": p.client,
            "amount_requested": p.amount_requested,
            "interest_rate": p.interest_rate,
            "duration_years": p.duration_years,
            "status": p.status
        }

        if details == "withLoan":
            monthly_payment, total_cost = calculate_loan(
                float(p.amount_requested),
                float(p.interest_rate),
                int(p.duration_years)
            )
            proj_dict["monthly_payment"] = monthly_payment
            proj_dict["total_cost"] = total_cost

        results.append(proj_dict)

    return results





def export_to_excel(projects):
    wb = Workbook()
    ws = wb.active

    # Dynamically get column headers from keys
    headers = list(projects[0].keys()) if projects else []
    ws.append(headers)

    for project in projects:
        ws.append([project.get(k, "") for k in headers])

    filename = "projects.xlsx"
    wb.save(filename)

    return FileResponse(
        filename,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=filename
    )


def export_to_google_sheets(projects):
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive"
    ]
    creds = ServiceAccountCredentials.from_json_keyfile_name("credentials.json", scope)
    client = gspread.authorize(creds)

    spreadsheet = client.create("Exported Projects")
    sheet = spreadsheet.sheet1
    spreadsheet.share(None, perm_type="anyone", role="writer")

    if projects:
        headers = list(projects[0].keys())
        sheet.append_row(headers)

        for proj in projects:
            sheet.append_row([safe_value(proj.get(k, "")) for k in headers])
            

    return {"url": spreadsheet.url}

def safe_value(value):
    if isinstance(value, Decimal):
        return float(value)  
    return value