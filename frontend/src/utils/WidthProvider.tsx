import React, { useState, useRef, useEffect, forwardRef } from 'react';

export function WidthProvider(WrappedComponent: any) {
    const WidthProviderComponent = forwardRef((props: any, forwardedRef: any) => {
        const [width, setWidth] = useState(0);
        const ref = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const el = ref.current;
            if (!el) return;

            setWidth(el.getBoundingClientRect().width);

            const observer = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    setWidth(entry.contentRect.width);
                }
            });

            observer.observe(el);
            return () => observer.disconnect();
        }, []);

        return (
            <div ref={ref} style={{ width: '100%', height: '100%' }}>
                {width > 0 && <WrappedComponent innerRef={forwardedRef} width={width} {...props} />}
            </div>
        );
    });

    WidthProviderComponent.displayName = `WidthProvider(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    return WidthProviderComponent;
}
