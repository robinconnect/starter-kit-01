import { useAppContext } from './contexts/appContext';

type Props = {
	className?: string;
	showTitle?: boolean;
};

export const PublicationAbout = ({ className = '', showTitle = true }: Props) => {
	const { publication } = useAppContext();

	// Return null if there's no about content
	if (!publication.about?.html && !publication.about?.text) {
		return null;
	}

	return (
		<div className={`prose prose-lg dark:prose-invert max-w-none ${className}`}>
			{showTitle && (
				<h2 className="text-2xl font-bold text-slate-900 dark:text-neutral-50 mb-4">
					About {publication.displayTitle || publication.title}
				</h2>
			)}
			{publication.about?.html ? (
				<div
					className="hashnode-content-style"
					dangerouslySetInnerHTML={{ __html: publication.about.html }}
				/>
			) : (
				<p className="text-slate-700 dark:text-neutral-300 leading-relaxed">
					{publication.about?.text}
				</p>
			)}
		</div>
	);
};
