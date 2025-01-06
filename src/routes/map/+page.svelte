<!-- src/routes/map/+page.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { db } from '$lib/firebase'; // Adjust the path if necessary
  import type { DocumentData } from 'firebase/firestore';
  import {
    collection,
    onSnapshot,
    QuerySnapshot,
  } from 'firebase/firestore';
  import L from 'leaflet';

  // Import Leaflet CSS
  import 'leaflet/dist/leaflet.css';

  // Import MarkerCluster plugin and its CSS
  import 'leaflet.markercluster/dist/MarkerCluster.css';
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

  // Import Leaflet marker icons
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

  let map: L.Map;
  let markerClusterGroup: L.MarkerClusterGroup;

  // Reference to the Firestore subscription
  let unsubscribeSnapshot: () => void;

  // Define map center and zoom level
  const defaultCenter: [number, number] = [20, 0]; // Example: Equator
  const defaultZoom: number = 2;

  // Function to get custom marker icons based on disaster type
  function getMarkerIcon(type: string): L.Icon {
    let iconUrl = markerIcon; // Default icon

    switch (type.toLowerCase()) {
      case 'flood':
        iconUrl = '/flood.png'; // Ensure these icons exist in the public/icons directory
        break;
      case 'hurricane':
        iconUrl = '/hurricane.png';
        break;
      case 'earthquake':
        iconUrl = '/earthquake.png';
        break;
      case 'wildfire':
        iconUrl = '/wildfire.png';
        break;
      default:
        iconUrl = markerIcon; // Default
    }

    return new L.Icon({
      iconUrl,
      iconRetinaUrl: markerIcon2x,
      shadowUrl: markerShadow,
      iconSize: [35, 50], // Default size
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }

  onMount(async () => {
    try {
      // Dynamically import MarkerCluster plugin
      await import('leaflet.markercluster');

      // Initialize the map
      map = L.map('disaster-map').setView(defaultCenter, defaultZoom);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Initialize Marker Cluster Group
      markerClusterGroup = L.markerClusterGroup();
      map.addLayer(markerClusterGroup);

      // Reference to the disasters collection
      const disastersCollectionRef = collection(db, 'disasters');

      // Subscribe to real-time updates
      unsubscribeSnapshot = onSnapshot(
        disastersCollectionRef,
        (snapshot: QuerySnapshot<DocumentData>) => {
          console.log('Received snapshot with', snapshot.size, 'documents.');

          // Clear existing markers
          markerClusterGroup.clearLayers();

          // Array to hold all marker positions for map fitting
          const markers: L.Marker[] = [];

          // Add markers for each disaster
          snapshot.forEach((doc) => {
            const disaster = doc.data();
            console.log('Processing disaster:', doc.id, disaster);
            const { location, type, description, createdAt, createdBy } = disaster;

            if (
              location &&
              typeof location.lat === 'number' &&
              typeof location.lng === 'number'
            ) {
              console.log(
                `Adding marker for disaster ${doc.id} at (${location.lat}, ${location.lng})`
              );

              const marker = L.marker([location.lat, location.lng], {
                icon: getMarkerIcon(type),
              });

              marker.bindPopup(`
                <div>
                  <strong>Type:</strong> ${type}<br/>
                  <strong>Description:</strong> ${description}<br/>
                  <strong>Date:</strong> ${createdAt.toDate().toLocaleString()}<br/>
                  <strong>Reported By:</strong> ${createdBy}
                </div>
              `);

              markerClusterGroup.addLayer(marker);
              markers.push(marker);
            } else {
              console.warn('Invalid location data for disaster:', doc.id, disaster);
            }
          });

          // Adjust map view to fit all markers
          if (markers.length > 0) {
            const group = new L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.2));
          }
        },
        (error) => {
          console.error('Error fetching disaster data:', error);
          alert('Failed to load disaster data. Please try again later.');
        }
      );
    } catch (error) {
      console.error('Error loading MarkerCluster plugin:', error);
      alert('Failed to load map plugins. Please try again later.');
    }
  });

  onDestroy(() => {
    if (unsubscribeSnapshot) {
      unsubscribeSnapshot();
    }

    if (map) {
      map.remove();
    }
  });
</script>

<style>
  .map-container {
    width: 100%;
    height: 600px; /* Adjust the height as needed */
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
</style>

<div class="max-w-screen-lg mx-auto mt-10">
  <h2 class="text-2xl font-semibold text-gray-700 mb-4">Disaster Map</h2>

  <div id="disaster-map" class="map-container"></div>
</div>

