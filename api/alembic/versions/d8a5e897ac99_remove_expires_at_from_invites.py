"""remove expires_at from invites

Revision ID: d8a5e897ac99
Revises: c9761932afb9
Create Date: 2025-10-19 23:01:35.089532

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "d8a5e897ac99"
down_revision: Union[str, None] = "c9761932afb9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_column("invites", "expires_at")


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column(
        "invites", sa.Column("expires_at", sa.DateTime(), nullable=True)
    )
