import { useState, type ReactNode } from 'react';

import PluginContextWithDefaultUIPage from './pages/PluginContextWithDefaultUI';
import PluginContextWithoutDefaultUIPage from './pages/PluginContextWithoutDefaultUI';
import OnlyCanvasPage from './pages/OnlyCanvas';

import styles from './App.module.css';

function App() {
  const [view, setView] = useState('plugin-without-ui');

  return (
    <div className={styles.grid}>
      <nav>
        <span onClick={() => setView('plugin-without-ui')}>
          Plugin without default UI
        </span>
        <span onClick={() => setView('plugin-with-ui')}>
          Plugin with default UI
        </span>
        <span onClick={() => setView('canvas3d')}>
          Just canvas3D
        </span>
      </nav>
      <Main view={view} />
    </div>
  );
}

const Main = ({ view }: { view: string }) => {
  let content: ReactNode;
  if (view === 'plugin-without-ui') {
    content = <PluginContextWithoutDefaultUIPage />;
  } else if (view === 'plugin-with-ui') {
    content = <PluginContextWithDefaultUIPage />
  } else if (view === 'canvas3d') {
    content = <OnlyCanvasPage />
  } else {
    content = null;
  }

  return (
    <main>
      {content}
    </main>
  );
};

export default App;
