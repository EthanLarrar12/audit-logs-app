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
INSERT INTO history.records (action_id, insert_time, executor_type, executor_id, executor_name, target_type, target_id, target_name, resource_type, resource_id, resource_name, history_action) VALUES
    ('act_001', 1709280000000, 'USER', 'admin_user', 'אברהם אבינו', 'USER', 'john.doe', 'ג''ון דו', NULL, NULL, NULL, 'MANDAT_USER_CREATED'),
    ('act_002', 1709283600000, 'USER', 'editor_user', 'משה רבנו', 'ENTITY', 'Entity 1', 'ישות א''', NULL, NULL, NULL, 'ENTITY_EDIT'),
    ('act_003', 1709287200000, 'SYSTEM', 'system_service', 'שרת אוטומציה', 'SHOS', 'Shos 123', 'שוס 123', 'SHOS', 'shos_123', 'מערכת שוס מרכזית', 'SHOS_CREATION'),
    ('act_004', 1709290800000, 'USER', 'manager_user', 'יוסף הצדיק', 'DYNAMIC_TAG', 'Tag A', 'תגית אבטחה', NULL, NULL, NULL, 'DYNAMIC_TAG_EDIT'),
    ('act_005', 1709294400000, 'USER', 'admin_user', 'אברהם אבינו', 'DISTRIBUTION_GROUP', 'All Users Group', 'קבוצת כל המשתמשים', NULL, NULL, NULL, 'DISTRIBUTION_GROUP_CREATION'),
    ('act_006', 1709298000000, 'USER', 'super_admin', 'שלמה המלך', 'USER', 'jane.smith', 'ג''יין סמית''', NULL, NULL, NULL, 'MANDAT_USER_DELETED'),
    ('act_007', 1709301600000, 'USER', 'group_admin', 'דוד המלך', 'DISTRIBUTION_GROUP', 'Distribution List A', 'רשימת תפוצה א''', 'USER', 'john.doe', 'ג''ון דו', 'ADD_USER_TO_DISTRIBUTION_GROUP'),
    ('act_008', 1709305200000, 'USER', 'admin_user', 'אברהם אבינו', 'PROFILE', 'Admin Profile', 'פרופיל מנהל מערכת', NULL, NULL, NULL, 'PROFILE_CREATION'),
    ('act_009', 1709308800000, 'USER', 'sys_admin', 'יצחק אבינו', 'END_SYSTEM', 'Legacy System', 'מערכת מורשת', NULL, NULL, NULL, 'END_SYSTEM_DELETION'),
    ('act_010', 1709312400000, 'SYSTEM', 'auto_bot', 'בוט סנכרון', 'ENTITY', 'Entity 999', 'ישות 999', NULL, NULL, NULL, 'ENTITY_CREATION'),
    ('act_011', 1709316000000, 'USER', 'manager_user', 'יוסף הצדיק', 'SHOS', 'Shos 456', 'שוס 456', 'USER', 'new_mgr', 'מנהל חדש', 'ADD_MANAGER_TO_SHOS'),
    ('act_012', 1709319600000, 'USER', 'tag_manager', 'מרדכי היהודי', 'DYNAMIC_TAG', 'Tag B', 'תגית ב''', 'USER', 'tag2', 'תג דינמי 2', 'MANDAT_USER_PROFILE_DG_PARAMS_ADDED'),
    ('act_013', 1709323200000, 'SYSTEM', 'config_bot', 'בוט הגדרות', 'USER', 'john.doe', 'ג''ון דו', NULL, 'new_config', 'הגדרת מערכת חדשה', 'MANDAT_USER_PROFILE_DG_PARAMS_ADDED'),
    ('act_014', 1709326800000, 'USER', 'admin_user', 'אברהם אבינו', 'PROFILE', 'Profile X', 'פרופיל איקס', 'USER', 'user_b', 'משתמש ב''', 'ADD_USER_TO_PROFILE'),
    ('act_015', 1709330400000, 'SYSTEM', 'sync_service', 'שירות סנכרון', 'USER', 'jane.doe', 'ג''יין דו', NULL, NULL, NULL, 'MANDAT_USER_SYNCED'),
    ('act_016', 1709334000000, 'USER', 'ethan', 'פיצפון', 'USER', 'YG', 'יותם', 'PARAMETER', 'clearance:1', 'סיווג: 1', 'MANDAT_USER_PROFILE_DG_PARAMS_ADDED'),
    ('act_016', 1709334000000, 'USER', 'ethan', 'פיצפון', 'USER', 'YG', 'יותם', 'PARAMETER', 'clearance:2', 'סיווג: 2', 'MANDAT_USER_PROFILE_DG_PARAMS_REMOVED'),
    ('act_016', 1709334001000, 'USER', 'ethan', 'פיצפון', 'USER', 'YG', 'יותם', 'PARAMETER', 'rank:king', 'דרגה: מלך', 'MANDAT_USER_PROFILE_DG_PARAMS_ADDED'),
    ('act_016', 1709334001000, 'USER', 'ethan', 'פיצפון', 'USER', 'YG', 'יותם', 'PARAMETER', 'rank:prince', 'דרגה: נסיך', 'MANDAT_USER_PROFILE_DG_PARAMS_REMOVED'),
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

