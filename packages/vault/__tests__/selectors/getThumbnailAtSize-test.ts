import {
  canvasContext,
  getThumbnailAtSize,
  manifestContext,
  ThumbnailImage,
  thumbnailSizeContext,
  Vault,
  VaultState,
} from '../../src';
import { combineContext } from '../../src/context/combineContext';
import { ManifestNormalized } from '@hyperion-framework/types';

const manifestJson = require('../../../../fixtures/manifests/thumbnails.json');

const getManifest = (state: VaultState): ManifestNormalized => state.hyperion.entities.Manifest[manifestJson.id];

let vault: Vault;
beforeAll(async () => {
  vault = new Vault();
  await vault.loadManifest(manifestJson['@id'], manifestJson);
});

/*
 * List of IIIF servers to test with to get thumbnails
 * - Wellcome / DLCS
 *   - Thumbnail property + thumbnail image service
 * - National Library of Scotland (canvas)
 *   - Thumbnail property (small)
 *   - Image tile source (256 tiles)
 *   - Tiled virtual image
 * - Yale
 *   - No thumbnail properties
 *   - Rich canvas external tile source
 * - Stanford
 *   - Manifest thumbnail property
 *   - Rich canvas external tile source
 * - E-Codices
 *   - No thumbnail properties
 *   - Rich canvas external tile source
 * - Vatican Libraries (Vatlib)
 *   - Single image thumbnail on canvas
 *   - External tile source
 * - Bodleian
 *   - Manifest thumbnail
 *   - Rich canvas external tile source
 * - Bnf
 *   - Thumbnail (string) on manifest
 *   - Thumbnail (string) on canvas
 *   - 1.1 level image server - very simple
 * - Durham
 *   - No thumbnail properties
 *   - 2.0 level 1 image service
 * - Text grid
 *   - No thumbnail properties
 *   - 2.0 level 2 image service
 * - Harvard
 *   - Thumbnail + service on manifest
 *   - Very rich 2.0 level 2 image service on canvas
 */
