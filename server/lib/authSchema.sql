-- Better Auth SQLite Schema
-- Save this as schema.sql or auth-schema.sql in your project

CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    emailVerified BOOLEAN NOT NULL DEFAULT false,
    name TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    image TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    banned BOOLEAN NOT NULL DEFAULT false,
    banReason TEXT,
    banExpires DATETIME
);

CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY,
    expiresAt DATETIME NOT NULL,
    token TEXT UNIQUE NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ipAddress TEXT,
    userAgent TEXT,
    userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    impersonatedBy TEXT
);

CREATE TABLE IF NOT EXISTS account (
    id TEXT PRIMARY KEY,
    accountId TEXT NOT NULL,
    providerId TEXT NOT NULL,
    userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    accessToken TEXT,
    refreshToken TEXT,
    idToken TEXT,
    accessTokenExpiresAt DATETIME,
    refreshTokenExpiresAt DATETIME,
    scope TEXT,
    password TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verification (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expiresAt DATETIME NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS passkey (
  id TEXT PRIMARY KEY,
  name TEXT,
  publicKey TEXT NOT NULL,
  userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  credentialID TEXT NOT NULL,
  counter INTEGER NOT NULL DEFAULT 0,
  deviceType TEXT NOT NULL,
  backedUp BOOLEAN NOT NULL,
  transports TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  aaguid TEXT
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_session_userId ON session(userId);
CREATE INDEX IF NOT EXISTS idx_session_token ON session(token);
CREATE INDEX IF NOT EXISTS idx_account_userId ON account(userId);
CREATE INDEX IF NOT EXISTS idx_verification_identifier ON verification(identifier);
CREATE INDEX IF NOT EXISTS idx_user_email ON user(email);