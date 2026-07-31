import { untrack } from 'svelte'

interface StreamingTextOptions {
	getContent: () => string
	getAnimate: () => boolean
}

export interface StreamingTextParts {
	stableContent: string
	deltaContent: string
}

export function resolveStreamingText(content: string, previousContent: string, animate: boolean): StreamingTextParts {
	if (animate && content.length > previousContent.length && content.startsWith(previousContent)) {
		return {
			stableContent: previousContent,
			deltaContent: content.slice(previousContent.length)
		}
	}

	return {
		stableContent: content,
		deltaContent: ''
	}
}

export class StreamingText {
	stableContent = $state('')
	deltaContent = $state('')
	revision = $state(0)

	#previousContent: string
	#previousAnimate: boolean

	constructor(private readonly options: StreamingTextOptions) {
		const content = untrack(this.options.getContent)
		const animate = untrack(this.options.getAnimate)

		this.#previousContent = content
		this.#previousAnimate = animate
		this.stableContent = content

		$effect.pre(() => {
			const nextContent = this.options.getContent()
			const nextAnimate = this.options.getAnimate()

			untrack(() => {
				if (nextContent === this.#previousContent && nextAnimate === this.#previousAnimate) {
					return
				}

				this.#apply(resolveStreamingText(nextContent, this.#previousContent, nextAnimate))
				this.#previousContent = nextContent
				this.#previousAnimate = nextAnimate
			})
		})
	}

	#apply(parts: StreamingTextParts): void {
		this.stableContent = parts.stableContent
		this.deltaContent = parts.deltaContent
		if (parts.deltaContent) {
			this.revision += 1
		}
	}
}
