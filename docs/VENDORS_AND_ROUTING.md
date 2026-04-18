# Fleet Flows: Vendor Management & Smart Routing Requirements

## 1. Full System Overview

### 1.1 The Shift to a Transport-as-a-Service Platform (Platform-provided Vendors)
Currently, Fleet Flows assumes that a Corporate Client (Tenant) manages both the passengers (employees) AND the transport assets (vehicles/drivers). However, the actual business model is a marketplace/platform model:
*   **The Platform (Super Admin):** Manages the entire ecosystem, handling payments, dispatching, and system monitoring.
*   **The Vendors (Fleet Operators):** Transport companies onboarded by the platform. They own the Vehicles and employ the Drivers. Vendors have their own dashboard to manage their fleet and view assigned trips.
*   **The Corporate Clients (Tenants):** Companies (like a BPO) that simply request transport for their employees. They manage their employees and shifts, but do not directly manage the cars.

### 1.2 Smart Routing & Reverse ETA Calculation
The platform will automatically replace manual trip timing guesses with intelligent route generation.
*   **Clustering:** When a trip is generated, employees sharing a similar route/shift are grouped together.
*   **Routing (Google Maps Directions API):** The system passes the employee locations (waypoints) to Google Maps to determine the most time-efficient pickup sequence.
*   **Reverse Math Calculation:** To ensure an employee arrives at the office by 9:00 AM, the system works backward. (e.g., arriving by 8:45 AM -> Employee 4 picked up at 8:30 AM -> Employee 3 at 8:20 AM).
*   **Real-time Adjustments:** Drivers and employees receive these exact Estimated Pickup Times. In the future, live GPS tracking will dynamically update these times if a driver faces traffic or if someone is a "no-show."

---

## 2. Task Breakdown (Small Implementation Steps)

### Phase 1: Database Restructuring
- [ ] **Task 1.1**: Create a `Vendor` model in `prisma/schema.prisma` mapping to the platform (id, name, contact info).
- [ ] **Task 1.2**: Update `Vehicle` and `Driver` models to belong to a `Vendor` instead of a `Tenant`.
- [ ] **Task 1.3**: Update `TripPassenger` model to include `sequenceIndex (Int)`, `estimatedPickupTime (DateTime)`, and `actualPickupTime (DateTime)`.
- [ ] **Task 1.4**: Update `Trip` model to reference the `Vendor` taking the trip, and include `routePolyline (String)` and `overallDistance (String)`.
- [ ] **Task 1.5**: Run `prisma migrate dev` or `prisma migrate deploy` to push these changes to the DB.

### Phase 2: Building the Smart Routing Logic
- [ ] **Task 2.1**: Install `@googlemaps/google-maps-services-js` package.
- [ ] **Task 2.2**: Ensure `GOOGLE_MAPS_API_KEY` is available in the `.env` file.
- [ ] **Task 2.3**: Create `src/lib/routing.ts` and write a function that queries Google Maps Directions API, passing employee coordinates as `waypoints` with `optimizeWaypoints: true`.
- [ ] **Task 2.4**: Implement the reverse-time calculation logic inside the routing engine to determine exact pickup times based on shift target arrival.
- [ ] **Task 2.5**: Update the `/api/trips` generation endpoint so that whenever a trip is created, it passes through the routing engine to assign `sequenceIndex` and `estimatedPickupTime`.

### Phase 3: Vendor & Tenant Web Dashboards
- [ ] **Task 3.1**: Create a new Dashboard layout for **Vendors** (`/vendor`).
- [ ] **Task 3.2**: Move the Driver and Vehicle creation forms out of the `(dashboard)` (Tenant) area and into the `/vendor` area.
- [ ] **Task 3.3**: Update the Super Admin dashboard to allow onboarding of new Vendors.
- [ ] **Task 3.4**: Update the Trip assignment UI so Super Admins (or the automated system) can link a Tenant's Trip Request to a specific Vendor.

### Phase 4: Mobile App Updates
- [ ] **Task 4.1**: Update the Driver Mobile App flow to sort trips specifically by the generated `sequenceIndex`.
- [ ] **Task 4.2**: Display the `estimatedPickupTime` clearly on the Driver app next to each passenger.
- [ ] **Task 4.3**: Update the Employee Mobile View to display their personal `estimatedPickupTime`.

### Phase 5: Polish & Real-Time Tracking (Backlog)
- [ ] **Task 5.1**: Implement live geo-location updates when the driver is En Route.
- [ ] **Task 5.2**: Update ETAs dynamically if an employee is marked as a "No Show" via the Driver App.
