<!-- src/routes/report/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '$lib/firebase';
  import { collection, addDoc } from 'firebase/firestore';
  import { get } from 'svelte/store';
  import { currentUser, userRole } from '$lib/stores/authStore';

  let disasterType = '';
  let description = '';
  let lat = null;
  let lng = null;

  let map;
  let marker = null;

  onMount(() => {
    const mapElement = document.getElementById('report-map');
    map = new google.maps.Map(mapElement, {
      center: { lat: 0, lng: 0 },
      zoom: 2
    });

    map.addListener('click', (e) => {
      const clickLat = e.latLng?.lat();
      const clickLng = e.latLng?.lng();

      if (clickLat && clickLng) {
        lat = clickLat;
        lng = clickLng;
        if (!marker) {
          marker = new google.maps.Marker({
            position: { lat, lng },
            map
          });
        } else {
          marker.setPosition({ lat, lng });
        }
      }
    });
  });

  async function submitDisaster() {
    if (!disasterType || !description || lat === null || lng === null) {
      alert('Please fill out all fields and select a location on the map.');
      return;
    }

    const user = get(currentUser);
    const role = get(userRole);

    await addDoc(collection(db, 'disasters'), {
      type: disasterType,
      description,
      location: { lat, lng },
      createdBy: user?.uid || null,
      role,
      createdAt: new Date().toISOString()
    });

    alert('Disaster registered!');
    disasterType = '';
    description = '';
    lat = null;
    lng = null;
    if (marker) {
      marker.setMap(null);
      marker = null;
    }
  }
</script>

<div class="max-w-screen-lg mx-auto mt-10 space-y-6">
  <h2 class="text-2xl font-semibold text-gray-700">Report a Disaster</h2>

  <div class="flex flex-col md:flex-row gap-6">
    <!-- Form Section -->
    <div class="w-full md:w-1/2 bg-white p-6 rounded shadow space-y-4">
      <div>
        <label class="block text-gray-600 mb-1 font-semibold">Type of Disaster</label>
        <input
          type="text"
          bind:value={disasterType}
          class="border border-gray-300 rounded w-full p-2 focus:outline-none focus:border-blue-500"
          placeholder="e.g., Flood, Hurricane"
        />
      </div>

      <div>
        <label class="block text-gray-600 mb-1 font-semibold">Description</label>
        <textarea
          bind:value={description}
          rows="4"
          class="border border-gray-300 rounded w-full p-2 focus:outline-none focus:border-blue-500"
          placeholder="Describe the disaster, severity, etc."
        ></textarea>
      </div>

      <div>
        <p class="text-sm text-gray-500">
          <strong>Selected Coordinates:</strong> 
          <span class="ml-1">{lat} / {lng}</span>
        </p>
      </div>

      <button
        on:click={submitDisaster}
        class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition"
      >
        Submit Disaster
      </button>
    </div>

    <!-- Map for picking location -->
    <div id="report-map" class="w-full md:w-1/2 h-[400px] rounded overflow-hidden border border-gray-200 shadow"></div>
  </div>
</div>

