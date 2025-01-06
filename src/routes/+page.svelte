<script lang="ts">
    import { user } from "$lib/firebase";
    import Map from "$lib/components/Map.svelte";
</script>

<div class="flex flex-col items-center space-y-4">
    <div class="navbar bg-neutral text-neutral-content">
        <div class="navbar-start"></div>
        <a href="/" class="navbar-center text-2xl">SOS Brasil</a>
        <div class="navbar-end"></div>
    </div>
    <div class="text-justify px-3">
        Uma plataforma para relatar e monitorar desastres climáticos, conectar-se com doadores e coordenar esforços de ajuda.
    </div>
    <Map />
    <div class="w-full px-3">
        {#if $user}
            <div class="w-full">Bem vindo, {$user.displayName}</div>
        {:else}
            <a href="/login" class="btn w-full">Login</a>
        {/if}
    </div>
</div>
<div class="flex flex-col items-center space-y-4">
    <div class="text-start px-3 h-20 w-full">
        Filtros
    </div>
    <div class="flex w-full px-3 justify-between">
        <a href="/donations" class="btn">Adicionar Local de Doação</a>
        <a href="/report" class="btn">Adicionar Desastre</a>
    </div>
</div>
