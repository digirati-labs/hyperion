---
name: Traversal
order: 3
---
# Traversing IIIF content
There are many use-cases for wanting to traverse a IIIF resource. You may want to build statistics, or flatten out 
ranges or, like Hyperion does, normalize IIIF resources into a flat structure.

## The relationships

### Structural properties

### Linking properties

### Ranges

## Annotations

### IIIF vs. W3C vs. OA
### Annotation bodies
### Annotation targets

## Services

### A note on profiles
### External services

## The "partOf" rabbit hole
> You take the blue pill—the story ends, you wake up in your bed and believe whatever you want to believe. You take 
the red pill—you stay in Wonderland, and I show you how deep the rabbit hole goes. Remember: all I'm offering is the 
truth. Nothing more.

– Morpheus, The Matrix

### The blue pill
Manifests, collections and canvases.
### The red pill
Layers, Annotation Collections and all of the above.

## A note on completeness
When it comes to modelling IIIF, as a developer its easy to ignore less commonly used properties. This however, is a 
cycle where no one wants to use the wacky combinations that IIIF allows to really explore their own data since no 
one will ever support it. This library aims to be fully compliant with the specification, allowing you to do anything
you like within the limits of IIIF. 