INSERT INTO api.mirage_premade_profile_owners (user_id, profile_id) VALUES
    ('user_001', 'prof_001'),
    ('user_002', 'prof_002'),
    ('user_003', 'prof_003');

-- Insert more sample data for pagination testing
INSERT INTO history.record_data (action_id, changes) VALUES
    ('act_018', '{"before": null, "after": {"username": "paginate.user1", "role": "user"}}'),
    ('act_019', '{"before": {"status": "inactive"}, "after": {"status": "active"}}'),
    ('act_020', '{"before": null, "after": {"group": "Test Group 1"}}'),
    ('act_021', '{"before": {"level": 1}, "after": {"level": 2}}'),
    ('act_022', '{"before": null, "after": {"config": "v2"}}'),
    ('act_023', '{"before": {"owner": "old"}, "after": {"owner": "new"}}'),
    ('act_024', '{"before": null, "after": {"tag": "security"}}'),
    ('act_025', '{"before": {"enabled": false}, "after": {"enabled": true}}'),
    ('act_026', '{"before": null, "after": {"note": "Audit log test"}}'),
    ('act_027', '{"before": {"quota": 10}, "after": {"quota": 20}}'),
    ('act_028', '{"before": null, "after": {"alert": "high"}}'),
    ('act_029', '{"before": {"archived": false}, "after": {"archived": true}}'),
    ('act_030', '{"before": null, "after": {"system": "backup"}}'),
    ('act_031', '{"before": {"retention": 30}, "after": {"retention": 60}}'),
    ('act_032', '{"before": null, "after": {"policy": "strict"}}'),
    ('act_033', '{"before": {"access": "read"}, "after": {"access": "write"}}'),
    ('act_034', '{"before": null, "after": {"job": "nightly_sync"}}'),
    ('act_035', '{"before": {"priority": "low"}, "after": {"priority": "medium"}}'),
    ('act_036', '{"before": null, "after": {"segment": "A"}}'),
    ('act_037', '{"before": {"limit": 100}, "after": {"limit": 200}}'),
    ('act_038', '{"before": null, "after": {"feature": "beta_access"}}'),
    ('act_039', '{"before": {"mode": "dev"}, "after": {"mode": "prod"}}'),
    ('act_040', '{"before": null, "after": {"notification": "email"}}');

