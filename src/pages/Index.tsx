import { useState } from 'react';

import PluginView from './PluginContextWithoutDefaultUI';
import CanvasView from './OnlyCanvas';

type PageType = 'plugin' | 'canvas';

const IndexPage = () => {
  const [view, setView] = useState<PageType>('plugin');

  const Page = getPage(view);

  return (
    <>
      <main>
        <Page />
      </main>
      <aside>
        <button>
          Using plugin
        </button>
        <button>
          Using canvas 3d
        </button>
      </aside>
    </>
  );
};


const getPage = (page: PageType) => {
  if (page === 'plugin') {
    return PluginView;
  } else {
    return CanvasView
  }
};

export default IndexPage;
