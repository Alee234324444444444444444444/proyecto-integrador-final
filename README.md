# proyecto-integrador-final

## Configuración client

1. Crea un archivo `.env` en client/
2. Copia el archivo `.env.example` a `.env`
3. Rellena las variables de entorno con tus credenciales de Firebase
4. Ejecuta `npm install`
5. Ejecuta `npm start`

## Para iconos del foro
`npm install lucide-react`



## Para la vista 
CREATE VIEW perfil_view AS
SELECT 
    u.id,
    u.name,
    u.username,
    u.email,
    COUNT(c.id) AS total_comments,
    COUNT(r.id) AS total_responses,
    STRING_AGG(c.content, ' || ' ORDER BY c.created_at DESC) AS last_three_comments
FROM users u  -- Se asigna el alias "u" correctamente aquí
LEFT JOIN comment c ON u.id = c.user_id
LEFT JOIN comment r ON c.id = r.parent_id
GROUP BY u.id, u.name, u.username, u.email
ORDER BY COUNT(c.id) DESC;
