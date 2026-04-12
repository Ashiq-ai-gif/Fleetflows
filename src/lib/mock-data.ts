export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  pickupLocation: string;
  shift: string;
  status: "active" | "inactive";
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  status: "available" | "on-trip" | "offline";
  rating: number;
}

export interface Vehicle {
  id: string;
  model: string;
  plateNumber: string;
  capacity: number;
  type: "sedan" | "suv" | "van";
  status: "active" | "maintenance";
}

export const mockEmployees: Employee[] = [
  { id: "E001", name: "Sarah Jenkins", email: "sarah.j@company.com", department: "Engineering", pickupLocation: "Central Park West", shift: "09:00 AM", status: "active" },
  { id: "E002", name: "David Chen", email: "d.chen@company.com", department: "Marketing", pickupLocation: "Brooklyn Heights", shift: "09:00 AM", status: "active" },
  { id: "E003", name: "Elena Rodriguez", email: "elena.r@company.com", department: "HR", pickupLocation: "Queens Plaza", shift: "10:00 AM", status: "active" },
  { id: "E004", name: "James Wilson", email: "j.wilson@company.com", department: "Sales", pickupLocation: "Jersey City", shift: "09:00 AM", status: "active" },
  { id: "E005", name: "Lisa Thompson", email: "lisa.t@company.com", department: "Engineering", pickupLocation: "Upper East Side", shift: "09:00 AM", status: "inactive" },
];

export const mockDrivers: Driver[] = [
  { id: "D001", name: "John Smith", phone: "+1 555-0101", licenseNumber: "LC-882291", status: "on-trip", rating: 4.8 },
  { id: "D002", name: "Michael Ford", phone: "+1 555-0102", licenseNumber: "LC-119283", status: "available", rating: 4.9 },
  { id: "D003", name: "Robert Miller", phone: "+1 555-0103", licenseNumber: "LC-772210", status: "offline", rating: 4.5 },
  { id: "D004", name: "William Brown", phone: "+1 555-0104", licenseNumber: "LC-339922", status: "available", rating: 4.7 },
];

export const mockVehicles: Vehicle[] = [
  { id: "V001", model: "Toyota Camry", plateNumber: "ABC-1234", capacity: 4, type: "sedan", status: "active" },
  { id: "V002", model: "Honda CR-V", plateNumber: "XYZ-5678", capacity: 6, type: "suv", status: "active" },
  { id: "V003", model: "Mercedes Sprinter", plateNumber: "VAN-9988", capacity: 12, type: "van", status: "active" },
  { id: "V004", model: "Ford Fusion", plateNumber: "DEF-4455", capacity: 4, type: "sedan", status: "maintenance" },
];
