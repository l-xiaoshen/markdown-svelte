import { quadOut } from 'svelte/easing'
import type { SlideParams } from 'svelte/transition'

export const streamSlide = {
	axis: 'y',
	duration: 180,
	easing: quadOut
} as const satisfies SlideParams

export const streamItemSlide = {
	axis: 'y',
	duration: 120,
	easing: quadOut
} as const satisfies SlideParams
