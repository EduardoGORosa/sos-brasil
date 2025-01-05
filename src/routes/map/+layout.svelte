<!-- src/routes/map/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';

  let mapInstance;

  onMount(async () => {
    // Dynamically import Leaflet and its CSS
    const L = await import('leaflet');
    await import('leaflet/dist/leaflet.css');

    // Initialize the map
    const map = L.default.map('map').setView([0, 0], 2);

    // Add OpenStreetMap tiles
    L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Example marker
    const marker = L.default.marker([0, 0]).addTo(map);
    marker.bindPopup('<b>Center of the World</b>').openPopup();

    mapInstance = map;
  });
</script>

<style>
  #map {
    width: 100%;
    height: 600px;
  }
</style>

<div id="map"></div>

