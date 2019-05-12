## Architecture

Problems with initial idea:
- Twitter APIs only work on server (CORS)
- Twitter Search API is limited to 7 days of history
- Search length of query is 256/128 characters, url query may not fit.

### Solution 1 - Redis + No login
Spin up a small node server that will, when given a manifest and canvas return a 
list of tweets that match. It will:
- Search twitter for the last 7 days of records (whole manifests)
- Store a cache in redis (set datatype) using a hash of the manifest + canvas
- Use redis to cache HTTP requests to twitter API (shortened version) 
- Trigger server side refresh when user tweets (could use window-close event on twitter pop-up)
- Let users decide if they want their comment public on this site

Benefits to this:
- No twitter login required for users
- Fast for getting results back

Problems with this:
- Not an easy way to get ID of tweets when created
- Possible we could hit twitter 450/req/15m limit
- Not free to host

### Solution 2 - Redis + Login
Spin up a small node server that will allow authentication to twitter, allowing users
to login and make tweets. It will:
- Store any created tweets through the UI in redis by manifest + canvas
- Provide authentication endpoints for signing into twitter

Benefits to this:
- No searching twitters API
- Fast for getting results

Problems with this:
- Requires users to login to post to twitter
- Only annotations created through this instance will get indexed
- Dev-time required to build authentication flow
- Not free to host

### Solution 3 - 7 days of tweets
Most simple solution, allows for 7 days of tweets and can be hosted on Netlify functions 
free tier.
- Lambda function searches twitters API for tweets from last 7 days
- Twitter API searched when:
  - initial manifest load per user
  - user closes tweet window or 20 seconds after click (mobile)

Benefits to this:
- No login required for users
- All tweets from 7 days will be included
- Free to host (ish)

Problems with this:
- Only shows 7 days worth of search results
- Not clear when to refresh if a user posts a tweet (could use window-close event on twitter pop-up)
- Rate limits may still be hit
- Lose historical tweets if we decide to go with another approach

### Solution 4 - Redis + Login + Fetching
This is the most complex solution, but covers the most bases. It will be a Redis + Node based
system like solutions 1 and 2, but will both store the tweets as they come through and also
periodically refresh them. 
- Store any created tweets through the UI in redis by manifest + canvas
- Provide authentication endpoints for signing into twitter
- Search twitters API for whole manifest on page load (cache for few hours / day)
- Keep local shortened version of tweets as annotations in redis
- Make logging in optional for users

Benefits to this:
- All tweets available
- Periodically fresh data

Problems with this:
- Users have to login to tweet
- Large dev time
- Not free to host

### Solution 5 - separate store for persistence
Another simple solution, ask users if they want their tweet publicly available, if yes, then it will
be stored in a very simple redis cache. 
- Store created tweets (marked as public) in redis as annotations
- Serve stored annotations to users
- No twitter login
- No twitter fetching

Benefits to this:
- Quick to build
- Fast to serve
- No twitter login or API needed

Problems with this:
- Not the simplicity of the original idea
- Dev time to create
- Not free to host

### Solution 6 - only show linked tweet
This is a very simple solution, and will work for MVP
- Only show annotation in URL
- When user annotates, it changes URL and their annotation is shown
- Link to twitter search to see if anyone else has commented on it

Benefits
- Quick to build
- Still offers an experience
- No backend, unless..
- Can use netlify to request latest annotated images from twitter directly

Problems
- Lose historical tweets if we decide to go with another approach 
- No conversation inside of the app, all on twitter
- No easy way to hide search if there's no annotations

This approach could be combined with other approaches, such as the 7 days
one that would allow users to still see if anyone has commented further
back in time on the image on twitter.
