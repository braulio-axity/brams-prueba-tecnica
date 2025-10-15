# TESTING

## Índice
- [Stack y alcance](#stack-y-alcance)
- [Cómo correr las pruebas](#cómo-correr-las-pruebas)
- [Unit & Integration (Jest + RTL)](#unit--integration-jest--rtl)
- [End-to-End (Cypress)](#end-to-end-cypress)
- [Cobertura de código](#cobertura-de-código)
- [Análisis visual (Figma vs UI)](#análisis-visual-figma-vs-ui)
- [Decisiones de diseño de pruebas](#decisiones-de-diseño-de-pruebas)

---

## Stack y alcance
**Objetivo:** validar calidad funcional, accesibilidad básica y estabilidad UI.
**Tecnologías:**
- Unit/Integration: **Jest** + **React Testing Library** (+ `@testing-library/jest-dom`)
- E2E: **Cypress** (+ `@testing-library/cypress`)
- Mock de red con **fixtures** e **intercept**; hook responsive `usePageSize` (actual: **mobile=4**, **tablet=8**, **desktop=12**)

---

## Cómo correr las pruebas

### Unit / Integration
```bash
# correr tests
npm run test

# ver cobertura
npm run test:coverage

## End-to-End (Cypress)
```
**Qué cubrimos:**
- **article-list.cy.ts**
  - Carga inicial con intercept + fixture (`/mock/articles.json`).
  - Paginación estable en **mobile** (`viewport` < 640 ⇒ `PAGE_SIZE=4`), asserts dinámicos basados en la fixture.
  - Filtrado (case-insensitive) por título/resumen; “solo espacios” (trim) no filtra.
  - Navegación next/prev con estados `disabled`.
- **search-bar.cy.ts**
  - Input visible + placeholder correcto.
  - Botón **Limpiar**: aparece con texto, borra y restaura página 1.
  - Filtrado por título/resumen (case-insensitive), sin resultados → estado vacío + navegación deshabilitada.
  - Cambiar query **resetea** a página 1.

**Ejecutar:**
```bash
npm run dev      
npm run test      
npm run test:coverage
npm run cy:open 
npm run cy:run
```
## Análisis visual (Figma vs UI)

**Capturas** (guardar en `docs/img/`):
- Figma:  
  ![Figma - listado](./docs/img/figma-list.png "Figma - Listado")
- UI real:  
  ![UI - listado](./docs/img/ui-list.png "UI - Listado")

**Diferencias observadas (y acciones):**
- **Grid (desktop)**: Figma propone 4 columnas con gutter amplio → UI ajustada con `grid-cols-4 gap-6/7`.
- **Tipografías**: H1 `text-3xl font-bold`, títulos `text-lg font-semibold` para respetar jerarquía.
- **Tarjeta**: imagen con `aspect-[16/9] object-cover rounded-t-xl`; resumen `line-clamp-2` para alturas consistentes.
- **Paginación**: estados `disabled` claros (`opacity-50 cursor-not-allowed`), controles centrados.

> Si se requiere paridad exacta (p. ej., 5 por página en desktop), fijar `usePageSize` y alinear tests (unit/E2E).

---

## Decisiones de diseño de pruebas

- **Selectores accesibles** primero: `getByRole(..., { name })`, `getByLabelText`, y `findBy*` en E2E.  
- **Determinismo E2E**: `cy.intercept` + fixture ⇒ sin dependencias de red.  
- **Timers en App.test**: usar `fakeTimers` solo para avanzar 200 ms y **volver** a `useRealTimers` antes de `waitFor`/`userEvent`.  
- **Responsive**:
  - RTL: mock de `matchMedia` (helper `__setViewportWidth`) **o** mock directo de `usePageSize` por test.
  - Cypress: **viewport mobile** para forzar paginación independiente del dataset.

---