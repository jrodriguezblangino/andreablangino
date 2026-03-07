# Cursor Task: Actualización de `escuela-de-formacion.html`

## Contexto general
Estás trabajando sobre el archivo `escuela-de-formacion.html`. Las modificaciones deben respetar íntegramente el sistema de estilos, colores, tipografías y estructura visual existente. **No introduzcas cambios de diseño ni nuevas clases CSS globales** salvo cuando se indique explícitamente para un componente nuevo.

---

## TAREA 1 — Actualizar sección de Preguntas Frecuentes (FAQ)

### Objetivo
Reemplazar el contenido textual (preguntas y respuestas) de la sección FAQ existente con los textos que se detallan a continuación. **No modificar ningún estilo, clase CSS, estructura HTML ni lógica JavaScript** del componente FAQ; solo sustituir el texto de cada par pregunta-respuesta.

### Nuevo contenido

Reemplazá los items existentes con exactamente estos 6 pares, en este orden:

```
Q1: "¿A quién está dirigida esta formación?"
A1: "A personas que sienten el deseo de acompañar a otros desde un enfoque humano y consciente. Ideal para quienes ya trabajan con personas y buscan sumar herramientas, o para quienes inician su camino en el acompañamiento."

Q2: "¿Necesito conocimientos previos para inscribirme?"
A2: "No se requieren conocimientos previos. La formación está diseñada para comenzar desde lo esencial y avanzar hacia la práctica de manera progresiva. Si ya trabajás acompañando personas, estas herramientas se integrarán a tu experiencia; si estás iniciando, te brindaremos el marco necesario para transitar el proceso con seguridad."

Q3: "¿Qué aprenderé y cómo es la formación?"
A3: "Cubre fundamentos científicos y aplicación práctica: formulación de hipótesis biológicas, manejo de casos reales y protocolos terapéuticos. Combina teoría y práctica en módulos con ejercicios clínicos supervisados."

Q4: "¿Qué certificación obtengo al finalizar?"
A4: "Recibirás un certificado que acredita tu recorrido formativo dentro de la Escuela y tu capacitación práctica como consultor/a en Biodecodificación (presencial u online)."

Q5: "¿Cómo me apoya la escuela después del curso?"
A5: "Acceso a actualizaciones, grupos de estudio, supervisión de casos, mentorías y eventos de especialización continua para acompañar tu desarrollo profesional."

Q6: "¿Tiene proyección a largo plazo?"
A6: "Sí. Muchas personas que completan la formación continúan acompañando procesos individuales, creando espacios de bienestar, brindando talleres o integrando lo aprendido a sus actividades actuales. La formación brinda una base sólida que puede sostenerse en el tiempo y seguir desarrollándose."
```

### Instrucciones de implementación
- Localizá el array o estructura de datos que alimenta la sección FAQ (puede ser un objeto JS, un array, atributos `data-*` o HTML estático).
- Reemplazá solo los valores de texto. No toques clases, IDs, eventos ni animaciones.
- Asegurate de que queden exactamente 6 items, eliminando cualquier item sobrante del original.

---

## TAREA 2 — Incorporar imagen `assets/escuela.png`

### Objetivo
Integrar la imagen `assets/escuela.png` en la página de forma dinámica, armoniosa y coherente con el resto del diseño. Esta imagen muestra el **programa y la modalidad del curso**, por lo que debe ubicarse en una zona donde el usuario la encuentre de manera natural dentro del flujo de lectura sobre la formación.

### Criterios de ubicación y presentación
- **Ubicación sugerida:** Inmediatamente después del bloque que describe el programa o los módulos del curso, y antes de la sección de FAQ. Si existe una sección de "programa", "plan de estudios" o "modalidad", insertarla allí. Si no, crear un bloque contenedor visual entre esas secciones.
- **Presentación:** La imagen debe integrarse con:
  - Un leve efecto de aparición al hacer scroll (`IntersectionObserver` o clase CSS con `opacity` + `transform` transitados, según el patrón ya usado en el archivo).
  - `border-radius` y `box-shadow` coherentes con los demás elementos visuales de la página.
  - Texto alternativo descriptivo: `alt="Programa y modalidad de la Escuela de Biodecodificación"`.
  - Comportamiento responsive: en mobile ocupa el 100% del ancho del contenedor; en tablet/desktop no supera el 80% del ancho del contenedor, centrada.
