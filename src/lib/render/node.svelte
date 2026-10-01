<script lang="ts">
	import type { NodeProps } from './node-props'
	import { resolveNodeRenderer } from './registry'
	import { useRenderContext } from './context'
	import type { ParsedMarkdownNode } from '../renderable-node'

	let props: NodeProps<ParsedMarkdownNode> = $props()
	const context = useRenderContext()
	let Renderer = $derived(resolveNodeRenderer(context.renderers, props.node.type))
</script>

<Renderer {...props} />
