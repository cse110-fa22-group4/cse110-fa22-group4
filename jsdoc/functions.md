<p>
Detailed Functions Implemented:
</p>



<pre class="prettyprint">    # domAPICalls
    ## htmlFromRenderer
    - Gets a filepath corresponding to the actual html file path from a renderer process
    ## loadPage
    - Loads an html page into an element
    ## setHTML
    - Sets the inner html of an element
    ## appendHTML
    - Appends the inner html of an element
    ## addGrid
    - Creates a GridJS, and inserts it into a html element.
    ## addEventListener
    - Adds an event listener
    ## addEventListenerbyClassName
    - Adds an event listener
    ## getAttribute
    - Gets the attribute of a given id
    ## setAttribute
    - Sets the attribute of a given id
    ## addChild
    - Adds a child to a given id
    ## setStyle
    - Sets the style of a given id
    ## setStyleClassToggle
    - Toggles a css class style
    ## setProperty
    - Sets an arbitrary property of a given domID
    ## getProperty
    - gets an arbitrary property of a given domID
    ## setThemeColor
    - Sets the application theme colors
    ## toggleDarkTheme
    - Toggles dark theme
    ## getSelectedTracks
    - Returns track objects selected by users from a grid.
    # ffMetaAPICalls
    ## ffmpegReadPromise
    - A nonexposed function that creates a promise for reading metadata
    ## ffmpegRead
    - Performs a read operation on the command line
    ## ffmpegWrite
    - Writes metadata to a file
    ## createMultiFFmpegPromise
    - A nonexposed function that creates a promise for reading metadata
    ## useMultiFFmpeg
    - Reads many files metadata at once
    # playSongAPICalls
    ## playSong
    - Plays a song
    ## toggleLooping
    - Toggles looping on a song
    ## setBehaviorUponEnd
    - Creates a callback for a song ending
    ## handleLooping
    - Loops a song
    ## changeVolume
    - Changes the volume
    ## getCurrentTime
    - Gets the current time of the song
    ## pauseSong
    - Pauses the song
    ## resumeSong
    - Resumes the song
    ## stopSong
    - Stops the song
    ## seekSong
    - Seeks the current song to a song time
    # ffmpegAPICalls
    ## getReadCMD
    - Gets a list of arguments for reading metadata
    ## getReadCMDForSpawn
    - Gets a list of arguments for reading metadata using .spawn()
    ## getWriteCMD
    - A list of arguments for writing metadata
    ## getMultiCMD
    - A list of arguments for reading metadata with multi_ffmpeg
    ## removeTempFile
    - Removes temp files created by our app
    - we don't call this because who cares lol
    ## setPath
    - Sets path to bin, such as ffmpeg, ffprobe, etc
    ## getPaths
    - Gets paths to ffmpeg, ffprobe, etc
    # playlistAPICalls
    ## getAllPlaylist
    - Get a list of all playlist names
    ## getPlaylist
    - Gets a playlist object
    ## removePlaylist
    - Removes a playlist by name
    ## createPlaylist
    - creates a playlist
    ## writePlaylist
    - writes to a playlist
    ## writeToPlaylist
    - Writes individual tags to a playlist
    ## writePlaylistMeta
    - Writes playlist metadata
    ## RemovePlaylistMeta
    - Removes a metadata tag
    ## getPlaylistMeta
    - Gets the metadata of a playlist
    ## removeFromPlaylist
    - Removes a taggroup from a playlist
    ## getPlaylistObj
    - Gets the actual underlying playlist object
    - for backend purposes only
    ## exportPlaylist
    - Exports a playlist
    # settingsAPICalls
    ## getSettings
    - Gets the settings object
    ## getSetting
    - Gets a single setting
    ## writeSettings
    - Writes the setting object
    ## writeToSetting
    - Writes a single setting
    ## deleteSetting
    - Removes a setting
    # songsAPICalls
    ## getSongs
    - Gets the songs object
    ## getSongsTrackData
    - Gets the songs object as tracks
    ## writeSongs
    - Writes the song object
    ## appendSong
    - Appends a song to the song object
    ## appendSongs
    - Appens multiple songs to the song object
    ## removeSong
    - Removes a song from the song object
    ## cullShortAudio
    - Culls short audio
    - why do we not use this?? it is the best function
    # statsAPICalls
    can we get an f, this file is fully functional but we never used it
    ## getStats
    - Gets the stats object
    ## writeStats
    - Writes the stats object
    ## writeToStat
    - Writes a single stat
    ## deleteStat
    - Deletes a stat
    # fsAPICalls
    ## fsInit
    - Inits fsAPI
    ## setStoragePath
    - Sets the path to storage, only done once
    ## getStoragePath
    - Gets the path to storage
    ## getSourceFolder
    - Gets the folder of this app
    ## devClear
    - Deletes everything, for testing purposes only!!
    ## makeDirIfNotExists
    - Creates the mixmatch directory if it doesn't exist
    ## getSRCString
    - A way of playing music through not ffmpeg
    ## recursiveSearchAtPath
    - A nonasync function that gets all music files recursively from a directory
    ## convertPathToTrack
    - Converts a song to a track object
    # genAPICalls
    ## debugLog
    - A controllable debug console.log where we can enable/disable tags
    ## openDialog
    - Opens a popup dialog
    ## publishGlobal
    - Publishes a global variable (not function)
    ## getGlobal
    - Gets a global variable
    ## removeGloabl
    - Removes a global variable
</pre>

