import { useEmbeds } from '@starter-kit/utils/renderer/hooks/useEmbeds';
import { markdownToHtml } from '@starter-kit/utils/renderer/markdownToHtml';
import { memo } from 'react';
import { processLinksInHTML } from '../utils/link-processor';

type Props = {
	contentMarkdown: string;
};

const MarkdownToHtmlComponent = ({ contentMarkdown }: Props) => {
	const rawContent = markdownToHtml(contentMarkdown);
	// Process links to automatically add target and rel attributes
	const content = processLinksInHTML(rawContent);
	useEmbeds({ enabled: true });

	return (
		<div
			className="hashnode-content-style mx-auto w-full px-5 md:max-w-screen-md"
			dangerouslySetInnerHTML={{ __html: content }}
		/>
	);
};

export const MarkdownToHtml = memo(MarkdownToHtmlComponent);
