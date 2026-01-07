# Migración de Hard Filters

Esta guía explica cómo migrar las carreras del formato legacy de hard filters al nuevo formato de checklist.

## ¿Qué hace la migración?

Convierte automáticamente:
- `educationMin` → Filtro tipo "Minimum Education Required"
- `licensureRequired: true` → Filtro tipo "Requires Licensure/Certification"
- `hardRequirements.requiresLifting: true` → Filtro tipo "Requires Heavy Lifting"
- `hardRequirements.requiresNightsWeekends: true` → Filtro tipo "Requires Nights/Weekends/Holidays"
- `hardRequirements.requiresBloodNeedles: true` → Filtro tipo "Requires Blood/Needles Exposure"
- `hardRequirements.requiresAcuteStress: true` → Filtro tipo "Requires High Stress/Emergencies"
- `salary.rangeMin` → Filtro tipo "Minimum Starting Salary" (si existe)

## Pasos para Ejecutar la Migración

### 1. Obtener Token de API de Sanity

1. Ve a https://sanity.io/manage
2. Selecciona tu proyecto (`j0yc55ca`)
3. Ve a "API" → "Tokens"
4. Crea un nuevo token con permisos de "Editor" o superior
5. Copia el token (solo se muestra una vez)

### 2. Configurar el Token

**Opción A: Variable de entorno (recomendado para una sola ejecución)**
```bash
export SANITY_API_TOKEN='tu-token-aqui'
```

**Opción B: Archivo .env (recomendado para uso continuo)**
Crea un archivo `apps/studio/.env`:
```
SANITY_API_TOKEN=tu-token-aqui
```

### 3. Ejecutar la Migración

Desde la raíz del proyecto:
```bash
pnpm --filter studio migrate:hard-filters
```

O desde `apps/studio/`:
```bash
pnpm migrate:hard-filters
```

### 4. Ver el Progreso

El script mostrará:
- ✅ Carreras migradas exitosamente
- ⏭️ Carreras saltadas (ya tienen hardFilters o no tienen datos legacy)
- ❌ Errores (si los hay)
- 📊 Resumen final

Ejemplo de salida:
```
🚀 Starting Hard Filters Migration...

📥 Fetching all careers...
   Found 25 careers

🔄 Migrating "Registered Nurse"...
   Adding 3 hard filter(s):
     - education_ceiling (AAS)
     - licensure_required
     - dealbreaker_nights_weekends
   ✅ Successfully migrated "Registered Nurse"

==================================================
📊 Migration Summary:
   ✅ Migrated: 20
   ⏭️  Skipped: 5
   ❌ Errors: 0
==================================================
```

## Verificar en Sanity Studio

### 1. Abrir Sanity Studio

```bash
pnpm --filter studio dev
```

### 2. Navegar a una Carrera

1. Abre el Studio en tu navegador (normalmente http://localhost:3333)
2. Ve a "Career" en el menú lateral
3. Selecciona una carrera que fue migrada

### 3. Verificar los Hard Filters

1. Desplázate hasta la sección **"Hard Filter Requirements (Checklist)"**
2. Deberías ver los filtros migrados con notas como:
   - "Migrated from educationMin field"
   - "Migrated from licensureRequired field"
   - etc.

### 4. Verificar que los Datos Legacy Siguen Presentes

Los campos legacy (`educationMin`, `licensureRequired`, `hardRequirements`) siguen presentes pero están marcados como deprecados (⚠️). Esto es intencional para:
- Mantener compatibilidad durante la transición
- Permitir verificación manual
- Facilitar rollback si es necesario

## Limpieza Post-Migración (Opcional)

Una vez que hayas verificado que la migración funcionó correctamente:

1. **Eliminar campos legacy manualmente** en Sanity Studio (opcional)
2. O dejarlos como están - no afectan el funcionamiento

## Rollback

Si necesitas revertir la migración:

1. En Sanity Studio, edita cada carrera
2. Elimina los items del array `hardFilters` que tienen notas de "Migrated from..."
3. Los campos legacy siguen disponibles

## Troubleshooting

### Error: "SANITY_API_TOKEN environment variable is required"

**Solución**: Asegúrate de haber configurado el token:
```bash
export SANITY_API_TOKEN='tu-token'
```

### Error: "Insufficient permissions"

**Solución**: El token necesita permisos de "Editor" o superior. Crea un nuevo token con más permisos.

### No se migran todas las carreras

**Causa común**: Algunas carreras ya tienen `hardFilters` o no tienen datos legacy.

**Solución**: Esto es normal. El script solo migra carreras que:
- No tienen `hardFilters` ya configurados
- Tienen al menos un campo legacy con datos

### Ver errores específicos

El script muestra errores por carrera. Revisa el mensaje de error para ver qué falló.

## Próximos Pasos

Después de la migración:

1. ✅ Verifica que los datos se migraron correctamente
2. ✅ Prueba el quiz para asegurar que los filtros funcionan
3. ✅ (Opcional) Elimina campos legacy después de verificar
4. ✅ Actualiza cualquier código que use los campos legacy

