-- Enable pg_trgm extension for fuzzy text search (LIKE/ILIKE with wildcards)

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN trigram index for member name search (supports ILIKE '%term%')
CREATE INDEX IF NOT EXISTS idx_members_name_trgm ON members USING gin (name gin_trgm_ops);

-- Trigram indexes for other searchable text fields
CREATE INDEX IF NOT EXISTS idx_members_email_trgm ON members USING gin (email gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_members_phone_trgm ON members USING gin (phone gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_members_address_city_trgm ON members USING gin (address_city gin_trgm_ops);

-- Also cover family groups name search
CREATE INDEX IF NOT EXISTS idx_family_groups_name_trgm ON family_groups USING gin (name gin_trgm_ops);

-- Also cover events title search
CREATE INDEX IF NOT EXISTS idx_events_title_trgm ON events USING gin (title gin_trgm_ops);

COMMENT ON EXTENSION pg_trgm IS 'Trigram text matching for ILIKE/fuzzy search';
