* Prerequisites:
    * These are used to play music and read song metadata 
    * Have the following installed:
        * .NET 6.0
        * ffmpeg
        * node
* To build from source, you will need to first clone to clone the repo.
* To clone over HTTP, run the following command \
`git clone https://github.com/cse110-fa22-group4/cse110-fa22-group4.git`
* Next, you'll need to build the electron app and install the node dependencies.
    * Change your directory to the `/source/musicplayer`
    * Run the command \
`npm install`
    * To test that everything installed correctly, try running the command \
`npm start`
    * If the app starts up, you've done this step correctly.
* Now, you'll need to build the custom binary included in the project for reading song metadata and playback.
    * Change your directory to the `/source/multi_ffmpeg`
    * Depending on your architecture, run one of the following commands: \
	multi-ffmpeg-build-win-64

        	multi-ffmpeg-build-osx-64


        	multi-ffmpeg-build-osx-arm


        	multi-ffmpeg-build-linux-64


        	multi-ffmpeg-build-adaptive

    * Now, you want to grab the generated binary, `multi_ffmpeg`, which will now be in the directory
        * /source/multi_ffmpeg/bin/Debug/net6.0/&lt;your architecture here>/publish/multi_ffmpeg
        * You can check if it was built right, Give iit execute permissions, and then run the command 

                `multi_ffmpeg --help`

    * Take this, and put it in the same folder where you have the ffmpeg binaries.
        * To find this folder, you can type in \
`which ffmpeg`
        * Alternatively you can copy the ffmpeg binaries, `ffplay`, `ffprobe`, and `ffmpeg` and put them into the same folder as the `multi_ffmpeg` binary.
    * Start the app, open up the developer console, and type

            `await fsAPI.setPath(¡°[path to your folder with the 4 binaries¡±])`

    * That's it! \
 \
	
