<script lang="ts">
	import { onMount, tick } from 'svelte'

	let { content, onsettled }: { content: string; onsettled: () => void } = $props()
	let element: HTMLSpanElement
	let settled = false

	function settle(): void {
		if (settled) return
		settled = true
		onsettled()
	}

	onMount(() => {
		let active = true
		element.addEventListener('animationcancel', settle)
		void tick().then(() => {
			if (active && element.getAnimations().length === 0) settle()
		})
		return () => {
			active = false
			element.removeEventListener('animationcancel', settle)
		}
	})
</script>

<span bind:this={element} class="markdown-svelte-stream-delta" onanimationend={settle}>{content}</span>
