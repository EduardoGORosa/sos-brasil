<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { auth, db } from '$lib/firebase';
  import { onAuthStateChanged } from 'firebase/auth';
  import { doc, getDoc } from 'firebase/firestore';
  import { currentUser, userRole } from '$lib/stores/authStore';
  import "../app.css";


  onMount(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      currentUser.set(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        userRole.set(userDoc.data()?.role ?? 'citizen');
      } else {
        userRole.set(null);
      }
    });
    return () => unsubscribe();
  });
</script>

<!-- Global navigation bar -->
<header class="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
  <nav class="space-x-4">
    <a href="/" class="hover:underline font-semibold">Home</a>
    <a href="/map" class="hover:underline">Disaster Map</a>
    <a href="/report" class="hover:underline">Report Disaster</a>
    <a href="/donations" class="hover:underline">Donations</a>
  </nav>
  <div>
    <!-- Display sign in/out or user info -->
    <!-- For brevity, no actual sign-in logic here -->
    <button class="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100">
      Sign In
    </button>
  </div>
</header>

<!-- Main content slot -->
<main class="p-6 min-h-[calc(100vh-150px)]">
  <slot />
</main>

<!-- Footer -->
<footer class="bg-gray-800 text-gray-300 text-center py-4">
  <p>&copy; {new Date().getFullYear()} SOS Brasil. All rights reserved.</p>
</footer>

