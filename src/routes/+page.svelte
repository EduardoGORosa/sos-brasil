<script lang="ts">
    import { user, auth } from "$lib/firebase";
    import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
    import Map from "$lib/components/Map.svelte";

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
        console.log(user)
    }
</script>

<div class="flex flex-col items-center space-y-4">
    <div class="navbar bg-neutral text-neutral-content">
        <div class="navbar-start">
            <a href="/" class="text-2xl">SOS Brasil</a>
        </div>
        <div class="navbar-center"></div>
        <div class="navbar-end">
            {#if $user}
                <div class="flex flex-col items-end">
                    <span class="text-sm">{$user.displayName}</span>
                    <button class="btn btn-xs btn-link" onclick={() => signOut(auth)}>Logout</button>
                </div>
            {:else}
                <button class="btn btn-primary" onclick={signInWithGoogle}>Login</button>
            {/if}
        </div>
    </div>
    <div class="text-justify px-3">
        Essa é uma plataforma para relatar e monitorar desastres climáticos, conectar-se com doadores e coordenar esforços de ajuda.
    </div>
    <div class="w-full px-3">
        <label class="block mb-1 font-semibold" for="description">Local do Desastre</label>
        <Map />
    </div>
    <div class="flex w-full px-3 justify-between">
        <a href="/donations" class="btn btn-secondary">Adicionar Local de Doação</a>
        <a href="/report" class="btn btn-secondary">Adicionar Desastre</a>
    </div>
</div>