<script lang="ts">
	let { content, revision }: { content: string; revision: number } = $props()
</script>

{#key revision}<span class="markdown-svelte-stream-delta">{content}</span>{/key}
