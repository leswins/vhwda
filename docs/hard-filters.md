# Hard Filters - Guía de Uso

Los **Hard Filters** son reglas de exclusión que filtran carreras basándose en las respuestas del usuario en el quiz. Cuando un usuario selecciona una opción con un hard filter, se excluyen automáticamente las carreras que no cumplen con los criterios.

## Dos Lugares para Configurar Hard Filters

### 1. En las Preguntas del Quiz (Opciones de Respuesta)
Cada opción de respuesta puede tener un hard filter que define qué excluir cuando el usuario selecciona esa opción.

### 2. En las Carreras (Checklist de Requisitos) ⭐ 
Cada carrera tiene un checklist donde puedes agregar múltiples requisitos. Si el usuario no cumple con alguno de estos requisitos, la carrera se excluye de los resultados.

## Estructura en Sanity

Cada opción de pregunta puede tener un **Hard Filter** opcional. El filtro es un objeto estructurado con validación condicional que hace más fácil y seguro configurar los filtros.

## Tipos de Hard Filters

### 1. Education Ceiling (`education_ceiling`)

**Propósito**: Excluye carreras que requieren un nivel de educación más alto que el seleccionado.

**Configuración**:
- **Type**: Seleccionar "Education Ceiling"
- **Education Level**: Seleccionar el nivel máximo permitido
  - `FF` - Free Form (sin requisitos formales)
  - `CSC` - College Success Course
  - `CERT` - Certificate
  - `AAS` - Associate (AAS)
  - `BACH` - Bachelor's
  - `GRAD` - Graduate degree

**Ejemplo**: Si el usuario selecciona "Certificate (CERT)", se excluyen todas las carreras que requieren Associate, Bachelor's o Graduate.

**Mapeo con Career**: Compara con el campo `educationMin` de cada carrera.

---

### 2. Licensure Rule (`licensure_rule`)

**Propósito**: Excluye carreras que requieren licencia/certificación cuando el usuario responde "No".

**Configuración**:
- **Type**: Seleccionar "Licensure Rule"
- **Exclude Licensure Required**: Dejar en `true` (por defecto)

**Ejemplo**: Si el usuario responde "No" a "¿Estás dispuesto a obtener licencia/certificación?", se excluyen todas las carreras con `licensureRequired: true`.

**Mapeo con Career**: Compara con el campo `licensureRequired` de cada carrera.

---

### 3. Minimum Start Salary (`min_start_salary`)

**Propósito**: Excluye carreras con salario inicial menor al rango seleccionado.

**Configuración**:
- **Type**: Seleccionar "Minimum Start Salary"
- **Salary Range**: Seleccionar el rango mínimo
  - `<35000` - Menos de $35,000
  - `35000-50000` - $35,000 - $50,000
  - `50000-65000` - $50,000 - $65,000
  - `65000-80000` - $65,000 - $80,000
  - `80000+` - $80,000 o más

**Ejemplo**: Si el usuario selecciona "$50,000 - $65,000", se excluyen carreras con `salary.rangeMin < 50000`.

**Mapeo con Career**: Compara con el campo `salary.rangeMin` de cada carrera.

---

### 4. Deal-breakers

**Propósito**: Excluye carreras que requieren características que el usuario no está dispuesto a aceptar.

**Tipos disponibles**:
- `dealbreaker_lifting` - Excluye carreras que requieren levantamiento pesado
- `dealbreaker_nights_weekends` - Excluye carreras que requieren trabajar noches/fines de semana
- `dealbreaker_blood_needles` - Excluye carreras que requieren exposición a sangre/agujas
- `dealbreaker_high_stress` - Excluye carreras que requieren trabajo en emergencias/alta agudeza

**Configuración**:
- **Type**: Seleccionar el tipo de deal-breaker correspondiente
- No se requieren campos adicionales

**Ejemplo**: Si el usuario responde "Sí" a "¿No estás dispuesto a trabajar noches/fines de semana?", se excluyen carreras con `hardRequirements.requiresNightsWeekends: true`.

**Mapeo con Career**: Compara con los campos en `hardRequirements` de cada carrera:
- `dealbreaker_lifting` → `hardRequirements.requiresLifting`
- `dealbreaker_nights_weekends` → `hardRequirements.requiresNightsWeekends`
- `dealbreaker_blood_needles` → `hardRequirements.requiresBloodNeedles`
- `dealbreaker_high_stress` → `hardRequirements.requiresAcuteStress`

---

### 5. Region (`region`)

**Propósito**: Filtra carreras por región geográfica.

**Configuración**:
- **Type**: Seleccionar "Region"
- **Region**: Especificar la región (configurar opciones según necesidad)

**Nota**: Este filtro puede requerir configuración adicional según cómo se almacene la información de región en las carreras.

