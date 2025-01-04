// src/lib/stores/authStore.ts
import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';

export const currentUser = writable<User | null>(null);
export const userRole = writable<'citizen' | 'government' | null>(null);

