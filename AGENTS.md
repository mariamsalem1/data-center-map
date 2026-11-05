# Dashboard requirements to preserve

Review each future update against the original Unified Operations data center brief and the user's later corrections.

- The current scope is an Egypt-only real geographic map, using the existing campuses (including 5th Settlement and New Administrative Capital).
- Maintain the hierarchy: Egypt → region → campus → building → building system → equipment. Use the semi-transparent left navigation for page drilldown.
- Map campus clicks select context in place: update the bottom visualization strip, location breadcrumbs and left-panel selected campus together without navigating away or remounting the map.
- The selected campus dashboard includes PUE, energy utilization, renewable mix, power load/capacity, backup load/capacity, occupied/total racks, cooling power/capacity, and scope-specific alarms.
- The performance tab follows selected campus/region context. Overview Map resets the selection and restores the national regional summary.
- Preserve the Schneider Electric transparent logo, black campus markers, responsive layouts with no sideways scrolling, cinematic cooling view and interactive data halls.
- Keep updates within this existing project. Do not silently describe a prepared external update as installed when filesystem permissions prevent applying it.
- Label simulated data and preserve meaningful units, consistent aggregates and traceable alarms. Do not present prototype campus data as a verified census of Egypt's real facilities.

- Preserve the exact user-supplied generator, UPS, AHU, switchgear, and tank/pump images; reuse them across equipment cards and inspectors rather than regenerating substitutes.

- Use the full available tab width on every detail page, with responsive content sizes and no horizontal scrolling; do not restore a centered fixed maximum-width container.

- Building KPIs must be a named clickable tab opening a full-page monitored KPI dashboard, scoped to the selected building. Do not embed KPI content in the side navigation or add a fixed right-side KPI column. Keep the selected building when opening the tab.

- Preserve all 18 final supplied component/security/facility images and their specific inspector mappings. Keep healthy buildings free of other buildings' source alarms.

- Navigation must visibly identify campus, building, and active system. Group system tabs with that context, provide visible location selectors, preserve the current system when changing building, and support browser Back/Forward and shareable location URLs. Never silently pick an arbitrary location for a system tab.

- Never rewrite #content.innerHTML after Leaflet initializes or reattaches the overview map. Preserve the actual map/canvas DOM nodes and handlers. Restrict navigation HTML enhancements to detail pages.

- Apply half-glassy styling only to shell/navigation/selectors/KPI cards/drawers: smoked dark surfaces, gentle blur, thin translucent borders, muted teal and soft shadows. Keep charts, tables, alarms and equipment on mostly solid dark surfaces. Avoid neon glow and heavy decoration.
- Present All Campuses → Campus → Building → Data Center → Systems / Assets with dependent Campus, Building and Data Center selectors. The current prototype has one monitored data center per existing building; preserve the existing totals and readings rather than inventing additional centers.

- v30: supplied server-aisle photo is the shared tab background, blurred 4px beneath a dark overlay. Keep all data, charts and equipment sharp; preserve the interactive map. The header version badge confirms the loaded update.

- v31: all card families now use smoked glass, thin translucent borders and backdrop blur; keep foreground text, graphs, equipment photos, severity cues and map content sharp.

- v32: high-transparency glass cards (~10-13% tint), readable foregrounds and stronger hover/focus feedback. Chart panels offer expansion of the original node, preserving hover handlers; Escape/outside click closes and restores focus. Never expand or replace Leaflet map nodes.
