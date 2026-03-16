-- ============================================================
-- CVCraft.ai - Supabase Schema
-- Clean Architecture: profiles + cvs con RLS
-- ============================================================

-- Extensión para UUID (ya suele estar en Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- TABLA: profiles (vinculada a auth.users)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para búsquedas por usuario
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- Comentarios
COMMENT ON TABLE public.profiles IS 'Perfil de usuario vinculado a auth.users';
COMMENT ON COLUMN public.profiles.full_name IS 'Nombre completo del usuario';
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL del avatar (ej. proveedor OAuth)';

-- ------------------------------------------------------------
-- TABLA: cvs (user_id nullable para Guest Flow sin persistencia)
-- ------------------------------------------------------------
CREATE TYPE public.cv_type_enum AS ENUM (
  'harvard',   -- Minimalista ATS
  'creativo',  -- Marketing
  'tech',      -- Stack/GitHub
  'europass'   -- Académico
);

CREATE TABLE IF NOT EXISTS public.cvs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_job      TEXT NOT NULL,
  vacancy_info    TEXT,
  cv_type         public.cv_type_enum NOT NULL,
  structure_order JSONB NOT NULL DEFAULT '[]',
  content         JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON public.cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_cvs_created_at ON public.cvs(created_at DESC);

COMMENT ON TABLE public.cvs IS 'CVs generados; user_id NULL = guest (no persistido en este flujo)';
COMMENT ON COLUMN public.cvs.target_job IS 'Puesto objetivo';
COMMENT ON COLUMN public.cvs.vacancy_info IS 'Link o descripción de la vacante';
COMMENT ON COLUMN public.cvs.structure_order IS 'Orden de secciones (array de IDs)';
COMMENT ON COLUMN public.cvs.content IS 'Contenido flexible por sección (JSONB)';

-- ------------------------------------------------------------
-- TRIGGER: updated_at automático
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

DROP TRIGGER IF EXISTS cvs_updated_at ON public.cvs;
CREATE TRIGGER cvs_updated_at
  BEFORE UPDATE ON public.cvs
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- ------------------------------------------------------------
-- TRIGGER: Crear perfil al registrar usuario (Auth)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;

-- Profiles: solo el propio usuario puede leer y actualizar
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- El insert de profiles lo hace el trigger con SECURITY DEFINER
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- CVs: solo el dueño (user_id = auth.uid()) puede CRUD
DROP POLICY IF EXISTS "cvs_select_own" ON public.cvs;
CREATE POLICY "cvs_select_own"
  ON public.cvs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "cvs_insert_own" ON public.cvs;
CREATE POLICY "cvs_insert_own"
  ON public.cvs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "cvs_update_own" ON public.cvs;
CREATE POLICY "cvs_update_own"
  ON public.cvs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "cvs_delete_own" ON public.cvs;
CREATE POLICY "cvs_delete_own"
  ON public.cvs FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- GRANTS (permiso para anon y authenticated)
-- ------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cvs TO authenticated;
