-- CivicOS PostgreSQL Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255),
    display_name VARCHAR(255),
    photo_url TEXT,
    reporting_points INT DEFAULT 0,
    verification_points INT DEFAULT 0,
    community_points INT DEFAULT 0,
    total_points INT DEFAULT 0,
    rank_name VARCHAR(50) DEFAULT 'Citizen',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Issues
CREATE TABLE IF NOT EXISTS issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(20) UNIQUE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(30) DEFAULT 'reported',
    reported_by UUID REFERENCES users(id),
    reporter_name VARCHAR(255),
    ward VARCHAR(100),
    affected_population INT DEFAULT 0,
    priority_score INT DEFAULT 0,
    trust_score INT DEFAULT 50,
    economic_impact BIGINT DEFAULT 0,
    upvotes INT DEFAULT 0,
    verification_count INT DEFAULT 0,
    ai_category VARCHAR(50),
    ai_confidence INT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Issue verifications
CREATE TABLE IF NOT EXISTS issue_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    action VARCHAR(20) NOT NULL, -- 'confirm', 'reject'
    evidence_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Issue status history
CREATE TABLE IF NOT EXISTS issue_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    from_status VARCHAR(30),
    to_status VARCHAR(30),
    changed_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Road segments
CREATE TABLE IF NOT EXISTS road_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(20),
    name VARCHAR(255),
    ward VARCHAR(100),
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Road scores
CREATE TABLE IF NOT EXISTS road_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    segment_id UUID REFERENCES road_segments(id) ON DELETE CASCADE,
    road_quality_score INT DEFAULT 70,
    safety_score INT DEFAULT 70,
    flood_risk_score INT DEFAULT 30,
    infrastructure_health_score INT DEFAULT 70,
    measured_at TIMESTAMP DEFAULT NOW()
);

-- Predictions
CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_type VARCHAR(50),
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    probability DECIMAL(5, 4),
    expected_date DATE,
    reason TEXT,
    ward VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Authority actions
CREATE TABLE IF NOT EXISTS authority_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    action_type VARCHAR(50),
    assigned_to VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    issue_id UUID REFERENCES issues(id),
    message TEXT,
    type VARCHAR(30) DEFAULT 'info',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Rewards
CREATE TABLE IF NOT EXISTS rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    points INT,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Community ranks
CREATE TABLE IF NOT EXISTS community_ranks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) UNIQUE,
    rank_name VARCHAR(50),
    total_points INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_issues_type ON issues(type);
CREATE INDEX IF NOT EXISTS idx_issues_severity ON issues(severity);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_ward ON issues(ward);
CREATE INDEX IF NOT EXISTS idx_issues_lat_lng ON issues(lat, lng);
CREATE INDEX IF NOT EXISTS idx_predictions_type ON predictions(issue_type);
CREATE INDEX IF NOT EXISTS idx_verifications_issue ON issue_verifications(issue_id);
