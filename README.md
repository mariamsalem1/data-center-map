## Professional half-glassy theme and location hierarchy

The visual system now uses charcoal/deep navy, off-white text, muted teal navigation accents, restrained rounded corners, smoked-glass navigation/selectors/KPI cards/drawers, and gentle blur/shadows. Charts, tables, alarms, camera/equipment images and monitoring panels remain on opaque dark surfaces. Alarm/warning colors remain reserved for their status roles. Existing images, chart types, hover readings, source alarms, interactions and metrics are preserved.

Campus → Building → Data Center selectors appear in both the visible context bar and location navigation. Breadcrumbs show All Campuses → Campus → Building → Data Center → System, with explicit return-to-campus/all-campus controls. The prototype still models one monitored data center per existing building, so the additional level does not duplicate metrics or invent facilities. Selected data-center identity follows building changes, browser Back/Forward, and URL state. Layouts wrap on narrow screens and glass effects fall back to solid dark surfaces if backdrop-filter is unavailable.

Validation: npm test and npm run check pass, including all seven campuses, dependent selectors, metric preservation, data-center invalidation/history restoration, and the Leaflet DOM-retention regression. Stylesheet block structure and local asset references checked. Live browser visual validation remains unavailable in this session.

## Map DOM preservation fix

The navigation enhancement now leaves the overview DOM untouched after Leaflet initializes or reattaches it. This fixes detached map layers and missing campus markers caused by an unnecessary innerHTML assignment. A regression test checks that the exact map/canvas node survives the enhanced render. The contextual navigation on detail pages is retained.

## Clear, contextual navigation

System tabs are now grouped beneath an explicit campus / building heading, a BUILDING SYSTEMS label, and a current-view badge. A visible location hierarchy and campus/building selectors explain exactly what the tabs control. Labels use Building overview, Cooling & mechanical, Power & electrical, and Security & CCTV. A persistent Browse locations / Change location button opens the existing navigation panel.

Changing a building preserves the selected system or KPI tab; changing campus clears the old building and asks for a valid choice. The side navigation no longer displays default DC-01 system links before a location is chosen. Navigation is reflected in the URL, can be refreshed/bookmarked, and supports browser Back/Forward. The Operations dropdown, all assets, and full-width layouts remain intact.

Automated validation covers contextual labels, tab grouping, location switching, invalid selections, scope preservation, URL state, and browser-history restoration. Live browser visual verification was unavailable in this session.

## Operations dropdown

The Operations section in the left navigation is now one dropdown instead of six separate buttons. It preserves the current page selection and campus/building context. Performance is labeled Regional performance, Campus performance, or Building KPIs according to the selected scope.

## Standalone Building KPIs tab

Select a campus and building, then click Building KPIs in the visible building tab row. It opens the full-width dashboard with that building's monitored metrics, charts, capacity, utility estimates and alarms. The same tab is accessible by name in navigation. KPI content is not embedded in the side panel, and there is no fixed right-side column.

## Final visual dashboard integration

All 18 final supplied images are now used on matching dashboard screens: server rack, cold aisle, vehicle/service/data-hall entrances and corridor, ATS, transformer, battery bank, PDU, chiller plant, cooling tower, AHU filter/fan/coil, administration, gate, and energy center. Specific inspectors show relevant component metrics. The cooling and electrical KPI cards now follow the selected building, and healthy buildings no longer inherit Cairo's return-air alarm or Suez's UPS advisory. The original 32-rack selection and thermal overlay, seven-campus image layouts, fire-system galleries, left-side navigation and building performance page remain available.

Validation: npm test and npm run check pass. All 18 PNG files were decoded/verified, and all local entrypoint and service-worker cache references were checked. Automated checks exercise every final system tab, image mapping, equipment/sensor inspectors, selection changes and alarm scoping. Live browser layout inspection was unavailable in this session.

This is a completed dashboard prototype using simulated readings and illustrative supplied images. It is not connected to real telemetry, CCTV, physical equipment controls, or a trained prediction model.

