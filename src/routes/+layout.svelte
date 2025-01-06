<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css'; // your Tailwind or global CSS
</script>

<div class="flex flex-col min-h-screen">
  <main class="flex-grow bg-gray-50">
    <slot />
  </main>

  <footer class="bg-gray-800 text-gray-300 text-center py-4">
    <p>&copy; {new Date().getFullYear()} SOS Brasil. All rights reserved.</p>
  </footer>
</div>
