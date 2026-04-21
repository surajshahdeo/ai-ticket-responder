from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database import get_db
from app.schemas.ticket import TicketCreate, TicketResponse, TicketUpdate, APIResponse
from app.services import ticket_service

router = APIRouter(prefix="/api/tickets", tags=["Tickets"])
limiter = Limiter(key_func=get_remote_address)


@router.post("", response_model=APIResponse, status_code=201)
@limiter.limit("10/minute")
async def create_ticket(
    request: Request,
    ticket: TicketCreate,
    db: Session = Depends(get_db)
):
    try:
        new_ticket = await ticket_service.create_ticket(db, ticket)
        return APIResponse(
            success=True,
            message="Ticket submitted! You will receive a reply soon.",
            data=new_ticket
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create ticket: {str(e)}")


@router.get("", response_model=List[TicketResponse])
def get_tickets(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    status: Optional[str] = Query(default=None),
    category: Optional[str] = Query(default=None),
    db: Session = Depends(get_db)
):
    return ticket_service.get_all_tickets(db, skip, limit, status, category)


@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(ticket_id: UUID, db: Session = Depends(get_db)):
    ticket = ticket_service.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@router.put("/{ticket_id}/update", response_model=APIResponse)
def update_ticket(
    ticket_id: UUID,
    update_data: TicketUpdate,
    db: Session = Depends(get_db)
):
    updated = ticket_service.update_ticket(db, ticket_id, update_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return APIResponse(
        success=True,
        message="Ticket updated with AI response",
        data=updated
    )