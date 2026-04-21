from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from uuid import UUID
import httpx
import logging

from app.models.ticket import Ticket
from app.schemas.ticket import TicketCreate, TicketUpdate
from app.config import settings

logger = logging.getLogger(__name__)


async def create_ticket(db: Session, ticket_data: TicketCreate) -> Ticket:
    db_ticket = Ticket(
        name=ticket_data.name,
        email=ticket_data.email,
        subject=ticket_data.subject,
        message=ticket_data.message,
        status="pending"
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    logger.info(f"Ticket created: {db_ticket.id}")
    await trigger_n8n_webhook(db, db_ticket)
    return db_ticket


async def trigger_n8n_webhook(db: Session, ticket: Ticket) -> None:
    try:
        ticket.status = "processing"
        db.commit()

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                settings.N8N_WEBHOOK_URL,
                json={
                    "ticket_id": str(ticket.id),
                    "name": ticket.name,
                    "email": ticket.email,
                    "subject": ticket.subject,
                    "message": ticket.message,
                    "callback_url": f"http://host.docker.internal:8000/api/tickets/{ticket.id}/update"
                }
            )
            response.raise_for_status()
            logger.info(f"n8n triggered for ticket: {ticket.id}")

    except httpx.RequestError as e:
        logger.warning(f"n8n not available: {e}. Ticket stays pending.")
        ticket.status = "pending"
        db.commit()
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        ticket.status = "pending"
        db.commit()


def get_all_tickets(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    status: Optional[str] = None,
    category: Optional[str] = None
) -> List[Ticket]:
    query = db.query(Ticket)
    if status:
        query = query.filter(Ticket.status == status)
    if category:
        query = query.filter(Ticket.category == category)
    return query.order_by(desc(Ticket.created_at)).offset(skip).limit(limit).all()


def get_ticket_by_id(db: Session, ticket_id: UUID) -> Optional[Ticket]:
    return db.query(Ticket).filter(Ticket.id == ticket_id).first()


def update_ticket(db: Session, ticket_id: UUID, update_data: TicketUpdate) -> Optional[Ticket]:
    ticket = get_ticket_by_id(db, ticket_id)
    if not ticket:
        return None
    if update_data.category is not None:
        ticket.category = update_data.category
    if update_data.ai_reply is not None:
        ticket.ai_reply = update_data.ai_reply
    if update_data.status is not None:
        ticket.status = update_data.status
    db.commit()
    db.refresh(ticket)
    logger.info(f"Ticket updated: {ticket_id}")
    return ticket