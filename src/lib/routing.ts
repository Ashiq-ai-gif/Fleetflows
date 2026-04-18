import { Client } from "@googlemaps/google-maps-services-js";

// Initialize the Google Maps Client securely
const client = new Client({});

/**
 * Calculates the optimal route and ETAs for a trip using Google Maps Directions API.
 * @param origin - The starting point (e.g., driver's location or garage)
 * @param destination - The final drop-off point (e.g., the office)
 * @param waypoints - The lat/lng of the employees
 */
export async function calculateTripRoute(
  origin: string,
  destination: string,
  waypoints: { lat: number; lng: number }[],
  targetArrivalTime: Date
) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY is missing from environment variables.");
  }

  try {
    const response = await client.directions({
      params: {
        origin,
        destination,
        // Passing employee locations
        waypoints: waypoints.map((wp) => `${wp.lat},${wp.lng}`),
        // Google will sort them in the fastest order
        optimize: true,
        key: apiKey,
      },
    });

    if (response.data.status === "OK") {
      const route = response.data.routes[0];

      const waypointOrder = route.waypoint_order;
      const legs = route.legs;
      
      // Reverse time calculation (Start from Arrival Time - 15 mins buffer)
      let currentStamp = targetArrivalTime.getTime() - (15 * 60 * 1000);
      
      // Google splits into N+1 legs (origin -> wp0 -> wp1 -> dest)
      // Destination arrival minus the final leg gives us the time we must leave the last waypoint
      currentStamp -= (legs[legs.length - 1].duration?.value || 0) * 1000;
      
      // We will store the exact pickup DateTime for each waypoint in its ORIGINAL array index position
      const estimatedTimes: Date[] = new Array(waypoints.length);
      
      if (waypoints.length > 0 && waypointOrder.length > 0) {
          estimatedTimes[waypointOrder[waypointOrder.length - 1]] = new Date(currentStamp);
      
          // Moving backwards through the remaining waypoints
          for (let i = legs.length - 2; i > 0; i--) {
              currentStamp -= (legs[i].duration?.value || 0) * 1000;
              estimatedTimes[waypointOrder[i - 1]] = new Date(currentStamp);
          }
      }

      let totalMeters = 0;
      for (const leg of legs) {
          totalMeters += leg.distance?.value || 0;
      }
      const distanceInKm = parseFloat((totalMeters / 1000).toFixed(2));

      return {
        // The optimal order to pick up the employees
        waypointOrder: waypointOrder,
        // Estimated pickup time per original employee index
        estimatedTimes: estimatedTimes,
        // The total distance and time
        legs: legs,
        // Distance in KM for billing
        distanceInKm: distanceInKm,
        // The glowing blue line for the tracking map
        polyline: route.overview_polyline?.points,
      };
    }

    throw new Error(`Google Maps API Error: ${response.data.status}`);
  } catch (error) {
    console.error("Routing Error:", error);
    throw error;
  }
}
