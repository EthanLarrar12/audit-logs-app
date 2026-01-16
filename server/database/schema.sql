CREATE SCHEMA IF NOT EXISTS history;

-- Create the enum types
CREATE TYPE history.mirage_actions AS ENUM (
    'UserCreation', 'UserDeletion', 'UserSync', 'AddValueToUser', 'RemoveValueFromUser',
    'EntityCreation', 'EntityEdit', 'EntityDeletion',
    'ShosCreation', 'ShosEdit', 'ShosDeletion', 'AddUserToShos', 'RemoveUserFromShos', 'AddManagerToShos', 'RemoveManagerFromShos',
    'DynamicTagCreation', 'DynamicTagEdit', 'DynamicTagDeletion', 'AddUserToDynamicTag', 'RemoveUserFromDynamicTag', 'AddManagerToDynamicTag', 'RemoveManagerFromDynamicTag',
    'EndSystemCreation', 'EndSystemEdit', 'EndSystemDeletion',
    'ProfileCreation', 'ProfileEdit', 'ProfileDeletion', 'AddUserToProfile', 'RemoveUserFromProfile',
    'DistributionGroupCreation', 'DistributionGroupEdit', 'DistributionGroupDeletion', 'AddUserToDistributionGroup', 'RemoveUserFromDistributionGroup', 'AddManagerToDistributionGroup', 'RemoveManagerFromDistributionGroup'
);

CREATE TYPE history.mirage_object_types AS ENUM ('User', 'Entity', 'Shos', 'DynamicTag', 'EndSystem', 'Profile', 'DistributionGroup');

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
    target TEXT NOT NULL,
    resource TEXT,
    target_type history.mirage_object_types,
    midur_action history.mirage_actions,
    resource_type history.mirage_object_types
);
