-- Enable pg_stat_statements for query performance monitoring

CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Grant read access to authenticated users (supabase dashboard uses it)
GRANT SELECT ON pg_stat_statements TO authenticated;

COMMENT ON EXTENSION pg_stat_statements IS 'Query performance monitoring: track execution stats, frequency, and timing';

-- Quick diagnostic query (run manually to check top slow queries):
-- SELECT query, calls, total_exec_time, mean_exec_time, rows
-- FROM pg_stat_statements
-- ORDER BY mean_exec_time DESC
-- LIMIT 20;
