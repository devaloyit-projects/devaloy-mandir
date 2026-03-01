# Devaloy Mandir Website

This is the official landing page for Devaloy Mandir, a community spiritual home.

## Hosting

### GitHub Pages (Static)
This site is designed to be hosted on GitHub Pages.
- The `index.html` serves as the entry point.
- Events are loaded from `events.json`.
- **Note:** The admin features (adding/deleting events) are disabled in the static version as they require a backend server.

### Local Development (Full Features)
To use the event management system (Admin features), run the Node.js server locally:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open `http://localhost:3000` in your browser.

## Structure
- `index.html`: Main website structure
- `style/`: CSS styles
- `Media/`: Images and videos
- `events.json`: Data source for events
- `server.js`: Backend for local event management