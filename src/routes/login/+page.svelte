<script lang="ts">
    import { user, auth } from "$lib/firebase";

    import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
        console.log(user)
    }
</script>

<h2>Login</h2>

{#if $user}
  <h2 class="card-title">Welcome, {$user.displayName}</h2>
  <p class="text-center text-success">You are logged in</p>
  <button class="btn btn-warning" onclick={() => signOut(auth)}>Sign out</button>
{:else}
  <button class="btn btn-primary" onclick={signInWithGoogle}>Sign in with Google</button>
{/if}
