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
    ('act_015', '{"before": null, "after": {"sync_status": "completed"}}'),
    ('act_016', '{"before": {"clearance": 2, "rank": "prince"}, "after": {"clearance": 1, "rank": "king"}}'),
    ('act_017', '{"before": null, "after": {"end_system": "coolSystem"}}');

-- Insert sample data into history.records
INSERT INTO history.records (action_id, insert_time, executor_type, executor_id, executor_name, target_type, target_id, target_name, resource_type, resource_id, resource_name, midur_action) VALUES
    ('act_001', 1709280000000, 'USER', 'admin_user', 'אברהם אבינו', 'USER', 'john.doe', 'ג''ון דו', NULL, NULL, NULL, 'USER_CREATION'),
    ('act_002', 1709283600000, 'USER', 'editor_user', 'משה רבנו', 'ENTITY', 'Entity 1', 'ישות א''', NULL, NULL, NULL, 'ENTITY_EDIT'),
    ('act_003', 1709287200000, 'SYSTEM', 'system_service', 'שרת אוטומציה', 'SHOS', 'Shos 123', 'שוס 123', 'SHOS', 'shos_123', 'מערכת שוס מרכזית', 'SHOS_CREATION'),
    ('act_004', 1709290800000, 'USER', 'manager_user', 'יוסף הצדיק', 'DYNAMIC_TAG', 'Tag A', 'תגית אבטחה', NULL, NULL, NULL, 'DYNAMIC_TAG_EDIT'),
    ('act_005', 1709294400000, 'USER', 'admin_user', 'אברהם אבינו', 'DISTRIBUTION_GROUP', 'All Users Group', 'קבוצת כל המשתמשים', NULL, NULL, NULL, 'DISTRIBUTION_GROUP_CREATION'),
    ('act_006', 1709298000000, 'USER', 'super_admin', 'שלמה המלך', 'USER', 'jane.smith', 'ג''יין סמית''', NULL, NULL, NULL, 'USER_DELETION'),
    ('act_007', 1709301600000, 'USER', 'group_admin', 'דוד המלך', 'DISTRIBUTION_GROUP', 'Distribution List A', 'רשימת תפוצה א''', 'USER', 'john.doe', 'ג''ון דו', 'ADD_USER_TO_DISTRIBUTION_GROUP'),
    ('act_008', 1709305200000, 'USER', 'admin_user', 'אברהם אבינו', 'PROFILE', 'Admin Profile', 'פרופיל מנהל מערכת', NULL, NULL, NULL, 'PROFILE_CREATION'),
    ('act_009', 1709308800000, 'USER', 'sys_admin', 'יצחק אבינו', 'END_SYSTEM', 'Legacy System', 'מערכת מורשת', NULL, NULL, NULL, 'END_SYSTEM_DELETION'),
    ('act_010', 1709312400000, 'SYSTEM', 'auto_bot', 'בוט סנכרון', 'ENTITY', 'Entity 999', 'ישות 999', NULL, NULL, NULL, 'ENTITY_CREATION'),
    ('act_011', 1709316000000, 'USER', 'manager_user', 'יוסף הצדיק', 'SHOS', 'Shos 456', 'שוס 456', 'USER', 'new_mgr', 'מנהל חדש', 'ADD_MANAGER_TO_SHOS'),
    ('act_012', 1709319600000, 'USER', 'tag_manager', 'מרדכי היהודי', 'DYNAMIC_TAG', 'Tag B', 'תגית ב''', 'USER', 'tag2', 'תג דינמי 2', 'ADD_VALUE_TO_USER'),
    ('act_013', 1709323200000, 'SYSTEM', 'config_bot', 'בוט הגדרות', 'USER', 'john.doe', 'ג''ון דו', NULL, 'new_config', 'הגדרת מערכת חדשה', 'ADD_VALUE_TO_USER'),
    ('act_014', 1709326800000, 'USER', 'admin_user', 'אברהם אבינו', 'PROFILE', 'Profile X', 'פרופיל איקס', 'USER', 'user_b', 'משתמש ב''', 'ADD_USER_TO_PROFILE'),
    ('act_015', 1709330400000, 'SYSTEM', 'sync_service', 'שירות סנכרון', 'USER', 'jane.doe', 'ג''יין דו', NULL, NULL, NULL, 'USER_SYNC'),
    ('act_016', 1709334000000, 'USER', 'ethan', 'פיצפון', 'USER', 'YG', 'יותם', 'PARAMETER', 'clearance:1', 'סיווג: 1', 'ADD_VALUE_TO_USER'),
    ('act_016', 1709334000000, 'USER', 'ethan', 'פיצפון', 'USER', 'YG', 'יותם', 'PARAMETER', 'clearance:2', 'סיווג: 2', 'REMOVE_VALUE_FROM_USER'),
    ('act_016', 1709334001000, 'USER', 'ethan', 'פיצפון', 'USER', 'YG', 'יותם', 'PARAMETER', 'rank:king', 'דרגה: מלך', 'ADD_VALUE_TO_USER'),
    ('act_016', 1709334001000, 'USER', 'ethan', 'פיצפון', 'USER', 'YG', 'יותם', 'PARAMETER', 'rank:prince', 'דרגה: נסיך', 'REMOVE_VALUE_FROM_USER'),
    ('act_017', 1709334002000, 'USER', 'ethan', 'פיצפון', 'SYSTEM', 'coolSystem', 'מערכת מגניבה', NULL, NULL, NULL, 'END_SYSTEM_CREATION');


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
    ('prof_001', 'rank', 'king'),
    ('prof_001', 'rank', 'prince'),
    ('prof_001', 'clearance', '1'),
    ('prof_002', 'param_display_mode', 'val_light'),
    ('prof_002', 'param_security_level', 'val_high'),
    ('prof_003', 'param_language', 'val_english'),
    ('prof_003', 'param_display_mode', 'val_dark');

INSERT INTO api.mirage_user_premade_profiles (user_id, profile_id) VALUES
    ('user_001', 'prof_001'),
    ('user_002', 'prof_002'),
    ('user_003', 'prof_003');
