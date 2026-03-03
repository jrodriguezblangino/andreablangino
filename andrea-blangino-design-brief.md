# Design Brief & Master Prompt — Rediseño Web Andrea Blangino
**Objetivo final:** Este documento es el insumo completo para que Claude Code (u otro agente de desarrollo) construya el nuevo sitio de Andrea Blangino desde cero, con HTML/CSS/JS estático o en el framework que el agente recomiende. Todo lo aquí especificado debe traducirse a código funcional, responsive y deployable.

---

## 0. CONTEXTO DEL PROYECTO

**Cliente:** Andrea Blangino — Terapeuta, Coach y Formadora en Biodecodificación Biológica  
**Sitio actual:** https://andreablangino.com  
**Idioma del sitio:** Español  
**Alcance:** Rediseño visual y estructural completo, respetando URLs y contenido existente donde sea posible.

---

## 1. REFERENCIAS VISUALES

### 1.1 Referencias de Diseño con Notas de Componente

| # | URL | Componente / Sensación a replicar |
|---|-----|-----------------------------------|
| 1 | https://www.brightmomentstherapy.com/ | **Navbar + Hero completo.** Logo centrado en navbar; menú de navegación a ambos lados; efecto hover en links; hamburger menu en mobile con animación suave. Hero: título H1 grande a la izquierda, subtítulo, 2 CTAs apilados, íconos de redes sociales, foto de la terapeuta a la derecha. Paleta: reemplazar el violeta por **verde pino** (#2D5016 o similar que armonice con el logo actual). Tipografía serif elegante + sans-serif limpio. |
| 2 | https://www.claireclerkin.com/ | **Quote motivacional + CTA inicial.** Franja después de la navbar con frase de impacto y botón de acción directa ("Reservar consulta" como disparo inmediato). También: separador de sección temático estilo "¿Por qué Nutrición?" → adaptar a "¿Por qué Biodecodificación?". |
| 3 | https://www.authenticselfconsulting.com/ | **Iconografía + fondos de sección.** Íconos lineales orgánicos (ya descargados por la cliente). Fondos texturizados/naturales para bloques divisores (ya descargados). Tipografía cálida pero profesional. |

### 1.2 Collage de Referencia

Se adjunta imagen de collage con **12 secciones** delimitadas por líneas rojas horizontales y numeradas. Ver sección 3 de este documento para la descripción detallada de cada sección.

---

## 2. DESIGN TOKENS (Sistema Visual)

### 2.1 Paleta de Color

```
--color-primary:        #2D5A1B   /* Verde pino — base del logo */
--color-primary-light:  #4A7C35   /* Verde pino medio — hover states */
--color-primary-pale:   #EBF2E4   /* Verde muy claro — fondos suaves */
--color-accent:         #C8A96E   /* Dorado cálido — CTAs secundarios, detalles */
--color-neutral-dark:   #1C1C1C   /* Textos principales */
--color-neutral-mid:    #5C5C5C   /* Textos secundarios */
--color-neutral-light:  #F5F3EF   /* Fondos alternos (crema) */
--color-white:          #FFFFFF
--color-separator-bg:   #3D4A35   /* Verde oscuro para franjas separadoras */
```

### 2.2 Tipografía

```
--font-heading:    'Cormorant Garamond', Georgia, serif   /* H1–H3, citas */
--font-body:       'Inter' o 'DM Sans', sans-serif        /* Cuerpo, nav, botones */
--font-accent:     'Cormorant Garamond' italic             /* Frases motivacionales */

Escala:
  H1: 56–64px / line-height 1.1
  H2: 36–42px / line-height 1.2
  H3: 24–28px
  Body: 16–18px / line-height 1.6
  Small/Caption: 13–14px
```

### 2.3 Espaciado y Layout

```
Max-width contenedor: 1200px
Padding lateral desktop: 80px
Padding lateral mobile: 20px
Sección padding vertical: 80px desktop / 48px mobile
Border-radius botones: 4px (esquinas levemente redondeadas, no pill)
Border-radius cards: 8px
```

### 2.4 Botones

```
Primary CTA: fondo --color-primary, texto blanco, hover fondo --color-primary-light
Secondary CTA: borde --color-primary, texto --color-primary, hover fondo --color-primary-pale
Accent CTA: fondo --color-accent, texto blanco (para secciones oscuras)
```

