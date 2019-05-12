# Selectors
In Hyperion, selectors take one or more IIIF resources, or entire loaded states, 
and return concrete values or shapes of values. In the experimental library 
preceding Hyperion, these were simple functions. They would looked something 
like:  `(state, props) => value` and were cached at every level. 

In Hyperion, with the help of Typescript, selectors are different. They are driven
by Context and can depend on each other, with types enforcing this. A Context
can be anything, and in user-applications new contexts should be created where it
makes sense. In this library there are some basic Contexts that cover the main 
resources in the store.

- Collection
- Manifest
- Canvas
- Annotation page
- Annotation
- Range
- Service

The best way to describe a what a context is would be to take a viewer or any IIIF-based
UI and draw boxes around where a manifest is used, around each canvas in the listing, around
each range or around the main "current" canvas. Everything in those boxes would inherit the context
inside of that box, and all of the contexts above it.

A context is made up of 2 parts. A reference and a value. The reference only change if the context should
change. In IIIF the ID of the current resource is used. The value of the context is the IIIF Resource itself.
Now if you were creating an editing interface for IIIF resources, you could continue to change the IIIF Resource
and not have to update the context every time.

Selectors can be tied to contexts. For example, a selector that retrieves the required statement on
a Manifest would be tied to that context. The selector doesn't need to know the exact Manifest in order
to select the field off of it. 

Selectors can also depend on other selectors. For example, you might want to take the metadata from 
the current manifest, canvas and range in order to combine them into a single panel, much like how the
Universal Viewer works. Your selector could depend on the 3 selectors for getting that metadata, and return
a new concrete value. 

The primary purpose of selectors is to create small, portable and reusable snippets of code that can 
extract useful information from IIIF resources that can then in turn be reused, composed into larger 
selectors to build full applications.

## Examples

A very simple request for the rights link:
```typescript
import { createSelector, manifestContext } from '@hyperion-framework/vault';

export const selectRights = createSelector({
  context: [manifestContext],
  selector: (state, ctx) => ctx.manifest.rights,
});
``` 

Another example, this time using 2 contexts together:

```typescript
import { createSelector, manifestContext, languageContext } from '@hyperion-framework/vault';

export const selectRequiredStatement = createSelector({
  context: [manifestContext, languageContext],
  selector: (state, ctx) => ctx.manifest.requiredStatement ? ({
    label: ctx.manifest.requiredStatement.label[ctx.lang].join(''),
    value: ctx.manifest.requiredStatement.value[ctx.lang].join(''),
  }) : null,
});
``` 

This example would return either null, or the label and value in the current language.
```
{
  label: 'some string',
  value: 'some value'
}
```

This makes it predictable when it comes to creating UI components. The important thing to note about 
how these selectors work is that neither the selector, nor the UI component that uses the selector needs
to care about how the `languageContext` is set. It could be calculated from the Manifest itself, or maybe
its a user choice for a multi-lingual manifest.

The same goes for all of these components. They are close to the data, far from the implementation. The
React adapter will let you use these selectors in normal React components like this:

```js
const RequiredStatement = () => {
  const requiredStatement = useManifest(selectRequiredStatement);
  
  if (!requiredStatement) {
    return null;
  }
  
  return (
    <div>
      <strong>{requiredStatement.label}:</strong> { requiredStatement.value }
    </div>
  );
};
```

Which could then be dropped into any `ManifestContext` and "just work". 

## Plan for selectors
The biggest hurdle with the selector library is going to be distributing as an NPM package.
Its completely possible that this will split out into its own package and offer granular 
imports. The largest set will be the language aware selectors for all descriptive properties.

Individual fields however will not have individual selectors, as these are strongly typed already.

The annotation, auth and search packages will cover most selectors for their domains. This package
will focus on data from the base IIIF resources for creating IIIF viewers. This package will also
aim to implement all of the Presentation 3 cookbook examples, with React and Vue demos using the
selectors.

### Async selectors + Utilities
One thing that has become clear is that some selectors might need to be asynchronous. The first large example of a selector, the canonical thumbnail raised a few problems:
- It may have to call out to get an image service
- It has to dereference resources as part of its selector
- Lots of loops, need to flatten resources easily.

This was a good test to see where gaps exist. This is a good time to add the start of a utility library to make selectors more powerful. Also it would be good if selectors could call other selectors easily.

I think a new library dedicating to parsing the IIIF image API would also be useful, keep the selectors in there. It will start in the main vault API first though.
