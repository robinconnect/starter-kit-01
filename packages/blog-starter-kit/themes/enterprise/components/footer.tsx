import Link from 'next/link';
import { Container } from './container';
import { useAppContext } from './contexts/appContext';
import { SocialLinks } from './social-links';

export const Footer = () => {
	const { publication } = useAppContext();
	const PUBLICATION_LOGO = publication.preferences.logo;
	return (
		<footer className="border-t py-20 dark:border-neutral-800 ">
			<Container className="px-5">
				{/* Logo section commented out */}
				<div className="flex flex-col items-center gap-5 text-center text-slate-600 dark:text-neutral-300">
					<SocialLinks />
					<p>&copy; 2025 RobinConnect</p>
					<p>
						<a href="#" className="hover:underline">
							Privacy Policy
						</a>{' '}
						·{' '}
						<a href="#" className="hover:underline">
							Terms
						</a>
					</p>
				</div>
			</Container>
		</footer>
	);
};
