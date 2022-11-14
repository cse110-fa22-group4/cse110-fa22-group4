# Meeting Minutes
## Meeting Information
**Meeting Date/Time:** 11/10/22 1:10pm - 1:45pm
**Meeting Location:** CSE Basement   
**Note Taker:** Jeremy  
**Objective Statement:** testing subteam meeting  

## Attendees
People who attended:
- Brian
- Jeremy
- Xuying

People absent:

## Agenda

| Item                   | Description                                                                                                                                                                                                                                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Backend Implementation | • seems like songs will be stored through as a mixture of metadata and paths in the json files<br>• Testing implementation is very dependant on what front-end does and what ends up working quickly<br>• For songs, seems like changing metadata (like a file name) or the directory could be very damaging<br>                                                       |
| Unit Tests             | • We have some tests for settings and songs, but need to break them up so that they are actually testing one function at a time<br>• We can set up multiple user folders and run the tests for each user. This way we can test what happens for multiple cases / setups <br>• Such cases would include a normal test as well as edge cases like files not existing<br> |
| Front End Testing?     | • Probably need some sort of framework in order to test front-end functionality<br>• Will look into that, but also need to ask the group what their expectations are for these automated tests<br>                                                                                                                                                                     |
| Input checking         | • API calls have no wrong input checking<br>• We can be the ones to put those in<br>                                                                                                                                                                                                                                                                                   |

## Other Notes & Information
N/A