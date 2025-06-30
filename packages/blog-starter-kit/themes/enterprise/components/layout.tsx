import { Analytics } from './analytics';
import { Integrations } from './integrations';
import { Meta } from './meta';
import { Scripts } from './scripts';
import { useSmartLinks, processExistingLinks } from '../hooks/use-smart-links';

type Props = {
	children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
	// Enable smart link handling for the entire app
	useSmartLinks();
	processExistingLinks();
	
	return (
		<>
			<Meta />
			<Scripts />
			<div className="min-h-screen bg-white dark:bg-neutral-950">
				<main>{children}</main>
			</div>
			<Analytics />
			<Integrations />
		</>
	);
};
