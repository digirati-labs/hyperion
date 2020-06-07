<div align="center"><img src="https://raw.githubusercontent.com/stephenwf/hyperion/master/hyperion-logo.png" width="390" /></div>
<br />

Set of packages for Typescript and Javascript projects both in the browser and in Node to work with IIIF.  

## Packages

- `@hyperion-framework/types` - Typescript types for the latest IIIF Presentation version (currently 3.0).
- `@hyperion-framework/presentation-2` - Typescript types for IIIF Presentation 2.1.1 
- `@hyperion-framework/presentation-3` - Typescript types for IIIF Presentation 3.0
- `@hyperion-framework/parser` - Traverse, normalise, serialise IIIF Presentation 3.0
- `@hyperion-framework/presentation-2-parser` - Traverse and upgrade IIIF Presentation 2.0
- `@hyperion-framework/store` - Minimal Redux store for IIIF resources (note: does not include state, e.g. selected items)
- `@hyperion-framework/vault` - Reference implementation around store and parser to make simple IIIF library
- `@hyperion-framework/react-vault` - React hooks for Vault. IIIF building blocks for creating React components.

#### Related packages
- `@atlas-viewer/iiif-image-api` - Types and tools for working with IIIF Image API (version 1-3) - [view repository](https://github.com/atlas-viewer/iiif-image-api)
- `@atlas-viewer/atlas` - Standalone IIIF deep-zoom viewer with optional React fiber - [view repository](https://github.com/atlas-viewer/atlas)

## Common patterns
Some common patterns working with IIIF.

#### Remotely loading IIIF.

With Vault, you can load remote resource and work with IIIF as Presentation 3 (presentation 2 will be upgraded to 3).
All the fields will be normalized, so you don't need to perform as many checks for undefined items. When you
load something into Vault it will be flattened into database-like tables. When you load a manifest for example,
the object you get back doesn't contain all of the canvases on that manifest fully, instead just a reference
pointing to them `{ id: '..', type: 'Canvas' }`. You can retrieve the full canvas by calling `vault.fromRef(ref)`.

This "references everywhere" model allows you to do the same thing for already referenced properties, such as
`partOf` where you will always be able to get the full resource. 

Aside from this change in structure, the objects you get back are all Presentation 3 resources. This is not
a complete abstraction or helper library.
```js
import { Vault } from '@hyperion-framework/vault';

const vault = new Vault();

vault.loadManifest('http://example.org/..').then(manifest => {
  // Note: manifest here is flattened. You need to call: vault.fromRef() or vault.allFromRef
  const canvasRef = manifest.items[0] // { id: 'http://...', type: 'Canvas' }
  const fullCanvas = vault.fromRef(canvasRef); // { id: '..', type: '', items: [], ... }
  const allCanvases = vault.allFromRef(manifest.items); // [{ id: '..', type: '', items: [], ... }, ...]
});
```

#### Upgrade Presentation 2 to 3

If you want to start building with IIIF Presentation 3 you will likely want to support both IIIF Presentation 2 
as the community transitions. The `@hyperion-framework/parser` package contains a simple converter that can
be used to convert 2 to 3 in the browser and can be dropped into most applications right after fetching an
IIIF resource. This supports both Collections and Manifests. If you need more granular control and options
you can check the `@hyperion-framework/presentation-2-parser` package.  

```js
import { convertPresentation2 } from '@hyperion-framework/parser';

// ...

const presentation3Manifest = convertPresentation2(presentation2Manifest);
```

#### Extracting a single field from all resources

Given the flexibility of IIIF you may want to extract a field from all levels of an IIIF resource, like rights
information.

```js
import { Traverse } from '@hyperion-framework/parser'; // or presentation-2-parser for Presentation 2. 

// Create the helper.
const logAllRights = Traverse.all(anyResource => {
  if (anyResource.rights) {
    console.log(anyResource.rights);
  }
});

// Use the traversal helper.
logAllRights.traverseManifest({ ... });
```

#### React

[See a demo](https://codesandbox.io/s/atlas-demo-omhg3?file=/src/Canvas.js) of Atlas + Vault working together in React.
