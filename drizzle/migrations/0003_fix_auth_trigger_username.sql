CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  profile_username text;
BEGIN
  profile_username := lower(trim(new.raw_user_meta_data ->> 'username'));

  IF profile_username IS NULL OR char_length(profile_username) < 3 THEN
    profile_username := 'user_' || substr(replace(new.id::text, '-', ''), 1, 8);
  END IF;

  INSERT INTO public.profiles (id, username, full_name, avatar_url, contact_email, updated_at)
  VALUES (
    new.id,
    profile_username,
    COALESCE(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name'),
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'contact_email',
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;
