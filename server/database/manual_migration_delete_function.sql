
-- Function to delete history records by time range
CREATE OR REPLACE FUNCTION history.delete_audit_history(start_date text DEFAULT NULL, end_date text DEFAULT NULL)
RETURNS integer AS $$
DECLARE
    deleted_count integer;
    start_ts bigint;
    end_ts bigint;
BEGIN
    -- Convert ISO strings to timestamps (milliseconds) if provided
    IF start_date IS NOT NULL THEN
        start_ts := EXTRACT(EPOCH FROM start_date::timestamp) * 1000;
    END IF;

    IF end_date IS NOT NULL THEN
        end_ts := EXTRACT(EPOCH FROM end_date::timestamp) * 1000;
    END IF;

    -- Basic validation to ensure at least one param is provided
    IF start_ts IS NULL AND end_ts IS NULL THEN
        RAISE EXCEPTION 'At least one of start_date or end_date must be provided';
    END IF;

    WITH deleted_rows AS (
        DELETE FROM history.records
        WHERE 
            (start_ts IS NULL OR insert_time >= start_ts)
            AND
            (end_ts IS NULL OR insert_time <= end_ts)
        RETURNING 1
    )
    SELECT COUNT(*) INTO deleted_count FROM deleted_rows;

    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql VOLATILE;
