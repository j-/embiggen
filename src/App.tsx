import * as React from 'react';
import classNames from 'classnames';
import { useWindowListener, useDocumentListener } from './use-listener';

const DARK_MODE = window.matchMedia('(prefers-color-scheme: dark)').matches;

const App: React.FC = () => {
  const outerRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);

  const [content, setContent] = React.useState('Edit me');
  const [darkMode, setDarkMode] = React.useState(DARK_MODE);
  const [error, setError] = React.useState<null | string>(null);

  const zoom = React.useCallback((val: number) => {
    const inner = innerRef.current;
    if (!inner) return;
    inner.style.transform = `scale(${val})`;
  }, []);

  const updateZoom = React.useCallback(() => {
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

  const updateZoomWithDelay = React.useCallback(() => {
    // Update immediately
    updateZoom();
    // Wait some time and do it again just in case
    setTimeout(updateZoom, 100);
  }, [updateZoom]);

  const handleChangeDarkMode = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
    const { checked } = e.currentTarget;
    setDarkMode(checked);
  }, []);

  const handleChangeContent = React.useCallback<React.ChangeEventHandler<HTMLTextAreaElement>>((e) => {
    setContent(e.currentTarget.value);
  }, []);

  const handleSubmitForm = React.useCallback<React.ReactEventHandler>(async (e) => {
    e.preventDefault();
    const outer = outerRef.current;
    if (!outer) return;
    try {
      await outer.requestFullscreen({ navigationUI: 'hide' });
    } catch (err) {
      setError(err.message);
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

  React.useEffect(() => {
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
