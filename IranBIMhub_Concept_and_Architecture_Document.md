# IranBIMhub: Product Concept, Architecture & Technical Specification
**Date:** July 2026  
**Status:** Certified Core Prototype Draft  
**Target Platform:** Web-Based BIM Content Hub & Parametric Analytics Portal  
**Languages:** English (LTR) / Persian (RTL) Dual-Engine Localized Interface  

---

## 1. Executive Summary & Market Problem

In the modern Architecture, Engineering, and Construction (AEC) industries, **Building Information Modeling (BIM)** is the global standard for designing, constructing, and maintaining physical structures. BIM shifts the industry from traditional 2D flat drafts to intelligent, 3D parametric database-driven models. 

Every object within a digital building (e.g., a specific fire-rated steel door, a heavy-duty double-hung glass window, a ceramic vanity mixer, or a multi-layered brick facade) must correspond to real-world manufacturer specifications. 

### The Industry Challenge:
1. **The Designer's Pain:** Architects and BIM modelers waste hundreds of hours manually modeling mechanical, electrical, plumbing (MEP), and structural components from PDF catalogs, or downloading unverified, bulky, and outdated third-party Revit Families (`.rfa`) that crash their models.
2. **The Manufacturer's Pain:** Building material manufacturers spend massive marketing budgets on expos, showrooms, and brochures without direct digital integration into the design stage of high-value construction projects. They lack real-time insights into which of their products are being searched for, drafted, or downloaded by specifiers.

### The Solution: IranBIMhub
**IranBIMhub** acts as a secure, high-contrast, dual-language digital bridge connecting:
- **AEC Designers & BIM Specialists:** Who gain free, instantaneous access to certified, lightweight, standardized, and parameter-compliant BIM objects (Revit, IFC, DWG) backed by real-world factory specifications.
- **Industrial Material Manufacturers & Brands:** Who gain verified digital storefronts to host their BIM libraries, receive direct quote requests from specifiers, and analyze real-time demand charts via a comprehensive business intelligence dashboard.

---

## 2. Platform Architecture & User Personas

IranBIMhub is structured into three integrated system viewports, each catering to a distinct user persona:

```
                  ┌──────────────────────────────────────────────┐
                  │                 IRANBIMHUB                   │
                  │             (Dual-Language Core)             │
                  └──────────────────────┬───────────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
┌────────────────────────┐    ┌────────────────────────┐    ┌────────────────────────┐
│   AEC DESIGNER PORTAL  │    │  MANUFACTURER DOCK     │    │   ADMIN CONTROL TOWER  │
│ - 3D Parametric Viewer │    │ - Business Analytics   │    │ - Brand Verifications  │
│ - Verified Downloaders │    │ - Quote Request Inboxes│    │ - File Quality Audits  │
│ - Category Search Engine│   │ - BIM Catalog Managers │    │ - Platform Moderation  │
└────────────────────────┘    └────────────────────────┘    └────────────────────────┘
```

### Persona A: The AEC Designer (Architects, MEP Engineers, BIM Managers)
* **Goal:** Discover and evaluate manufacturing specifications, inspect geometric boundaries, and download clean, standardized Revit Families (`.rfa` / `.rvt`) or AutoCAD CAD files.
* **Core Experience:**
  - Fast-loading search index with localized structural category navigation (Doors/Windows, Sanitary, Furniture, Facades, Mechanical/HVAC).
  - **Dynamic 2D/3D Multi-Media Deck:** Provides high-fidelity rendering slide galleries alongside an interactive WebGL viewport to inspect object collision, opening constraints, and parametric data directly within the browser without downloading heavy desktop software.
  - One-click downloads with formal specification checklists.

### Persona B: The Building Material Manufacturer (Brands & Industrial Factories)
* **Goal:** Host verified catalogs, cultivate relationships with architects, and gain business intelligence regarding market trends and procurement pipelines.
* **Core Experience:**
  - **Business Intelligence Dashboard:** Live tracking of total object downloads, profile impressions, click-through rates (CTR), and regional search hot-zones.
  - **D3/Recharts Analytics Engines:** Interactive data visualization showcasing trend trajectories, device distributions, and category market shares.
  - **Procurement CRM:** Inbound project RFQs (Requests for Quote) containing verified designer emails, project locations, required quantities, and attachment links.

### Persona C: The Platform Admin & Quality Assurance Auditor
* **Goal:** Ensure all files uploaded to IranBIMhub match rigorous LOD (Level of Detail/Development) standards and verify the legal registrations of industrial brands.
* **Core Experience:**
  - Verification queues for pending manufacturing facilities.
  - Technical file auditing trackers ensuring downloaded Revit files have clean parameter bindings.
  - Dynamic user role permission modeling (Reviewer, Manager, Support, Admin).

