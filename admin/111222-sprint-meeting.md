# Meeting Minutes
## Meeting Information
**Meeting Date/Time:** meeting_date, meeting_time, end_time   
**Meeting Location:** meeting_location   
**Note Taker:** note_taker  
**Objective Statement:** reason_for_meeting  

## Attendents
People who attended:
- [x] Alvin
- [x] Andrew
- [x] Brian
- [x] Chi
- [x] Jeremy
- [x] Jiseung
- [x] Liam
- [x] Noah
- [x] Xuying
- [x] Yinlong

People absent:
- none

## Things accomplished
<table>
  <tr>
   <td><strong>Name</strong>
   </td>
   <td><strong>What you accomplished</strong>
   </td>
  </tr>
  <tr>
   <td>Chi Zhang
   </td>
   <td>
<ul>

<li>CI/CD Pipeline 
<ul>
 
<li>Github Action  
<ul>
  
<li>Lint   
<ul>
   
<li>JS Lint:     
<ul>
    
<li>Using the ESlint with webpack plugin and google style guideline to make sure a good code style and check some potential errors in code.
    
<li>Auto trigger on push and PR on all branches.
</li>    
</ul>
   
<li>CSS Lint:    
<ul>
    
<li>Using stylelint to check the code style.
    
<li>Auto trigger on push and PR on all branches.
</li>    
</ul>
</li>    
</ul>
  
<li>Code Dependencies Quality   
<ul>
   
<li>Modifying an action on github to check the code quality and check if there are any malicious dependencies and security issues in the code.
   
<li>Auto trigger on any push or PR on all branches
</li>   
</ul>
  
<li>Build
  
<li>Try to build    
<ul>
   
<li>Build and test run the project to see if it is compiled without errors.
   
<li>Auto trigger on any push or PR on all branches
</li>   
</ul>
</li>   
</ul>
 
<li>Branch Protection  
<ul>
  
<li>Setting protection on different branches depend on need
</li>  
</ul>
 
<li>Basic maintenance of the repo
</li> 
</ul>
</li> 
</ul>
   </td>
  </tr>
  <tr>
   <td>Jeremy Lei
   </td>
   <td>
<ul>

<li>Setting up test users 
<ul>
 
<li>3 users currently
</li> 
</ul>

<li>Setting up the testing environment 
<ul>
 
<li>npm run test
</li> 
</ul>

<li>Unit testing for fsAPI 
<ul>
 
<li>Settings, some work for songs
</li> 
</ul>
</li> 
</ul>
   </td>
  </tr>
  <tr>
   <td>Alvin Mangaliman
   </td>
   <td>
<ul>

<li>Initial Figma design board, used as primary reference for app UI design and structure

<li>App logo

<li>Implemented base html/css structure for app 
<ul>
 
<li>UI design implementations including sidebar navigation
 
<li>Function buttons (create playlist/add playlist/etc.)
 
<li>Pages for library content (artists/albums/etc.) + playlist content
 
<li>“Now playing views” (queue/track/lyrics)
</li> 
</ul>

<li>Frontend Javascript implementation for page switching, search query capture

<li>CI/CD Pipeline 
<ul>
 
<li>GitHub actions ESLint style checker with google formatting
</li> 
</ul>
</li> 
</ul>
   </td>
  </tr>
  <tr>
   <td>Liam Golly
   </td>
   <td>
<ul>

<li>Set up API calls as a pipeline for renderer-preload-main communication.

<li>Implemented ffmpeg and ffprobe, began ffplay

<li>Worked on file system access

<li>Worked on cli app to increase ffmpeg performance
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td>Andrew Man
   </td>
   <td>
<ul>

<li>Finished playback interface (now playing, controls, audio volume)

<li>Added basic functionality like changing pages from playback  

<li>Button doesn’t have actual functionality to play, pause, etc. yet
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td>Brian Dinh
   </td>
   <td>
<ul>

<li>Did some research on backend algorithms like for the searching algorithm

<li>Helped patch up some cross-platform issues

<li>
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td>Jiseung Yoo
   </td>
   <td>
<ul>

<li>Finished code styling guides

<li>Documentation of the codes

<li>Created framework of the website (keeping all JSdoc files)
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td>Noah Terminello
   </td>
   <td>
<ul>

<li>UI:

<li>Contributed to initial Figma design

<li>Created structure and styling for Home Page

<li>Created structure for settings page

<li>Documentation:

<li>Generated JSDoc pages and created a build tutorial
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td>
   </td>
   <td>
   </td>
  </tr>
</table>



## Action Items



* Working in tandem with backend to figure new Grid.js (js library) and display dynamic info
* Research tools for UI testing, currently considering Selenium
* Major refactoring incoming to replace JQuery and Dom API
* Create website for documenting code base
* Add generating jsDoc to CI/CD pipeline
