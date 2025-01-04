<!-- src/routes/donations/+page.svelte -->
<script lang="ts">
  import { db } from '$lib/firebase';
  import { collection, addDoc, getDocs } from 'firebase/firestore';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { currentUser } from '$lib/stores/authStore';

  let amount = '';
  let cause = '';
  let donations = [];

  onMount(async () => {
    const snapshot = await getDocs(collection(db, 'donations'));
    donations = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  });

  async function donate() {
    if (!amount || !cause) {
      alert('Please enter an amount and cause.');
      return;
    }

    const user = get(currentUser);
    const donorName = user?.displayName || 'Anonymous';

    await addDoc(collection(db, 'donations'), {
      donorId: user?.uid || null,
      donorName,
      amount: parseFloat(amount),
      cause,
      donatedAt: new Date().toISOString()
    });

    alert('Thank you for your donation!');
    amount = '';
    cause = '';

    // Refresh donation list
    const snapshot = await getDocs(collection(db, 'donations'));
    donations = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
</script>

<div class="max-w-screen-lg mx-auto mt-10">
  <h2 class="text-2xl font-semibold text-gray-700 mb-6">Donations</h2>

  <div class="flex flex-col md:flex-row gap-6">
    <!-- Donation Form -->
    <div class="w-full md:w-1/2 p-6 bg-white rounded shadow space-y-4">
      <h3 class="text-lg font-semibold text-gray-600">Make a Donation</h3>
      <div>
        <label class="block text-gray-600 mb-1 font-semibold">Amount</label>
        <input
          type="number"
          bind:value={amount}
          class="border border-gray-300 rounded w-full p-2 focus:outline-none focus:border-blue-500"
          placeholder="Enter donation amount"
        />
      </div>
      <div>
        <label class="block text-gray-600 mb-1 font-semibold">Cause / Disaster ID</label>
        <input
          type="text"
          bind:value={cause}
          class="border border-gray-300 rounded w-full p-2 focus:outline-none focus:border-blue-500"
          placeholder="Specify which disaster or cause"
        />
      </div>
      <button
        on:click={donate}
        class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500 transition"
      >
        Donate
      </button>
    </div>

    <!-- Donor List -->
    <div class="w-full md:w-1/2 bg-white p-6 rounded shadow">
      <h3 class="text-lg font-semibold text-gray-600 mb-4">Recent Donations</h3>
      {#if donations.length > 0}
        <ul class="space-y-3">
          {#each donations as donation}
            <li class="border rounded p-3">
              <p class="font-semibold text-gray-700">
                {donation.donorName} donated 
                <span class="text-blue-600 font-bold">${donation.amount}</span>
              </p>
              <p class="text-sm text-gray-500">Cause: {donation.cause}</p>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-gray-500">No donations yet.</p>
      {/if}
    </div>
  </div>
</div>