---

## 3. MAPA DE SECCIONES — PÁGINA DE INICIO (/)

### SECCIÓN 1 — NAVBAR
**Referencia:** brightmomentstherapy.com (nav completa)  
**Estructura:**
- Logo de Andrea Blangino **centrado**
- Links a la **izquierda** del logo: `Inicio` · `Formación` · `Talleres` · `Terapias`
- Links a la **derecha** del logo: `Sobre Mí` · `Blog` (si existe)
- Botón CTA destacado en el extremo derecho: **`Contacto`** (fondo verde pino)
- Comportamiento: sticky/fixed al hacer scroll, con sombra suave al despegar
- Hover: subrayado animado deslizante (no simple underline estático)
- **Mobile:** hamburger menu con drawer lateral o dropdown suave. Misma jerarquía de links.

---

### SECCIÓN 2 — FRANJA QUOTE MOTIVACIONAL
**Referencia:** claireclerkin.com (franja inicial post-nav)  
**Fondo:** `--color-separator-bg` (verde oscuro) o textura orgánica descargada  
**Contenido:**
> *"El cuerpo habla lo que la mente calla"*

**Sub-copy (más pequeño, debajo de la frase):**
> Cada síntoma es un mapa preciso. No es un error de la naturaleza, sino una solución biológica a un conflicto emocional que no hemos podido gestionar. Mi misión es acompañarte a leer ese mapa para que puedas recuperar tu poder y liberar las cargas que no te pertenecen.

**CTA:** Botón centrado — `"Reservar Consulta"` → enlace a sección o página de contacto  
**Tipografía:** `--font-accent` para la frase principal; body para el sub-copy  

---

### SECCIÓN 3 — HERO / PORTADA PRINCIPAL
**Referencia:** brightmomentstherapy.com (hero layout)  
**Layout:** Split 50/50 — texto izquierda, foto derecha  
**Contenido izquierdo:**
- Eyebrow tag: `"Biodecodificación Biológica"`
- H1: `"Decodifica el lenguaje oculto de tu cuerpo"`
- Subtítulo: 1–2 líneas sobre la propuesta de valor de Andrea
- 2 CTAs apilados:
  - Primary: `"Ver Formación Anual"` → `/escuela-de-formacion`
  - Secondary: `"Ver Talleres"` → `/talleres` o sección #7
- Íconos de redes sociales (Instagram, WhatsApp, YouTube si aplica)

**Contenido derecho:**
- Foto de Andrea (recortada con forma suave, no rectangular pura — posible clip-path orgánico o borde redondeado asimétrico)
- Fondo con textura sutil o mancha de color `--color-primary-pale`

---

### SECCIÓN 4 — SEPARADOR "¿POR QUÉ BIODECODIFICACIÓN?"
**Referencia:** claireclerkin.com (separador temático)  
**Fondo:** `--color-neutral-light` (crema)  
**Contenido:**
- Título centrado: `"¿Por qué Biodecodificación?"`
- 3–4 columnas con íconos (del set descargado de authenticselfconsulting.com) + título corto + 2–3 líneas explicativas
- Cada columna responde un "dolor" del visitante y cómo la biodecodificación lo aborda

---

### SECCIÓN 5 — FORMACIÓN ANUAL (HERO SECUNDARIO / FLAGSHIP)
**Prioridad:** ALTA — es el lanzamiento principal del año  
**Fondo:** Verde pino sólido o imagen de fondo oscura con overlay  
**Contenido:**
- Eyebrow: `"Lanzamiento 2025"`
- H2: Nombre de la formación (ej: `"Formación Integral en Biodecodificación Biológica"`)
- Descripción breve (3–4 líneas) de qué incluye y a quién va dirigida
- Bullets con beneficios clave (máx. 4)
- CTA principal: `"Quiero Formarme"` → `/escuela-de-formacion`
- Elemento visual: imagen o ilustración relevante a la derecha

---

### SECCIÓN 6 — DIVISOR DE NAVEGACIÓN POR SERVICIO (ICON LINKS)
**Layout:** 3 columnas centradas, con separadores visuales  
**Iconos del set descargado (authenticselfconsulting.com style)**  
| Ícono | Label | Destino |
|-------|-------|---------|
| 🖥️ (monitor/online) | Sesiones Online | `/terapias#online` |
| 📅 (calendario) | Talleres & Workshops | `/#talleres` |
| 🏠 (consultorio) | Consultorio Presencial | `/terapias#presencial` |

