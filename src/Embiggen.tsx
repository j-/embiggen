import useResizeObserver from '@react-hook/resize-observer';
import { FC, PropsWithChildren, useCallback, useLayoutEffect, useRef } from 'react';

const debug = false;

export const Embiggen: FC<PropsWithChildren> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  const resizeContent = useCallback(async () => {
    const containerEl = containerRef.current;
    const outerEl = outerRef.current; // Red
    const innerEl = innerRef.current; // Blue
    if (!containerEl || !outerEl || !innerEl) return;

    // TODO: Necessary? Gives time for fullscreen to settle.
    await new Promise((resolve) => setTimeout(resolve, 10));

    const targetRatio = containerEl.offsetWidth / containerEl.offsetHeight;

    // Cleanup from last operation.
    outerEl.style.removeProperty('width');
    outerEl.style.removeProperty('transform');

    // Find best fit.
    const originalOuterElWidth = outerEl.offsetWidth;
    let bestDistance: number | null = null;
    let bestFactor: number | null = null;
    for (let i = 100; i >= 1; i--) {
      const factor = i / 100;
      const restrictedOuterElWidth = originalOuterElWidth * factor;
      outerEl.style.setProperty('width', `${restrictedOuterElWidth}px`);

      const currentRatio = outerEl.offsetWidth / outerEl.offsetHeight;
      const distance = Math.abs(targetRatio - currentRatio);

      if (bestDistance == null) {
        bestDistance = distance;
      } else if (distance < bestDistance) {
        bestDistance = distance;
        bestFactor = factor;
      }
    }

    // Commit best fit.
    const restrictedOuterElWidth = bestFactor ? `${originalOuterElWidth * bestFactor}px` : null;
    outerEl.style.setProperty('width', restrictedOuterElWidth);

    // Final step. Scale the inner text up to fit the container.
    const innerRect = innerEl.getBoundingClientRect();
    const scaleWidth = containerEl.offsetWidth / innerRect.width;
    const scaleHeight = containerEl.offsetHeight / innerRect.height;
    const finalScale = Math.min(scaleWidth, scaleHeight);
    outerEl.style.setProperty('transform', `scale(${finalScale})`);
  }, []);

  useResizeObserver(containerRef, () => {
    resizeContent();
  });

  useLayoutEffect(() => {
    resizeContent();
  }, [resizeContent, children]);

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: debug ? '#ddd' : undefined,
        border: debug ? '1px inset #888' : undefined,
        position: 'absolute',
        inset: 0,
        lineHeight: 1,
      }}
    >
      <div
        ref={outerRef}
        style={{
          backgroundColor: debug ? 'hsl(0, 80%, 80%)' : undefined,
          outline: debug ? '1px solid red' : undefined,
          position: 'relative',
          display: 'inline-block',
          transformOrigin: 'top left',
          lineHeight: 1,
        }}
      >
        <span
          ref={innerRef}
          style={{
            backgroundColor: debug ? 'hsl(200, 80%, 80%)' : undefined,
            outline: debug ? '1px solid blue' : undefined,
            position: 'relative',
            outlineOffset: -1,
            whiteSpace: 'pre-wrap',
            hyphens: 'auto',
            lineHeight: 1,
          }}
        >
          {children}
        </span>
      </div>
    </div>
  );
};