INSERT INTO history.records (action_id, insert_time, executor_type, executor_id, executor_name, target_type, target_id, target_name, resource_type, resource_id, resource_name, history_action) VALUES
    ('act_018', 1709337600000, 'USER', 'tester1', 'בודק ראשון', 'USER', 'user_p1', 'משתמש עמוד 1', NULL, NULL, NULL, 'MANDAT_USER_CREATED'),
    ('act_019', 1709341200000, 'SYSTEM', 'auto_fix', 'תיקון אוטומטי', 'ENTITY', 'ent_p1', 'ישות עמוד 1', NULL, NULL, NULL, 'ENTITY_EDIT'),
    ('act_020', 1709344800000, 'USER', 'admin_x', 'מנהל איקס', 'DISTRIBUTION_GROUP', 'group_p1', 'קבוצה בדיקה 1', NULL, NULL, NULL, 'DISTRIBUTION_GROUP_CREATION'),
    ('act_021', 1709348400000, 'USER', 'manager_y', 'מנהל וואי', 'SHOS', 'shos_p1', 'שוס בדיקה 1', NULL, NULL, NULL, 'SHOS_CREATION'),
    ('act_022', 1709352000000, 'SYSTEM', 'deploy_bot', 'בוט דיפלוי', 'SYSTEM', 'sys_p1', 'מערכת בדיקה 1', NULL, NULL, NULL, 'END_SYSTEM_CREATION'),
    ('act_023', 1709355600000, 'USER', 'tester2', 'בודק שני', 'USER', 'user_p2', 'משתמש עמוד 2', NULL, NULL, NULL, 'MANDAT_USER_PROFILE_DG_PARAMS_ADDED'), -- Was USER_EDIT
    ('act_024', 1709359200000, 'USER', 'sec_admin', 'מנהל אבטחה', 'DYNAMIC_TAG', 'tag_p1', 'תגית בדיקה 1', NULL, NULL, NULL, 'DYNAMIC_TAG_CREATION'),
    ('act_025', 1709362800000, 'SYSTEM', 'scheduler', 'מתזמן', 'PROFILE', 'prof_p1', 'פרופיל בדיקה 1', NULL, NULL, NULL, 'PROFILE_EDIT'),
    ('act_026', 1709366400000, 'USER', 'auditor', 'מבקר מערכת', 'USER', 'user_p3', 'משתמש עמוד 3', NULL, NULL, NULL, 'MANDAT_USER_SYNCED'), -- Was NOTE_ADDED
    ('act_027', 1709370000000, 'USER', 'admin_z', 'מנהל זד', 'ENTITY', 'ent_p2', 'ישות עמוד 2', NULL, NULL, NULL, 'ENTITY_EDIT'),
    ('act_028', 1709373600000, 'SYSTEM', 'monitor', 'ניטור', 'SHOS', 'shos_p2', 'שוס בדיקה 2', NULL, NULL, NULL, 'SHOS_EDIT'), -- Was ALERT_TRIGGERED
    ('act_029', 1709377200000, 'USER', 'archiver', 'ארכיונאי', 'DISTRIBUTION_GROUP', 'group_p2', 'קבוצה בדיקה 2', NULL, NULL, NULL, 'DISTRIBUTION_GROUP_DELETION'), -- Was DISTRIBUTION_GROUP_ARCHIVE
    ('act_030', 1709380800000, 'SYSTEM', 'backup_svc', 'שירות גיבוי', 'SYSTEM', 'sys_p2', 'מערכת בדיקה 2', NULL, NULL, NULL, 'END_SYSTEM_EDIT'), -- Was BACKUP_STARTED
    ('act_031', 1709384400000, 'USER', 'policy_mgr', 'מנהל מדיניות', 'PROFILE', 'prof_p2', 'פרופיל בדיקה 2', NULL, NULL, NULL, 'PROFILE_EDIT'), -- Was POLICY_UPDATE
    ('act_032', 1709388000000, 'USER', 'compliance', 'ציות', 'DYNAMIC_TAG', 'tag_p2', 'תגית בדיקה 2', NULL, NULL, NULL, 'DYNAMIC_TAG_EDIT'), -- Was TAG_UPDATE
    ('act_033', 1709391600000, 'USER', 'dev_lead', 'ראש צוות פיתוח', 'USER', 'user_p4', 'משתמש עמוד 4', NULL, NULL, NULL, 'MANDAT_USER_PROFILE_DG_PARAMS_ADDED'), -- Was PERMISSION_CHANGE
    ('act_034', 1709395200000, 'SYSTEM', 'cron', 'קרון', 'SYSTEM', 'sys_p3', 'מערכת בדיקה 3', NULL, NULL, NULL, 'END_SYSTEM_EDIT'), -- Was JOB_STARTED
    ('act_035', 1709398800000, 'USER', 'pm', 'מנהל מוצר', 'ENTITY', 'ent_p3', 'ישות עמוד 3', NULL, NULL, NULL, 'ENTITY_EDIT'), -- Was PRIORITY_CHANGE
    ('act_036', 1709402400000, 'USER', 'marketing', 'שיווק', 'DISTRIBUTION_GROUP', 'group_p3', 'קבוצה בדיקה 3', NULL, NULL, NULL, 'DISTRIBUTION_GROUP_EDIT'), -- Was SEGMENT_CHANGE
    ('act_037', 1709406000000, 'SYSTEM', 'limiter', 'מגביל עומס', 'SHOS', 'shos_p3', 'שוס בדיקה 3', NULL, NULL, NULL, 'SHOS_EDIT'), -- Was LIMIT_UPDATE
    ('act_038', 1709409600000, 'USER', 'beta_tester', 'בודק בטא', 'PROFILE', 'prof_p3', 'פרופיל בדיקה 3', NULL, NULL, NULL, 'PROFILE_EDIT'), -- Was FEATURE_ENABLE
    ('act_039', 1709413200000, 'USER', 'ops', 'תפעול', 'SYSTEM', 'sys_p4', 'מערכת בדיקה 4', NULL, NULL, NULL, 'END_SYSTEM_EDIT'), -- Was MODE_SWITCH
    ('act_040', 1709416800000, 'SYSTEM', 'notifier', 'מערכת התראות', 'USER', 'user_p5', 'משתמש עמוד 5', NULL, NULL, NULL, 'MANDAT_USER_SYNCED'); -- Was NOTIFICATION_SENT