---

## Cómo Usar en Sanity Studio

1. **Editar una pregunta del quiz**
2. **Abrir una opción de respuesta**
3. **Expandir la sección "Hard Filter (Optional)"**
4. **Seleccionar el tipo de filtro** en el campo "Filter Type"
5. **Completar los campos específicos** que aparecen según el tipo seleccionado
6. **Opcional**: Agregar una descripción en "Filter Description" para referencia

## Validación

El schema incluye validación condicional:
- Los campos específicos solo aparecen cuando son relevantes para el tipo seleccionado
- Los campos requeridos se validan automáticamente
- Se previenen configuraciones inconsistentes

## Migración desde la Estructura Anterior

La estructura anterior usaba dos campos separados:
- `hardFilterField` (string)
- `hardFilterValue` (string)

**Compatibilidad**: El código mantiene compatibilidad hacia atrás. Si una opción tiene los campos legacy, se mapean automáticamente al nuevo formato. Sin embargo, se recomienda migrar a la nueva estructura para mejor validación y UX.

## Ejemplo de Uso Completo

### Pregunta: "¿Cuál es el nivel máximo de educación que estás dispuesto a completar?"

**Opción 1: "Certificate"**
- Hard Filter:
  - Type: `education_ceiling`
  - Education Level: `CERT`
  - Description: "Exclude careers requiring Associate or higher"

**Opción 2: "Bachelor's"**
- Hard Filter:
  - Type: `education_ceiling`
  - Education Level: `BACH`
  - Description: "Exclude careers requiring Graduate degree"

### Pregunta: "¿Estás dispuesto a trabajar noches, fines de semana o días festivos?"

**Opción 1: "Sí"**
- Sin hard filter (no excluye nada)

**Opción 2: "No"**
- Hard Filter:
  - Type: `dealbreaker_nights_weekends`
  - Description: "Exclude careers requiring nights/weekends/holidays"

---

## Hard Filters en Carreras (Checklist)

### Cómo Usar el Checklist

1. **Editar una carrera** en Sanity Studio
2. **Ir a la sección "Hard Filter Requirements (Checklist)"**
3. **Hacer clic en "Add item"** para agregar un nuevo requisito
4. **Seleccionar el tipo de filtro** del dropdown
5. **Completar los campos específicos** que aparecen según el tipo:
   - **Education Level**: Si seleccionaste "Minimum Education Required"
   - **Minimum Starting Salary**: Si seleccionaste "Minimum Starting Salary" (ingresar el valor en dólares)
   - **Region**: Si seleccionaste "Region Specific"
6. **Repetir** para agregar múltiples requisitos

### Ejemplo de Checklist Completo

Para una carrera de "Registered Nurse":

1. **Filtro 1:**
   - Type: `✓ Minimum Education Required`
   - Education Level: `Associate (AAS)`
   - Note: "Requires at least Associate degree"

2. **Filtro 2:**
   - Type: `✓ Requires Licensure/Certification`
   - Note: "Must have RN license"

3. **Filtro 3:**
   - Type: `✓ Minimum Starting Salary`
   - Minimum Starting Salary: `55000`
   - Note: "Starting salary typically $55k+"

4. **Filtro 4:**
   - Type: `✓ Requires Nights/Weekends/Holidays`
   - Note: "Hospital shifts often include nights/weekends"

### Ventajas del Checklist

- ✅ **Visual y fácil de usar**: Ver todos los requisitos en una lista
- ✅ **Múltiples requisitos**: Agregar tantos como necesites
- ✅ **Valores específicos**: Ingresar salarios mínimos exactos, niveles de educación, etc.
- ✅ **Notas internas**: Agregar notas para referencia del equipo
- ✅ **Preview claro**: Ver resumen de cada filtro antes de guardar

### Migración desde Campos Legacy

Los campos antiguos (`educationMin`, `licensureRequired`, `hardRequirements`) siguen funcionando por compatibilidad, pero están marcados como deprecados. 

**Recomendación**: Migrar todas las carreras al nuevo checklist:
- `educationMin` → Agregar filtro tipo "Minimum Education Required" con el nivel correspondiente
- `licensureRequired: true` → Agregar filtro tipo "Requires Licensure/Certification"
- `hardRequirements.requiresLifting: true` → Agregar filtro tipo "Requires Heavy Lifting"
- etc.

---

## Implementación en el Código

Los hard filters se aplican después de calcular los scores de matching. El proceso es:

1. Calcular scores de matching basados en vectores
2. Aplicar hard filters para excluir carreras que no cumplen criterios
3. Ordenar y mostrar resultados

Ver `apps/web/src/sanity/queries/careers.ts` para la implementación de filtrado.

