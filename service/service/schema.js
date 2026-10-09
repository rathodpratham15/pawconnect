// Idempotent schema, applied automatically on first connect (and by `npm run migrate`).
// Needs PostgreSQL 13+ for gen_random_uuid() (Neon is fine).
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS ngos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    registration_id TEXT NOT NULL,
    latitude        DOUBLE PRECISION NOT NULL,
    longitude       DOUBLE PRECISION NOT NULL,
    address         TEXT NOT NULL,
    contact_info    TEXT NOT NULL,
    description     TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ngos_status_idx ON ngos (status);

-- NGOs imported from external directories (e.g. Every.org) have no coordinates and carry extra links
ALTER TABLE ngos ALTER COLUMN latitude DROP NOT NULL;
ALTER TABLE ngos ALTER COLUMN longitude DROP NOT NULL;
ALTER TABLE ngos ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'registered';
ALTER TABLE ngos ADD COLUMN IF NOT EXISTS external_id TEXT;
ALTER TABLE ngos ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE ngos ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE ngos ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE ngos ADD COLUMN IF NOT EXISTS donate_url TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS ngos_source_external_idx ON ngos (source, external_id) WHERE external_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS users (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    password   TEXT NOT NULL,
    address    TEXT NOT NULL DEFAULT '',
    role       TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'NGO', 'ADMIN')),
    ngo_id     UUID REFERENCES ngos (id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pets (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name              TEXT,
    type              TEXT NOT NULL,
    breed             TEXT NOT NULL,
    age               DOUBLE PRECISION NOT NULL CHECK (age >= 0),
    size              TEXT NOT NULL,
    disability_status BOOLEAN NOT NULL,
    health_concerns   TEXT[] NOT NULL DEFAULT '{}',
    shelter_location  TEXT NOT NULL,
    image_url         TEXT
);

CREATE TABLE IF NOT EXISTS food_products (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name              TEXT NOT NULL,
    brand             TEXT NOT NULL,
    price             DOUBLE PRECISION NOT NULL,
    description       TEXT,
    nutrition_details TEXT NOT NULL,
    sold              INTEGER NOT NULL DEFAULT 0,
    image             TEXT
);

CREATE TABLE IF NOT EXISTS fundraisers (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title            TEXT NOT NULL,
    description      TEXT NOT NULL,
    target_amount    DOUBLE PRECISION NOT NULL,
    collected_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
    ngo_id           UUID NOT NULL REFERENCES ngos (id) ON DELETE CASCADE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;
