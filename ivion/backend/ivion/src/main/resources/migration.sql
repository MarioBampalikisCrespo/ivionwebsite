-- Run this against iviondb before deploying the new version
-- Adds brute-force protection fields to users and the audit_logs table

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS failed_login_attempts INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS locked_until          DATETIME NULL;

CREATE TABLE IF NOT EXISTS audit_logs (
  id        BIGINT       NOT NULL AUTO_INCREMENT,
  timestamp DATETIME     NOT NULL,
  action    VARCHAR(50)  NOT NULL,
  email     VARCHAR(254) NULL,
  ip        VARCHAR(45)  NULL,
  success   TINYINT(1)   NOT NULL,
  details   VARCHAR(500) NULL,
  PRIMARY KEY (id),
  INDEX idx_audit_email     (email),
  INDEX idx_audit_timestamp (timestamp),
  INDEX idx_audit_action    (action)
);
