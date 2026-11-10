# Mundial de Cruceros — Instrucciones para el asistente

## Qué es este proyecto

**Mundial de Cruceros** es la marca principal (desde 1980) del grupo Mundial / Centro de Cruceros:
representante oficial de Norwegian (NCL) y exclusivo de Oceania y Regent en Colombia. Público más
pequeño y exclusivo que Centro de Cruceros (lujo, upper premium y familias con NCL).

**Estado (10 nov 2026):** proyecto Next.js creado con la marca (logo, colores, favicon) y una
portada provisional «Estamos preparando nuestro nuevo sitio». Todavía **no hay proyecto en Vercel**.

- Diagnóstico + cuestionario enviados al cliente: `docs/Mundial_de_Cruceros_Diagnostico_y_Cuestionario.docx`.
- **No se reutiliza contenido del WordPress actual** (Julien, 10 nov 2026: mucha info está mal).
  Estructura, textos y contenidos se definen con las respuestas del cliente; no rescatar páginas
  ni textos del sitio viejo por iniciativa propia.
- El buscador/reservas es la **app de reservas de RV3 + su base de datos de navieras**: producto
  de RV3 que se cobra aparte. Nunca presentarlo al cliente como «reutilizado de Centro de Cruceros».
- Marca: `app/globals.css` (Pantone 286 C #0033A1, 116 C #FFCD00) y `public/marca/`.

## Con quién trabajo

- **Johana** es la dueña de la agencia.
- **Solo habla español.** Comunicación en español claro, sin jerga técnica.
- **No es técnica**: no usa terminal, SSH ni git. Instrucciones paso a paso, concretas ("abrí esta URL, hacé clic acá, decime si ves X").
- Pedir screenshots cuando algo no esté claro.

## Stack (igual a los demás sitios de Johana)

- **Next.js 16** (App Router, Fluid Compute)
- **React + TypeScript**
- **Tailwind CSS v4** (modo CSS-first `@theme`)
- **Hosting: Vercel**, región **`iad1` (Estados Unidos)** en `vercel.json`. Nunca `gru1`
  (Brasil): sale más caro. Todos los proyectos del equipo pasaron a `iad1` el 10 nov 2026.
- Fuente: Futura (manual) es de pago → se usa **Jost** (Google Fonts) hasta tener licencia web.

## Supabase

**Proyecto: el de Estados Unidos, `rukztthxfjdfjscjtshr` (us-east-1).** El de Brasil
(`zkogcdvvfabpvxnazrqg`) está bloqueado en solo lectura desde la migración del 10 nov 2026: nunca
usarlo, aunque algún `.env.local` viejo de otro repo todavía lo tenga. Ver `.env.example`.

Si se agrega DB (catálogo de cruceros, reservas, leads), **todas las tablas deben ir prefijadas `cruceros_`** — Supabase es compartido entre todos los sitios de Johana.

Ejemplos: `cruceros_bookings`, `cruceros_leads`, `cruceros_packages`.

**Regla dura**: nunca crear tablas sin prefijo — chocan con los demás sitios (`colombiacommerce_`, `denty_`, `arboretto_`, etc.).

Migraciones: `supabase/migrations/NNN_nombre.sql`, RLS activo, policies explícitas. **Nunca** correr `db:reset` contra producción.

## Autenticación multi-sitio (si este sitio necesita cuentas)

Todos los sitios de Johana **comparten `auth.users`** (mismo proyecto Supabase). Una misma persona puede pertenecer a varios sitios — se etiqueta su membresía en `auth.users.raw_app_meta_data.sites` (text[] de slugs).

- **Slug de este sitio**: `cruceros`.
- **Implementación de referencia**: `/home/julien/Workspace/johanas-websites/colombia-ecommerce/` — ver `supabase/migrations/013_auth_site_scoping.sql`, `lib/auth/site-scope.ts`, `components/auth/AuthForm.tsx`, `app/api/auth/grant-site-access/route.ts`.

Si este sitio alguna vez necesita login, seguir el patrón:

1. **Migración propia** que cree `cruceros_profiles` (FK a `auth.users.id`) + función/trigger `cruceros_on_auth_user_created` que dispara **solo** cuando `new.raw_user_meta_data->>'site' = 'cruceros'`. El trigger inserta en `cruceros_profiles` y appendea `'cruceros'` a `raw_app_meta_data.sites` (dedup).
2. **Signup client-side** pasa `options.data.site = 'cruceros'` a `supabase.auth.signUp`.
3. **Login**: si `user.app_metadata.sites` no incluye `'cruceros'`, llamar a un endpoint propio `/api/auth/grant-site-access` que, con service-role, agrega el slug y crea la fila en `cruceros_profiles`.
4. **Jamás** compartir trigger ni tabla `_profiles` con otro sitio — cada repo es dueño del suyo.

## Flujo de trabajo: commit + push a `main` SIEMPRE

**Regla dura**: CADA cambio se commitea y pushea a `main` **inmediatamente**, salvo que Johana pida explícitamente "probar primero" — ahí uso `staging`.

```bash
git add -A
git commit -m "<mensaje claro>"
git push origin main
```

Vercel auto-deploya `main` a producción **una vez creado el proyecto en Vercel** (todavía no existe: crearlo es un cambio de configuración que necesita la aprobación de Johana).

### Cuándo proponer staging a Johana (proactivo, en español)

Cuando el sitio ya tenga contenido real y un cambio sea visible (layout, colores, copy de paquetes, cambios al form de consulta) o riesgoso, **antes** de hacerlo proponerle:

> "Lo puedo subir primero a una URL de pruebas en paralelo, así lo ves sin que afecte el sitio. Si te gusta, lo paso a la versión en vivo. ¿Querés probarlo así primero?"

Flujo:
1. `git checkout staging` (crearla con `-b` si no existe).
2. Push a `staging` → Vercel genera URL de preview.
3. Pasarle el link por WhatsApp.
4. Ella confirma → merge a `main` + push.

## Mensajes a clientes

### Resend (email)

**Estado actual**: `RESEND_API_KEY` **todavía no está configurada**. Si se agrega un form de consulta/reserva, los mails no saldrán hasta que Johana provea la key.

- Form con fallback: loguear la submission en server console + toast de éxito.
- **Avisar a Johana** si un flujo depende de email.

### WhatsApp (preferido)

Johana **prefiere WhatsApp** para que los clientes la contacten. En sitios de agencia de viajes, el CTA principal debería ser WhatsApp directo con mensaje prellenado (tipo "Hola, me interesa el crucero a ...").

- Link tipo: `https://wa.me/<numero>?text=<mensaje-prellenado>`.

## Antes de cerrar un cambio

1. Una vez que haya build: `npm run build` para confirmar que compila.
2. Commit + push a `main` sin pedir permiso (salvo "probar primero").
3. Avisar a Johana en español: qué cambió, dónde se ve.
