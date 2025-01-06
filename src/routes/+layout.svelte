<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css'; // your Tailwind or global CSS
  import { user } from "$lib/firebase";
</script>

<header class="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
  <nav class="space-x-4">
    <a href="/" class="hover:underline font-semibold">Home</a>
    <a href="/map" class="hover:underline">Disaster Map</a>
    <a href="/report" class="hover:underline">Report Disaster</a>
    <a href="/donations" class="hover:underline">Donations</a>
  </nav>
{#if $user}
  <p class="card-title">{$user.displayName}</p>
{:else}
    <a href="/login" class="hover:underline">Login</a>
{/if}
</header>
<main class="p-6 min-h-[calc(100vh-150px)]">
  <slot />
</main>

<footer class="bg-gray-800 text-gray-300 text-center py-4">
  <p>&copy; {new Date().getFullYear()} SOS Brasil. All rights reserved.</p>
</footer>

