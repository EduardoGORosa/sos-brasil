<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '$lib/firebase';
  import { collection, addDoc, Timestamp } from 'firebase/firestore';
  import { user } from '$lib/firebase'; // Corrected import

  // Import Leaflet
  import L from 'leaflet';

  // Import Leaflet CSS
  import 'leaflet/dist/leaflet.css';
  import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
  import markerIcon from 'leaflet/dist/images/marker-icon.png';
  import markerShadow from 'leaflet/dist/images/marker-shadow.png';

  // Fix Leaflet's default icon paths
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });

  let disasterType = '';
  let description = '';
  let lat: number | null = null;
  let lng: number | null = null;

  let map: L.Map;
  let marker: L.Marker | null = null;
  let isSubmitting = false; // To handle loading state

  onMount(() => {
    const mapElement = document.getElementById('report-map');
    if (!mapElement) {
      console.error('Map element not found');
      return;
    }

    // Initialize the map centered on the user's location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          initializeMap([latitude, longitude], 13);
        },
        () => {
          // Fallback to default if user denies location access
          initializeMap([0, 0], 2);
        }
      );
    } else {
      initializeMap([0, 0], 2);
    }
  });

  function initializeMap(center: [number, number], zoom: number) {
    map = L.map('report-map').setView(center, zoom);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Handle map clicks
    map.on('click', (e: L.LeafletMouseEvent) => {
      const clickedLat = e.latlng.lat;
      const clickedLng = e.latlng.lng;

      // Update coordinates
      lat = clickedLat;
      lng = clickedLng;

      if (!marker) {
        // Create a new marker
        marker = L.marker([clickedLat, clickedLng]).addTo(map);
      } else {
        // Move existing marker
        marker.setLatLng([clickedLat, clickedLng]);
      }
    });
  }

  async function submitDisaster() {
    console.log('Submitting disaster report...');
    console.log('Disaster Type:', disasterType);
    console.log('Description:', description);
    console.log('Coordinates:', lat, lng);

    if (!disasterType || !description || lat === null || lng === null) {
      alert('Please fill out all fields and select a location on the map.');
      return;
    }

    // Use the reactive store value with the $ prefix
    if (!$user) {
      alert('You must be logged in to submit a disaster report.');
      console.error('Submission attempted without a valid user:', $user);
      return;
    }

    isSubmitting = true;

    try {
      await addDoc(collection(db, 'disasters'), {
        type: disasterType,
        description,
        location: { lat, lng },
        createdAt: Timestamp.now(), // Use Firestore's Timestamp
        createdBy: $user.uid // Use the reactive store value
      });

      alert('Disaster registered successfully!');
      // Reset form fields
      disasterType = '';
      description = '';
      lat = null;
      lng = null;

      // Remove marker from map
      if (marker) {
        map.removeLayer(marker);
        marker = null;
      }
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to register disaster. Please try again.');
    } finally {
      isSubmitting = false;
    }
  }
</script>

<style>
  #report-map {
      width: 100%;
      height: 400px;
      border-radius: 16px;
  }
</style>

<div class="flex flex-col items-center space-y-4">
  <div class="navbar bg-neutral text-neutral-content">
    <div class="navbar-start">
      <a href="/" class="btn btn-link">Voltar</a>
    </div>
    <span class="navbar-center text-2xl">Reportar Desastre</span>
    <div class="navbar-end"></div>
  </div>
  <div class="w-full px-3">
    <label class="block text-gray-600 mb-1 font-semibold" for="disasterType">Tipo de Desastre</label>
    <select
      id="disasterType"
      bind:value={disasterType}
      class="border border-gray-300 rounded w-full p-2 focus:outline-none focus:border-blue-500"
    >
      <option value="" disabled selected>Selecione o tipo de desastre</option>
      <option value="Flood">Flood</option>
      <option value="Hurricane">Hurricane</option>
      <option value="Earthquake">Earthquake</option>
      <option value="Wildfire">Wildfire</option>
      <option value="Tornado">Tornado</option>
      <option value="Other">Other</option>
    </select>
  </div>
  <div class="w-full px-3">
    <label class="block text-gray-600 mb-1 font-semibold" for="description">Local do Desastre</label>
    <div id="report-map"></div>
  </div>
  <div class="w-full px-3">
    <label class="block text-gray-600 mb-1 font-semibold" for="description">Description</label>
    <textarea
      id="description"
      bind:value={description}
      rows="4"
      class="border border-gray-300 rounded w-full p-2 focus:outline-none focus:border-blue-500"
      placeholder="Descreva o desastre ..."
    ></textarea>
  </div>
  <div class="w-full px-3">
    <button
      on:click={submitDisaster}
      class="btn btn-primary w-full"
      disabled={isSubmitting}
    >
      {#if isSubmitting}
        Submitting...
      {:else}
        Submit Disaster
      {/if}
    </button>
  </div>
</div>
