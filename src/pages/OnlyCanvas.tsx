import { useRef, useEffect } from 'react';
import {Canvas3D, Canvas3DContext } from 'molstar/lib/mol-canvas3d/canvas3d';
import { setCanvasSize } from 'molstar/lib/mol-canvas3d/util';
import { CIF, CifFrame } from 'molstar/lib/mol-io/reader/cif';
import { Model, Structure } from 'molstar/lib/mol-model/structure';
import { ColorTheme } from 'molstar/lib/mol-theme/color';
import { SizeTheme } from 'molstar/lib/mol-theme/size';
import { CartoonRepresentationProvider } from 'molstar/lib/mol-repr/structure/representation/cartoon';
import { trajectoryFromMmCIF } from 'molstar/lib/mol-model-formats/structure/mmcif';
import { MolecularSurfaceRepresentationProvider } from 'molstar/lib/mol-repr/structure/representation/molecular-surface';
import { BallAndStickRepresentationProvider } from 'molstar/lib/mol-repr/structure/representation/ball-and-stick';
import { GaussianSurfaceRepresentationProvider } from 'molstar/lib/mol-repr/structure/representation/gaussian-surface';
import { Representation } from 'molstar/lib/mol-repr/representation';
import { throttleTime } from 'rxjs/operators';
import { MarkerAction } from 'molstar/lib/mol-util/marker-action';
import { EveryLoci } from 'molstar/lib/mol-model/loci';
import { lociLabel } from 'molstar/lib/mol-theme/label';
import { InteractionsRepresentationProvider } from 'molstar/lib/mol-model-props/computed/representations/interactions';
import { InteractionsProvider } from 'molstar/lib/mol-model-props/computed/interactions';
import { SecondaryStructureProvider } from 'molstar/lib/mol-model-props/computed/secondary-structure';
import { SyncRuntimeContext } from 'molstar/lib/mol-task/execution/synchronous';
import { AssetManager } from 'molstar/lib/mol-util/assets';
import { MembraneOrientationProvider } from 'molstar/lib/extensions/anvil/prop';
import { MembraneOrientationRepresentationProvider } from 'molstar/lib/extensions/anvil/representation';

import styles from './Page.module.css';

const parseCif = async(data: string) => {
  const comp = CIF.parse(data);
  const parsed = await comp.run();
  if (parsed.isError) throw parsed;
  return parsed.result;
};

const downloadCif = async (url: string) => {
  const data = await fetch(url).then(response => response.text());
  return parseCif(data);
};

const getModels = async (frame: CifFrame) => {
  return await trajectoryFromMmCIF(frame).run();
};

const getStructure = (model: Model) => {
  return Structure.ofModel(model);
};

type InitParams = {
  canvas: HTMLCanvasElement
};

const init = async (params: InitParams) => {
  const { canvas } = params;
  setCanvasSize(canvas, 800, 800); // FIXME
  const canvas3d = Canvas3D.create(Canvas3DContext.fromCanvas(canvas));
  canvas3d.animate();

  // canvas3d.input.move.pipe(throttleTime(100)).subscribe(({ x, y }) => {
  //   console.log({ x, y });
  // });

  const cif = await downloadCif('https://alphafold.ebi.ac.uk/files/AF-Q9S745-F1-model_v1.cif');
  const models = await getModels(cif.blocks[0]);
  const structure = getStructure(models.representative);

  const representationContext = {
    webgl: canvas3d.webgl,
    colorThemeRegistry: ColorTheme.createRegistry(),
    sizeThemeRegistry: SizeTheme.createRegistry()
  };

  const cartoonRepresentation = CartoonRepresentationProvider.factory(
    representationContext,
    CartoonRepresentationProvider.getParams
  );

  cartoonRepresentation.setTheme({
    color: representationContext.colorThemeRegistry.create('uniform', { structure }),
    size: representationContext.sizeThemeRegistry.create('shape-group', { structure })
  });

  await cartoonRepresentation.createOrUpdate({ ...CartoonRepresentationProvider.defaultValues, quality: 'auto' }, structure).run();

  canvas3d.add(cartoonRepresentation);

  canvas3d.requestCameraReset();
};


const OnlyCanvasPage = () => {
  const divRef = useRef<HTMLDivElement|null>(null);
  const canvasRef = useRef<HTMLCanvasElement|null>(null);

  useEffect(() => {
    init({
      canvas: canvasRef.current as HTMLCanvasElement,
    });
  }, []);

  return (
    <div>
      <h1>Only canvas</h1>
      <div ref={divRef} className={styles.container}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default OnlyCanvasPage;