-- Insert sample data for a large object with partial changes
INSERT INTO history.record_data (action_id, changes) VALUES
    ('act_big_001', '{
    "before": {
        "id": "usr_9999",
        "username": "complex.user",
        "email": "complex@example.com",
        "fullName": "Complex User Profile",
        "department": "IT Operations",
        "role": "System Administrator",
        "status": "Active",
        "phoneNumber": "555-0100",
        "address": {
            "street": "123 Main St",
            "city": "Tech City",
            "zip": "90210",
            "country": "Israel"
        },
        "preferences": {
            "theme": "dark",
            "notifications": {
                "email": true,
                "push": false,
                "sms": true
            },
            "security": {
                "2fa": true,
                "recoveryEmail": "admin@example.com"
            },
            "dashboard": {
                "widgets": ["cpu", "memory", "disk"],
                "refreshRate": 30
            }
        },
        "permissions": ["read:all", "write:logs", "delete:temp"]
    },
    "after": {
        "id": "usr_9999",
        "username": "complex.user",
        "email": "complex.updated@example.com",
        "fullName": "Complex User Profile",
        "department": "IT Operations",
        "role": "Senior System Administrator",
        "status": "Active",
        "phoneNumber": "555-0100",
        "address": {
            "street": "123 Main St",
            "city": "Tech City",
            "zip": "90210",
            "country": "Israel"
        },
        "preferences": {
            "theme": "dark",
            "notifications": {
                "email": true,
                "push": true, 
                "sms": true
            },
            "security": {
                "2fa": true,
                "recoveryEmail": "admin@example.com"
            },
            "dashboard": {
                "widgets": ["cpu", "memory", "disk", "network"],
                "refreshRate": 30
            }
        },
        "permissions": ["read:all", "write:logs", "delete:temp", "manage:users"]
    }
}');

INSERT INTO history.records (action_id, insert_time, executor_type, executor_id, executor_name, target_type, target_id, target_name, resource_type, resource_id, resource_name, history_action) VALUES
    ('act_big_001', 1709420400000, 'USER', 'tester_big', 'בודק גדול', 'USER', 'complex_user', 'משתמש מורכב', NULL, NULL, NULL, 'MANDAT_USER_PROFILE_DG_PARAMS_ADDED');

INSERT INTO history.record_data (action_id, changes) VALUES
    ('act_array_001', '{"before": {"tags": ["A", "B", "C"]}, "after": {"tags": ["C", "A", "B"]}}');

INSERT INTO history.records (action_id, insert_time, executor_type, executor_id, executor_name, target_type, target_id, target_name, resource_type, resource_id, resource_name, history_action) VALUES
    ('act_array_001', 1709424000000, 'USER', 'tester_array', 'בודק מערכים', 'USER', 'array_user', 'משתמש מערך', NULL, NULL, NULL, 'MANDAT_USER_PROFILE_DG_PARAMS_ADDED');

-- Insert sample dictionary data for English to Hebrew translation in Extra Details
INSERT INTO api.digital_parameters (id, name) VALUES
    ('username', 'שם משתמש'),
    ('role', 'תפקיד'),
    ('name', 'שם ישות'),
    ('shos_id', 'מזהה שוס'),
    ('level', 'רמה'),
    ('active', 'פעיל'),
    ('group_name', 'שם קבוצה'),
    ('members', 'חברים'),
    ('profile_name', 'שם פרופיל'),
    ('end_system', 'מערכת קצה'),
    ('entity_id', 'מזהה ישות'),
    ('status', 'סטטוס'),
    ('manager', 'מנהל'),
    ('tags', 'תגיות'),
    ('value', 'ערך'),
    ('owner', 'בעלים'),
    ('sync_status', 'סטטוס סנכרון'),
    ('clearance', 'סיווג'),
    ('rank', 'דרגה'),
    ('email', 'דוא"ל'),
    ('fullName', 'שם מלא'),
    ('department', 'מחלקה'),
    ('phoneNumber', 'מספר טלפון'),
    ('address', 'כתובת'),
    ('preferences', 'העדפות'),
    ('permissions', 'הרשאות');

INSERT INTO api.digital_values (id, digital_parameter_id, name) VALUES
    ('admin', 'role', 'מנהל מערכת'),
    ('user', 'role', 'משתמש רגיל'),
    ('true', 'active', 'כן'),
    ('false', 'active', 'לא'),
    ('active', 'status', 'פעיל'),
    ('inactive', 'status', 'לא פעיל'),
    ('completed', 'sync_status', 'הושלם'),
    ('pending', 'sync_status', 'ממתין'),
    ('1', 'clearance', 'סודי ביותר'),
    ('2', 'clearance', 'סודי'),
    ('king', 'rank', 'מלך'),
    ('prince', 'rank', 'נסיך');