## Building performance through the original left navigation

Choose a campus and building, then select Building performance in the existing semi-transparent left navigation. This is the same rich performance screen used at region/campus level, now scoped to one building. It retains selection while updating power, capacity, racks, utilities, building comparisons, and alarms. A visible Building KPIs tab opens the full dashboard; no KPI summary is embedded in the side navigation. The separate fixed right-hand panel has been removed.

## Selected building KPI side panel

The Building KPIs tab identifies the campus and DC building. There is no fixed right-side KPI column. It shows PUE, facility/IT power, available power, rack occupancy and capacity, inlet temperatures, humidity, cooling monitoring status, and building-specific alarm links. The same selected-building model supplies the overview/data-hall KPI cards. Changing campus or building updates the panel. The main content retains its full-width layout. Values remain simulated.

## Full-building alarm marking

Buildings with active source alarms receive a strong red polygon overlay across their roof and facade, with a red outline and source-event legend. Selecting the overlay opens that building. Masks are registered independently for each campus image; only buildings with matching source events are marked. Acknowledgment does not clear an ongoing source condition. Red marking indicates an active alarm and does not itself declare a fire emergency.

## Full-width tab layouts

Every detail tab now uses the complete available width instead of the former centered 1750px limit. KPI cards, charts, equipment grids, rack images, tables, campus views, and readiness panels adapt to available space. Short pages fill the viewport vertically, while content-heavy pages retain normal vertical scrolling. Small screens stack panels rather than introducing sideways scrolling.

## Seven dedicated campus images

All seven campuses now have separate supplied illustrations with independently positioned building and support-facility hit areas. The six new images are assigned in attachment order to New Administrative Capital, 6th October, Borg El Arab, Suez Canal, Aswan Edge, and Delta. 5th Settlement keeps its existing image. Each layout exposes only the buildings configured for that campus. The supplied scenes are illustrative; visible structures are not a verified real-world inventory.

## Fire system reference designs

Both supplied fire dashboard references are implemented in the Fire systems tab: a six-card response equipment gallery with readiness panel, followed by six detailed zone/equipment cards. Each image window shows the equipment portion of the supplied reference and keeps titles, readings, status, and inspection actions as HTML. Nine fire asset inspectors show relevant readings; SD-042 maintenance is scoped to Cairo/DC-01. Fire monitoring is read-only and all telemetry is simulated.

## 5th Settlement campus image

Only 5th Settlement uses the supplied campus illustration. The image window displays the campus portion of the reference, with interactive hit areas aligned to DC-01 through DC-04, the chiller plant, energy center, administration, and gate. The remaining six campuses now use their dedicated supplied images.

## Control-room screens and chart hover readings

The exact supplied control-room image is used in overview cards and the control-room inspector. Six screen overlays highlight on hover and show selected-campus electrical, cooling, and data-hall readings. Chart SVGs now highlight and display time/category readings on hover across power trends, cooling trends, PUE bars, costs, efficiency distributions, gauges, donuts, and sparklines. Keyboard focus also reveals readings. Values remain simulated; the control-room image is not a live screen capture.

## User-supplied realistic equipment images

Generator A, UPS-B, AHU-03, Switchgear, and Water tank now use the exact supplied equipment images in overview tiles, equipment cards, and inspectors. The water-tank inspector includes the second pump/tank view. The cooling hero uses the supplied AHU image with repositioned fan/filter sensor callouts. Other equipment retains its existing vector visualization. Images are bundled locally and service-worker cached; live readings, sensor interactions, and work-order actions remain separate HTML controls. The photographs illustrate equipment and are not live camera feeds.

## Expanded performance dashboard

The performance tab now includes six KPI cards, five capacity gauges, a 24-hour facility/IT power chart, renewable-source breakdown, cooling load and thermal indicators, monthly utility-cost bars, individual building power/rack/status comparison, available operational headroom, and traceable source alarms. The original regional comparison strip remains on the same page. Scope follows the selected campus or region, and the reporting month updates the demonstration profiles and estimates. All charts remain local SVG and adapt to narrow screens.

