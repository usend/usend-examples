<script lang="ts">
  import { enhance } from '$app/forms';
  let { form } = $props();
</script>

<form method="POST" use:enhance>
  <input name="email" type="email" required />
  <textarea name="message" required></textarea>
  <button>Send</button>
  {#if form?.success}<p>Thanks, we got it.</p>{/if}
  {#if form?.message}<p>{form.message}</p>{/if}
</form>
