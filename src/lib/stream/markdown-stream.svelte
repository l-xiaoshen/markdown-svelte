<script lang="ts">
	import MarkdownRenderer from '../markdown/markdown-renderer.svelte'
	import type { MarkdownStreamProps } from './markdown-stream-props'
	import StreamNode from './node.svelte'

	let { nodes, animate = true, ...props }: MarkdownStreamProps = $props()
</script>

<MarkdownRenderer {...props} {nodes} nodeRenderer={StreamNode} {animate} stream />

<style>
	:global(.markdown-svelte-stream .markdown-svelte-stream-enter),
	:global(.markdown-svelte-stream .markdown-svelte-stream-delta) {
		animation: markdown-svelte-stream-fade var(--markdown-stream-fade-duration, 280ms)
			var(--markdown-stream-fade-easing, cubic-bezier(0.33, 0, 0.67, 1)) backwards;
	}

	@keyframes markdown-svelte-stream-fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.markdown-svelte-stream .markdown-svelte-stream-enter),
		:global(.markdown-svelte-stream .markdown-svelte-stream-delta) {
			animation: none;
		}
	}
</style>
