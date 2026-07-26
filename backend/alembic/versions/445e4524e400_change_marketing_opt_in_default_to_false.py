"""change_marketing_opt_in_default_to_false

Revision ID: 445e4524e400
Revises: e80dbb2d20a1
Create Date: 2026-06-30 22:49:30.598424

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '445e4524e400'
down_revision: Union[str, Sequence[str], None] = 'e80dbb2d20a1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column('feedbacks', 'marketing_opt_in', server_default='0')


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('feedbacks', 'marketing_opt_in', server_default='1')
