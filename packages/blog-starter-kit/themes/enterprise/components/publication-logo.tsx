import { resizeImage } from '@starter-kit/utils/image';
import Link from 'next/link';
import { useAppContext } from './contexts/appContext';
import { PublicationFragment } from '../generated/graphql';

const getPublicationLogo = (publication: PublicationFragment, isSidebar?: boolean) => {
	if (isSidebar) {
		return publication.preferences.logo; // Always display light mode logo in sidebar
	}
	return publication.preferences.darkMode?.logo || publication.preferences.logo;
}

export const PublicationLogo = ({ isSidebar }: { isSidebar?: boolean }) => {
    const { publication } = useAppContext();
    const PUBLICATION_LOGO = getPublicationLogo(publication, isSidebar);
    
    return (
        <div className="flex flex-col items-start">
            <h1 className="relative w-full">
                <Link
                    href={'/'}
                    aria-label={`${publication.title} blog home page`}
                    className="flex flex-row items-center justify-start gap-3"
                >
                    {PUBLICATION_LOGO ? (
                        <>
                            <img
                                className="block w-32 shrink-0 md:w-40"
                                alt={publication.title}
                                src={resizeImage(PUBLICATION_LOGO, { w: 320, h: 80 })}
                            />
                            <span className="text-2xl font-semibold md:text-3xl">Blog</span>
                        </>
                    ) : (
                        <span className="block text-2xl font-semibold md:text-4xl">
                            {publication.title}
                        </span>
                    )}
                </Link>
            </h1>
            {publication.descriptionSEO && (
                <p className="mt-2 text-left text-base text-neutral-600 dark:text-neutral-300 max-w-md ml-0">
                    {publication.descriptionSEO}
                </p>
            )}
        </div>
    );
};
