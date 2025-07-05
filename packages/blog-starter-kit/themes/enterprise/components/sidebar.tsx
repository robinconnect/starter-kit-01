import Link from 'next/link';
import { useEffect, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { PublicationNavbarItem } from '../generated/graphql';
import { Button } from './button';
import { useAppContext } from './contexts/appContext';
import CloseSVG from './icons/svgs/CloseSVG';
import { PublicationLogo } from './publication-logo';
import { SocialLinks } from './social-links';
import { isInternalLink, createLinkProps } from '../utils/link-helper';

type Props = {
	toggleSidebar: () => void;
	navbarItems: (PublicationNavbarItem & { url: string })[];
};

function PublicationSidebar(props: Props) {
	const { toggleSidebar, navbarItems } = props;
	const [isMounted, setIsMounted] = useState(false);
	const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
	const { publication } = useAppContext();
	const hasSocialLinks = !Object.values(publication.links!).every((val) => val === '');

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const toggleExpanded = (itemLabel: string) => {
		setExpandedItems(prev => ({
			...prev,
			[itemLabel]: !prev[itemLabel]
		}));
	};

	return (
		<DialogPrimitive.Root open>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay
					className={`fixed inset-0 z-50 bg-slate-900 opacity-0 transition-opacity duration-300 ease-out ${
						isMounted && 'opacity-50'
					}`}
				/>
				<DialogPrimitive.Content
					onEscapeKeyDown={() => {
						toggleSidebar();
					}}
					onPointerDownOutside={() => {
						toggleSidebar();
					}}
					className={`${
						// When the sheet is mounted, we want to slide it in from the left.
						!isMounted ? '-translate-x-96' : 'translate-x-0'
					} fixed bottom-0 left-0 top-0 z-50 flex w-80 transform flex-col bg-white shadow-2xl duration-300 ease-out dark:border-neutral-800 dark:bg-neutral-950`}
				>
					<div className="blog-sidebar-header w-full shrink-0 py-6">
						<div className="flex items-center justify-between pl-8 pr-4">
							<div className="!text-xl">
								<PublicationLogo isSidebar />
							</div>

							<DialogPrimitive.Close asChild>
								<Button
									type="outline"
									label=""
									icon={<CloseSVG className="h-5 w-5 fill-current" />}
									className="rounded-xl !border-transparent !px-3 !py-2 hover:bg-neutral-800 dark:text-white"
									onClick={() => {
										toggleSidebar();
									}}
								/>
							</DialogPrimitive.Close>
						</div>
					</div>

					<div className="py-10 pl-8 pr-4">
						<h2 className="mb-4 text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">
							Blog menu
						</h2>
						<section className="mb-10">
							<ul className="flex flex-col gap-2 text-slate-700 dark:text-white">
								<li>
									<Link
										href="/"
										onClick={toggleSidebar}
										className="transition-200 block truncate text-ellipsis whitespace-nowrap rounded p-2 px-3 transition-colors hover:bg-slate-100 hover:text-black dark:hover:bg-neutral-800 dark:hover:text-white"
									>
										Home
									</Link>
								</li>
								{navbarItems.map((item) => {
									const itemWithChildren = item as any;
									const hasChildren = itemWithChildren.children && itemWithChildren.children.length > 0;
									const isExpanded = expandedItems[item.label || ''];
									
									return (
										<li key={item.url}>
											{hasChildren ? (
												<>
													{/* Main page link */}
													<div className="flex items-center">
														<Link
															href={item.url}
															onClick={toggleSidebar}
															className="transition-200 block flex-1 truncate text-ellipsis whitespace-nowrap rounded-l p-2 px-3 transition-colors hover:bg-slate-100 hover:text-black dark:hover:bg-neutral-800 dark:hover:text-white"
														>
															{item.label}
														</Link>
														{/* Toggle button */}
														<button
															onClick={() => toggleExpanded(item.label || '')}
															className="transition-200 px-3 py-2 rounded-r transition-colors hover:bg-slate-100 hover:text-black dark:hover:bg-neutral-800 dark:hover:text-white"
														>
															<span className="text-lg">{isExpanded ? '−' : '+'}</span>
														</button>
													</div>
													{/* Sub-menu items */}
													{isExpanded && (
														<ul className="ml-4 mt-2 flex flex-col gap-1">
															{itemWithChildren.children.map((subItem: any) => {
																const isExternal = !isInternalLink(subItem.url);
																
																return (
																	<li key={subItem.url}>
																		{isExternal ? (
																			<a
																				{...createLinkProps(subItem.url)}
																				onClick={toggleSidebar}
																				className="transition-200 block truncate text-ellipsis whitespace-nowrap rounded p-2 px-3 text-sm transition-colors hover:bg-slate-100 hover:text-black dark:hover:bg-neutral-800 dark:hover:text-white"
																			>
																				{subItem.label}
																			</a>
																		) : (
																			<Link
																				href={subItem.url}
																				onClick={toggleSidebar}
																				className="transition-200 block truncate text-ellipsis whitespace-nowrap rounded p-2 px-3 text-sm transition-colors hover:bg-slate-100 hover:text-black dark:hover:bg-neutral-800 dark:hover:text-white"
																			>
																				{subItem.label}
																			</Link>
																		)}
																	</li>
																);
															})}
														</ul>
													)}
												</>
											) : (
												<Link
													href={item.url}
													onClick={toggleSidebar}
													className="transition-200 block truncate text-ellipsis whitespace-nowrap rounded p-2 px-3 transition-colors hover:bg-slate-100 hover:text-black dark:hover:bg-neutral-800 dark:hover:text-white"
												>
													{item.label}
												</Link>
											)}
										</li>
									);
								})}
							</ul>
						</section>

						{hasSocialLinks && (
							<h2 className="mb-4 text-sm font-semibold uppercase leading-6 text-slate-500 dark:text-slate-400">
								Blog socials
							</h2>
						)}
						<SocialLinks isSidebar />
					</div>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}

export default PublicationSidebar;