describe('selectors/getThumbnailAtSize', () => {
  describe('Wellcome: first canvas', () => {
    test.each`
      width  | height  | scale
      ${62}  | ${100}  | ${1}
      ${123} | ${200}  | ${1}
      ${246} | ${400}  | ${1}
      ${630} | ${1024} | ${1}
    `('$width x $height should use exact match', ({ width, height, scale }) => {
      const manifest = vault.select(getManifest);
      const ctx = combineContext(
        manifestContext(manifest.id),
        canvasContext(manifest.items[0].id),
        thumbnailSizeContext({
          width,
          height,
        })
      );
      const thumb = vault.select(getThumbnailAtSize, ctx);
      expect(thumb).toEqual({
        actualHeight: height,
        actualWidth: width,
        height: height,
        scale: scale,
        uri: `https://dlcs.io/thumbs/wellcome/1/af0634e1-cf36-4290-b7bd-a7ed8699f42d/full/${width},${height}/0/default.jpg`,
        width: width,
      });
    });

    test.each`
      reqWidth | reqHeight | actualWidth | actualHeight | width  | height | scale
      ${62}    | ${100}    | ${62}       | ${100}       | ${62}  | ${100} | ${1}
      ${150}   | ${150}    | ${123}      | ${200}       | ${92}  | ${150} | ${1.33}
      ${250}   | ${250}    | ${246}      | ${400}       | ${154} | ${250} | ${1.6}
      ${500}   | ${500}    | ${246}      | ${400}       | ${308} | ${500} | ${0.8}
      ${515}   | ${515}    | ${246}      | ${400}       | ${317} | ${515} | ${0.78}
      ${516}   | ${516}    | ${630}      | ${1024}      | ${317} | ${516} | ${1.98}
      ${750}   | ${750}    | ${630}      | ${1024}      | ${461} | ${750} | ${1.37}
    `(
      '$width x $height should choose $actualWidth x $actualHeight cropped to $expWidth x $expHeight (scale: $scale)',
      ({ reqWidth, reqHeight, actualWidth, actualHeight, width, height, scale }) => {
        const manifest = vault.select(getManifest);
        const ctx = combineContext(
          manifestContext(manifest.id),
          canvasContext(manifest.items[0].id),
          thumbnailSizeContext({
            width: reqWidth,
            height: reqHeight,
          })
        );
        const thumb = vault.select(getThumbnailAtSize, ctx) as ThumbnailImage;

        expect(thumb).toEqual({
          actualWidth,
          actualHeight,
          width,
          height,
          scale,
          uri: `https://dlcs.io/thumbs/wellcome/1/af0634e1-cf36-4290-b7bd-a7ed8699f42d/full/${actualWidth},${actualHeight}/0/default.jpg`,
        });
      }
    );
  });

  describe('Wellcome: second canvas', () => {
    test.each`
      width   | height | scale
      ${100}  | ${38}  | ${1}
      ${200}  | ${77}  | ${1}
      ${400}  | ${153} | ${1}
      ${1024} | ${392} | ${1}
    `('$width x $height should use exact match', ({ width, height, scale }) => {
      const manifest = vault.select(getManifest);
      const ctx = combineContext(
        manifestContext(manifest.id),
        canvasContext(manifest.items[1].id),
        thumbnailSizeContext({
          width,
          height,
          minHeight: 38, // default is 50
        })
      );
      const thumb = vault.select(getThumbnailAtSize, ctx);
      expect(thumb).toEqual({
        actualHeight: height,
        actualWidth: width,
        height: height,
        scale: scale,
        uri: `https://dlcs.io/thumbs/wellcome/1/0791d344-2716-463f-b21f-cf38ef3d5592/full/${width},${height}/0/default.jpg`,
        width: width,
      });
    });
  });

  describe('Wellcome: third canvas', () => {
    test.each`
      width   | height | scale
      ${100}  | ${62}  | ${1}
      ${200}  | ${123} | ${1}
      ${400}  | ${246} | ${1}
      ${1024} | ${631} | ${1}
    `('$width x $height should use exact match', ({ width, height, scale }) => {
      const manifest = vault.select(getManifest);
      const ctx = combineContext(
        manifestContext(manifest.id),
        canvasContext(manifest.items[2].id),
        thumbnailSizeContext({
          width,
          height,
        })
      );
      const thumb = vault.select(getThumbnailAtSize, ctx);
      expect(thumb).toEqual({
        actualHeight: height,
        actualWidth: width,
        height: height,
        scale: scale,
        uri: `https://dlcs.io/thumbs/wellcome/1/8ac70935-b55b-4c6f-89ca-33e6ab9bb161/full/${width},${height}/0/default.jpg`,
        width: width,
      });
    });
  });

  describe('Wellcome: fourth canvas', () => {
    test.each`
      width   | height | scale
      ${100}  | ${62}  | ${1}
      ${1024} | ${631} | ${1}
    `('$width x $height should use exact match', ({ width, height, scale }) => {
      const manifest = vault.select(getManifest);
      const ctx = combineContext(
        manifestContext(manifest.id),
        canvasContext(manifest.items[3].id),
        thumbnailSizeContext({
          width,
          height,
        })
      );
      const thumb = vault.select(getThumbnailAtSize, ctx);
      expect(thumb).toEqual({
        actualHeight: height,
        actualWidth: width,
        height: height,
        scale: scale,
        uri: `https://dlcs.io/thumbs/wellcome/1/8ac70935-b55b-4c6f-89ca-33e6ab9bb161/full/${width},${height}/0/default.jpg`,
        width: width,
      });
    });
  });

  describe('National Library of Scotland', () => {
    test.each`
      width   | height  | scale | uri
      ${150}  | ${113}  | ${1}  | ${`https://deriv.nls.uk/dcn4/7443/74438561.4.jpg`}
      ${2500} | ${1868} | ${1}  | ${`https://view.nls.uk/iiif/7443/74438561.5/full/full/0/native.jpg`}
    `('$width x $height should use exact match', ({ width, height, scale, uri }) => {
      const manifest = vault.select(getManifest);
      const ctx = combineContext(
        manifestContext(manifest.id),
        canvasContext(manifest.items[4].id),
        thumbnailSizeContext({
          width,
          height,
          // We want to make sure we get the right size for this one.
          minWidth: width,
          minHeight: height,
        })
      );
      const thumb = vault.select(getThumbnailAtSize, ctx);
      expect(thumb).toEqual({
        actualHeight: height,
        actualWidth: width,
        height: height,
        scale,
        uri,
        width: width,
      });
    });
  });

  describe('Yale', () => {
    test.each`
      width   | height  | scale | uri
      ${4800} | ${6299} | ${1}  | ${`https://images.desmm.yale.edu/iiif/2/desmm:78f8d7bb-e15d-48fd-9fd8-71e7f82aae02.jp2/full/full/0/default.jpg`}
    `('$width x $height should use exact match', ({ width, height, scale, uri }) => {
      const manifest = vault.select(getManifest);
      const ctx = combineContext(
        manifestContext(manifest.id),
        canvasContext(manifest.items[5].id),
        thumbnailSizeContext({
          width,
          height,
          // We want to make sure we get the right size for this one.
          minWidth: width,
          minHeight: height,
        })
      );
      const thumb = vault.select(getThumbnailAtSize, ctx);
      expect(thumb).toEqual({
        actualHeight: height,
        actualWidth: width,
        height: height,
        scale,
        uri,
        width: width,
      });
    });
  });

  describe('Stanford', () => {
    test.each`
      width   | height  | scale | uri
      ${1715} | ${2459} | ${1}  | ${`https://stacks.stanford.edu/image/iiif/bb475kg5932%2Fbb475kg5932_05_0001/full/full/0/default.jpg`}
    `('$width x $height should use exact match', ({ width, height, scale, uri }) => {
      const manifest = vault.select(getManifest);
      const ctx = combineContext(
        manifestContext(manifest.id),
        canvasContext(manifest.items[6].id),
        thumbnailSizeContext({
          width,
          height,
          // We want to make sure we get the right size for this one.
          minWidth: width,
          minHeight: height,
        })
      );
      const thumb = vault.select(getThumbnailAtSize, ctx);
      expect(thumb).toEqual({
        actualHeight: height,
        actualWidth: width,
        height: height,
        scale,
        uri,
        width: width,
      });
    });
  });
});
