---
name: The basics
order: 1
---
# The basics
Before we jump into how Hyperion makes working with IIIF both easy and powerful, we'll first look at the
concepts and building blocks that make it up.

## Context

Knowing the units that make up IIIF (Manifest, canvases, annotation etc.) and the hierarchy that links them all together we need to think about how to represent that in our applications. This is where contexts come in. At the most basic level, a context is just a value (can be anything) that describes anything below it in the DOM hierarchy. In IIIF, the build in contexts are for the current language and all of the IIIF resources.

<img src="/images/contexts.png" style="max-width: 637px" />

Imagine taking your UI that you want to create, and drawing boxes around IIIF resources as you spot them. This is what context is effectively doing. You can see the manifest around everything, canvases down the left, a larger canvas on the right with a green annotation. Under that we've jumped back up a bit to manifests ranges, but this still fits within the hierarchy. 

You can see below how to create, combine and subscribe to contexts. All you need to know though are that these contexts are logical boxes that represent a segment of the UI.

## Selectors

Now we've created these logical boxes, its time to get some data out of them. If you, conceptually, have a context representing a manifest, then inside of the context you should be able to grab the label of that manifest for example. Not only that, but however we do this should work under any other manifest context and be completely reusable. 

This is what a selector does. It takes a value from the caller, and returns a chunk of the main Redux state. Optionally it can use one or more contexts to add some context to that selection from the store. Before we talked about contexts being segments of the UI, they are also segments of the Redux store that can be further refined by selectors.

```typescript
import { manifestContext, currentLanuge } from '@hyperion-framework/vault';

const getManifestLabel = createSelector({
  
  // Set up the contexts required for this selector.
  context: [manifestContext, currentLanguage],
  
  // Create the selector itself.
  selector: (state, ctx) => {
    
    // Grab the manifest from context.
    const manifest = ctx.manifest;

    // Use the current language to grab the correct language to display.
    return  manifest.label ? manifest.label[ctx.language].join('') : null;
  },
});
```

This is a simple implementation of grabbing a label from a manifest. The most important part of this whole process though is Typescript. Because of how `createSelector` and `createContext` work together, you get fully typed `ctx` property here. **Click the image below to edit the above example and see the types in action**

<a href="https://codesandbox.io/s/8167omjmp2?fontsize=14" target="_blank"><img src="/images/selector.png" /></a>

