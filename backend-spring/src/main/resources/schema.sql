-- ==============================================================================
-- CIVITAS MUNICIPAL PLATFORM - PostgreSQL + PostGIS Schema DDL
-- Multi-tenant municipality architecture with spatial indexing for fast deduplication
-- ==============================================================================

-- Enable PostGIS extension for spatial queries
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Municipalities Table (Multi-tenant)
CREATE TABLE IF NOT EXISTS municipalities (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    province VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    center_location GEOMETRY(Point, 4326),
    zoom_level INT DEFAULT 15,
    population INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Municipal Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(36) PRIMARY KEY,
    municipality_id VARCHAR(36) REFERENCES municipalities(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Users & RBAC Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    municipality_id VARCHAR(36) REFERENCES municipalities(id) ON DELETE SET NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(30) NOT NULL CHECK (role IN ('ROLE_CITIZEN', 'ROLE_EMPLOYEE', 'ROLE_MUNICIPAL_ADMIN', 'ROLE_SUPERADMIN')),
    department_id VARCHAR(36) REFERENCES departments(id) ON DELETE SET NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Incidents Table (with Spatial Point and Priority Algorithm)
CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(36) PRIMARY KEY,
    tracking_code VARCHAR(30) UNIQUE NOT NULL,
    municipality_id VARCHAR(36) NOT NULL REFERENCES municipalities(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    urgency VARCHAR(20) NOT NULL CHECK (urgency IN ('baja', 'media', 'alta', 'urgente')),
    priority_score INT DEFAULT 50,
    status VARCHAR(30) NOT NULL DEFAULT 'recibida' CHECK (status IN ('recibida', 'validando', 'asignada', 'en_proceso', 'resuelta', 'cerrada')),
    assigned_department_id VARCHAR(36) REFERENCES departments(id) ON DELETE SET NULL,
    assigned_employee_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    citizen_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    address TEXT,
    location GEOMETRY(Point, 4326) NOT NULL,
    adherents_count INT DEFAULT 1,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spatial index for sub-millisecond <50m duplicate detection
CREATE INDEX IF NOT EXISTS idx_incidents_location_gist ON incidents USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_incidents_mun_status ON incidents (municipality_id, status);

-- 5. Incident Images & Attachments
CREATE TABLE IF NOT EXISTS incident_images (
    id VARCHAR(36) PRIMARY KEY,
    incident_id VARCHAR(36) REFERENCES incidents(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type VARCHAR(20) DEFAULT 'INITIAL' CHECK (image_type IN ('INITIAL', 'RESOLUTION')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Incident Status History & Audit Log
CREATE TABLE IF NOT EXISTS incident_history (
    id VARCHAR(36) PRIMARY KEY,
    incident_id VARCHAR(36) REFERENCES incidents(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    comment TEXT,
    performed_by_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Citizen Suggestions & Participatory Budget
CREATE TABLE IF NOT EXISTS suggestions (
    id VARCHAR(36) PRIMARY KEY,
    municipality_id VARCHAR(36) NOT NULL REFERENCES municipalities(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    author_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    votes_count INT DEFAULT 1,
    status VARCHAR(30) DEFAULT 'recibida' CHECK (status IN ('recibida', 'en_estudio', 'aprobada', 'en_ejecucion', 'desestimada')),
    budget_estimate VARCHAR(50),
    official_response TEXT,
    converted_to_project BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Suggestion Votes (Ensuring 1 citizen 1 vote)
CREATE TABLE IF NOT EXISTS suggestion_votes (
    suggestion_id VARCHAR(36) REFERENCES suggestions(id) ON DELETE CASCADE,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (suggestion_id, user_id)
);

-- 9. General System Audit Logs (GDPR / ENS compliant)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    municipality_id VARCHAR(36) REFERENCES municipalities(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL,
    details TEXT,
    performed_by VARCHAR(150),
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
