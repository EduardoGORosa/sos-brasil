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

<div class="flex flex-col items-center space-y-4">
  <div class="navbar bg-neutral text-neutral-content">
    <div class="navbar-start">
      <a href="/" class="btn btn-link">Voltar</a>
    </div>
    <span class="navbar-center text-2xl">Doação</span>
    <div class="navbar-end"></div>
  </div>
  <div class="w-full px-3">
    <label class="block text-gray-600 mb-1 font-semibold" for="description">
      Item Necessário
    </label>
    <input
      type="text"
      bind:value={cause}
      class="border border-gray-300 rounded w-full p-2 focus:outline-none focus:border-blue-500"
      placeholder="Item a ser doado (mudar pois está causa)"
    />
  </div>
  <div class="w-full px-3">
    <label class="block text-gray-600 mb-1 font-semibold" for="description">
      Quantidade
    </label>
    <input
      type="number"
      bind:value={amount}
      class="border border-gray-300 rounded w-full p-2 focus:outline-none focus:border-blue-500"
      placeholder="Quantidade a ser doada"
    />
  </div>
  <div class="w-full px-3">
    <h3 class="text-lg font-semibold text-gray-600 mb-4">Doações Recentes</h3>
    {#if donations.length > 0}
      <ul class="space-y-3">
        {#each donations as donation}
          <li class="border rounded p-3">
            <p class="font-semibold text-gray-700">
              {donation.donorName} doado 
              <span class="text-blue-600 font-bold">${donation.amount}</span>
            </p>
            <p class="text-sm text-gray-500">Causa: {donation.cause}</p>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="text-gray-500">Sem doações feitas.</p>
    {/if}
  </div>
  <div class="w-full px-3">
    <button 
      on:click={donate} 
      class="btn btn-primary w-full"
    >
      Doar
    </button>
  </div>
</div>

