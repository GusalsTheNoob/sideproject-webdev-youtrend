# sideproject-webdev-youtrend

Side project for developing API integration into NodeJS backend development

## To-do

- [x] Step 0.
  - [x] Basic Env Setting
  - [x] Basic Backend Server Setting (+ MongoDB Integration)
- [ ] Step 1. Landing Page + Authentication
  - [x] Basic Front-end
    - [x] Header (Not logged in)
    - [x] Big Title
    - [x] Google Login Button
  - [ ] Google OAuth Login
    - [x] Basic Configurations
    - [x] Request verification
    - [x] Get response and handle failures
    - [x] Request access token and refresh token
    - [x] Test with getting channel name (`channels.list.mine`)
    - [ ] Create User Schema to store basic identification infos
    - [ ] Use Session to store the token
- [ ] Step 2. Fetching Sample Data from Youtube API for development
  - [ ] Fetching the data (+ estimating necessary data)
  - [ ] Fitting into model schema
- [ ] Step 3. Executing & Analysis
  - [ ] Keyword Trend
    - [ ] Backend Topic Modeling
    - [ ] Backend Analysis Data Formatting
    - [ ] Trend for Each keyword (+ Related Videos)
  - [ ] Channel Trend
    - [ ] Backend Analysis Data Formatting
    - [ ] Trend for Each Channel
  - [ ] Activity Trend
    - [ ] Daily, Weekly, Monthly Views
- [ ] Step 4. Api Fetching
  - [ ] Updating Behavior Programming