## Synchronized campus map selection

Click any campus marker to update the bottom dashboard immediately in place: PUE, energy utilization, renewable source mix, total power load/capacity, backup load/capacity, occupied/total racks, and cooling system load/capacity. The map click does not navigate or recreate the map. All campuses remain available for another selection. Breadcrumbs, selected marker outline, region/campus dropdowns, side-panel summary, and building list synchronize to the selected campus.

The same performance tab becomes Campus performance for the selected campus. Region filtering without a campus scopes the performance tab to that region. Overview Map clears the scope and restores national regional cards. All campus-specific operating values beyond the existing site records are deterministic demonstration scenarios.

AGENTS.md records the original brief and later accepted constraints for review before future changes. It is a requirements checklist, not a verbatim copy of the original prompt.

## Egypt regional performance tab

Left navigation → Regional performance opens a single national comparison screen following the reference layout. It includes all five regions configured in the prototype: Greater Cairo, Mediterranean, Canal, Upper Egypt, and Delta. Each row shows buildings, customers, weighted PUE, illustrative WUE, efficiency distribution, twelve months of best/average PUE, occupied/total rack positions, and estimated water/electricity/gas costs in EGP. The reporting month selector updates estimates. With no location selection the page shows all configured regions; otherwise it follows the selected region or campus. It adapts to narrow screens without horizontal scrolling.

All regional records are demonstration data, not a verified inventory of real facilities in Egypt. Cost and rack-capacity assumptions are displayed on the page.

## Cinematic cooling view

Cooling now follows the supplied AHU reference: a large photorealistic cutaway scene, interactive sensor labels, animated cold/warm airflow, critical return-air indication, and three monitoring panels. Each of the five sensor labels opens an inspector with its own reading, threshold, component metrics, and advisory. The scene is a generated illustration; telemetry and trends are simulated. The static AHU image is not a live camera or rotatable 3D model. Pause stops airflow effects; reduced-motion preferences are respected.

Cooling capacity is internally consistent: 1.84 MW demand / 3.20 MW installed = 57.5% utilization, with 1.36 MW available.

## Schneider Electric branding and map visibility

The header and map title use the supplied Schneider Electric logo with true PNG alpha transparency. Campus markers are black, with a 12 px radius (14 px for critical campuses), a white contrast outline, and a 16 px hover radius. Status remains visible in campus popups and regional health indicators.

## Data halls and equipment update

The Data halls tab follows the supplied white-space reference: 32 detailed local vector rack models, eight columns on desktop, a cold aisle divider, an R-12 temperature alarm, Hall A/B selection, a thermal overlay, and a selected-rack conditions card. Select a rack, then open its inspector for inlet temperature, rack load, power, and humidity. R-12 in Cairo / DC-01 / Hall A consistently reports 32.8 °C and 82% load. Hall B and other campuses do not inherit that alarm.

The building overview, BMS, cooling, electrical, fire, security, and equipment inspectors now include detailed three-face equipment illustrations: AHUs, UPS banks, switchgear, generators, tanks, suppression cylinders, access doors, cameras, and control workstations. Camera tiles are simulated scenes, not connected video. These are lightweight SVG digital-twin illustrations, not orbitable 3D meshes. Everything is local and works without downloaded textures or a GPU library.

Validation: `npm test` and `npm run check` pass. Automated checks cover rack selection, hall switching, alarm scope, thermal overlay, equipment inspectors, existing map and navigation flows. A live browser visual inspection was unavailable in this session.

# AVEVA Unified Operations — Egypt

The interactive map fills the complete panel without a blank country mask or rectangular tile cutoffs. Egypt is centered and fitted into the initial view. The left navigation uses cascading Region, Campus, and Building dropdowns. The application name, header, tab title, and exported report branding use AVEVA Unified Operations.