---

## 3. Deep-Dive: Core Technical Implementations

The codebase is engineered around highly interactive, visual, and modern full-stack guidelines:

### A. The Interactive 3D WebGL BIM Viewport
Built with `@react-three/fiber` and `@react-three/drei` (backed by `three.js`), the viewer allows real-time rendering of parametric models inside standard browser frames:
* **Procedural CAD Generators:** Instead of loading heavy, unoptimized raw files on mobile devices, the viewer dynamically constructs lightweight geometric hulls matching product categories:
  - *Doors & Windows:* Animates hinges on custom Y-axis pivot points (swing ratio slider) or vertical slide frames to simulate movement in real-world spaces.
  - *Bathroom/Sanitary Fittings:* Simulates physical fluid dynamics using oscillating sine-wave geometries representing faucet water flow.
  - *Layered Facades & Building Envelopes:* Employs an exploded-view layout separating the decorative brick veneer, ventilation air gap, rockwool insulation insulation, and the concrete backing wall sequentially along the Z-axis.
* **Styling & Presentation Modes:**
  - *Shaded Mode:* Shows realistic materials, metallic finishes, and soft shadows.
  - *Wireframe Vector Mode:* Exposes the raw structural mesh and bounding lines.
  - *X-Ray Mode:* Renders transparent volumes, useful for checking internal piping cores or structural reinforcing bars.
* **Calibration & Grid Controllers:** Full integration of ground grids, auto-rotation with multi-speed gear selectors ($1\times, 2\times, 4\times$), and scale-accurate 3D dimensional annotations ($x, y, z$ axis boundaries).
* **Immersive Fullscreen Overlay:** An expanded overlay that takes over the screen, suspending scroll states and presenting detailed CAD specifications side-by-side with the WebGL canvas.

### B. Segmented 2D Render Slideshow
Complementing the 3D space is a rich photo gallery featuring slide indexes, sliding gradient info cards, high-resolution lightboxes, and quick thumbnail selection loops. For every product, multiple views are loaded:
1. **Primary Product Render:** Standard clean presentation of the final aesthetic form.
2. **CAD Dimension Blueprint:** Engineering diagrams detailing exact manufacturer installation ports.
3. **Architectural Installation Context:** Showcases the item integrated into prestigious, award-winning built projects.

### C. The Dual-Language RTL/LTR Engine
The platform incorporates a localized language provider (`LanguageContext.tsx`) which:
* Translates interface text on the fly across both English (En) and Persian (Fa).
* Dynamically manages text alignment and directional layout rules (`dir="rtl"` vs. `dir="ltr"`).
* Swaps alignment of visual elements like chevron buttons, sidebars, grids, and typography styling (e.g., matching Western sans-serif layouts with Persian calligraphy-like typography).

---

## 4. Key Visual Aesthetic Values

Every aspect of IranBIMhub is visually designed to convey precision, cleanliness, and industrial authority:
1. **Cosmic Slate Palette:** Designed using soft off-whites, neutral grays, and deep slate/charcoal canvases. This provides an high-contrast, eye-safe environment for professionals who spend long hours drafting.
2. **The Signature Teal Accent (`#26B6B6`):** Inspired by precision laser lines, this vibrant teal color is used as a deliberate visual guide for interactive components, active states, and calibration grids.
3. **Grid & Geometry Alignment:** Utilizes clean borders, micro-borders, rounded card contours, and spacious layout margins to reflect structural blue-prints.
4. **Fluid Motion:** Features subtle, non-distracting fade-in animations and micro-interaction states that make the application feel highly responsive and polished.

---

## 5. Development Summary & Current State
The IranBIMhub prototype is currently fully compiled, verified, and active. Core modules include:
- `App.tsx`: Central viewport router and general layout controller.
- `BIM3DViewer.tsx`: The WebGL engine implementing 3D shapes, speed controls, dimension annotations, and fullscreen mode.
- `ObjectDetailView.tsx`: The product presentation deck incorporating the new segmented media tabs (2D gallery slideshow vs. 3D viewport) and download checkout modals.
- `CategoryFilterSidebar.tsx`: The multi-tiered parametric category selector with a dedicated mobile drill-down panel-swap interface.
- `ManufacturerDashboard.tsx` & `AdminControlPanel.tsx`: The business analytics hub and system moderation console.

---
*Developed with excellence by AI Studio Build (2026).*
