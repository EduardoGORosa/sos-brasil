<script lang="ts">
    import { user } from "$lib/firebase";
    import Map from "$lib/components/Map.svelte";
</script>

<div class="flex flex-col items-center space-y-4">
    <div class="navbar bg-neutral text-neutral-content">
        <div class="navbar-start"></div>
        <span class="navbar-center text-2xl">SOS Brasil</span>
        <div class="navbar-end">
            <a href="/" class="btn btn-link">Logout</a>
        </div>
    </div>
    <div class="text-start px-3 h-20 w-full">
        Filtros
    </div>
    <Map />
    <div class="flex w-full px-3 justify-between">
        <a href="/donations" class="btn">Adicionar Local de Doação</a>
        <a href="/report" class="btn">Adicionar Desastre</a>
    </div>
</div>