# Configuración de Base de Datos Supabase

## Pasos para configurar la base de datos

1. **Abre tu proyecto en Supabase**
   - Ve a https://supabase.com/dashboard
   - Selecciona tu proyecto `wzavnbatuhdbsrqrjaws`

2. **Abre el SQL Editor**
   - En el menú lateral izquierdo, haz clic en **SQL Editor**
   - Haz clic en **New query**

3. **Ejecuta la migración**
   - Abre el archivo `supabase/migrations/001_initial.sql`
   - Copia TODO el contenido del archivo
   - Pégalo en el editor SQL de Supabase
   - Haz clic en **Run** (o presiona `Ctrl+Enter`)

4. **Verifica la creación**
   - Ve a **Table Editor** en el menú lateral
   - Deberías ver dos tablas:
     - `bus_locations` (para almacenar ubicaciones en tiempo real)
     - `bus_lines` (con 8 líneas de buses predefinidas)

5. **Habilita Realtime**
   - Ve a **Database** → **Replication**
   - Asegúrate de que la tabla `bus_locations` esté habilitada para Realtime
   - Si no está habilitada, actívala

## Qué hace esta migración

- ✅ Crea tabla `bus_locations` para tracking GPS
- ✅ Crea tabla `bus_lines` con líneas de Lima predefinidas
- ✅ Configura índices para queries rápidas
- ✅ Habilita Realtime para actualizaciones en vivo
- ✅ Configura RLS (Row Level Security) para permitir acceso anónimo
- ✅ Crea función de limpieza automática de datos antiguos

## Políticas de Seguridad (RLS)

Las políticas permiten que usuarios anónimos (sin login):
- ✅ Lean ubicaciones de buses
- ✅ Inserten sus propias ubicaciones
- ✅ Actualicen ubicaciones existentes
- ✅ Lean información de líneas de buses

Esto es necesario para el funcionamiento P2P de la app.

## Troubleshooting

**Si ves errores al ejecutar la migración:**

- Error "relation already exists" → Las tablas ya existen, puedes ignorarlo
- Error de permisos → Verifica que estés usando el proyecto correcto
- Error de realtime → Asegúrate de que Realtime esté habilitado en tu plan

**Si la app sigue sin funcionar después de la migración:**

1. Verifica que las variables de entorno en `.env` sean correctas
2. Reinicia la app: `bun run android`
3. Revisa los logs en Supabase Dashboard → Logs
