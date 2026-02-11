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
INSERT INTO history.records (action_id, insert_time, executor_id, executor_name, target_id, target_name, resource_id, resource_name, target_type, midur_action, resource_type) VALUES
    ('act_001', 1709280000000, 'admin_user', 'אברהם אבינו', 'john.doe', 'ג''ון דו', NULL, NULL, 'USER', 'USER_CREATION', NULL),
    ('act_002', 1709283600000, 'editor_user', 'משה רבנו', 'Entity 1', 'ישות א''', NULL, NULL, 'ENTITY', 'ENTITY_EDIT', NULL),
    ('act_003', 1709287200000, 'system_service', 'שרת אוטומציה', 'Shos 123', 'שוס 123', 'shos_123', 'מערכת שוס מרכזית', 'SHOS', 'SHOS_CREATION', 'SHOS'),
    ('act_004', 1709290800000, 'manager_user', 'יוסף הצדיק', 'Tag A', 'תגית אבטחה', NULL, NULL, 'DYNAMIC_TAG', 'DYNAMIC_TAG_EDIT', NULL),
    ('act_005', 1709294400000, 'admin_user', 'אברהם אבינו', 'All Users Group', 'קבוצת כל המשתמשים', NULL, NULL, 'DISTRIBUTION_GROUP', 'DISTRIBUTION_GROUP_CREATION', NULL),
    ('act_006', 1709298000000, 'super_admin', 'שלמה המלך', 'jane.smith', 'ג''יין סמית''', NULL, NULL, 'USER', 'USER_DELETION', NULL),
    ('act_007', 1709301600000, 'group_admin', 'דוד המלך', 'Distribution List A', 'רשימת תפוצה א''', 'john.doe', 'ג''ון דו', 'DISTRIBUTION_GROUP', 'ADD_USER_TO_DISTRIBUTION_GROUP', 'USER'),
    ('act_008', 1709305200000, 'admin_user', 'אברהם אבינו', 'Admin Profile', 'פרופיל מנהל מערכת', NULL, NULL, 'PROFILE', 'PROFILE_CREATION', NULL),
    ('act_009', 1709308800000, 'sys_admin', 'יצחק אבינו', 'Legacy System', 'מערכת מורשת', NULL, NULL, 'END_SYSTEM', 'END_SYSTEM_DELETION', NULL),
    ('act_010', 1709312400000, 'auto_bot', 'בוט סנכרון', 'Entity 999', 'ישות 999', NULL, NULL, 'ENTITY', 'ENTITY_CREATION', NULL),
    ('act_011', 1709316000000, 'manager_user', 'יוסף הצדיק', 'Shos 456', 'שוס 456', 'new_mgr', 'מנהל חדש', 'SHOS', 'ADD_MANAGER_TO_SHOS', 'USER'),
    ('act_012', 1709319600000, 'tag_manager', 'מרדכי היהודי', 'Tag B', 'תגית ב''', 'tag2', 'תג דינמי 2', 'DYNAMIC_TAG', 'ADD_VALUE_TO_USER', 'USER'),
    ('act_013', 1709323200000, 'config_bot', 'בוט הגדרות', 'john.doe', 'ג''ון דו', 'new_config', 'הגדרת מערכת חדשה', 'USER', 'ADD_VALUE_TO_USER', NULL),
    ('act_014', 1709326800000, 'admin_user', 'אברהם אבינו', 'Profile X', 'פרופיל איקס', 'user_b', 'משתמש ב''', 'PROFILE', 'ADD_USER_TO_PROFILE', 'USER'),
    ('act_015', 1709330400000, 'sync_service', 'שירות סנכרון', 'jane.doe', 'ג''יין דו', NULL, NULL, 'USER', 'USER_SYNC', NULL);

-- Insert sample data into api.mirage_premade_profiles
INSERT INTO api.mirage_premade_profiles (id, name) VALUES
    ('prof_001', 'פרופיל ניהול בכיר'),
    ('prof_002', 'פרופיל אבטחת מידע'),
    ('prof_003', 'פרופיל משתמש רגיל');

-- Insert sample data into api.mirage_premade_profile_digital_parameter_values
INSERT INTO api.mirage_premade_profile_digital_parameter_values (profile_id, parameter_id, value_id) VALUES
    ('prof_001', 'param_display_mode', 'val_dark'),
    ('prof_001', 'param_language', 'val_hebrew'),
    ('prof_001', 'param_notifications', 'val_enabled'),
    ('prof_002', 'param_display_mode', 'val_light'),
    ('prof_002', 'param_security_level', 'val_high'),
    ('prof_003', 'param_language', 'val_english'),
    ('prof_003', 'param_display_mode', 'val_dark');

INSERT INTO api.mirage_user_premade_profiles (user_id, profile_id) VALUES
    ('user_001', 'prof_001'),
    ('user_002', 'prof_002'),
    ('user_003', 'prof_003');
