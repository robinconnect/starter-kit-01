import { Button } from './button';
import { useAppContext } from './contexts/appContext';
import { ExternalArrowSVG, HashnodeSVG } from './icons';
import { useEffect, useRef, useState } from "react";

export const PostComments = () => {
    const { post } = useAppContext();
    const commentsRef = useRef<HTMLDivElement>(null);
    const [widgetStatus, setWidgetStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
    const [retryCount, setRetryCount] = useState(0);

    const loadWidget = () => {
        if (!post || !commentsRef.current) return;
        
        const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || "robinconnect.hashnode.dev";
        console.log("Loading Hashnode comments widget", { 
            host, 
            slug: post.slug, 
            postId: post.id,
            attempt: retryCount + 1
        });

        // Clear previous content
        commentsRef.current.innerHTML = "";
        setWidgetStatus('loading');

        // Method 1: Try the official Hashnode embed script
        const script1 = document.createElement("script");
        script1.src = "https://hashnode.com/utility/embed-comments.js";
        script1.async = true;
        script1.setAttribute("data-comments-widget", "true");
        script1.setAttribute("data-host", host);
        script1.setAttribute("data-slug", post.slug);
        script1.id = `hashnode-comments-${post.id}`;

        script1.onload = () => {
            console.log("Hashnode comments script loaded successfully");
            setTimeout(() => {
                if (commentsRef.current && commentsRef.current.children.length > 1) {
                    setWidgetStatus('loaded');
                    console.log("Widget appears to have loaded content");
                } else {
                    console.log("Script loaded but no content, trying alternative method");
                    tryAlternativeMethod();
                }
            }, 3000);
        };
        
        script1.onerror = () => {
            console.log("Primary script failed, trying alternative");
            tryAlternativeMethod();
        };

        commentsRef.current.appendChild(script1);
    };

    const tryAlternativeMethod = () => {
        if (!commentsRef.current || !post) return;
        
        const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || "robinconnect.hashnode.dev";
        
        // Clear and try iframe method
        commentsRef.current.innerHTML = "";
        
        // Method 2: Direct iframe embed
        const iframe = document.createElement("iframe");
        iframe.src = `https://${host}/embed/comments/${post.slug}`;
        iframe.style.width = "100%";
        iframe.style.minHeight = "400px";
        iframe.style.border = "none";
        iframe.style.borderRadius = "8px";
        iframe.onload = () => {
            console.log("Iframe method loaded");
            setWidgetStatus('loaded');
        };
        iframe.onerror = () => {
            console.log("Iframe method failed");
            showFallback();
        };
        
        commentsRef.current.appendChild(iframe);
    };

    const showFallback = () => {
        if (!commentsRef.current || !post) return;
        
        const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || "robinconnect.hashnode.dev";
        setWidgetStatus('error');
        
        commentsRef.current.innerHTML = `
            <div style="padding: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; text-align: center;">
                <h4 style="margin: 0 0 12px 0; color: #374151; font-size: 18px; font-weight: 600;">💬 Join the Discussion</h4>
                <p style="margin: 0 0 16px 0; color: #6b7280; line-height: 1.5;">Comments are powered by Hashnode. Click below to view and participate in the conversation.</p>
                <a href="https://${host}/${post.slug}#comments" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: 500; transition: background-color 0.2s;"
                   onmouseover="this.style.backgroundColor='#1d4ed8'"
                   onmouseout="this.style.backgroundColor='#2563eb'">
                    View Comments on Hashnode
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15,3 21,3 21,9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                </a>
                ${retryCount < 2 ? `
                    <p style="margin: 16px 0 0 0;">
                        <button onclick="window.location.reload()" 
                                style="background: none; border: 1px solid #d1d5db; color: #6b7280; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;"
                                onmouseover="this.style.backgroundColor='#f3f4f6'"
                                onmouseout="this.style.backgroundColor='transparent'">
                            Try Again
                        </button>
                    </p>
                ` : ''}
            </div>
        `;
    };

    useEffect(() => {
        if (!post) return;
        
        console.log("PostComments useEffect triggered", { 
            post: post?.slug, 
            hasCommentsRef: !!commentsRef.current,
            postId: post?.id,
            host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST
        });
        
        // Small delay to ensure DOM is ready
        const timeout = setTimeout(() => {
            loadWidget();
        }, 300);
        
        return () => {
            clearTimeout(timeout);
            if (commentsRef.current) {
                commentsRef.current.innerHTML = "";
            }
        };
    }, [post, retryCount]);

    if (!post) return null;

    return (
        <div className="mx-auto flex w-full max-w-screen-md flex-col gap-5 px-5">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-neutral-100">
                    Comments
                </h3>
                {widgetStatus === 'loading' && (
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                        Loading...
                    </div>
                )}
                {widgetStatus === 'error' && retryCount < 2 && (
                    <button 
                        onClick={() => setRetryCount(prev => prev + 1)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Retry
                    </button>
                )}
            </div>
            <div 
                ref={commentsRef} 
                id="hashnode-comments"
                className="min-h-[200px] w-full"
            />
        </div>
    );
};
