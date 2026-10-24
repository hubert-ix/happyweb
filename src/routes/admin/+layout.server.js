import { redirect, error } from '@sveltejs/kit';

export async function load({ parent }) {
  return { pageTitle: "Administration" };
}