**Fondo:** `--color-neutral-light` o textura descargada  
**Hover:** card eleva con sombra suave + color verde en ícono

---

### SECCIÓN 7 — TALLERES & WORKSHOPS
**Layout:** Carousel/Slider horizontal de cards + filtro o link superior  
**Header de sección:**
- Título: `"Talleres & Workshops"`
- Link en el extremo derecho del header: `"Ver calendario completo →"` → `/talleres`

**Card de taller (repetible):**
- Imagen de portada (16:9 o cuadrada)
- Badge de fecha/estado (ej: `"Próximo"`, `"En Curso"`, `"Cupos Limitados"`)
- Título del taller
- 1 línea de descripción
- CTA: `"Ver detalles"` → página individual del taller

**Nota técnica:** Este componente debe ser fácil de actualizar (array de objetos o CMS-ready). Las cards cambian durante el año.

---

### SECCIÓN 8 — CTA CONSULTA INDIVIDUAL
**Layout:** Centrado, fondo de color separador  
**Fondo:** `--color-separator-bg` o textura orgánica oscura  
**Contenido:**
- H3: `"¿Querés trabajar en tu proceso personal?"`
- Sub-copy: 2 líneas invitando a la consulta individual
- 2 CTAs en paralelo:
  - `"Sesión Online"` → formulario/calendario online
  - `"Consulta Presencial"` → info de consultorio / WhatsApp

---

### SECCIÓN 9 — SOBRE MÍ (RESUMEN)
**Layout:** Split — foto izquierda, texto derecha  
**Foto:** Con cita debajo en tipografía `--font-accent`:
> *"Tu sistema es el mapa hacia tu tesoro interior."*

**Texto derecha:**
- Párrafo 1: Presentación profesional de Andrea
- Párrafo 2: Enfoque y metodología
- CTA: `"Conocer más sobre mí"` → `/sobre-mi`

**Contadores animados (al entrar al viewport):**
- `10+` años de experiencia
- `5k+` personas acompañadas
- `∞` posibilidades de cambio

---

### SECCIÓN 10 — FAQ (PREGUNTAS FRECUENTES)
**Referencia:** Collage sección 10 (acordeón tipo accordion)  
**Layout:** Acordeón expandible. 2 columnas en desktop, 1 en mobile.  
**Preguntas sugeridas (adaptar al contexto de biodecodificación):**
1. ¿Qué es la Biodecodificación Biológica?
2. ¿En qué se diferencia de la psicología tradicional?
3. ¿Necesito diagnóstico médico previo para una sesión?
4. ¿Cuántas sesiones se necesitan?
5. ¿Cómo son las sesiones online?
6. ¿La formación tiene certificación?

---

### SECCIÓN 11 — VIDEOS / RECURSOS
**Condición:** Mostrar solo si hay URLs de video disponibles  
**Layout:** Grid 2–3 columnas de thumbnails de YouTube embebidos o linked  
**Header:** `"Recursos & Contenido"` o `"Mirá estos recursos"`  
**Nota técnica:** Usar lazy-loading para los iframes de YouTube. No cargar hasta que el usuario haga scroll hasta la sección.

---

### SECCIÓN 12 — FOOTER
**Columnas (desktop):**
| Col 1 | Col 2 | Col 3 | Col 4 |
|-------|-------|-------|-------|
| Logo + tagline corto | Navegación | Redes Sociales | Contacto / WhatsApp |
| | Inicio, Formación, Talleres, Terapias, Sobre Mí | Instagram, YouTube, Facebook | Email, Teléfono |

**Footer inferior:** Copyright + Política de privacidad (si aplica)  
**Fondo:** `#1C1C1C` o verde pino oscuro

---

## 4. INVENTARIO DE PÁGINAS / URLs A PRESERVAR