[![Edit 03-context-selectors](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/8167omjmp2?fontsize=14)

This is not limited to IIIF types, that is just the return types inferred from our contexts. If your `creator` (see below) is of a specific custom type then that will be picked up when you use that context in a selector.

## Observers

Selectors and contexts are quite static by themselves, they don't change and don't really do anything! This is where observers come in. There are two observers: `observeContext` and `observeSelector`. They are the building blocks that can be used to create a reactive interface.

### Observing a context

```typescript
import { observeContext, manifestContext } from '@hyperion-framework/vault'

const { subscribe, updateContext } = observeContext({
  context: manifestContext,
  initialValue: 'http://example.org/manifest.json',
  store,
  utility: {},
});
```

This is the basic signature of the observer. You will get an object with 4 keys:

* subscribe - add a new listener on your context
* updateContext - update your context, has the same signature as the context itself
* unsubscribe - unsubscribe your listener
* unsubscribeAll - stop all listeners

The first two are the most commonly used. So let's subscribe to our context.

```typescript
subscribe((state, context) => {
	// state is our Redux state.
	// context is our manifest
	console.log(context.manifest.label); // label of manifest
});
```

As with all of Hyperion, you have types here too, even in a JS project. It uses strong inference to know that the second value here must contain a manifest. Now that we've got our subscription, we can update it a few times.

```typescript
updateContext('http://example.org/manifest-1.json');
updateContext('http://example.org/manifest-2.json');
updateContext('http://example.org/manifest-3.json');
```

Each time we do this, the label of that manifest will be loaded (provided it's in the store!).

### Observing a selector

In my opinion, this is where it all comes together. Let's take our example from above and combine it with the `getManifestLabel` selector we created.

```typescript
import { observeSelector, manifestContext } from '@hyperion-framework/vault'

const { subscribe, updateContext } = observeSelector({
  context: manifestContext,
  initialValue: 'http://example.org/manifest.json',
  store,
  utility: {},
  selector: getManifestLabel,
});
```

Now when we call subscribe, we will get our manifest label straight away.

```typescript
subscribe(label => {
  console.log(label); // our manifest label.
});
```

Now whenever the context updates, the selector will be called. This is not on its suitable for an editing interface, but works great for loading in static IIIF resources. For editing interfaces and other similar use-cases, using Redux or a normal state management will be much better.

Worth noting too that the types remain here too, if you have a large selector with a complex return, it will be typed in your subscriber.

## In depth

### Create a context

To create a context you need to provide 2 values. You need to give it a name, and you need to add a creator. The creator will be the signature of  `myContext` in this example and allows for type-hinting your created function. 

```typescript
import { createContext } from '@hyperion-framework/vault';

const myContext = createContext({
  // give it a name, this is the property on the `context` object
  name: 'myNewContext',

  // A function that will be used to create your context
  creator: (data: string) => ({ data })
});

const ctx = myContext('some data')

// Our context is now:
// { myNewContext: { data: 'some data' } }
```

You can see that the context is a single value, with a key matching the name we gave. It's value is the return of the creator function we made. **The most important take away here is that when you create a context, only one value can be assigned at a time.** Looking back up to the diagram, you can't have a box that represents 2 canvases (using the canvas context).

You can also pass a `resolve` function into your `createContext`. This will allow you to use your context to grab data from the [Redux store](/the-vault/redux). Let's take a look at the source code for the built in manifest context.

```typescript
const manifestContext = createContext({
  name: 'manifest',
  creator: (id: string) => ({ id, type: 'Manifest' }),
  resolve: (ref, state) => {
    return state.hyperion.entities.Manifest[ref.id];
  },
});
```

As usualy, we can see the name and creator, which will take a `id` and turn it into an ID/Type object (which are [references](/the-framework/normalization#references)). 

The interesting part is the resolve function. The first argument is the return value of your `creator` and the second is the whole Redux store. Here we are returning the whole manifest from the Redux store. What this means is that we can get our context object back (in our application) we won't just get an `id`, instead we'll get the whole manifest. Even in an editing interface where the manifest might be changing, we'll still get the latest.

### Combining contexts

In our diagram we showed off some sort of tree structure, where there was a canvas "inside" of a manifest. In our data model here that is a combined context. So the yellow canvas boxes are a combination of the manifest and canvas context. So let's take the `manifestContext` and `canvasContext` which has the same signature as the manifest one above and combine them.

When you combine contexts, you are combining the instances, not the creators.

```typescript
import { 
  combineContext, 
  manifestContext, 
  canvasContext 
} from '@hyperion-framework/vault';

const ctx = combineContext(
  manifestContext('https://wellcomelibrary.org/iiif/b18035723/manifest'),
  canvasContext('https://wellcomelibrary.org/iiif/b18035723/canvas/c0')
);


```

So now our `ctx` here looks something like this:

```js
{
  manifest: { id: 'https://wellcom...', label: {en: ['Wunder der Vererbung']} },
  canvas: { id: 'https://wellcome...', label: {en: [' - ']} }
}
```

Contexts are strange to use without an abstraction. In the React Vault implementation, a context is a wrapper component around your React elements, so conceptually its easier to visualise.

```jsx
const myComponent = props => (
  <Manifest id={props.id}>
    <ComponentThatRendersManifestFromContext />
    <Canvas id={props.canvasId}>
	    <ComponentThatRendersCanvasFromContext />
    </Canvas>
  </Manifest>
);
```

So you can build up a tree of contexts. Every time you create a context under another context it will automatically combine with the current context. So in this example `ComponentThatRendersCanvasFromContext` will have access to both a manifest and canvas.

Context work best with a good abstraction, but they are still useful for composing selectors with no external dependencies. Together context and selectors are the units of sharable code.

### Combining selectors

The ability to combine multiple selectors into a single selector is useful to compose these units to fit with UIs you might be building. However, due to the type-system, the API for combining selectors looks a little strange. All in the name of type-saftey though! Using this API your new selector will retain all of its autocomplete goodness.

```typescript
const label = createSelector({
  context: [manifestContext],
  selector: (state, ctx) => ctx.manifest.label,
});

const summary = createSelector({
  context: [manifestContext],
  selector: (state, ctx) => ctx.manifest.summary,
});

const annotations = createSelector({
  context: [manifestContext],
  selector: (state, ctx) => ctx.manifest.annotations,
});
```

So here's a quick example, we've got 3 simple selectors for a manifest and we want to create a new selector that will allow us to get the results like:

```
{
  label: ...
  summary: ...
  annotations: ...
}
```

Here's the way to do that using combine selector:

```typescript
const selector = combineSelector([
  ['label', label],
  ['summary', summary],
  ['annotations', annotations],
]);
```

This API may be improved in the future!

