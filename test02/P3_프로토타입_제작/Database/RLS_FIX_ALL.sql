-- RLS 전체 수정 SQL
-- 생성일: 2026-02-03T16:26:37.004Z

-- === admin_settings - 기존 정책 삭제 ===
DROP POLICY IF EXISTS "Allow anon to read admin_settings" ON admin_settings;
DROP POLICY IF EXISTS "Allow anon to insert admin_settings" ON admin_settings;
DROP POLICY IF EXISTS "Allow anon to update admin_settings" ON admin_settings;
DROP POLICY IF EXISTS "Allow authenticated to read admin_settings" ON admin_settings;
DROP POLICY IF EXISTS "Allow authenticated to update admin_settings" ON admin_settings;
DROP POLICY IF EXISTS "anon_select_admin_settings" ON admin_settings;
DROP POLICY IF EXISTS "anon_insert_admin_settings" ON admin_settings;
DROP POLICY IF EXISTS "anon_update_admin_settings" ON admin_settings;
DROP POLICY IF EXISTS "admin_select" ON admin_settings;
DROP POLICY IF EXISTS "admin_update" ON admin_settings;
DROP POLICY IF EXISTS "admin_insert" ON admin_settings;
DROP POLICY IF EXISTS "admin_delete" ON admin_settings;

-- === admin_settings - RLS 활성화 + 새 정책 ===
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings FORCE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_select_admin_settings" ON admin_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_insert_admin_settings" ON admin_settings FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin_update_admin_settings" ON admin_settings FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin_delete_admin_settings" ON admin_settings FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "anon_deny_admin_settings" ON admin_settings FOR ALL TO anon USING (false);

-- === api_costs - 기존 정책 삭제 ===
DROP POLICY IF EXISTS "Allow anon full access to api_costs" ON api_costs;
DROP POLICY IF EXISTS "Allow anon select api_costs" ON api_costs;
DROP POLICY IF EXISTS "Allow anon insert api_costs" ON api_costs;
DROP POLICY IF EXISTS "Allow anon update api_costs" ON api_costs;
DROP POLICY IF EXISTS "Allow anon delete api_costs" ON api_costs;
DROP POLICY IF EXISTS "anon_select_api_costs" ON api_costs;
DROP POLICY IF EXISTS "anon_insert_api_costs" ON api_costs;
DROP POLICY IF EXISTS "anon_update_api_costs" ON api_costs;
DROP POLICY IF EXISTS "anon_delete_api_costs" ON api_costs;
DROP POLICY IF EXISTS "admin_select" ON api_costs;
DROP POLICY IF EXISTS "admin_insert" ON api_costs;
DROP POLICY IF EXISTS "admin_update" ON api_costs;
DROP POLICY IF EXISTS "admin_delete" ON api_costs;

-- === api_costs - 새 정책 (admin only) ===
ALTER TABLE api_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_costs FORCE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_select_api_costs" ON api_costs FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_insert_api_costs" ON api_costs FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin_update_api_costs" ON api_costs FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin_delete_api_costs" ON api_costs FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "anon_deny_api_costs" ON api_costs FOR ALL TO anon USING (false);

-- === deposit_notifications - 기존 정책 삭제 ===
DROP POLICY IF EXISTS "deposit_notifications_dev_select" ON deposit_notifications;
DROP POLICY IF EXISTS "deposit_notifications_dev_insert" ON deposit_notifications;
DROP POLICY IF EXISTS "deposit_notifications_dev_update" ON deposit_notifications;
DROP POLICY IF EXISTS "Allow anon to read deposit_notifications" ON deposit_notifications;
DROP POLICY IF EXISTS "Allow anon to insert deposit_notifications" ON deposit_notifications;
DROP POLICY IF EXISTS "Allow anon to update deposit_notifications" ON deposit_notifications;
DROP POLICY IF EXISTS "dev_select_deposit" ON deposit_notifications;
DROP POLICY IF EXISTS "dev_insert_deposit" ON deposit_notifications;
DROP POLICY IF EXISTS "dev_update_deposit" ON deposit_notifications;

