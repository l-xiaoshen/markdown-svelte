<script lang="ts">
	const paths = {
		play: 'm8 5 11 7-11 7V5Z',
		pause: 'M9 5v14M15 5v14',
		replay: 'M3 10a9 9 0 1 1 2 8M3 4v6h6',
		arrow: 'M5 12h14m-5-5 5 5-5 5',
		code: 'm8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 20',
		eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
		check: 'm5 12 4 4L19 6',
		copy: 'M9 9h11v11H9V9Zm6-4V3H3v12h2',
		wave: 'M3 10v4m4-8v12m5-15v18m5-15v12m4-8v4',
		skip: 'm5 5 10 7-10 7V5Zm14 0v14'
	}
	let { name, size = 16 }: { name: keyof typeof paths; size?: number } = $props()
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.7"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<path d={paths[name]} />
</svg>
