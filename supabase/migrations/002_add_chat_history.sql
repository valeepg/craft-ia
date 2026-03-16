-- ============================================================
-- Migration: Add chat_history to cvs table
-- ============================================================

ALTER TABLE public.cvs ADD COLUMN chat_history JSONB DEFAULT '[]';