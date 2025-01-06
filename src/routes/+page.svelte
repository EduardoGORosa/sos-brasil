
<script lang="ts">
    import { user } from "$lib/firebase";
    import Map from "$lib/components/Map.svelte";
</script>

<div class="flex flex-col items-center space-y-4">
    <div class="navbar bg-neutral text-neutral-content">
        <div class="navbar-start"></div>
        <span class="navbar-center text-2xl">SOS Brasil</span>
        <div class="navbar-end"></div>
    </div>
    <div class="text-justify px-3">
        Uma plataforma para relatar e monitorar desastres climáticos, conectar-se com doadores e coordenar esforços de ajuda.
    </div>
    <Map />
    <div class="w-full px-3">
        <button class="btn w-full">Login</button>
    </div>
</div>