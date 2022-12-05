# Queue Implementation

## The Issue

Needed a simple but more effective implementation of shuffle and loop toggle buttons. Shuffle made you dance in the queue while loop only looped the last song.

## The Solution
Shuffle:
- Implemented with the help of the added button for playing a playlist. If the shuffle is on, it will simply switch the order of the items in the playlist before adding them to the queue

Loop:
- Implemented by having the finished song go to the end of the queue once it finished playing. Allowed for looping of single songs or whole queues/playlists.
- Does introduce some awkward behavior when one uses the previous song button since it would reintroduce another copy of the song to the queue
  - Ultimately deemed a minor case, could be adjusted at a future time

## Circumstances

Ultimately implemented alongside the queue modifications, and thus decided on in the call between Alvin, Andrew, and Jeremy.
