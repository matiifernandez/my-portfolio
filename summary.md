# Guía Completa de Astro (para devs de Rails)

## Tabla de Contenidos
1. [¿Qué es Astro?](#qué-es-astro)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Anatomía de un archivo .astro](#anatomía-de-un-archivo-astro)
4. [Comparación Rails vs Astro](#comparación-rails-vs-astro)
5. [Tailwind CSS Essentials](#tailwind-css-essentials)
6. [Cómo funciona el routing](#cómo-funciona-el-routing)
7. [Componentes y Props](#componentes-y-props)
8. [JavaScript en Astro](#javascript-en-astro)
9. [Comandos útiles](#comandos-útiles)

---

## ¿Qué es Astro?

Astro es un framework para crear sitios web **estáticos** o con **server-side rendering**. Su filosofía principal es:

> "Ship less JavaScript"

Por defecto, Astro genera HTML puro sin JavaScript. Solo añade JS cuando explícitamente lo necesitas.

### ¿Por qué es bueno para un portfolio?
- **Rápido**: Sin JS = carga instantánea
- **SEO friendly**: HTML estático es ideal para buscadores
- **Simple**: No necesitas entender React/Vue para usarlo
- **Flexible**: Puedes añadir React/Vue/Svelte si lo necesitas después

---

## Estructura del Proyecto

```
my-portfolio/
├── src/
│   ├── layouts/          # Plantillas base (como application.html.erb)
│   │   └── Layout.astro
│   ├── components/       # Componentes reutilizables (como partials)
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   └── Footer.astro
│   ├── pages/            # Rutas automáticas
│   │   └── index.astro   # → /
│   │   └── about.astro   # → /about (si existiera)
│   └── styles/
│       └── global.css
├── public/               # Archivos estáticos (imágenes, fonts, etc.)
├── astro.config.mjs      # Configuración de Astro
└── package.json
```

---

## Anatomía de un archivo .astro

Un archivo `.astro` tiene dos partes:

```astro
---
// ═══════════════════════════════════════════════════════════
// FRONTMATTER (entre los ---)
// ═══════════════════════════════════════════════════════════
//
// Esta parte es JavaScript/TypeScript que se ejecuta en BUILD TIME
// (cuando corrés `npm run build` o en el servidor de desarrollo)
//
// NO se ejecuta en el browser del usuario
//
// Aquí podés:
// - Importar componentes
// - Importar CSS
// - Definir variables
// - Hacer fetch a APIs
// - Definir props (parámetros que recibe el componente)

import Header from '../components/Header.astro';
import '../styles/global.css';

// Props = parámetros que recibe este componente
interface Props {
  title: string;
}

const { title } = Astro.props;

// Variables que podés usar abajo
const currentYear = new Date().getFullYear();
const items = ['uno', 'dos', 'tres'];
---

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- TEMPLATE (después de los ---) -->
<!-- ═══════════════════════════════════════════════════════════ -->
<!--
  Esta parte es HTML con superpoderes:
  - Podés usar variables con {variable}
  - Podés usar componentes como <Header />
  - Podés hacer loops con {items.map(...)}
  - Podés hacer condicionales con {condition && <div>...</div>}
-->

<html>
  <head>
    <title>{title}</title>  <!-- Usa la variable title -->
  </head>
  <body>
    <Header />  <!-- Usa el componente importado -->

    <p>Año actual: {currentYear}</p>

    <!-- Loop -->
    <ul>
      {items.map((item) => (
        <li>{item}</li>
      ))}
    </ul>

    <!-- Condicional -->
    {title === 'Home' && <p>Estás en home!</p>}

    <slot />  <!-- Equivalente a <%= yield %> -->
  </body>
</html>
```

---

## Comparación Rails vs Astro

| Concepto | Rails | Astro |
|----------|-------|-------|
| **Layout principal** | `app/views/layouts/application.html.erb` | `src/layouts/Layout.astro` |
| **Yield** | `<%= yield %>` | `<slot />` |
| **Partials** | `<%= render 'shared/header' %>` | `<Header />` (componente) |
| **Pasar datos a partials** | `<%= render 'card', title: 'Hola' %>` | `<Card title="Hola" />` |
| **Variables en HTML** | `<%= @title %>` | `{title}` |
| **Loops** | `<% @items.each do \|item\| %>` | `{items.map((item) => ...)}` |
| **Condicionales** | `<% if condition %>` | `{condition && <div>...</div>}` |
| **Rutas** | `config/routes.rb` | Automático por archivos en `pages/` |
| **Assets** | Asset Pipeline | Vite (automático) |
| **CSS** | `app/assets/stylesheets/` | `src/styles/` o inline |

### Ejemplo lado a lado

**Rails (ERB):**
```erb
<!-- _card.html.erb -->
<div class="card">
  <h2><%= title %></h2>
  <p><%= description %></p>

  <% tags.each do |tag| %>
    <span class="tag"><%= tag %></span>
  <% end %>
</div>
```

**Astro:**
```astro
---
// Card.astro
interface Props {
  title: string;
  description: string;
  tags: string[];
}

const { title, description, tags } = Astro.props;
---

<div class="card">
  <h2>{title}</h2>
  <p>{description}</p>

  {tags.map((tag) => (
    <span class="tag">{tag}</span>
  ))}
</div>
```

---

## Tailwind CSS Essentials

Tailwind usa clases utilitarias en lugar de escribir CSS. Cada clase hace UNA cosa.

### Conceptos clave

#### 1. Spacing (Espaciado)
```
p-4     → padding: 1rem (16px)
px-4    → padding-left y padding-right: 1rem
py-4    → padding-top y padding-bottom: 1rem
m-4     → margin: 1rem
mt-4    → margin-top: 1rem
gap-4   → gap: 1rem (espacio entre items en flex/grid)
```

Escala: 1 = 0.25rem (4px), 2 = 0.5rem (8px), 4 = 1rem (16px), 8 = 2rem (32px)...

#### 2. Colores
```
text-zinc-100    → color de texto (casi blanco)
bg-zinc-900      → color de fondo (casi negro)
border-zinc-800  → color de borde

El número indica luminosidad:
50 = muy claro, 500 = medio, 950 = muy oscuro
```

#### 3. Opacidad con /
```
bg-emerald-500/50  → fondo verde con 50% de opacidad
text-white/80      → texto blanco con 80% de opacidad
```

#### 4. Flexbox
```
flex              → display: flex
items-center      → align-items: center
justify-between   → justify-content: space-between
flex-col          → flex-direction: column
gap-4             → espacio entre items
```

#### 5. Grid
```
grid              → display: grid
grid-cols-2       → 2 columnas
grid-cols-3       → 3 columnas
gap-6             → espacio entre items
```

#### 6. Responsive (breakpoints)
```
sm:   → 640px+  (tablets)
md:   → 768px+  (tablets grandes)
lg:   → 1024px+ (desktop)
xl:   → 1280px+ (desktop grande)
2xl:  → 1536px+ (pantallas muy grandes)
```

Ejemplo:
```html
<div class="text-sm md:text-base lg:text-lg">
  <!--
    Móvil: texto pequeño
    Tablet: texto normal
    Desktop: texto grande
  -->
</div>
```

#### 7. Estados (hover, focus, etc.)
```html
<button class="bg-blue-500 hover:bg-blue-400 focus:ring-2">
  <!--
    Normal: azul
    Hover: azul más claro
    Focus: anillo de 2px
  -->
</button>
```

#### 8. Transiciones
```html
<div class="transition-all duration-300">
  <!-- Anima todos los cambios en 300ms -->
</div>

<div class="transition-colors duration-200">
  <!-- Solo anima cambios de color -->
</div>
```

---

## Cómo funciona el routing

Astro usa **file-based routing** (igual que Next.js):

```
src/pages/
├── index.astro        → /
├── about.astro        → /about
├── projects/
│   ├── index.astro    → /projects
│   └── [slug].astro   → /projects/cualquier-cosa (dinámico)
└── blog/
    └── [...slug].astro → /blog/cualquier/ruta/anidada
```

### Ejemplo de ruta dinámica

```astro
---
// src/pages/projects/[slug].astro

// Astro llama a getStaticPaths() para saber qué páginas generar
export async function getStaticPaths() {
  return [
    { params: { slug: 'proyecto-1' } },
    { params: { slug: 'proyecto-2' } },
  ];
}

const { slug } = Astro.params;
---

<h1>Proyecto: {slug}</h1>
```

---

## Componentes y Props

### Definir props con TypeScript

```astro
---
// Button.astro
interface Props {
  text: string;
  href?: string;        // ? = opcional
  variant?: 'primary' | 'secondary';  // Solo estos valores
}

// Destructuring con valor default
const { text, href = '#', variant = 'primary' } = Astro.props;
---

<a href={href} class:list={[
  'btn',
  variant === 'primary' && 'btn-primary',
  variant === 'secondary' && 'btn-secondary'
]}>
  {text}
</a>
```

### Usar el componente

```astro
---
import Button from '../components/Button.astro';
---

<Button text="Click me" />
<Button text="Secondary" variant="secondary" />
<Button text="Con link" href="/about" />
```

### class:list (clases condicionales)

Es como `class_names` en Rails:

```astro
<div class:list={[
  'base-class',                           // Siempre se aplica
  isActive && 'active',                   // Solo si isActive es true
  { 'highlighted': isHighlighted },       // Sintaxis de objeto
  size === 'large' ? 'text-lg' : 'text-sm' // Ternario
]}>
```

### Slots (como yield con nombres)

```astro
---
// Card.astro
---
<div class="card">
  <div class="card-header">
    <slot name="header" />  <!-- Slot nombrado -->
  </div>
  <div class="card-body">
    <slot />  <!-- Slot default (sin nombre) -->
  </div>
</div>
```

Uso:
```astro
<Card>
  <h2 slot="header">Título</h2>  <!-- Va al slot "header" -->
  <p>Contenido del body</p>       <!-- Va al slot default -->
</Card>
```

---

## JavaScript en Astro

### 1. JavaScript en el frontmatter (BUILD TIME)

```astro
---
// Esto se ejecuta cuando se construye el sitio
// NO en el browser

const data = await fetch('https://api.example.com/data');
const posts = await data.json();
---

{posts.map(post => <article>{post.title}</article>)}
```

### 2. JavaScript en el cliente (BROWSER)

```astro
---
// Frontmatter...
---

<button id="myButton">Click me</button>

<script>
  // Esto SÍ se ejecuta en el browser
  // Astro lo empaqueta automáticamente

  document.getElementById('myButton').addEventListener('click', () => {
    alert('Clicked!');
  });
</script>
```

### 3. Diferencia clave

| Frontmatter `---` | `<script>` |
|-------------------|------------|
| Se ejecuta en build | Se ejecuta en browser |
| Acceso a Node.js | Acceso al DOM |
| Puede hacer fetch a APIs | Puede manipular la página |
| NO puede acceder al DOM | NO puede acceder a Node |

### 4. Scripts inline vs bundled

```astro
<!-- BUNDLED (default): Astro lo procesa y optimiza -->
<script>
  console.log('Esto se procesa con Vite');
</script>

<!-- INLINE: Se incluye tal cual, sin procesar -->
<script is:inline>
  console.log('Esto va directo al HTML');
</script>
```

---

## Comandos útiles

```bash
# Desarrollo (con hot reload)
npm run dev

# Build para producción
npm run build

# Preview del build de producción
npm run preview

# Añadir integraciones (React, Tailwind, etc.)
npx astro add react
npx astro add tailwind
```

---

## Tips finales

1. **Siempre importá CSS en el frontmatter**, no con `<style>@import</style>`

2. **Los componentes .astro no tienen estado** - Si necesitás interactividad compleja, usá React/Vue/Svelte

3. **Tailwind v4 es nuevo** - Algunas cosas de tutoriales viejos pueden no funcionar

4. **El Dev Toolbar se puede desactivar** en `astro.config.mjs`:
   ```js
   export default defineConfig({
     devToolbar: { enabled: false }
   });
   ```

5. **Para imágenes optimizadas**, usá el componente `<Image />` de Astro:
   ```astro
   ---
   import { Image } from 'astro:assets';
   import myImage from '../images/photo.jpg';
   ---
   <Image src={myImage} alt="Descripción" />
   ```

---

## Recursos

- [Documentación oficial de Astro](https://docs.astro.build)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Astro + Tailwind](https://docs.astro.build/en/guides/integrations-guide/tailwind/)