| URL actual | Contenido | Acción |
|-----------|-----------|--------|
| `/` | Home | Rediseño completo (este doc) |
| `/biodecodificacion` | Qué es la biodecodificación | Conservar contenido, rediseñar layout |
| `/escuela-de-formacion` | Página de la formación anual | Conservar y potenciar — es página clave |
| `/informacion-escuela` | Info adicional de la escuela | Evaluar fusión con `/escuela-de-formacion` |
| `/registros` | Registros akáshicos u otro servicio | Conservar, verificar si tiene tráfico |
| `/talleres` | Listado de talleres (por crear o ampliar) | Crear o rediseñar como página dinámica |

---

## 5. INVENTARIO DE COMPONENTES REUTILIZABLES

```
- NavBar (sticky, logo centrado, hamburger mobile)
- HeroSplit (texto izquierda + imagen derecha)
- QuoteBanner (franja oscura, frase + CTA centrado)
- ServiceIconGrid (3 columnas con íconos y links)
- WorkshopCard (imagen + badge + título + CTA)
- WorkshopCarousel (wrapper slider para WorkshopCards)
- SectionDividerCTA (fondo oscuro, heading + 2 CTAs paralelos)
- AboutSplit (foto + cita + texto + contadores animados)
- StatsCounter (número animado + label)
- FAQAccordion (item expandible)
- VideoGrid (thumbnails con lazy-load)
- Footer (4 columnas + subfooter)
- Button (variantes: primary, secondary, accent)
- SectionHeader (eyebrow + H2 + subline opcional)
```

---

## 6. INSTRUCCIONES PARA EL AGENTE DE DESARROLLO (Claude Code)

### Stack recomendado
- **HTML5 + CSS3 + Vanilla JS** (si se quiere sitio estático simple)
- **O Next.js + Tailwind CSS** (si se quiere estructura más escalable y fácil de mantener)
- Fuentes: Google Fonts (`Cormorant Garamond` + `Inter` o `DM Sans`)
- Íconos: set provisto por la cliente + Lucide Icons como complemento

### Prioridades de build (orden sugerido)
1. Design tokens (variables CSS / Tailwind config)
2. Navbar + Footer (presentes en todas las páginas)
3. Hero + QuoteBanner (primera impresión)
4. Secciones 4, 5, 6 (contenido de valor)
5. WorkshopCarousel (sección 7 — requiere datos de muestra)
6. AboutSplit + StatsCounter (sección 9)
7. FAQAccordion (sección 10)
8. VideoGrid (sección 11 — condicional)
9. Páginas internas (biodecodificacion, escuela-de-formacion, etc.)

### Responsive breakpoints
```
Mobile:  < 768px
Tablet:  768px – 1024px
Desktop: > 1024px
```

### Accesibilidad mínima requerida
- Contraste AA en todos los textos
- `alt` descriptivo en todas las imágenes
- Navegación por teclado funcional (especialmente nav y FAQ accordion)
- `aria-labels` en botones de hamburger y carousel

### Assets disponibles
- Íconos orgánicos lineales (estilo authenticselfconsulting.com) — provistos por la cliente
- Fondos/texturas orgánicas — provistos por la cliente
- Logo de Andrea Blangino (verde pino) — disponible en el sitio actual
- Fotos de Andrea — disponibles en el sitio actual

### Textos de placeholder
Donde no haya texto definitivo, usar `[TEXTO PENDIENTE — Andrea confirma]` para que sea fácil de identificar y reemplazar.

---

## 7. PREGUNTAS ABIERTAS PARA LA CLIENTE (antes de iniciar build)

1. **Dominio de videos:** ¿Los videos son de YouTube? ¿Tenés una playlist o canal definido?
2. **Formulario de contacto:** ¿Querés un formulario propio o redirigir a WhatsApp/Calendly?
3. **Talleres:** ¿Hay una lista de talleres activos para cargar como datos iniciales?
4. **Registros Akáshicos:** ¿Es un servicio activo o está en pausa? ¿Merece sección en el home?
5. **Blog:** ¿Existe o está planificado? ¿Va en la navbar?
6. **Nombre oficial de la formación 2025:** ¿Cuál es el título exacto?
7. **Logo:** ¿Tenés el logo en SVG o PNG con fondo transparente en alta resolución?
8. **Foto del hero:** ¿Querés usar la misma foto del sitio actual o tenés una nueva sesión de fotos?

---

*Documento generado como insumo de diseño para Claude Code. Versión 1.0 — listo para iniciar Fase 1 + Fase 2 en paralelo.*
