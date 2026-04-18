# Fleetflows: The Dream User Flow

Fleetflows is a multi-tenant, intelligent logistics and personnel transportation platform. The flow operates on a strict hierarchical structure, built to maximize automation across different business layers.

Below is the definitive end-to-end workflow covering every role in the system.

---

## 1. The Super Admin (Platform Owner)
The Super Admin is the master account (you!) operating from `fleetflowz.com`. 
* **Role**: You own the SaaS platform. You sell it to other businesses (Tenants).
* **Flow**: 
  1. You login to `/login` via `admin@fleetflows.com` / `dmin123456`.
  2. You land on the Master Operations Overview where you can view total active trips and global platform telemetry.
  3. You onboard a new business entity (e.g., "TechCorp Logistics"). Setting up their Company Name, Plan Tier, domain, and their initial Admin credentials.
  4. At any point, you can click "Impersonate" on a company to securely hop into their exact dashboard securely overriding your active context without asking for their passwords. 

## 2. The Tenant Admin (Company Owner)
The Tenant is the client business using Fleetflows to move their shipments or employees.
* **Role**: They manage their internal assets (Vehicles/Drivers) or outsource routing to external Vendors.
* **Flow**:
  1. They login via `/login` using the credentials created by the Super Admin.
  2. Their dashboard strictly isolates them to *only* their resources (Tenancy isolation via `tenantId`).
  3. They onboard their local **Employees** (passengers), local **Drivers**, and local **Vehicles**.
  4. If they lack internal fleet capacity, they can create **Vendors** (Third-party transport carriers). They assign a cost logic (e.g., "$2 per km") to this vendor.
  5. The Tenant Admin utilizes the **Trip Planner Engine** to automatically group Employees into Trips, routing them to Vehicles/Vendors. Financial billing metrics (`tenantBilling`, `vendorCost`) are fully calculated during generation.

## 3. The Vendor (Outsourced Transport)
Vendors act as 3PL (Third Party Logistics) sub-entities tied to a specific Tenant.
* **Role**: Supply external Drivers and Vehicles for the Tenant's overflow trips.
* **Flow**:
  1. Once created by the Tenant, the Tenant inputs the Vendor's drivers and vehicles into the system specifically tagged with that `vendorId`.
  2. When the Trip engine executes, external trips are seamlessly assigned to Vendor assets. 
  3. The system tracks the exact GPS distance travelled and uses the preset Vendor Rate algorithms to determine how much the Tenant owes the Vendor!

## 4. The Driver (Mobile Execution)
The Driver sits at the bleeding edge of the operational flow, using the React Native Expo App.
* **Role**: Physically transport the assets from the sequenced AI route.
* **Flow**:
  1. A driver opens the Expo App and logs in using their credentials (e.g., `phone` + `pin`).
  2. The mobile backend queries their assigned Trips for the day.
  3. The driver starts the trip. They are presented with a sorted, sequence-indexed checklist of passengers (Employees) they must pick up.
  4. Selecting a passenger opens a native OS map application (Google Maps/Apple Maps) via Deep Linking, safely guiding them with offline-ready turn-by-turn navigation.
  5. As they are `EN_ROUTE`, a background headless telemetric process pushes their precise GPS coordinates to the `/api/driver/location` endpoint every 15 seconds.

## 5. The Employee (Passenger Receiver)
The Employee is the ultimate benefactor of the transportation cycle.
* **Role**: Know exactly where their ride is and get home safely.
* **Flow**:
  1. They open the Expo App and log in securely via `email` + `password`.
  2. The application intercepts their active `TripId` and associated `DriverId`.
  3. The Employee's screen displays a localized, live interactive Google Map UI. 
  4. The frontend performs low-bandwidth polling every 10 seconds to the Next.js server, receiving the Driver's telemetry data pushed from the Driver app in Step 4.
  5. The Map pin physically drifts across the Employee's screen, calculating a hyper-accurate reverse-routing ETA natively based on the physical distance remaining. 
