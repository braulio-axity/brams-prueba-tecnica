# Dev Tester Assessment (React + TypeScript)

Bienvenido/a a la prueba técnica para Dev Tester Jr / Developer in Test Jr. Este proyecto base está listo con Vite + React + TypeScript, Jest + React Testing Library para pruebas unitarias/integración y Cypress para pruebas end-to-end.

## Objetivo

Tu objetivo es asegurar la calidad de los componentes y flujos clave implementando pruebas automatizadas. Trabajarás sobre una UI simple que lista artículos provenientes de un mock de CMS.

## Stack

- Vite + React + TypeScript
- Jest + React Testing Library (RTL)
- Cypress (E2E)
- ESLint + Prettier

## Estructura principal

- `public/mock/articles.json`: datos mock del CMS (lista de artículos).
- `src/modules/articles/components/ArticleCard.tsx`: tarjeta de artículo.
- `src/modules/articles/components/ArticleList.tsx`: listado con paginación.
- `src/modules/articles/components/SearchBar.tsx`: barra de búsqueda.
- `src/modules/app/App.tsx`: composición de la página, carga de datos y estado de filtro.

## Qué debes hacer

1. Pruebas unitarias e integración (Jest + RTL):
   - Cubre los componentes `ArticleCard`, `ArticleList` y `SearchBar`.
   - Valida render, props, interacciones y estados (vacío, error si lo agregas, etc.).
2. Prueba E2E (Cypress) / Deseable no Excluyente:
   - Valida la carga inicial de artículos.
   - Valida el filtrado usando `SearchBar`.
   - Valida la navegación entre páginas (paginación) si aplica para el dataset.
3. Análisis de diseño:
   - Revisa el diseño en Figma y documenta al menos dos diferencias visuales observadas entre la UI renderizada y el diseño.
   - Placeholder: https://www.figma.com/file/XXXXXXXX/dev-tester-assessment
4. Cobertura:
   - Genera reporte de cobertura de Jest y verifica que supere el 80% global.
5. Documentación de pruebas:
   - Documenta brevemente en este README los pasos de prueba realizados y hallazgos relevantes (bugs, riesgos, mejoras sugeridas).

## Scripts

- `npm run dev`: levanta el servidor de desarrollo (Vite).
- `npm run build`: build de producción.
- `npm run preview`: previsualiza el build.
- `npm run test`: ejecuta Jest.
- `npm run test:coverage`: ejecuta Jest con cobertura.
- `npm run test:e2e`: ejecuta Cypress en modo headless.
- `npm run cy:open`: abre el Test Runner de Cypress.
- `npm run lint`: corre ESLint.
- `npm run format`: corre Prettier.

## Guía rápida

1. Instala dependencias: `npm install`.
2. Corre la app: `npm run dev` y abre `http://localhost:5173`.
3. Ejecuta tests unitarios: `npm test`.
4. Ejecuta cobertura: `npm run test:coverage` (verifica >80%).
5. Ejecuta E2E: con la app corriendo, `npm run test:e2e` o usa `npm run cy:open`.

## Criterios de evaluación

- Cobertura y calidad de los tests (claridad, maintainability, casos borde).
- Correcto uso de RTL y buenas prácticas (queries por rol, name, accesibilidad, etc.).
- Correcto modelado de flujos E2E (estabilidad, selectors, esperas razonables).
- Lectura y comprensión de requisitos; documentación en este README.
- Organización del código y estandarización con ESLint/Prettier.

## Notas

- Los datos se cargan desde `public/mock/articles.json` con un ligero delay simulado.
- Puedes extender la UI o estados (loading/error) si deseas probar más escenarios.
- Se incluye un ejemplo de test con RTL (`ArticleCard.test.tsx`) y un spec E2E (`article-list.cy.ts`).

¡Éxitos y happy testing! 🧪
