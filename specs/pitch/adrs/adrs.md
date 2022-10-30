Overarching Decisions:
Lightweight: 
- Other apps are slow (Spotify (local): is generally slow, Groove: trying to open mp3 takes like ~3 seconds). 
- Decision: remove bloated features
Missing Song Handling: 
- Spotify (used to) hang on unavailable songs, interrupting a smooth listening experience. 
- Decision: Playlist will note missing songs, Skip missing songs when listening directly without delay
Play out of local file system: 
- ITunes: move songs manually to app, Apple Music: requires songs to be uploaded to the cloud. Only supports .mp3, .wav, Apple lossless format, attempts to overwrite to .acc
- Decision: Use supported Javascript audio formats in Electron app, then expand to local binaries (like VLC does) 
User-Focused UI: 
- VLC: keeps appending new features, resulted in really deep/nested dropdowns
- Decision: Add features users want and plan UI ahead of time
Include Metadata Tool: 
- Spotify: only filter by artist and album name, duration, date added 
- Decision: Metadata Search/Editor allowing adding metadata (as custom tags) and searching by this metadata
Free: 
- Most other audio players besides VLC: costs money for subscription, Spotify (Free, mobile): Ads, Limited Skips, Can’t directly play wanted songs 
- Decision: GPL license (other alternatives MIT, Berkeley)
Can Share Playlists: 
- Groove, VLC, etc. : Cannot share playlists locally
- Decision: Create playlists based on metadata tags
Export/Import playlists: 
- All Other players: Export/Import doesn’t work since players try to match exact song name 
- Decision: Share metadata as CSV or json
Themes: 
- VLC: doesn’t have light, dark themes Other: admittedly other apps do have basic themes 
- Decision: Themes do not solve any novel problem but should be a standard feature. Plus, custom themes are possible for further customization.
User Stats: 
- VLC, Groove: no stats, Spotify: Limited stats on demand, natively detailed stats given once a year 
- Decision: Themes does not solve any novel problem but should be a standard feature to match the features of Spotify, Apple Music
