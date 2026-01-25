CREATE SCHEMA IF NOT EXISTS history;

-- Create the enum types
CREATE TYPE history.mirage_actions AS ENUM (
    'USER_CREATION', 'USER_DELETION', 'USER_SYNC', 'ADD_VALUE_TO_USER', 'REMOVE_VALUE_FROM_USER',
    'ENTITY_CREATION', 'ENTITY_EDIT', 'ENTITY_DELETION',
    'SHOS_CREATION', 'SHOS_EDIT', 'SHOS_DELETION', 'ADD_USER_TO_SHOS', 'REMOVE_USER_FROM_SHOS', 'ADD_MANAGER_TO_SHOS', 'REMOVE_MANAGER_FROM_SHOS',
    'DYNAMIC_TAG_CREATION', 'DYNAMIC_TAG_EDIT', 'DYNAMIC_TAG_DELETION', 'ADD_USER_TO_DYNAMIC_TAG', 'REMOVE_USER_FROM_DYNAMIC_TAG', 'ADD_MANAGER_TO_DYNAMIC_TAG', 'REMOVE_MANAGER_FROM_DYNAMIC_TAG',
    'END_SYSTEM_CREATION', 'END_SYSTEM_EDIT', 'END_SYSTEM_DELETION',
    'PROFILE_CREATION', 'PROFILE_EDIT', 'PROFILE_DELETION', 'ADD_USER_TO_PROFILE', 'REMOVE_USER_FROM_PROFILE',
    'DISTRIBUTION_GROUP_CREATION', 'DISTRIBUTION_GROUP_EDIT', 'DISTRIBUTION_GROUP_DELETION', 'ADD_USER_TO_DISTRIBUTION_GROUP', 'REMOVE_USER_FROM_DISTRIBUTION_GROUP', 'ADD_MANAGER_TO_DISTRIBUTION_GROUP', 'REMOVE_MANAGER_FROM_DISTRIBUTION_GROUP'
);

CREATE TYPE history.mirage_object_types AS ENUM ('USER', 'ENTITY', 'SHOS', 'DYNAMIC_TAG', 'END_SYSTEM', 'PROFILE', 'DISTRIBUTION_GROUP', 'DIGITAL_VALUE');

CREATE TABLE history.record_data(
    action_id TEXT PRIMARY KEY,
    changes JSONB -- target before and after
);

-- Create the table for audit_events
CREATE TABLE IF NOT EXISTS history.records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_id TEXT NOT NULL REFERENCES history.record_data(action_id),
    updated_time BIGINT NOT NULL,
    executor TEXT NOT NULL,
    executor_name TEXT,
    target TEXT NOT NULL,
    target_name TEXT,
    resource TEXT,
    resource_name TEXT,
    executor_type history.mirage_object_types,
    target_type history.mirage_object_types,
    midur_action history.mirage_actions,
    resource_type history.mirage_object_types
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