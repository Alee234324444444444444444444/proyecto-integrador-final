# proyecto-integrador-final

## Configuración client

1. Crea un archivo `.env` en client/
2. Copia el archivo `.env.example` a `.env`
3. Rellena las variables de entorno con tus credenciales de Firebase
4. Ejecuta `npm install`
5. Ejecuta `npm start`

## Para iconos del foro
`npm install lucide-react`


## Para la base de datos triger comentarios
-- Crear función de auditoría para la tabla comment
CREATE OR REPLACE FUNCTION TRIGGER_AUDIT_COMMENTS()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public."Audits" ("Entity", "Event", "NewSyntax", "OldSyntax", "Users", "RecordDate")
        VALUES ('comment', 'INSERT', NEW.content, NULL, NEW.user_id::TEXT, NOW());

    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public."Audits" ("Entity", "Event", "NewSyntax", "OldSyntax", "Users", "RecordDate")
        VALUES ('comment', 'UPDATE', NEW.content, OLD.content, NEW.user_id::TEXT, NOW());

    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public."Audits" ("Entity", "Event", "NewSyntax", "OldSyntax", "Users", "RecordDate")
        VALUES ('comment', 'DELETE', NULL, OLD.content, OLD.user_id::TEXT, NOW());
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


-- Crear trigger para la tabla comment
CREATE OR REPLACE TRIGGER TR_AUDIT_COMMENTS
AFTER INSERT OR UPDATE OR DELETE
ON public.comment
FOR EACH ROW
EXECUTE FUNCTION TRIGGER_AUDIT_COMMENTS();

## Para la base de datos triger users


CREATE OR REPLACE FUNCTION trigger_audit_users()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public."Audits" ("Entity", "Event", "NewSyntax", "OldSyntax", "Users", "RecordDate")
        VALUES ('users', 'INSERT', NEW.username || ' (' || NEW.email || ')', NULL, NEW.id::TEXT, NOW());

    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public."Audits" ("Entity", "Event", "NewSyntax", "OldSyntax", "Users", "RecordDate")
        VALUES ('users', 'UPDATE', NEW.username || ' (' || NEW.email || ')', OLD.username || ' (' || OLD.email || ')', NEW.id::TEXT, NOW());

    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public."Audits" ("Entity", "Event", "NewSyntax", "OldSyntax", "Users", "RecordDate")
        VALUES ('users', 'DELETE', NULL, OLD.username || ' (' || OLD.email || ')', OLD.id::TEXT, NOW());
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;




CREATE OR REPLACE TRIGGER tr_audit_users
AFTER INSERT OR UPDATE OR DELETE
ON public.users
FOR EACH ROW
EXECUTE FUNCTION trigger_audit_users();


## Para la base de datos trigger desafios (challenge )
-- Crear función de auditoría para la tabla challenge
CREATE OR REPLACE FUNCTION TRIGGER_AUDIT_CHALLENGES()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public."Audits" ("Entity", "Event", "NewSyntax", "OldSyntax", "Users", "RecordDate")
        VALUES ('challenge', 'INSERT', NEW.title || ' - ' || NEW.description, NULL, NEW.superuser_id::TEXT, NOW());

    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public."Audits" ("Entity", "Event", "NewSyntax", "OldSyntax", "Users", "RecordDate")
        VALUES ('challenge', 'UPDATE', NEW.title || ' - ' || NEW.description, OLD.title || ' - ' || OLD.description, NEW.superuser_id::TEXT, NOW());

    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public."Audits" ("Entity", "Event", "NewSyntax", "OldSyntax", "Users", "RecordDate")
        VALUES ('challenge', 'DELETE', NULL, OLD.title || ' - ' || OLD.description, OLD.superuser_id::TEXT, NOW());
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para la tabla challenge
CREATE OR REPLACE TRIGGER TR_AUDIT_CHALLENGES
AFTER INSERT OR UPDATE OR DELETE
ON public.challenge
FOR EACH ROW
EXECUTE FUNCTION  TRIGGER_AUDIT_CHALLENGES();



##vista del perfilCREATE OR REPLACE VIEW user_profile AS
SELECT 
    u.id AS user_id,
    u.name AS full_name,
    u.username,
    u.email,
    COALESCE(c.name, 'No Character') AS character_name,
    COUNT(DISTINCT p.id) AS total_posts,
    COUNT(DISTINCT cmt.id) AS total_comments,
    COUNT(DISTINCT ch.id) AS total_challenges,
    STRING_AGG(DISTINCT r.name, ', ') AS rewards_earned
FROM public.users u
LEFT JOIN public."character" c ON u.id = c.user_id
LEFT JOIN public.post p ON u.id = p.user_id
LEFT JOIN public.comment cmt ON u.id = cmt.user_id
LEFT JOIN public.challenge ch ON p.challenge_id = ch.id
LEFT JOIN public.character_reward cr ON c.id = cr.character_id
LEFT JOIN public.reward r ON cr.reward_id = r.id
GROUP BY u.id, c.name;


