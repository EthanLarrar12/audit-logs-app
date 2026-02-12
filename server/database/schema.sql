CREATE SCHEMA IF NOT EXISTS history;

-- Create the enum types
CREATE TYPE history.history_actions AS ENUM (
    'USER_CREATION', 'USER_DELETION', 'USER_SYNC', 'ADD_VALUE_TO_USER', 'REMOVE_VALUE_FROM_USER',
    'ENTITY_CREATION', 'ENTITY_EDIT', 'ENTITY_DELETION',
    'SHOS_CREATION', 'SHOS_EDIT', 'SHOS_DELETION', 'ADD_USER_TO_SHOS', 'REMOVE_USER_FROM_SHOS', 'ADD_MANAGER_TO_SHOS', 'REMOVE_MANAGER_FROM_SHOS',
    'DYNAMIC_TAG_CREATION', 'DYNAMIC_TAG_EDIT', 'DYNAMIC_TAG_DELETION', 'ADD_USER_TO_DYNAMIC_TAG', 'REMOVE_USER_FROM_DYNAMIC_TAG', 'ADD_MANAGER_TO_DYNAMIC_TAG', 'REMOVE_MANAGER_FROM_DYNAMIC_TAG',
    'END_SYSTEM_CREATION', 'END_SYSTEM_EDIT', 'END_SYSTEM_DELETION',
    'PROFILE_CREATION', 'PROFILE_EDIT', 'PROFILE_DELETION', 'ADD_USER_TO_PROFILE', 'REMOVE_USER_FROM_PROFILE',
    'DISTRIBUTION_GROUP_CREATION', 'DISTRIBUTION_GROUP_EDIT', 'DISTRIBUTION_GROUP_DELETION', 'ADD_USER_TO_DISTRIBUTION_GROUP', 'REMOVE_USER_FROM_DISTRIBUTION_GROUP', 'ADD_MANAGER_TO_DISTRIBUTION_GROUP', 'REMOVE_MANAGER_FROM_DISTRIBUTION_GROUP'
);

CREATE TYPE history.mirage_object_types AS ENUM ('USER', 'ENTITY', 'SHOS', 'DYNAMIC_TAG', 'END_SYSTEM', 'PROFILE', 'DISTRIBUTION_GROUP', 'PARAMETER');

CREATE TABLE history.record_data(
    action_id TEXT PRIMARY KEY,
    changes JSONB -- target before and after
);

-- Create the table for audit_events
CREATE TABLE history.records(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    action_id TEXT NOT NULL,
    insert_time BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000),
    midur_action history.history_actions NOT NULL,
    executor_id TEXT,
    executor_name TEXT,
    executor_type history.mirage_object_types,
    target_type history.mirage_object_types,
    target_id TEXT,
    target_name TEXT,
    resource_type history.mirage_object_types,
    resource_id TEXT, -- (eg: dg value id)
    resource_name TEXT,
    FOREIGN KEY (action_id) REFERENCES history.record_data(action_id) ON DELETE CASCADE
);

CREATE SCHEMA IF NOT EXISTS api;

CREATE TABLE IF NOT EXISTS api.mirage_premade_profiles(
    id text PRIMARY KEY,
    name text NOT NULL 
);

CREATE TABLE IF NOT EXISTS api.mirage_premade_profile_digital_parameter_values(
    profile_id text not null,
    parameter_id text not null,
    value_id text not null,
    PRIMARY KEY (profile_id, parameter_id, value_id),
    FOREIGN KEY (profile_id) REFERENCES api.mirage_premade_profiles(id)
);

-- Keep in mind the actuall table is a bit different but for this current poject it shouldn't matter
-- TODO: make sure the table actually looks like this
-- TODO: make sure any postgraphile genarated queries work properly with the actual table

CREATE TABLE IF NOT EXISTS api.mirage_premade_profile_digital_parameter_values(
    profile_id text not null,
    parameter_id text not null,
    value_id text not null,
    PRIMARY KEY (profile_id, parameter_id, value_id),
    FOREIGN KEY (profile_id) REFERENCES api.mirage_premade_profiles(id)
);

CREATE TABLE IF NOT EXISTS api.mirage_premade_profile_owners(
    profile_id text,
    user_id text not null,
    PRIMARY KEY (profile_id, user_id),
    FOREIGN KEY (profile_id) REFERENCES api.mirage_premade_profiles(id)
);

-- This is a mock function with the same name and parameters as the real function
-- It is used for testing purposes
CREATE OR REPLACE FUNCTION history.get_search_filters(
    search_term TEXT,
    result_limit INTEGER DEFAULT 10,
    result_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id TEXT,
    name TEXT,
    type history.mirage_object_types
) AS $$
DECLARE
    fetch_max INTEGER := result_limit + result_offset;
BEGIN
    RETURN QUERY
    -- Qualify the outer SELECT columns with the alias 'combined_results'
    -- to resolve the ambiguity with the RETURNS TABLE column names.
    SELECT 
        combined_results.id, 
        combined_results.name, 
        combined_results.type 
    FROM (
        (
            SELECT executor_id::TEXT AS id, executor_name AS name, executor_type AS type
            FROM history.records
            WHERE executor_name ILIKE '%' || search_term || '%'
            ORDER BY executor_type, executor_name, executor_id
            LIMIT fetch_max
        )
        UNION ALL
        (
            SELECT target_id::TEXT AS id, target_name AS name, target_type AS type
            FROM history.records
            WHERE target_name ILIKE '%' || search_term || '%'
            ORDER BY target_type, target_name, target_id
            LIMIT fetch_max
        )
        UNION ALL
        (
            SELECT resource_id::TEXT AS id, resource_name AS name, resource_type AS type
            FROM history.records
            WHERE resource_name ILIKE '%' || search_term || '%'
            ORDER BY resource_type, resource_name, resource_id
            LIMIT fetch_max
        )
    ) AS combined_results
    ORDER BY combined_results.type, combined_results.name, combined_results.id
    LIMIT result_limit
    OFFSET result_offset; 
END;
$$ LANGUAGE plpgsql STABLE;