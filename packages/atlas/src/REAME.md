# Atlas
A headless IIIF-compatible world builder, with trivial pipeline for rendering complex scenes.

## Concepts
- **World** - abstract space shared by one ore more resources
- **WorldObjects** - Abstract representations of single objects (sourced from IIIF canvases)
- **Layers** - Component parts of WorldObjects layered to create a visual representation (images, tiles)
- **DNA** - An abstraction over Float32Array, a stream of bytes representing the position and size of all resources, relative to their parent.
- **LayoutEngine** - A world builder, an example of how to layout objects to display.
- **Projection** - a window/viewport of a cropped view of the world, which will be rendered
- **Points** - points are a Float32Array (DNA) representing the current position of an element in relation to its parent.
- **DisplayPoints** - display points are a Float32Array (DNA) representing the structure of an element in positioned relative to itself.

### Points - examples
 What we need is:
 - Layer.getPointsAt({ scale, x, y, width, height });
  - scale to choose right set of points
  - intersection of x, y, width, height to filter those points
  - x, y, width and height will be REALTIVE TO THE PARENT (WORLD OBJECT)
- WorldObject.getPointsAt({ scale, x, y, width, height });
  - scale to pass to layers
  - intersection of x, y, width and height to filter layers
  - x, y, width and height will be REALTIVE TO THE WORLD
  - With filtered layers, map those and call Layer.getPointsAt() translating the x, y, width and height from itself to layer position
  - Maps each layer to a PaintingTarget described above
- World.getPointsAt({ scale, x, y, width, height })
  - scale to pass to world objects
  - intersection of x, y, width and height to filter world objects
  - With filtered world objects, map those and call WorldObject.getPointsAt() translating x, y, width and height from world to world object
