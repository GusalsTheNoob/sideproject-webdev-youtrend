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
  - [x] Google OAuth Login
    - [x] Basic Configurations
    - [x] Request verification
    - [x] Get response and handle failures
    - [x] Request access token and refresh token
    - [x] Test with getting channel name (`channels.list.mine`)
    - [x] Create User Schema to store basic identification infos
    - [x] Use Session to store the token
  - [x] Log Out
  - [x] Flash Messages
  - [ ] Reusing Behavior
    - [x] Access Token Reuse
    - [ ] Token Renewal (Use middleware to findOne)
- [ ] Step 2. Fetching Sample Data from Youtube API for development
  - [ ] Fetching the data (+ estimating necessary data)
    - [ ] Channel Data
    - [ ] Watch history (With all video info populated)
      - [ ] `Channel: list`(Watch History): `items` -> `contentDetails` -> `watchHistory` (1)
      - [ ] `Playlistitems: list`(List of Videos): `items` -> [`snippet` -> `title`, `channelId`, `channelTitle`, `thumbnails`, `videoId`, `publishedAt`(=watch time)] (1)
      - [ ] `Channel: list`(Video Owner Thumbnail + additional Info) (1)
    - [ ] Subscription (With all channel info populated)
      - [ ] `Subscriptions: list`(List of subscribed channels): `items` -> [`snippet` -> `channelId`, `url`, `title`] (1)
      - [ ] `Channel: list`(Uploaded Playlist): `items` -> `contentDetails` -> `uploads` (1)
      - [ ] `Playlistitems: list`(List of Videos): `items` -> [`snippet` -> `title`, `channelId`, `channelTitle`, `thumbnails`, `videoId`, `publishedAt`(=watch time)] (1)
    - [ ] Activity Log (With all video info & channel info populated)
      - [ ] `Activities: list`(List of Activities): `items` -> [`contentDetails`, `snippets`] (1)
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
