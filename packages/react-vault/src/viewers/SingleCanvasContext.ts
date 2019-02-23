/**
 * Single canvas context
 * ****************************************************************************
 *
 * This will be the most simple implementation of the context API. It offers
 * no navigation through resources, instead simply setting up some basic
 * providers for selecting:
 * - Manifest based on passed in ID
 * - Canvas based on passed in ID
 * - Annotation list (first annotation list)
 *
 * In the future this may support external annotation lists. The context should
 * be easy to use:
 *
 * import { SingleCanvasProvider } from '...';
 *
 * function SingleCanvasViewer() {
 *  <SingleCanvasContext>
 *    <MyViewer>
 *  </SingleCanvasContext>
 * }
 *
 * Note: You will still need the base hyperion provider. This could be
 * abstracted more in the future to its own package and without the need for
 * the core provider.
 *
 * All of the normal hooks will then work for manifests, canvases and
 * annotation lists.
 */

export const SingleCanvasProvider = null;