- **No crear un bloque visualmente aislado o genérico.** Integrala como si siempre hubiera sido parte del diseño.


```css
/* Solo si el patrón fade-in-scroll no existe ya en el archivo */
.fade-in-scroll {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.fade-in-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}
```
```js
// Solo si IntersectionObserver no está ya implementado para otros elementos
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.fade-in-scroll').forEach(el => observer.observe(el));
```

---

## TAREA 3 — Añadir sección de video

### Objetivo
Insertar un bloque de video incrustado de manera armónica dentro de la página, coherente con el flujo de contenido y el estilo visual existente.

### Ubicación
- Insertalo después de la imagen `escuela.png` (Tarea 2) y antes de la sección FAQ, o en la ubicación narrativa más lógica según el flujo de la página (por ejemplo, justo después de una llamada a la acción o presentación del programa).

### URL del video
https://www.youtube.com/watch?v=dqdWcGL5224

### Implementación
- Usar un `<iframe>` responsive con aspect ratio 16:9 garantizado mediante la técnica de padding-bottom o `aspect-ratio: 16/9`.
- Añadir `loading="lazy"` y `allowfullscreen`.
- El contenedor debe tener un título o epígrafe corto y consistente con la voz de la marca (ejemplo: *"Conocé cómo es la formación"*), usando el mismo estilo tipográfico de otros subtítulos de la página.
- Aplicar `border-radius` y `box-shadow` coherentes con el resto del diseño.
- No usar autoplay ni mute forzado.

### Código de referencia
```html
<section class="video-formacion-section">
  <h3 class="[clase-de-subtitulo-existente]">Conocé cómo es la formación</h3>
  <div class="video-wrapper">
    <!-- TODO: Reemplazar VIDEO_ID con el ID real del video -->
    <iframe
      src="https://www.youtube.com/embed/VIDEO_ID"
      title="Video de presentación de la Escuela de Formación en Biodecodificación"
      frameborder="0"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      loading="lazy"
    ></iframe>
  </div>
</section>
```
```css
.video-wrapper {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  aspect-ratio: 16 / 9;
  border-radius: /* usar el mismo valor que otros elementos de la página */;
  overflow: hidden;
  box-shadow: /* usar el mismo valor de sombra que otros elementos de la página */;
}
.video-wrapper iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
```

---

## TAREA 4 — Reemplazar sección `testimonios-heading` con Slider de Reseñas de Google

### Objetivo
Reemplazar las tarjetas de testimonios estáticas actuales por un **carrusel/slider interactivo** que muestre reseñas reales extraídas de la página de Google de la terapeuta Andrea Blangino.

### Reseñas a incorporar (hardcodeadas)
Incluí las siguientes reseñas reales. Cada una debe mostrar: nombre del autor, calificación en estrellas (★), texto de la reseña y, opcionalmente, la fecha.

```
Reseña 1:
  Autor: [Extraer del perfil de Google]
  Estrellas: 5
  Texto: [Extraer texto real de la reseña desde la URL de búsqueda proporcionada]
  Fecha: [Si está disponible]

⚠️ INSTRUCCIÓN IMPORTANTE: Visitá la siguiente URL para extraer las reseñas reales y visibles:
https://www.google.com/search?q=andrea+blangino+biodecodifcacion
Copiá el texto exacto de al menos 5–8 reseñas visibles en la página de resultados de Google
(las que aparecen en el panel de Knowledge Graph o en la sección de reseñas).
Hardcodealas en el componente. No uses una API de Google; solo copia el contenido visible. Asegurate que cuando se haga click en cualquiera de ellas, se lleve al sitio de las reseñas de google 
```

