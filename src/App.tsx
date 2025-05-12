import { ChangeEventHandler, FC, FormEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useWindowListener, useDocumentListener } from './use-listener';

const DARK_MODE = window.matchMedia('(prefers-color-scheme: dark)').matches;

const App: FC = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const [content, setContent] = useState('Edit me');
  const [darkMode, setDarkMode] = useState(DARK_MODE);
  const [error, setError] = useState<null | string>(null);

  const zoom = useCallback((val: number) => {
    const inner = innerRef.current;
    if (!inner) return;
    inner.style.transform = `scale(${val})`;
  }, []);

  const updateZoom = useCallback(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) {
      zoom(1);
      return;
    }
    const zoomRatioWidth = outer.offsetWidth / inner.offsetWidth;
    const zoomRatioHeight = outer.offsetHeight / inner.offsetHeight;
    const zoomRatioMin = Math.min(zoomRatioWidth, zoomRatioHeight);
    zoom(zoomRatioMin);
  }, [zoom]);

  const updateZoomWithDelay = useCallback(() => {
    // Update immediately
    updateZoom();
    // Wait some time and do it again just in case
    setTimeout(updateZoom, 100);
  }, [updateZoom]);

  const handleChangeDarkMode = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    const { checked } = e.currentTarget;
    setDarkMode(checked);
  }, []);

  const handleChangeContent = useCallback<ChangeEventHandler<HTMLTextAreaElement>>((e) => {
    setContent(e.currentTarget.value);
  }, []);

  const handleSubmitForm = useCallback<FormEventHandler>(async (e) => {
    e.preventDefault();
    const outer = outerRef.current;
    if (!outer) return;
    try {
      await outer.requestFullscreen({ navigationUI: 'hide' });
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useWindowListener('orientationchange', updateZoomWithDelay);
  useWindowListener('resize', updateZoomWithDelay);

  useDocumentListener('fullscreenchange', () => {
    const outer = outerRef.current;
    if (!outer) return;
    if (document.fullscreenElement === outer) {
      outer.classList.add('zoom');
      updateZoom();
    } else {
      outer.classList.remove('zoom');
    }
  });

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <>
      <form className="App container d-flex flex-column py-5" onSubmit={handleSubmitForm}>
        <div>
          <a href="https://skeoh.com/" className="text-secondary">&larr; skeoh.com</a>
          <h1 className="mb-2">Embiggen</h1>
        </div>

        <div className="d-flex flex-column flex-fill form-group my-2">
          <label htmlFor="App-content" className="sr-only">Content</label><br />
          <textarea id="App-content" className="form-control flex-fill" value={content} onChange={handleChangeContent} />
        </div>

        <div className="my-2">
          <div className="form-check">
            <input
              id="App-dark-mode"
              className="form-check-input"
              type="checkbox"
              value="dark"
              checked={darkMode}
              onChange={handleChangeDarkMode}
            />
            <label htmlFor="App-dark-mode" className="form-check-label">Dark mode</label>
          </div>
        </div>

        <button
          type="submit"
          title={error || ''}
          className={classNames('btn btn-block my-2', error ? 'btn-danger' : 'btn-primary')}
        >
          Embiggen
        </button>
      </form>

      <div ref={outerRef} className="App-output-outer d-flex align-items-center justify-content-center">
        <div ref={innerRef} className="App-output-inner">
          {content}
        </div>
      </div>
    </>
  );
};

export default App;
