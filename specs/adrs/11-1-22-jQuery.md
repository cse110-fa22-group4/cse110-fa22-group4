---
parent: Architectural Decisions
nav_order: 2
---
# Use vanilla javascript loading html from other html files

## Context and Problem Statement

* How to load other html into current html file?
* At a high level how to load app structure (and styling) spreaded across many files?

## Considered Options
* vanilla javaScript
* iframes
* jQuery

## Decision Outcome

Chosen option: "vanilla javascript", because it has integrated the capabilities of jQuery into later iterations of the language.

### Consequences
* Good, the illusion of a multipage app without actually changing pages 
* Good, allows members to work on different files but still all files remain easily integratable  
* Good, removed unnecessary API from codebase


### Vanilla javascript
MDN Docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript

Example:
```javascript
async function homeClick(element) {
    await mainButtonsOff();

	await domAPI.loadPage('main-container', 'pages/home.html');
	...
}
```

* Good, All loading statements in a single file (index.js)
* Bad, refactored code in all places where jQuery has been previously used.

### iFrames
MDN Docs: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe

Example:
iframes
 ```html
<iframe src ="external.html" width="500" height="500">
  <p>Your browser does not support iframes.</p>
</iframe>
 ```

* Good, doesn't require writing large amounts of code to use
* Bad, Not a good pratice nowadays since injecting code like this may open security loopholes 

### jQuery
Homepage: <https://api.jquery.com/> 

Example:
jQuery 
```html 
<script>
$(document).ready(function(){        
	$('#navbar').load('./navbar.html');
});
</script>
```

* Good, jQuery is definately compatiable with Electron
* Bad, Has to additionally include load statements in every file where clicking a ui element redirects
to a different page

## More Information
<https://thelicato.medium.com/jquery-is-useless-in-2022-65f5bab3177>

The linked article is **Not** the opinion of the team. It does, however, compare how one could write most code in jQuery as javascript

