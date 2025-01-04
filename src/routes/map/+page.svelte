<!-- src/routes/map/+page.svelte -->
<script lang="ts">
  import L from 'leaflet';
  import { onMount } from 'svelte';
  import 'leaflet/dist/leaflet.css'; // Import the Leaflet CSS

  export const ssr = false;

  let map; // will hold our Leaflet map instance

  onMount(() => {
    // Create a map
    map = L.map('map').setView([0, 0], 2);

    // Add a tile layer from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Example: Add a marker at some location, e.g., Rio de Janeiro
    const marker = L.marker([-22.9068, -43.1729]).addTo(map);
    marker.bindPopup('<b>Hello!</b><br>Rio de Janeiro').openPopup();
  });
</script>

<style>
  /* Make sure the map container has a fixed height or Leaflet won't display properly */
  #map {
    width: 100%;
    height: 600px;
  }
</style>

<div id="map"></div>

