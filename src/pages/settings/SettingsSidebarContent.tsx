import { useResponsive, useScrollPosition } from '@/hooks';
import {
  GeneralSettings,
  SystemApiConfig,
  NotificationsEmail,
  CacheOfflineControl,
  ChangePassword
} from './blocks';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Scrollspy } from '@/components/scrollspy/Scrollspy';
import { SettingsSidebar } from './SettingsSidebar';
import { useLayout } from '@/providers';

const stickySidebarClasses: Record<string, string> = {
  'demo1-layout': 'top-[calc(var(--tw-header-height)+1rem)]',
  'demo2-layout': 'top-[calc(var(--tw-header-height)+1rem)]',
  'demo3-layout': 'top-[calc(var(--tw-header-height)+var(--tw-navbar-height)+1rem)]',
  'demo4-layout': 'top-[3rem]',
  'demo5-layout': 'top-[calc(var(--tw-header-height)+1.5rem)]',
  'demo6-layout': 'top-[3rem]',
  'demo7-layout': 'top-[calc(var(--tw-header-height)+1rem)]',
  'demo8-layout': 'top-[3rem]',
  'demo9-layout': 'top-[calc(var(--tw-header-height)+1rem)]',
  'demo10-layout': 'top-[1.5rem]'
};

const SettingsSidebarContent = () => {
  const desktopMode = useResponsive('up', 'lg');
  const { currentLayout } = useLayout();
  const [sidebarSticky, setSidebarSticky] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Initialize ref for parentEl
  const parentRef = useRef<HTMLElement | Document>(document); // Default to document
  const scrollPosition = useScrollPosition({ targetRef: parentRef });

  // Effect to update parentRef after the component mounts
  useEffect(() => {
    const scrollableElement = document.getElementById('scrollable_content');
    if (scrollableElement) {
      parentRef.current = scrollableElement;
    }
  }, []); // Run only once on component mount

  // Handle scroll position and sidebar stickiness
  useEffect(() => {
    setSidebarSticky(scrollPosition > 100);
  }, [scrollPosition, currentLayout?.options]);

  // Handle automatic scroll-to-top when sidebar items are clicked
  useEffect(() => {
    const scrollToSectionTop = (sectionId: string) => {
      const sectionElement = document.getElementById(sectionId);
      if (!sectionElement) {
        console.warn(`Section with id "${sectionId}" not found`);
        return;
      }

      // Check if there's a scrollable container
      const scrollableContent = document.getElementById('scrollable_content');
      
      if (scrollableContent) {
        // For container scrolling, calculate position relative to container
        const containerRect = scrollableContent.getBoundingClientRect();
        const sectionRect = sectionElement.getBoundingClientRect();
        const scrollTop = scrollableContent.scrollTop + (sectionRect.top - containerRect.top);
        
        scrollableContent.scrollTo({
          top: Math.max(0, scrollTop),
          left: 0,
          behavior: 'smooth'
        });
      } else {
        // For window scrolling, use scrollIntoView
        sectionElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    };

    const handleSidebarClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchorElement = target.closest('[data-scrollspy-anchor]') as HTMLElement;
      
      if (anchorElement) {
        const sectionId = anchorElement.getAttribute('data-scrollspy-anchor');
        if (sectionId) {
          // Prevent Scrollspy from handling the click
          event.stopPropagation();
          
          // Handle scroll immediately
          setTimeout(() => {
            scrollToSectionTop(sectionId);
          }, 10);
          
          // Update active state manually
          const allAnchors = document.querySelectorAll('[data-scrollspy-anchor]');
          allAnchors.forEach((anchor) => {
            anchor.classList.remove('scrollspy-active');
          });
          anchorElement.classList.add('scrollspy-active');
          
          // Update URL hash
          if (window.history?.replaceState) {
            window.history.replaceState(null, '', `#${sectionId}`);
          }
        }
      }
    };

    // Wait for sidebar to be rendered, then attach handler
    const timeoutId = setTimeout(() => {
      const sidebarContainer = sidebarRef.current;
      if (sidebarContainer) {
        // Attach click handler with capture phase to intercept before Scrollspy
        sidebarContainer.addEventListener('click', handleSidebarClick, true);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      const sidebarContainer = sidebarRef.current;
      if (sidebarContainer) {
        sidebarContainer.removeEventListener('click', handleSidebarClick, true);
      }
    };
  }, []);

  // Get the sticky class based on the current layout, provide a default if not found
  const stickyClass = currentLayout?.name
    ? stickySidebarClasses[currentLayout.name] || 'top-[calc(var(--tw-header-height)+1rem)]'
    : 'top-[calc(var(--tw-header-height)+1rem)]';

  return (
    <div className="flex grow gap-5 lg:gap-7.5">
      {desktopMode && (
        <div className="w-[230px] shrink-0">
          <div
            ref={sidebarRef}
            className={clsx('w-[230px]', sidebarSticky && `fixed z-10 start-auto ${stickyClass}`)}
          >
            <Scrollspy offset={0} targetRef={parentRef}>
              <SettingsSidebar />
            </Scrollspy>
          </div>
        </div>
      )}

      <div className="flex flex-col items-stretch grow gap-5 lg:gap-7.5">
        {/* <GeneralSettings /> */}

        <SystemApiConfig />

        <CacheOfflineControl />

        <NotificationsEmail />

        <ChangePassword />
      </div>
    </div>
  );
};

export { SettingsSidebarContent };