> **Nota para el desarrollador:** Si no podés acceder a las reseñas en tiempo de ejecución, usá las reseñas que puedas extraer manualmente de la URL y hardcodealas como objetos JS en el array `reviews` del slider.

### Estructura del slider

**Componente requerido:**
- Un slider/carrusel con navegación mediante botones anterior/siguiente (`‹` / `›`) y puntos de paginación (`•`).
- Mostrar **1 tarjeta visible a la vez en mobile**, **2 en tablet**, **3 en desktop** (o 1 grande destacada según el diseño existente).
- Auto-avance opcional cada 5 segundos, pausado al hacer hover.
- Transición suave (CSS `transition` o `transform`).
- Accesible: botones con `aria-label`, tarjetas con `role="article"`.

**Estructura de cada tarjeta:**
```html
<article class="review-card" role="article">
  <div class="review-header">
    <div class="review-avatar"><!-- Inicial del nombre o ícono genérico --></div>
    <div class="review-meta">
      <span class="review-author">Nombre del autor</span>
      <span class="review-date">Hace X semanas</span>
    </div>
    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
         alt="Google" class="google-logo" width="48" />
  </div>
  <div class="review-stars" aria-label="5 de 5 estrellas">★★★★★</div>
  <p class="review-text">"Texto de la reseña..."</p>
</article>
```

**Estructura del slider:**
```html
<section id="testimonios-heading" class="[clases existentes de la sección]">
  <h2 class="[clase de título existente]">Lo que dicen quienes nos eligieron</h2>
  <p class="[clase de subtítulo existente]">Reseñas verificadas en Google</p>

  <div class="reviews-slider-container">
    <button class="slider-btn slider-btn--prev" aria-label="Reseña anterior">&#8249;</button>
    <div class="reviews-track">
      <!-- Tarjetas generadas dinámicamente con JS -->
    </div>
    <button class="slider-btn slider-btn--next" aria-label="Reseña siguiente">&#8250;</button>
  </div>
  <div class="slider-dots" role="tablist" aria-label="Navegación del carrusel"></div>
</section>
```

**Lógica JS mínima requerida:**
```js
const reviews = [
  // Array con objetos: { author, date, rating, text }
  // Hardcodear aquí las reseñas reales extraídas de Google
];

// Implementar:
// - currentIndex state
// - renderSlide(index) que actualiza la vista
// - Event listeners en botones prev/next
// - Generación dinámica de dots
// - Auto-advance con setInterval, cleared on hover
// - Touch/swipe support básico (opcional pero recomendado)
```

### Integración visual
- Las tarjetas deben usar la paleta de colores existente (variables CSS del archivo o clases ya definidas).
- El fondo de las tarjetas puede ser blanco/crema con sombra sutil si la paleta lo permite.
- Las estrellas deben ser doradas (`#F5B800` o similar).
- El logo de Google (SVG) en cada tarjeta refuerza la autenticidad.
- Botones de navegación estilizados coherentemente con los CTAs del sitio.

---

## Checklist de validación antes de entregar

- [ ] FAQ: exactamente 6 items con el texto nuevo, sin cambios de estilo.
- [ ] Imagen `assets/escuela.png`: visible, responsive, con fade-in al scroll.
- [ ] Video: iframe responsive 16:9, con comentario TODO para la URL.
- [ ] Slider de reseñas: funcional, con reseñas reales hardcodeadas, navegación prev/next y dots.
- [ ] No se rompió ningún estilo, layout ni funcionalidad preexistente.
- [ ] El HTML es semánticamente correcto y accesible (alt texts, aria-labels).
- [ ] El JS no genera conflictos con scripts existentes (usar IIFE o módulos si es necesario).
- [ ] Responsive verificado en mobile (320px), tablet (768px) y desktop (1280px).