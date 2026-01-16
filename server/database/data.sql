-- Insert sample data into history.record_data
INSERT INTO history.record_data (action_id, changes) VALUES
    ('act_001', '{"before": null, "after": {"username": "john.doe", "role": "user"}}'),
    ('act_002', '{"before": {"name": "Old Entity"}, "after": {"name": "New Entity"}}'),
    ('act_003', '{"before": null, "after": {"shos_id": "shos_123", "level": 5}}'),
    ('act_004', '{"before": {"active": true}, "after": {"active": false}}'),
    ('act_005', '{"before": null, "after": {"group_name": "All Users"}}'),
    ('act_006', '{"before": {"username": "jane.smith"}, "after": null}'),
    ('act_007', '{"before": {"members": ["user1"]}, "after": {"members": ["user1", "john.doe"]}}'),
    ('act_008', '{"before": null, "after": {"profile_name": "Admin Profile"}}'),
    ('act_009', '{"before": {"end_system": "legacy_sys"}, "after": null}'),
    ('act_010', '{"before": null, "after": {"entity_id": "ent_999", "status": "active"}}'),
    ('act_011', '{"before": {"manager": "old_mgr"}, "after": {"manager": "new_mgr"}}'),
    ('act_012', '{"before": {"tags": ["tag1"]}, "after": {"tags": ["tag1", "tag2"]}}'),
    ('act_013', '{"before": null, "after": {"value": "new_config"}}'),
    ('act_014', '{"before": {"owner": "user_a"}, "after": {"owner": "user_b"}}'),
    ('act_015', '{"before": null, "after": {"sync_status": "completed"}}');

-- Insert sample data into history.records
INSERT INTO history.records (action_id, updated_time, executor, target, resource, target_type, midur_action, resource_type) VALUES
    ('act_001', 1709280000000, 'admin_user', 'john.doe', NULL, 'User', 'UserCreation', NULL),
    ('act_002', 1709283600000, 'editor_user', 'Entity 1', NULL, 'Entity', 'EntityEdit', NULL),
    ('act_003', 1709287200000, 'system_service', 'Shos 123', 'shos_123', 'Shos', 'ShosCreation', 'Shos'),
    ('act_004', 1709290800000, 'manager_user', 'Tag A', NULL, 'DynamicTag', 'DynamicTagEdit', NULL),
    ('act_005', 1709294400000, 'admin_user', 'All Users Group', NULL, 'DistributionGroup', 'DistributionGroupCreation', NULL),
    ('act_006', 1709298000000, 'super_admin', 'jane.smith', NULL, 'User', 'UserDeletion', NULL),
    ('act_007', 1709301600000, 'group_admin', 'Distribution List A', 'john.doe', 'DistributionGroup', 'AddUserToDistributionGroup', 'User'),
    ('act_008', 1709305200000, 'admin_user', 'Admin Profile', NULL, 'Profile', 'ProfileCreation', NULL),
    ('act_009', 1709308800000, 'sys_admin', 'Legacy System', NULL, 'EndSystem', 'EndSystemDeletion', NULL),
    ('act_010', 1709312400000, 'auto_bot', 'Entity 999', NULL, 'Entity', 'EntityCreation', NULL),
    ('act_011', 1709316000000, 'manager_user', 'Shos 456', 'new_mgr', 'Shos', 'AddManagerToShos', 'User'),
    ('act_012', 1709319600000, 'tag_manager', 'Tag B', 'tag2', 'DynamicTag', 'AddValueToUser', 'User'), -- Note: Using 'AddValueToUser' might be slightly off for tags, but sticking to valid enums
    ('act_013', 1709323200000, 'config_bot', 'john.doe', 'new_config', 'User', 'AddValueToUser', NULL),
    ('act_014', 1709326800000, 'admin_user', 'Profile X', 'user_b', 'Profile', 'AddUserToProfile', 'User'),
    ('act_015', 1709330400000, 'sync_service', 'jane.doe', NULL, 'User', 'UserSync', NULL);
