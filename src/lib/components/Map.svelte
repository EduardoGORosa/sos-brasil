<!-- src/routes/map/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';

    onMount(async () => {
        // Dynamically import Leaflet and its CSS
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');

        // Initialize the map
        const map = L.default.map('map').setView([-14.235, -51.9253], 4);

        // Add OpenStreetMap tiles
        L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Example marker
        // const marker = L.default.marker([0, 0]).addTo(map);
        // marker.bindPopup('<b>Center of the World</b>').openPopup();
    });
</script>

<style>
    #map {
        width: 95%;
        height: 600px;
        border-radius: 16px;
    }
</style>

<div id="map"></div>  