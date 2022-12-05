# Queue Implementation

## The Issue

Originally the queue was implemented by an array that stored both the history, the current, and future songs. This was confusing because the index of the playing song needed to be stored, and this got really messy with the history too.

## The Solution

The song queue exists as two separate structures:
- The queue holding the currently playing songs and songs planned to be played
  - This is actually a queue data structure
- An array storing the history of songs played so that the 'previous' button may be used
  - This is actually implemented as a stack data structure

As songs from the queue are played, whenever they finish or are skipped they are moved to the previous songs stack. It is a stack since you want to retrieve whatever was placed most recently. Meanwhile, the queue will simply remove the first track and move everything else down one index.

## Circumstances

Since the prior implementation of the queue had been worked on for a while but was still buggy, the reimplementation occured in parallel with the continued development of the original branch until the new implementation proved to be more adequate, decided upon in a call with Andrew, Alvin, and Jeremy.