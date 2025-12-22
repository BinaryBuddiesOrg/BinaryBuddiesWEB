'use client';

import { useEffect, useRef, useState } from 'react';

interface BlogContentWithScriptsProps {
    content: string;
}

interface AdsterraAd {
    key: string;
    width: number;
    height: number;
}

export function BlogContentWithScripts({ content }: BlogContentWithScriptsProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [processedContent, setProcessedContent] = useState<string>('');
    const [adsterraAds, setAdsterraAds] = useState<AdsterraAd[]>([]);

    useEffect(() => {
        // Parse content and extract Adsterra ads
        const { cleanContent, ads } = parseAdsterraAds(content);
        setProcessedContent(cleanContent);
        setAdsterraAds(ads);
    }, [content]);

    useEffect(() => {
        if (!contentRef.current || !processedContent) return;

        // Set the cleaned HTML content (without Adsterra scripts)
        contentRef.current.innerHTML = processedContent;

        // Insert Adsterra ad iframes at the marked positions
        adsterraAds.forEach((ad, index) => {
            const placeholder = contentRef.current?.querySelector(`[data-adsterra-placeholder="${index}"]`);
            if (placeholder) {
                const adIframe = createAdsterraIframe(ad);
                placeholder.replaceWith(adIframe);
            }
        });

        // Execute other non-Adsterra scripts
        const scripts = contentRef.current.querySelectorAll('script');
        scripts.forEach((script) => {
            const newScript = document.createElement('script');
            Array.from(script.attributes).forEach((attr) => {
                newScript.setAttribute(attr.name, attr.value);
            });
            if (script.textContent) {
                newScript.textContent = script.textContent;
            }
            script.parentNode?.removeChild(script);
            document.head.appendChild(newScript);
        });
    }, [processedContent, adsterraAds]);

    return (
        <div
            ref={contentRef}
            className="blog-prose"
        />
    );
}

// Parse content to extract Adsterra ads and replace with placeholders
function parseAdsterraAds(content: string): { cleanContent: string; ads: AdsterraAd[] } {
    const ads: AdsterraAd[] = [];
    let cleanContent = content;
    let adIndex = 0;

    // Find atOptions script content
    const atOptionsPattern = /<script[^>]*>([\s\S]*?atOptions\s*=\s*\{[\s\S]*?\}[\s\S]*?)<\/script>/gi;
    const invokePattern = /<script[^>]*src="[^"]*highperformanceformat\.com[^"]*"[^>]*><\/script>/gi;
    
    let match;
    while ((match = atOptionsPattern.exec(content)) !== null) {
        const scriptContent = match[1];
        const keyMatch = scriptContent.match(/['"]key['"]\s*:\s*['"]([^'"]+)['"]/);
        const heightMatch = scriptContent.match(/['"]height['"]\s*:\s*(\d+)/);
        const widthMatch = scriptContent.match(/['"]width['"]\s*:\s*(\d+)/);
        
        if (keyMatch) {
            const key = keyMatch[1];
            const height = heightMatch ? parseInt(heightMatch[1]) : 90;
            const width = widthMatch ? parseInt(widthMatch[1]) : 728;
            
            ads.push({ key, width, height });
            adIndex++;
        }
    }
    
    // Remove all atOptions scripts
    cleanContent = cleanContent.replace(atOptionsPattern, (match, p1, offset) => {
        const idx = ads.findIndex((ad) => match.includes(ad.key));
        if (idx !== -1) {
            return `<div data-adsterra-placeholder="${idx}" class="adsterra-ad-container" style="width: 100%; max-width: ${ads[idx].width}px; min-height: ${ads[idx].height}px; margin: 20px auto;"></div>`;
        }
        return '';
    });
    
    // Remove all invoke.js scripts
    cleanContent = cleanContent.replace(invokePattern, '');

    return { cleanContent, ads };
}

// Check if we're on localhost
function isLocalhost(): boolean {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.');
}

// Create an iframe with srcdoc to properly render Adsterra ad
function createAdsterraIframe(ad: AdsterraAd): HTMLElement {
    // If on localhost, show a placeholder message
    if (isLocalhost()) {
        const placeholder = document.createElement('div');
        placeholder.className = 'adsterra-ad-placeholder';
        placeholder.style.cssText = `
            width: 100%;
            max-width: ${ad.width}px;
            height: ${ad.height}px;
            margin: 20px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            background: hsl(var(--muted) / 0.3);
            border: 2px dashed hsl(var(--border));
            border-radius: var(--radius);
            color: hsl(var(--muted-foreground));
            text-align: center;
            padding: 20px;
            font-size: 14px;
        `;
        placeholder.innerHTML = `<div>Ad</div>`;
        return placeholder;
    }
    
    // Production: Create actual ad iframe
    const iframe = document.createElement('iframe');
    
    // Create the HTML content for the iframe using srcdoc
    // This isolates the ad in its own context, solving React's script execution issues
    const adHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            margin: 0; 
            padding: 0; 
            display: flex; 
            justify-content: center; 
            align-items: center;
            min-height: ${ad.height}px;
            background: transparent;
            overflow: hidden;
        }
    </style>
</head>
<body>
    <script type="text/javascript">
        atOptions = {
            'key' : '${ad.key}',
            'format' : 'iframe',
            'height' : ${ad.height},
            'width' : ${ad.width},
            'params' : {}
        };
    </script>
    <script type="text/javascript" src="//www.highperformanceformat.com/${ad.key}/invoke.js"></script>
</body>
</html>`;
    
    iframe.srcdoc = adHTML;
    iframe.width = String(ad.width);
    iframe.height = String(ad.height);
    iframe.style.cssText = `
        width: 100%;
        max-width: ${ad.width}px;
        height: ${ad.height}px;
        border: none;
        display: block;
        margin: 20px auto;
        background: transparent;
    `;
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowtransparency', 'true');
    iframe.className = 'adsterra-ad-iframe';
    
    return iframe;
}
