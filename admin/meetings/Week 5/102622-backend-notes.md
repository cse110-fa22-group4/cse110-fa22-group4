## Meeting Information
__Meeting Date/Time:__ 10/26, 6pm, 7:30pm<br>
__Meeting Location:__ CSE Basement<br>
__Note Taker:__ Liam Golly <br>
__Objective Statement:__ Go over the tools, plan subroles.

## Attendees
People who attended: <br>
- Liam
- Xuying
- Brian

## Topics
1. Electron overview
   - Framework quirks
   - Structure
2. Subroles
   - UI integration
   - Backend logic
   - IPC/Security
3. Going forwards

## Information
### Electron Overview
- Talked about how electron works as a framework, and specifically what is required to make it work.
  - Talked about specific file structure and organization, such as the main and renderer processes.
  - Talked about how most of the code will not have direct access to the DOM or library calls, and instead will have to be done through a secure context bridge.
### Subroles
- We decided that, while we should all do all the work, we should specialize in one area in particular, being either: 
  - UI implementation, such as navigation and other functionalities required by the UI team
  - Backend logic, such as the management of playlists optimizations with acceessing the file system
  - IPC/Security, such as the management of the different public facing APIs in such a way that it provides the neccecary functionality to the rest of the code without exposing any security vulnerabilities

### Going Forwards
- For this week, we believe that it is most important to ensure that we have a solid grasp on the tools, so we are each spending time creating small tests and demos the familizarize ourselves with the tools, and hopefully the logic will be able to carry over into the main application.