The persistent **Overview Map** header button returns from any page to the national Egypt map and clears campus/building selection. Zoom uses whole levels with a shorter wheel debounce; street tiles update after zooming settles, and background geographic data loads preserve the existing street map instance. Detailed tile loading still depends on network speed. These optimizations have not been benchmarked in a live browser.

Egypt-only monitoring dashboard prototype. All campuses, equipment readings, telemetry, and prediction scenarios are demonstration data.

## Run

Node.js 20 or newer; no npm installation needed. The map engine and offline geographic assets are bundled.

```powershell
node scripts/serve.mjs
```

Open **http://localhost:4173**. Keep PowerShell running. Press **Ctrl+F5** after updating. Do not open index.html with a file URL.

## Interactive map

The Egypt map now uses **Leaflet 1.9.4** with real geographic coordinates, Web Mercator projection, dragging, wheel/pinch zoom, keyboard navigation, a distance scale, campus tooltips/popups, and location search through the campus directory. Global-region views and the SVG map have been removed.

- **Street map:** OpenStreetMap street tiles provide detailed roads and labels while connected to the internet. Tiles are loaded for normal browsing only; the app never bulk-downloads or service-worker caches these public tiles.
- **Offline map:** Bundled geographic layers show countries, governorates, the Nile, 710 road segments, city labels, and campus markers. This is an interactive geographic overview with less detail than street tiles. Select Offline map for network-free use.
- If street tiles fail, the app falls back to the local geographic basemap.
- Full offline street-level detail still requires a self-hosted or appropriately licensed regional tile dataset. The bundled vector overview is not equivalent to a complete street tile package.

Campus coordinates represent illustrative city-area locations, not verified real facility addresses.

## Navigation and scope

Use the semi-transparent **NAVIGATION** handle on the left. Select all Egypt, a region, campus, building, or system. **Locate on Egypt map** zooms to a campus. Marker popups display information; facility/system navigation remains in the left panel.

Separate campuses include **5th Settlement** (four buildings) and **New Administrative Capital** (three buildings), plus 6th October, Borg El Arab, Suez Canal, Aswan Edge, and Delta. Location selection updates aggregated KPIs.

The dashboard includes building overview, Data Halls, BMS/FMS, Mechanical, Electrical, Fire, Security/CCTV, rack thermal overlay, equipment inspection, alarm tracing/acknowledgment, work orders, shift journal, and CSV export. Work orders, journal entries, and acknowledgments persist in the current browser.

No authentication, shared backend, real telemetry, live CCTV, or trained prediction model is connected. Camera feeds are labeled placeholders. Predictive scenarios are illustrative.

## Optional geographic refresh

The files are already bundled. To refresh them later with internet access:

```powershell
node scripts/download-assets.mjs
```

This retrieves Natural Earth v5.1.2 and extracts Egypt-region geography. Existing files are preserved if a download fails. This is cartographic data, not a survey source.

## Sources and licenses

- Leaflet: https://leafletjs.com/ — BSD-2-Clause; license in dist/vendor/leaflet/LICENSE.
- Natural Earth: https://www.naturalearthdata.com/ — public domain.
- OpenStreetMap: https://www.openstreetmap.org/copyright — attribution remains visible on the map.
- Public tile policy: https://operations.osmfoundation.org/policies/tiles/ — offline bulk downloads are prohibited.

## Checks

```powershell
npm run check
npm test
```

VM checks verify generated screens, state, filters, persistence, navigation, and Egypt-only markup. They do not exercise Leaflet's actual browser rendering.

- v30: supplied server-aisle photo is the shared tab background, blurred 4px beneath a dark overlay. Keep all data, charts and equipment sharp; preserve the interactive map. The header version badge confirms the loaded update.

- v31: all card families now use smoked glass, thin translucent borders and backdrop blur; keep foreground text, graphs, equipment photos, severity cues and map content sharp.

- v32: high-transparency glass cards (~10-13% tint), readable foregrounds and stronger hover/focus feedback. Chart panels offer expansion of the original node, preserving hover handlers; Escape/outside click closes and restores focus. Never expand or replace Leaflet map nodes.
