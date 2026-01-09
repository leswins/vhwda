# Guía de Deploy de Cambios en Sanity

Esta guía explica cómo deployar los cambios en los schemas de Sanity, específicamente los cambios en los hard filters.

## Cambios Realizados

### 1. Hard Filters en Quiz Options (`hardFilter.ts`)
- Convertidos a formato de toggles
- Campos principales:
  - `hasMinimumEducation` (toggle) + `educationLevel` (cuando está activo)
  - `hasMinimumSalary` (toggle) - usa automáticamente `salary.rangeMin` de la carrera
  - `requiresLicensure`, `requiresLifting`, `requiresNightsWeekends`, `requiresBloodNeedles`, `requiresAcuteHighStress` (toggles directos)

### 2. Hard Filters en Careers (`careerHardFilter.ts`)
- El campo `min_start_salary` ahora usa automáticamente `salary.rangeMin` de la carrera
- No requiere campo `minSalary` adicional cuando se selecciona esta opción

## Pasos para Deployar

### Paso 1: Verificar que los schemas estén actualizados

Asegúrate de que los archivos en `apps/studio/src/schemaTypes/objects/` tengan los cambios correctos:

- `hardFilter.ts` - Debe tener los toggles con `initialValue: () => false`
- `careerHardFilter.ts` - Debe tener la lógica para usar `salary.rangeMin` automáticamente

### Paso 2: Deployar el Schema

Desde el directorio raíz del proyecto, ejecuta:

```bash
pnpm --filter studio run deploy
```

O desde el directorio `apps/studio`:

```bash
cd apps/studio
pnpm run deploy
```

Este comando ejecuta `sanity schema deploy` que actualiza el schema en Sanity sin afectar los datos existentes.

**Nota:** Si te pide autenticación, necesitarás un token de Sanity. Puedes obtenerlo en: https://sanity.io/manage

**Resultado esperado:**
```
✓ Extracted manifest
✓ Deployed 1/1 schemas
```

### Paso 3: Deployar el Studio (Opcional)

Si también quieres actualizar el Studio desplegado:

```bash
pnpm --filter studio run deploy:studio
```

O:

```bash
cd apps/studio
pnpm run deploy:studio
```

Esto ejecuta `sanity deploy` que actualiza la interfaz del Studio.

### Paso 4: Verificar en Sanity Studio

1. Abre Sanity Studio: `https://j0yc55ca.api.sanity.io/manage`
2. Ve a cualquier documento de Quiz
3. Abre una pregunta y una opción
4. Verifica que los hard filters aparezcan como toggles
5. Activa un toggle (ej: "Minimum Education") y verifica que aparezcan los campos relacionados

### Paso 5: Actualizar Contenido Existente (Opcional)

Si tienes contenido existente con el formato antiguo, puedes:

1. **Actualizar manualmente** en Sanity Studio:
   - Abre cada opción de quiz que tenga hard filters
   - Activa los toggles correspondientes
   - Completa los campos relacionados

2. **O usar el script de migración** (si aplica):
   ```bash
   cd apps/studio
   export SANITY_API_TOKEN="tu-token-aqui"
   pnpm migrate:hard-filters
   ```

## Notas Importantes

- **El deploy del schema NO elimina datos existentes**
- Los campos antiguos seguirán existiendo en los documentos hasta que los actualices manualmente
- El frontend soporta ambos formatos (nuevo y legacy) para compatibilidad
- Siempre verifica en Sanity Studio después del deploy para asegurarte de que los cambios se aplicaron correctamente

## Troubleshooting

### Error: "SchemaError" o "Schema validation failed"
- **Problema común:** Campos boolean con `initialValue: false` deben ser `initialValue: () => false`
- Verifica que todos los campos requeridos tengan `validation: (r) => r.required()`
- Revisa que los tipos de datos sean correctos
- Evita campos con `readOnly: true` y `initialValue` al mismo tiempo (puede causar errores)

### Error: "Token not found"
- Asegúrate de tener `SANITY_API_TOKEN` configurado
- Puedes obtenerlo en: https://sanity.io/manage

### Los toggles no aparecen
- Verifica que el schema se haya deployado correctamente
- Refresca el navegador (Ctrl+Shift+R o Cmd+Shift+R)
- Limpia la caché del navegador si es necesario
- Abre Sanity Studio local: `pnpm --filter studio dev` para verificar los cambios

