---
name: IIIF Redux
order: 4
---
# IIIF Redux
[IIIF Redux](https://github.com/stephenwf/iiif-redux) is dead, long live IIIF Redux. 

Originally IIIF Redux was an ambitious library that was created to bring fault-tolerant, speedy
and organised storage for IIIF resources. It was a very large project, and mostly feature complete
with IIIF presentation 2 and 3 support, although this was its downfall.

## In numbers
* **5,301** lines of code, across **78** files
* **12,585** lines of tests, across **150** files
* **141,711** lines of real IIIF resources tested
* **100%** line, branch and coverage

In the end, none of this mattered, the surface area of IIIF Redux was too large. It tried to do too
many things tied to Redux, which made it dense to use.

## Why it failed

## What made it to Hyperion

## Using IIIF Redux without Vault
This jumps ahead to further in this book, but the long story short is that Vault is an abstraction around
was remains of IIIF Redux. There is a `createStore()` function that you can use, and possibly integrate
your own Redux store into. So let's try to do just that. 

## The code in detail
### Create store
### Epics
### Reducers
