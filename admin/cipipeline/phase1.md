# CI/CD for mixMatch

> a short 2 page (roughly) status on the pipeline in terms of what is currently functional (and what is planned or in progress). Embed your diagram in the markdown file.

**Below is the diagram for the pipeline**

![](phase1.png)

## What is currently functional
- [x] Linting
  - LintJS
    - Using ESLint to lint the JavaScript code
      - It will trigger when a pull request is made on **all branches** and push to **all branches**
      - We will comply with the Google style guide
  - LintCSS
    - Using Stylelint to lint the CSS code
    - It will trigger when a pull request is made on **all branches** and push to **all branches**
- [x] Code Quality
  - using GitHub build in for code quality and security check
  - It will trigger when a pull request is made on **main branch** and push to **main branch**
- [x] Build
  - Build the project using npm command, which will run the test and build the project
  - Ensure the new codes and functions will not break the current project
    - It will trigger when a pull request is made on **main branch** and push to **main branch**

## What is in progress
- [ ] Auto Testing
  - Unit Testing (waiting to work with testing team)
  - Integration Testing (waiting to work with testing team)
  - Smoke Testing (waiting to work with testing team)

- [ ] Deployment (since we are still in the development phase, we will not generate package for deployment)
  - Deploy the project as installer for Windows, Mac, and Linux
  - It will trigger when a pull request is made on main branch and push to main branch

