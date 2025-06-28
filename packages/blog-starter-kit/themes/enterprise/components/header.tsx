import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';
import { PublicationNavbarItem } from '../generated/graphql';
import { Button } from './button';
import { Container } from './container';
import { useAppContext } from './contexts/appContext';
import HamburgerSVG from './icons/svgs/HamburgerSVG';
import { PublicationLogo } from './publication-logo';
import PublicationSidebar from './sidebar';
import ThemeToggle from './themetoggle';

function hasUrl(
    navbarItem: PublicationNavbarItem,
): navbarItem is PublicationNavbarItem & { url: string } {
    return !!navbarItem.url && navbarItem.url.length > 0;
}

export const Header = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '/';
    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>();
    const { publication } = useAppContext();
    
    // Get navbar items and add sub-menus
    let navbarItems = publication.preferences.navbarItems.filter(hasUrl);
    
    // Add sub-menus to "China Assistant"
    const navbarItemsWithSubMenus = navbarItems.map(item => {
        if (item.label === "China Assistant") {
            return {
                ...item,
                children: [
                    { label: "Supply Chain Solutions", url: "https://robinconnect.com/supply-chain-solutions" },
                    { label: "On the Ground Support", url: "https://robinconnect.com/on-the-ground-support" },
                    { label: "Business Connections", url: "https://robinconnect.com/business-connections" },
                    { label: "Market Entry Support", url: "https://robinconnect.com/market-entry-support" },
                ]
            };
        }
        return item;
    });
    
    const visibleItems = navbarItemsWithSubMenus.slice(0, 3);
    const hiddenItems = navbarItemsWithSubMenus.slice(3);

    const toggleSidebar = () => {
        setIsSidebarVisible((prevVisibility) => !prevVisibility);
    };

    const navList = (
        <ul className="flex flex-row items-center gap-6 text-neutral-900 dark:text-slate-300">
            {visibleItems.map((item) => {
                // Check if item has children (sub-menu)
                const itemWithChildren = item as any;
                if (itemWithChildren.children && itemWithChildren.children.length > 0) {
                    return (
                        <li key={item.url} className="group relative">
                            <a
                                href={item.url || '#'}
                                className="uppercase tracking-wide font-medium hover:text-primary-600 focus:outline-none group-hover:text-primary-600 group-hover:underline relative z-[2] px-4 py-3 transition-all duration-200 text-sm"
                                tabIndex={-1}
                            >
                                {item.label}
                            </a>
                            
                            {/* Hover Area Extension - invisible area to maintain hover state */}
                            <div className="absolute top-full left-0 w-full h-2 z-40 invisible group-hover:visible"></div>
                            
                            {/* Dropdown Menu */}
                            <div className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-neutral-900 shadow-xl border border-gray-100 dark:border-neutral-700 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out transform translate-y-1 group-hover:translate-y-0 z-50">
                                <div className="py-3">
                                    {itemWithChildren.children.map((subItem: any, index: number) => (
                                        <a
                                            key={subItem.url}
                                            href={subItem.url}
                                            className={`block px-6 py-3 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-neutral-800 hover:text-primary-700 dark:hover:text-primary-400 transition-all duration-150 hover:pl-8 ${
                                                index !== itemWithChildren.children.length - 1 ? 'border-b border-gray-50 dark:border-neutral-800' : ''
                                            }`}
                                        >
                                            {subItem.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </li>
                    );
                }
                
                // Regular menu item without sub-menu
                return (
                    <li key={item.url} className="group">
                        <a
                            href={item.url}
                            className="uppercase tracking-wide font-medium hover:text-primary-600 focus:outline-none group-hover:text-primary-600 group-hover:underline px-4 py-3 transition-all duration-200 text-sm"
                        >
                            {item.label}
                        </a>
                    </li>
                );
            })}

            {hiddenItems.length > 0 && (
                <li>
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="transition-200 block rounded-full p-2 transition-colors hover:bg-white hover:text-black dark:hover:bg-neutral-800 dark:hover:text-white">
                                More
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                className="w-48 rounded border border-gray-300 bg-white text-neutral-950 shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                                align="end"
                                sideOffset={5}
                            >
                                {hiddenItems.map((item) => (
                                    <DropdownMenu.Item asChild key={item.url}>
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="transition-200 block truncate p-2 transition-colors hover:bg-slate-100 hover:text-black dark:hover:bg-neutral-800 dark:hover:text-white"
                                        >
                                            {item.label}
                                        </a>
                                    </DropdownMenu.Item>
                                ))}
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </li>
            )}
        </ul>
    );

    return (
        <header className="border-b bg-white py-10 dark:border-neutral-800 dark:bg-neutral-900">
            <Container className="grid grid-cols-4 gap-5 px-5">
                <div className="col-span-2 flex flex-1 flex-row items-center gap-2 lg:col-span-1">
                    <div className="lg:hidden">
                        <Button
                            type="outline"
                            label=""
                            icon={<HamburgerSVG className="h-5 w-5 stroke-current" />}
                            className="rounded-xl border-transparent !px-3 !py-2 text-neutral-900 dark:text-white hover:bg-slate-900 dark:hover:bg-neutral-800"
                            onClick={toggleSidebar}
                        />

                        {isSidebarVisible && (
                            <PublicationSidebar navbarItems={navbarItemsWithSubMenus} toggleSidebar={toggleSidebar} />
                        )}
                    </div>
                    <div className="hidden lg:block text-neutral-900 dark:text-slate-300">
                        <PublicationLogo />
                    </div>
                </div>
                <div className="col-span-2 flex flex-row items-center justify-end gap-5 text-neutral-900 dark:text-slate-300 lg:col-span-3">
                    <nav className="hidden lg:block">{navList}</nav>
                    <Button href={baseUrl} as="a" type="primary" label="Ask Robin" />
                    <ThemeToggle /> {/* Dark/Light mode button */}
                </div>
            </Container>
            <div className="mt-5 flex justify-center lg:hidden text-neutral-900 dark:text-slate-300">
                <PublicationLogo />
            </div>
        </header>
    );
};