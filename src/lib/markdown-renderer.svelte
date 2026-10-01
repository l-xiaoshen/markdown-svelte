<script lang="ts">
	import MarkdownDocument from './document/markdown-document.svelte'
	import type { MarkdownRendererProps } from './markdown-props'
	import { nodeRenderers } from './render/renderers'
	import { provideRenderContext } from './render/context'

	let props: MarkdownRendererProps = $props()
	provideRenderContext({ renderers: nodeRenderers, animate: false })
</script>

<MarkdownDocument {...props} />