-- === deposit_notifications - 새 정책 ===
ALTER TABLE deposit_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposit_notifications FORCE ROW LEVEL SECURITY;
CREATE POLICY "own_select_deposit_notifications" ON deposit_notifications FOR SELECT TO authenticated USING (auth.uid()::text = user_id::text OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "own_insert_deposit_notifications" ON deposit_notifications FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "admin_update_deposit_notifications" ON deposit_notifications FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin_delete_deposit_notifications" ON deposit_notifications FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "anon_deny_deposit_notifications" ON deposit_notifications FOR ALL TO anon USING (false);

-- === sunny_inquiries - 기존 정책 삭제 ===
DROP POLICY IF EXISTS "Allow anon full access to sunny inquiries (DEV)" ON sunny_inquiries;
DROP POLICY IF EXISTS "Allow anon full access to sunny_inquiries (DEV)" ON sunny_inquiries;
DROP POLICY IF EXISTS "anon_full_access_sunny" ON sunny_inquiries;
DROP POLICY IF EXISTS "Allow users to read own inquiries" ON sunny_inquiries;
DROP POLICY IF EXISTS "Allow users to create inquiries" ON sunny_inquiries;
DROP POLICY IF EXISTS "Allow admin to read all inquiries" ON sunny_inquiries;
DROP POLICY IF EXISTS "Allow admin to update inquiries" ON sunny_inquiries;
DROP POLICY IF EXISTS "own_select_sunny" ON sunny_inquiries;
DROP POLICY IF EXISTS "own_insert_sunny" ON sunny_inquiries;
DROP POLICY IF EXISTS "admin_select_sunny" ON sunny_inquiries;
DROP POLICY IF EXISTS "admin_update_sunny" ON sunny_inquiries;

-- === sunny_inquiries - 새 정책 (own + admin) ===
ALTER TABLE sunny_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sunny_inquiries FORCE ROW LEVEL SECURITY;
CREATE POLICY "own_select_sunny_inquiries" ON sunny_inquiries FOR SELECT TO authenticated USING (auth.jwt()->>'email' = user_email OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "own_insert_sunny_inquiries" ON sunny_inquiries FOR INSERT TO authenticated WITH CHECK (auth.jwt()->>'email' = user_email);
CREATE POLICY "admin_update_sunny_inquiries" ON sunny_inquiries FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin_delete_sunny_inquiries" ON sunny_inquiries FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "anon_deny_sunny_inquiries" ON sunny_inquiries FOR ALL TO anon USING (false);

-- === project_sal_grid - 기존 정책 삭제 ===
DROP POLICY IF EXISTS "anon_select_grid" ON project_sal_grid;
DROP POLICY IF EXISTS "anon_insert_grid" ON project_sal_grid;
DROP POLICY IF EXISTS "anon_update_grid" ON project_sal_grid;
DROP POLICY IF EXISTS "anon_delete_grid" ON project_sal_grid;
DROP POLICY IF EXISTS "Allow anon to read project_sal_grid" ON project_sal_grid;
DROP POLICY IF EXISTS "Allow public read access" ON project_sal_grid;

-- === project_sal_grid - 새 정책 (authenticated read, admin CUD) ===
ALTER TABLE project_sal_grid ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_sal_grid FORCE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_select_project_sal_grid" ON project_sal_grid FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_insert_project_sal_grid" ON project_sal_grid FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin_update_project_sal_grid" ON project_sal_grid FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin_delete_project_sal_grid" ON project_sal_grid FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "anon_deny_project_sal_grid" ON project_sal_grid FOR ALL TO anon USING (false);

-- === notices - 기존 정책 삭제 ===
DROP POLICY IF EXISTS "Everyone can view notices" ON notices;
DROP POLICY IF EXISTS "Only admins can create notices" ON notices;
DROP POLICY IF EXISTS "Only admins can update notices" ON notices;
DROP POLICY IF EXISTS "Only admins can delete notices" ON notices;
DROP POLICY IF EXISTS "anon_select_notices" ON notices;
DROP POLICY IF EXISTS "anon_insert_notices" ON notices;
DROP POLICY IF EXISTS "anon_update_notices" ON notices;
DROP POLICY IF EXISTS "anon_delete_notices" ON notices;
DROP POLICY IF EXISTS "Allow anon select notices" ON notices;

-- === notices - 새 정책 (public read, admin CUD) ===
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices FORCE ROW LEVEL SECURITY;
CREATE POLICY "public_select_notices" ON notices FOR SELECT USING (true);
CREATE POLICY "admin_insert_notices" ON notices FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin_update_notices" ON notices FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin_delete_notices" ON notices FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- === ai_usage_log - 기존 정책 삭제 ===
DROP POLICY IF EXISTS "ai_usage_log_dev_select" ON ai_usage_log;
DROP POLICY IF EXISTS "ai_usage_log_dev_insert" ON ai_usage_log;
DROP POLICY IF EXISTS "Allow anon to read ai_usage_log" ON ai_usage_log;
DROP POLICY IF EXISTS "Allow anon to insert ai_usage_log" ON ai_usage_log;
DROP POLICY IF EXISTS "own_select_ai_usage_log" ON ai_usage_log;
DROP POLICY IF EXISTS "own_insert_ai_usage_log" ON ai_usage_log;
DROP POLICY IF EXISTS "admin_select_ai_usage_log" ON ai_usage_log;

-- === ai_usage_log - 새 정책 (own + admin) ===
ALTER TABLE ai_usage_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_log FORCE ROW LEVEL SECURITY;
CREATE POLICY "own_select_ai_usage_log" ON ai_usage_log FOR SELECT TO authenticated USING (auth.uid()::text = user_id::text OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "own_insert_ai_usage_log" ON ai_usage_log FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "admin_update_ai_usage_log" ON ai_usage_log FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "anon_deny_ai_usage_log" ON ai_usage_log FOR ALL TO anon USING (false);

-- === learning_contents - 기존 CUD 정책 삭제 ===
DROP POLICY IF EXISTS "Only admins can insert learning_contents" ON learning_contents;
DROP POLICY IF EXISTS "Only admins can update learning_contents" ON learning_contents;
DROP POLICY IF EXISTS "Only admins can delete learning_contents" ON learning_contents;
DROP POLICY IF EXISTS "authenticated_insert_learning_contents" ON learning_contents;
DROP POLICY IF EXISTS "authenticated_update_learning_contents" ON learning_contents;
DROP POLICY IF EXISTS "authenticated_delete_learning_contents" ON learning_contents;

-- === learning_contents - admin only CUD ===
CREATE POLICY "admin_insert_learning_contents" ON learning_contents FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin_update_learning_contents" ON learning_contents FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin_delete_learning_contents" ON learning_contents FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- === faqs - 기존 CUD 정책 삭제 ===
DROP POLICY IF EXISTS "Only admins can insert faqs" ON faqs;
DROP POLICY IF EXISTS "Only admins can update faqs" ON faqs;
DROP POLICY IF EXISTS "Only admins can delete faqs" ON faqs;
DROP POLICY IF EXISTS "authenticated_insert_faqs" ON faqs;
DROP POLICY IF EXISTS "authenticated_update_faqs" ON faqs;
DROP POLICY IF EXISTS "authenticated_delete_faqs" ON faqs;
DROP POLICY IF EXISTS "Authenticated users can manage faqs" ON faqs;

-- === faqs - admin only CUD ===
CREATE POLICY "admin_insert_faqs" ON faqs FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin_update_faqs" ON faqs FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin_delete_faqs" ON faqs FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- === content_embeddings - anon deny for write ===
ALTER TABLE content_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_embeddings FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_deny_write_content_embeddings" ON content_embeddings;
CREATE POLICY "anon_deny_write_content_embeddings" ON content_embeddings FOR INSERT TO anon WITH CHECK (false);

-- === stage_verification - 기존 정책 삭제 ===
DROP POLICY IF EXISTS "anon_select_stage_verification" ON stage_verification;
DROP POLICY IF EXISTS "Allow anon to read stage_verification" ON stage_verification;
DROP POLICY IF EXISTS "Allow public read access" ON stage_verification;

-- === stage_verification - 새 정책 ===
ALTER TABLE stage_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE stage_verification FORCE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_select_stage_verification" ON stage_verification FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_update_stage_verification" ON stage_verification FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "anon_deny_stage_verification" ON stage_verification FOR ALL TO anon USING (false);

