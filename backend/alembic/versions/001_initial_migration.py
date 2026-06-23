"""Initial migration

Revision ID: 001
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True, default=True),
        sa.Column('is_verified', sa.Boolean(), nullable=True, default=False),
        sa.Column('is_premium', sa.Boolean(), nullable=True, default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_login', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)

    # Create companies table
    op.create_table(
        'companies',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('domain', sa.String(), nullable=True),
        sa.Column('industry', sa.String(), nullable=True),
        sa.Column('size', sa.String(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('culture', sa.Text(), nullable=True),
        sa.Column('values', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('preferred_keywords', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('tech_stack', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('hiring_criteria', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('website', sa.String(), nullable=True),
        sa.Column('linkedin', sa.String(), nullable=True),
        sa.Column('careers_page', sa.String(), nullable=True),
        sa.Column('logo_url', sa.String(), nullable=True),
        sa.Column('location', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_companies_name'), 'companies', ['name'], unique=True)

    # Create resumes table
    op.create_table(
        'resumes',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=True),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('file_path', sa.String(), nullable=True),
        sa.Column('file_type', sa.String(), nullable=True),
        sa.Column('raw_text', sa.Text(), nullable=True),
        sa.Column('structured_data', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('skills', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('experience', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('education', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('certifications', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('projects', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('contact_info', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('is_primary', sa.Boolean(), nullable=True, default=False),
        sa.Column('version', sa.Integer(), nullable=True, default=1),
        sa.Column('parent_resume_id', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['parent_resume_id'], ['resumes.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create jobs table
    op.create_table(
        'jobs',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=True),
        sa.Column('company_id', sa.String(), nullable=True),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('company_name', sa.String(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('requirements', sa.Text(), nullable=True),
        sa.Column('required_skills', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('preferred_skills', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('required_experience', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('education_requirements', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('location', sa.String(), nullable=True),
        sa.Column('job_type', sa.String(), nullable=True),
        sa.Column('salary_range', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('remote_option', sa.String(), nullable=True),
        sa.Column('job_url', sa.String(), nullable=True),
        sa.Column('application_deadline', sa.DateTime(timezone=True), nullable=True),
        sa.Column('status', sa.String(), nullable=True, default='active'),
        sa.Column('priority', sa.Float(), nullable=True, default=0.0),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create analyses table
    op.create_table(
        'analyses',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=True),
        sa.Column('resume_id', sa.String(), nullable=True),
        sa.Column('job_id', sa.String(), nullable=True),
        sa.Column('overall_score', sa.Float(), nullable=True),
        sa.Column('ats_score', sa.Float(), nullable=True),
        sa.Column('keyword_match_score', sa.Float(), nullable=True),
        sa.Column('experience_match_score', sa.Float(), nullable=True),
        sa.Column('skill_match_score', sa.Float(), nullable=True),
        sa.Column('education_match_score', sa.Float(), nullable=True),
        sa.Column('matched_skills', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('missing_skills', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('matched_keywords', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('missing_keywords', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('strengths', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('weaknesses', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('improvement_areas', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('suggestions', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('recommended_changes', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('optimized_sections', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('ai_summary', sa.Text(), nullable=True),
        sa.Column('ai_recommendations', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('competitive_analysis', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('analysis_type', sa.String(), nullable=True),
        sa.Column('version', sa.Integer(), nullable=True, default=1),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['resume_id'], ['resumes.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['job_id'], ['jobs.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('analyses')
    op.drop_table('jobs')
    op.drop_table('resumes')
    op.drop_table('companies')
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')