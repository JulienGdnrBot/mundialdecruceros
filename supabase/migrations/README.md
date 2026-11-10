# Migraciones de Mundial de Cruceros

Base: Supabase compartido de RV3 en **Estados Unidos** (`rukztthxfjdfjscjtshr`, us-east-1).
El de Brasil (`zkogcdvvfabpvxnazrqg`) está en solo lectura: no usarlo.

- Todas las tablas, funciones y triggers propios llevan el prefijo **`cruceros_`**
  (ver CLAUDE.md). Nunca crear nada sin prefijo.
- Archivos `NNN_nombre.sql`, RLS activo y policies explícitas.
- Nunca `db:reset` contra producción.

Todavía no hay migraciones: el catálogo de navieras se conecta en la fase 2.
