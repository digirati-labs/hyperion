---
name: The Vault API
order: 1
---
# The Vault 
This is the main library used to fetch, store and retrieve IIIF resources. It is not tied to a single framework
and can be used with both JavaScript and Typescript.

## Fetching a manifest

Presumably the first thing that any IIIF-library needs to be able to do is fetch a IIIF manifest given a URL. In Hyperion it's quite simple.

```typescript
import { Vault } from '@hyperion-framework/vault';

const vault = new Vault();

vault.loadManifest('https://.../manifest.json').then(manifest => {
  // we have our manifest here.
})

```

What this returns is a promiset that when resolved will be a IIIF manifest from the store. Here's a demo of this in action, with a simple manifest being fetched and then a logo extracted and displayed. If you click **open in editor** you will be able to get auto-complete on the `manifest` and explore some of the properties. 

<iframe src="https://codesandbox.io/embed/nq0r2vm2p?autoresize=1&expanddevtools=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2Findex.ts&moduleview=1" title="04-loading-manifest" style="width:100%; height:700px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<br/><br/>

The key thing to remember is the references. The manifest is always **flat** so items that are related to it are referenced by type and ID. The manifest is also always **Presentation 3** regardless of what the source is. So when you are requesting properties from the manifest, they may not match the original source. For example, the manifest above has a `manifest.description` field on it. Since the semantics of this has changed in Presentation 3, this property has moved to the `manifest.metadata` property instead, with a label of description.

## Flat Earth

## A better way: Selectors

## Reactive, with subscriptions

## Bring your own JSON
