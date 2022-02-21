import { useRef, useEffect } from 'react'; 
import { DefaultPluginSpec, PluginSpec } from 'molstar/lib/mol-plugin/spec';
import { PluginContext  } from 'molstar/lib/mol-plugin/context';
// import { PluginConfig } from 'molstar/lib/mol-plugin/config';

import styles from './Page.module.css';

const MySpec: PluginSpec = {
  ...DefaultPluginSpec(),
    // config: [
    //     [PluginConfig.VolumeStreaming.Enabled, false]
    // ]
};

type InitParams = {
  canvas: HTMLCanvasElement,
  parent: HTMLDivElement,
  url: string
};

const init = async (params: InitParams) => {
  const { canvas, parent, url } = params;
  const plugin = new PluginContext(MySpec);
  await plugin.init();

  if (!plugin.initViewer(canvas, parent)) {
    console.error('Failed to init Mol*');
    return;
  }

  const data = await plugin.builders.data.download({ url }, { state: { isGhost: true } });
  const trajectory = await plugin.builders.structure.parseTrajectory(data, 'mmcif');
  await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default');
  return plugin;
};



const PluginContextWithoutDefaultUIPage = () => {
  const divRef = useRef<HTMLDivElement|null>(null);
  const canvasRef = useRef<HTMLCanvasElement|null>(null);

  useEffect(() => {
    let plugin: PluginContext;
    init({
      parent: divRef.current as HTMLDivElement,
      canvas: canvasRef.current as HTMLCanvasElement,
      url: 'https://alphafold.ebi.ac.uk/files/AF-Q9S745-F1-model_v1.cif'
    }).then(instance => plugin = instance as PluginContext);

    return () => {
      plugin.clear();
      plugin.dispose();
    }
  }, []);

  return (
    <div>
      <h1>Plugin context without default UI</h1>
      <div ref={divRef} className={styles.container}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default PluginContextWithoutDefaultUIPage;
