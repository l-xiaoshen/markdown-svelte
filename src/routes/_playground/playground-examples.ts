import overviewMarkdown from './examples/syntax.md?raw'
import codeMarkdown from './examples/hello-svelte.md?raw'
import tablesMarkdown from './examples/project-notes.md?raw'
import richTextMarkdown from './examples/formatting.md?raw'

export const playgroundExamples = [
	{
		id: 'overview',
		label: 'Overview',
		filename: 'syntax.md',
		markdown: overviewMarkdown.trimEnd()
	},
	{
		id: 'code',
		label: 'Code',
		filename: 'hello-svelte.md',
		markdown: codeMarkdown.trimEnd()
	},
	{
		id: 'tables',
		label: 'Tables & tasks',
		filename: 'project-notes.md',
		markdown: tablesMarkdown.trimEnd()
	},
	{
		id: 'rich-text',
		label: 'Rich text',
		filename: 'formatting.md',
		markdown: richTextMarkdown.trimEnd()
	}
] as const
