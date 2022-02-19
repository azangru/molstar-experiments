import { useEffect, useRef } from 'react';
import { DefaultPluginUISpec, PluginUISpec } from 'molstar/lib/mol-plugin-ui/spec';
import { createPluginUI } from 'molstar/lib/mol-plugin-ui/index';
import { PluginConfig } from 'molstar/lib/mol-plugin/config';

import 'molstar/build/viewer/molstar.css';

import styles from './Page.module.css';

const MySpec: PluginUISpec = {
  ...DefaultPluginUISpec(),
  config: [
      [PluginConfig.VolumeStreaming.Enabled, false]
  ]
}

async function createPlugin({ parent, url }: { parent: HTMLElement, url: string }) {
  const plugin = await createPluginUI(parent, MySpec);

  const data = await plugin.builders.data.download({ url: 'https://alphafold.ebi.ac.uk/files/AF-Q9S745-F1-model_v1.cif' }, { state: { isGhost: true } });
  const trajectory = await plugin.builders.structure.parseTrajectory(data, 'mmcif');
  await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default');

  return plugin;
}


const PluginContextWithDefaultUIPage = () => {
  const containerRef = useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    createPlugin({
      parent: containerRef.current as HTMLElement,
      url: 'https://alphafold.ebi.ac.uk/files/AF-Q9S745-F1-model_v1.cif'
    });
  }, []);

  return (
    <>
      <div>
        <h1>Plugin context with default UI</h1>
        <div ref={containerRef} className={styles.containerWithUI} />
      </div>
    </>
  );
};

export default PluginContextWithDefaultUIPage;
