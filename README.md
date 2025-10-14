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

1. Crear pruebas unitarias e integración (Jest + RTL):
   - Cubre los componentes `ArticleCard`, `ArticleList` y `SearchBar`.
   - Valida render, props, interacciones y estados (vacío, error si lo agregas, etc.).
2. Prueba E2E (Cypress) / Deseable no Excluyente:
   - Valida la carga inicial de artículos.
   - Valida el filtrado usando `SearchBar`.
   - Valida la navegación entre páginas (paginación) si aplica para el dataset.
3. Análisis de diseño:
   - Revisa el diseño en Figma y documenta al menos dos diferencias visuales observadas entre la UI renderizada y el diseño.
   - Placeholder: https://www.figma.com/design/57tKDYPYvBlMp4AGjloNFq/Dev-Tester-Test?node-id=0-1&t=fxFXpexFDtUMtlx0-1
4. Cobertura:
   - Genera reporte de cobertura de Jest y verifica que supere el 80% global.
5. Documentación de pruebas:
   - Documentar en un archivo brevemente los pasos de prueba realizados y hallazgos relevantes (bugs, riesgos, mejoras sugeridas).
6. Control de versiones:
   - Usa git para guardar el avance de tu trabajo y solicita un pull request al finalizar.

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

## Control de versiones

Este proyecto se encuentra en un repositorio público de GitHub. Para contribuir, sigue estos pasos:

1. **Fork del Repositorio**: Haz un fork del repositorio a tu cuenta de GitHub.
2. **Clona tu Fork**: Clona tu fork en tu máquina local usando:
   ```bash
   git clone https://github.com/angelhurst/prueba-tecnica
   ```
3. **Crea una Nueva Rama desde `Dev-tester`**: Asegúrate de estar en la rama `Dev-tester` antes de crear tu rama de trabajo:
   ```bash
   git checkout Dev-tester
   git checkout -b nombre-de-tu-rama
   ```
4. **Realiza tus Cambios**: Haz los cambios necesarios y realiza commits con mensajes descriptivos.
5. **Envía un Pull Request**: Una vez que hayas terminado, envía un pull request desde tu fork al repositorio original.

## Notas

- Los datos se cargan desde `public/mock/articles.json` con un ligero delay simulado.
- Puedes extender la UI o estados (loading/error) si deseas probar más escenarios.
- Se incluye un ejemplo de test con RTL (`ArticleCard.test.tsx`) y un spec E2E (`article-list.cy.ts`).

¡Éxitos y happy testing! 🧪
