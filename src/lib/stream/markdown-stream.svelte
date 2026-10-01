<script lang="ts">
	import MarkdownRenderer from '../markdown-renderer.svelte'
	import type { MarkdownStreamProps } from './markdown-stream-props'
	import StreamNode from './node.svelte'

	let { nodes, animate = true, ...props }: MarkdownStreamProps = $props()
</script>

<MarkdownRenderer {...props} {nodes} nodeRenderer={StreamNode} {animate} stream />

<style>
	:global(.markdown-svelte-stream .markdown-svelte-stream-delta) {
		animation: markdown-svelte-stream-fade var(--markdown-stream-fade-duration, 280ms)
			var(--markdown-stream-fade-easing, cubic-bezier(0.33, 0, 0.67, 1)) backwards;
	}

	/* Growing content needs its natural height and margin layout throughout entry. */
	:global(
		.markdown-svelte-stream
			> :where(
				.markdown-svelte-heading,
				.markdown-svelte-paragraph,
				.markdown-svelte-list,
				.markdown-svelte-code-block,
				.markdown-svelte-table-wrapper,
				.markdown-svelte-definition-list
			)
	),
	:global(
		.markdown-svelte-stream
			:where(
				.markdown-svelte-stream-list-item,
				.markdown-svelte-stream-definition-item,
				.markdown-svelte-stream-footnote,
				.markdown-svelte-stream-table-cell,
				.markdown-svelte-stream-math-block,
				.markdown-svelte-emoji,
				.markdown-svelte-checkbox,
				.markdown-svelte-footnote-reference,
				.markdown-svelte-footnote-backlink,
				.markdown-svelte-reference,
				.markdown-svelte-fallback,
				.markdown-svelte-html-escaped,
				.markdown-svelte-image-fallback
			)
	) {
		animation: markdown-svelte-stream-line-enter var(--markdown-stream-line-duration, 110ms)
			var(--markdown-stream-line-easing, cubic-bezier(0.25, 0.46, 0.45, 0.94)) backwards;
	}

	:global(.markdown-svelte-stream .markdown-svelte-stream-code-size),
	:global(.markdown-svelte-stream .markdown-svelte-stream-math-size) {
		overflow-y: clip !important;
		transition: height var(--markdown-stream-size-duration, 180ms)
			var(--markdown-stream-size-easing, cubic-bezier(0.25, 0.46, 0.45, 0.94));
	}

	:global(.markdown-svelte-stream .markdown-svelte-stream-block-enter) {
		animation: markdown-svelte-stream-block-enter var(--markdown-stream-enter-duration, 160ms)
			var(--markdown-stream-enter-easing, cubic-bezier(0.25, 0.46, 0.45, 0.94)) backwards;
	}

	:global(.markdown-svelte-stream .markdown-svelte-stream-rule) {
		transform-origin: center;
		animation: markdown-svelte-stream-rule var(--markdown-stream-enter-duration, 160ms)
			var(--markdown-stream-enter-easing, cubic-bezier(0.25, 0.46, 0.45, 0.94)) backwards;
	}

	:global(.markdown-svelte-stream .markdown-svelte-stream-code-language) {
		animation: markdown-svelte-stream-metadata 120ms cubic-bezier(0.25, 0.46, 0.45, 0.94) backwards;
	}

	:global(.markdown-svelte-stream .markdown-svelte-stream-image) {
		opacity: 0;
		scale: 0.995;
		transition:
			opacity var(--markdown-stream-media-duration, 180ms) ease-out,
			scale var(--markdown-stream-media-duration, 180ms) cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	:global(.markdown-svelte-stream .markdown-svelte-stream-image--loaded) {
		opacity: 1;
		scale: 1;
	}

	@keyframes markdown-svelte-stream-fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes markdown-svelte-stream-line-enter {
		from {
			opacity: 0.35;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes markdown-svelte-stream-block-enter {
		from {
			opacity: 0.35;
			translate: 0 0.2rem;
		}
		to {
			opacity: 1;
			translate: 0 0;
		}
	}

	@keyframes markdown-svelte-stream-rule {
		from {
			opacity: 0.25;
			transform: scaleX(0.08);
		}
		to {
			opacity: 1;
			transform: scaleX(1);
		}
	}

	@keyframes markdown-svelte-stream-metadata {
		from {
			opacity: 0;
			translate: 0 0.12rem;
		}
		to {
			opacity: 1;
			translate: 0 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.markdown-svelte-stream .markdown-svelte-stream-delta) {
			animation: none;
		}

		:global(.markdown-svelte-stream .markdown-svelte-stream-block-enter),
		:global(.markdown-svelte-stream .markdown-svelte-stream-rule),
		:global(.markdown-svelte-stream .markdown-svelte-stream-code-language) {
			animation: none;
		}

		:global(.markdown-svelte-stream .markdown-svelte-stream-code-size),
		:global(.markdown-svelte-stream .markdown-svelte-stream-math-size) {
			transition: none;
		}

		:global(.markdown-svelte-stream .markdown-svelte-stream-image) {
			opacity: 1;
			scale: 1;
			transition: none;
		}

		:global(
			.markdown-svelte-stream
				> :where(
					.markdown-svelte-heading,
					.markdown-svelte-paragraph,
					.markdown-svelte-list,
					.markdown-svelte-code-block,
					.markdown-svelte-table-wrapper,
					.markdown-svelte-definition-list
				)
		),
		:global(
			.markdown-svelte-stream
				:where(
					.markdown-svelte-stream-list-item,
					.markdown-svelte-stream-definition-item,
					.markdown-svelte-stream-footnote,
					.markdown-svelte-stream-table-cell,
					.markdown-svelte-stream-math-block,
					.markdown-svelte-emoji,
					.markdown-svelte-checkbox,
					.markdown-svelte-footnote-reference,
					.markdown-svelte-footnote-backlink,
					.markdown-svelte-reference,
					.markdown-svelte-fallback,
					.markdown-svelte-html-escaped,
					.markdown-svelte-image-fallback
				)
		) {
			animation: none;
		}
	}
</style>
