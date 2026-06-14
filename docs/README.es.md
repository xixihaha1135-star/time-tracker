[中文](../README.md) | [English](README.en.md) | [Français](README.fr.md) | **Español** | [Русский](README.ru.md) | [العربية](README.ar.md) | [日本語](README.ja.md)

# Time Tracker ⏱

> El tiempo es tu recurso más esencial — donde lo inviertas determina en quién te conviertes.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-brightgreen)](https://xixihaha1135-star.github.io/time-tracker/)

Un Skill de registro de tiempo multiplataforma. Dile a tu Agente qué hiciste y cuánto tiempo te llevó en lenguaje natural, y automáticamente lo registrará, lo fusionará en categorías y generará informes visuales.

**Live Demo**: https://xixihaha1135-star.github.io/time-tracker/

---

## Características

- **Registro en lenguaje natural, sin fricción** — Di «Leer media hora» y queda registrado. Sin necesidad de abrir ninguna app ni rellenar formularios.
- **Fusión inteligente de alias + categorización automática** — «Jugar pelota» se fusiona automáticamente con «Jugar baloncesto», y las actividades se clasifican en cinco categorías: Estudio / Ejercicio / Vida diaria / Entretenimiento / Trabajo.
- **Exploración de calendario en tres niveles + panel visual** — Vista anual con mapa de calor, vista mensual con estadísticas semanales, vista diaria con desglose detallado. Explora capa por capa y ve exactamente dónde inviertes tu tiempo.
- **Cambio de tema con un clic** — Tema oscuro estilo GitHub (para cuidar la vista) / Tema claro estilo Apple Health (fresco y limpio). Adáptalo a cada situación.
- **Tus datos te pertenecen** — Todos los registros se guardan en un único archivo `records.json`. Cambia de equipo, de plataforma o de Agente: copia y pega, y te lo llevas contigo.
- **Compatible con múltiples plataformas** — Un mismo archivo SKILL.md funciona con Claude Code / Cursor / Coze (扣子) / Lark (飞书) / cualquier Agente de IA genérico.

---

## Inicio rápido

### Opción 1: Claude Code (recomendado)

```bash
# 1. Clonar el repositorio
git clone https://github.com/xixihaha1135-star/time-tracker.git

# 2. Copiar SKILL.md a tu proyecto
mkdir -p tu-proyecto/.claude/skills/time-tracker
cp time-tracker/SKILL.md tu-proyecto/.claude/skills/time-tracker/

# 3. Copiar también la página de visualización y el archivo de datos
cp time-tracker/index.html tu-proyecto/.claude/skills/time-tracker/
cp time-tracker/records.json tu-proyecto/.claude/skills/time-tracker/
```

Una vez instalado, dile directamente a Claude Code:

- «Leer media hora» → Registro automático
- «Ver estadísticas» → Genera un informe en texto
- «Abrir estadísticas de tiempo» → Abre la página de visualización

### Opción 2: Cursor / Copilot / IDE de IA genérico

1. Abre `SKILL.md` y copia todo el contenido
2. Pégalo en tu `.cursorrules`, `copilot-instructions.md` o en el archivo de instrucciones del agente de tu proyecto
3. Coloca `records.json` en la raíz del proyecto y `index.html` en una ubicación accesible

### Opción 3: Coze (扣子) / Lark (飞书) / Agente genérico

1. Abre `SKILL.md` y copia todo el contenido
2. Pégalo en el **System Prompt** de tu agente
3. Sube `records.json` como archivo de base de conocimiento, o pega su contenido directamente
4. Empieza a conversar y registrar

---

## Ejemplos de uso

### Registrar tiempo

```
Tú: Leer media hora
Agente: Registrado: Leer 30 min (Estudio) ✅  Hoy: 1 registro, 30 min en total.
```

### Registro por lotes

```
Tú: Leer media hora, jugar videojuegos 20 minutos, comer 30 minutos
Agente: 3 registros guardados, 80 min en total ✅
        - Leer 30 min (Estudio)
        - Jugar videojuegos 20 min (Entretenimiento)
        - Comer 30 min (Vida diaria)
        Hoy: 3 registros, 80 min en total.
```

### Ver estadísticas

```
Tú: Hoy
Agente: 📊 Informe del día (14/6)
        Total de registros: 4 | Tiempo total: 3 h 30 min
        📂 Distribución por categoría:
        1. Estudio — 2 h (57 %)
        2. Vida diaria — 1 h (29 %)
        3. Ejercicio — 30 min (14 %)

Tú: Esta semana
Agente: 📊 Informe semanal (9/6 – 14/6)
        Total de registros: 31 | Tiempo total: 18 h 45 min
        📂 Distribución por categoría:
        1. Estudio — 8 h 30 min (45 %)
        2. Trabajo — 5 h (27 %)
        3. Vida diaria — 3 h (16 %)
        4. Ejercicio — 1 h 45 min (9 %)
        5. Entretenimiento — 30 min (3 %)
        📋 Ranking de actividades:
        1. Preparar CET-6 — 6 h
        2. Investigación de IA — 2 h 30 min
        3. Cuenta pública — 2 h
        ...
```

### Fusionar alias

```
Tú: Fusionar jugar pelota con jugar baloncesto
Agente: «Jugar pelota» se ha fusionado con «Jugar baloncesto». Se actualizaron 3 registros históricos.
```

### Modificar un registro

```
Tú: Lo de antes lo apunté mal, en realidad fue 1 hora
Agente: Modificado: Investigación de IA 60 min ✅ (antes 30 min)
```

### Eliminar un registro

```
Tú: Borra el último registro
Agente: ¿Confirmas eliminar «Preparar CET-6 60 min» (Estudio)?
Tú: Confirmo
Agente: Eliminado ✅
```

---

## Visualización

La demo en línea muestra tres vistas, con datos cargados directamente desde `records.json` en el mismo directorio:

| Vista | Descripción |
|------|------|
| **Mapa de calor anual** | Cuadrícula de calendario de 365 días. Colores más intensos indican más tiempo invertido. Haz clic en un día para ver todos sus registros. |
| **Gráfico de tendencias** | Compara la evolución del tiempo por actividad o categoría. Cambia entre 30, 90 o 365 días. Soporta zoom y arrastre. |
| **Informe de análisis** | Ranking de actividades, distribución por categoría, variación intermensual, media diaria y mayor consumidor de tiempo. Genera un resumen en texto con un clic. |

Incluye **doble tema**: cambia en un clic (esquina superior derecha) entre oscuro (estilo GitHub, predeterminado) y claro (estilo Apple Health).

> Página completa de visualización: https://xixihaha1135-star.github.io/time-tracker/

---

## Formato de datos

Todos los registros se almacenan en `records.json`, con la siguiente estructura v2:

```json
{
  "version": "2.0",
  "aliases": {
    "看英文原著": "看书",
    "AI写代码": "AI技术研究"
  },
  "records": [
    {
      "id": "20260610-182449-fc55",
      "date": "2026-06-10",
      "start": "",
      "end": "",
      "duration_min": 30,
      "activity": "看书",
      "raw_input": "看书半小时",
      "created_at": "2026-06-10T18:24:49.079383Z",
      "category": "学习"
    }
  ],
  "categories": {
    "学习": ["看书", "做作业", "备考六级"],
    "生活": ["吃饭", "洗漱洗衣", "休息"],
    "运动": ["早训", "健身"],
    "娱乐": ["玩手机", "打游戏"],
    "工作": ["AI技术研究", "公众号", "开会", "工作"]
  }
}
```

**Descripción de campos:**

| Campo | Tipo | Descripción |
|------|------|------|
| `version` | string | Versión del formato de datos, actualmente `"2.0"` |
| `aliases` | object | Tabla de alias. Clave: nombre de actividad introducido por el usuario; Valor: nombre estándar de la actividad |
| `records[].id` | string | Identificador único, formato `YYYYMMDD-HHmmss-xxxx` |
| `records[].date` | string | Fecha del registro, formato `YYYY-MM-DD` |
| `records[].start` | string | Hora de inicio (opcional), formato `HH:mm` |
| `records[].end` | string | Hora de fin (opcional), formato `HH:mm` |
| `records[].duration_min` | number | Duración en minutos |
| `records[].activity` | string | Nombre estándar de la actividad (tras aplicar la fusión de alias) |
| `records[].raw_input` | string | Entrada original del usuario, conservada para trazabilidad |
| `records[].created_at` | string | Marca de tiempo de creación del registro, formato ISO 8601 |
| `records[].category` | string | Categoría a la que pertenece (Estudio / Vida diaria / Ejercicio / Entretenimiento / Trabajo / Otros) |
| `categories` | object | Diccionario de categorías. Clave: nombre de la categoría; Valor: array de nombres de actividad en esa categoría |

**Asignación automática de categoría**: al registrar una actividad nueva, el Agente recorre el diccionario `categories` para encontrar la categoría correspondiente. Las actividades que no coincidan con ninguna se colocan en «Otros» y se pregunta al usuario su preferencia de categorización.

**Migración de v1 a v2**: respecto a v1, en v2 cada registro incluye el campo `category` y a nivel raíz se añade el diccionario `categories`. Para actualizar desde v1 solo hay que añadir manualmente estos dos campos; no se necesita ningún script.

---

## Migración de datos

**Principio de diseño**: tus datos viajan contigo, sin ataduras a ninguna plataforma.

### Exportar

Simplemente copia `records.json`. Un solo archivo contiene todos tus registros de tiempo, alias y configuración de categorías.

```bash
# Copia de seguridad en cualquier ubicación
cp records.json ~/backup/records-$(date +%Y%m%d).json
```

### Importar

Coloca `records.json` en la raíz del proyecto del nuevo entorno (o en cualquier ruta que SKILL.md pueda detectar). El Agente lo reconocerá automáticamente y seguirá registrando.

### Multiplataforma

El mismo archivo `records.json` tiene un formato completamente idéntico en Claude Code, Cursor, Coze, Lark y cualquier otra plataforma. No requiere conversión.

---

## Contribuir

Las PR son bienvenidas. Si encuentras algún problema, por favor repórtalo en [GitHub Issues](https://github.com/xixihaha1135-star/time-tracker/issues).

---

## Licencia

MIT — uso, modificación y distribución libres.
