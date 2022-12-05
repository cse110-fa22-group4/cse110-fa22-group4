* The Repo is divided into a few main folders
    * /.github/workflows

            This contains the github automated workflows for linting, running unit and E2E tests, and code quality checks.

    * /admin
* Contains meeting related files such as retrospective, meeting notes, videos, ETC.
    * /jsdoc

			Contains jsdoc source code and output folder docs.



    * /Source
        * /multi_ffmpeg

                This folder has the source code needed to build the multi_ffmpeg binary used in the app to play music and read metadata

        * /users

                This folder contains data for imaginary users to be used in testing

        * /musicplayer

                This folder contains all the HTML, CSS, and JS source code.

            * /css

                    This folder contains all of the css files for the entire project. Each file is for a specific view or component in the app, with the exception of style.css, which contains the global theme variables and the styling for the structure of the app.

            * /html
                * /components

                        This folder contains all the HTML files for ¡®components¡¯, which are any part of the app which should always be instantly available. An example of this is the sidebar and the bottom playback bar

                * /pages

                        This folder contains the HTML files for the different ¡®views¡¯ which are parts of the app which can be loaded and unloaded. An example of this is home screen with the cards on it, or the library page that displays tracks

            * /img

                    This folder contains various graphical assets.

            * /main

                    This folder contains `main.js`, which is a secure thread which handles secure access to the DOM of the app. 

            * /preload

                    This folder contains Javascript files that form a secure context bridge from the frontend UI to the backend main process to allow for accessing the DOM, the file system, and the ffmpeg and multi_ffmpeg binaries. These are accessible through four APIs, separated by their folders

                * /dom

                        This folder contains all files relevant to the `domAPI`. Any UI code that accesses the DOM will do it here.

                * /ffmpeg

                        This folder contains files that access ffmpeg/multi_ffmpeg, which is done to play songs and read metadata. This is all done by opening a terminal.

                * /fs

                        This folder contains files that access the filesystem. We access the filesystem for playlists, settings, songs, and stats.

                * /general

                        This folder contains API that don¡¯t fit into the other categories. This includes general purpose debugging logs and a wrapper for accessing and creating global variables.

            * /renderer

                    Contains Javascript files related to graphically implementing the UI. These files do not have access to the DOM by Electron standards, so do this access through the secure context bridge the `preload` forms.

                * /components

                        Contains files that form parts of different views. An example of this is code for the sidebar buttons.

                * /pages

                        Contains files that dictate pages, which represent entire different views, used in the application. An example of this is the home page.

            * /songs
                * Contains songs for testing
            * /testing
                * Contains all the files needed for unit testing
            * package.json
                * This file contains scripts used in workflows as well as for development.
            * .eslintrc.json
                * This is the config file for linting Javascript files
            * .stylintrc.json
                * This is the config file for linting CSS files.
    * specs

			Contains basic outline of the project and its derivation from the start.

 \