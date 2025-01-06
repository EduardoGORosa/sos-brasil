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
  /* Optional: Customize styles as needed */
  .map-container {
    width: 100%;
    height: 400px;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
</style>

<div class="max-w-screen-lg mx-auto mt-10 space-y-6">
  <h2 class="text-2xl font-semibold text-gray-700">Report a Disaster</h2>

  <div class="flex flex-col md:flex-row gap-6">
    <!-- Form Section -->
    <div class="w-full md:w-1/2 bg-white p-6 rounded shadow space-y-4">
      <div>
        <label class="block text-gray-600 mb-1 font-semibold" for="disasterType">Type of Disaster</label>
        <select
          id="disasterType"
          bind:value={disasterType}
          class="border border-gray-300 rounded w-full p-2 focus:outline-none focus:border-blue-500"
        >
          <option value="" disabled selected>Select disaster type</option>
          <option value="Flood">Flood</option>
          <option value="Hurricane">Hurricane</option>
          <option value="Earthquake">Earthquake</option>
          <option value="Wildfire">Wildfire</option>
          <option value="Tornado">Tornado</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label class="block text-gray-600 mb-1 font-semibold" for="description">Description</label>
        <textarea
          id="description"
          bind:value={description}
          rows="4"
          class="border border-gray-300 rounded w-full p-2 focus:outline-none focus:border-blue-500"
          placeholder="Describe the disaster, severity, etc."
        ></textarea>
      </div>

      <div>
        <p class="text-sm text-gray-500">
          <strong>Selected Coordinates:</strong> 
          <span class="ml-1">{lat !== null ? lat.toFixed(5) : '-'} / {lng !== null ? lng.toFixed(5) : '-'}</span>
        </p>
      </div>

      <button
        on:click={submitDisaster}
        class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition w-full disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {#if isSubmitting}
          Submitting...
        {:else}
          Submit Disaster
        {/if}
      </button>
    </div>

    <!-- Leaflet Map for Picking Location -->
    <div id="report-map" class="w-full md:w-1/2 h-[400px] rounded overflow-hidden border border-gray-200 shadow map-container"></div>
  </div>

  <!-- Debugging Section -->
  <div class="mt-4 p-4 bg-gray-100 rounded">
    {#if $user}
      <p class="text-green-600">Logged in as: {$user.email}</p>
      <p class="text-blue-600">UID: {$user.uid}</p>
    {:else}
      <p class="text-red-600">You are not logged in.</p>
    {/if}
  </div>
</div>

