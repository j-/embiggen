import * as React from 'react';

export function useDocumentListener <K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any) {
  React.useEffect(() => {
    document.addEventListener(type, listener);
    return () => document.removeEventListener(type, listener);
  });
}

export function useWindowListener <K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any) {
  React.useEffect(() => {
    window.addEventListener(type, listener);
    return () => window.removeEventListener(type, listener);
  });
}
