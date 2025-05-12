import classNames from 'classnames';
import { ChangeEventHandler, FC, FormEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { Embiggen } from './Embiggen';

const DARK_MODE = window.matchMedia('(prefers-color-scheme: dark)').matches;

const App: FC = () => {
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState('Edit me');
  const [darkMode, setDarkMode] = useState(DARK_MODE);
  const [error, setError] = useState<null | string>(null);

  const handleChangeDarkMode = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    const { checked } = e.currentTarget;
    setDarkMode(checked);
  }, []);

  const handleChangeContent = useCallback<ChangeEventHandler<HTMLTextAreaElement>>((e) => {
    setContent(e.currentTarget.value);
  }, []);

  const handleSubmitForm = useCallback<FormEventHandler>(async (e) => {
    e.preventDefault();
    const outer = fullscreenRef.current;
    if (!outer) return;
    try {
      await outer.requestFullscreen({ navigationUI: 'hide' });
      try {
        await screen.orientation.lock('landscape');
      } catch {}
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    const outer = fullscreenRef.current;
    if (!outer) return;
    const handler = () => {
      if (document.fullscreenElement === outer) {
        outer.classList.add('zoom');
      } else {
        outer.classList.remove('zoom');
      }
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

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

      <div ref={fullscreenRef} className="App-output-outer">
        <Embiggen>{content}</Embiggen>
      </div>
    </>
  );
};

export default App;
