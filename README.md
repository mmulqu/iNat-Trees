# iNaturalist Taxonomic Tree Viewer

A web application for visualizing phylogenetic trees based on iNaturalist observations. Compare users, explore taxonomic diversity, and generate interactive tree visualizations.

## Features

- **Build Phylogenetic Trees**: Generate taxonomic trees from any iNaturalist user's observations
- **PVP Mode**: Compare two users side-by-side to see unique and shared observations
- **Date Filtering**: Filter observations by date range to analyze temporal patterns
- **Interactive Visualization**: Explore trees using the Markmap interactive mind-map interface
- **Taxon Search**: Search by common name, scientific name, or taxon ID with autocomplete

## Live Demo

Visit the live application at: `https://[your-username].github.io/iNat-Trees/`

## Deploying to GitHub Pages

### Prerequisites

- A GitHub account
- An iNaturalist developer account (for OAuth)

### Step 1: Fork or Clone This Repository

```bash
git clone https://github.com/[your-username]/iNat-Trees.git
cd iNat-Trees
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** > **Pages**
3. Under "Source", select **Deploy from a branch**
4. Choose **main** (or your default branch) and **/ (root)**
5. Click **Save**

Your site will be available at: `https://[your-username].github.io/iNat-Trees/`

### Step 3: Configure iNaturalist OAuth (Optional)

If you want to enable iNaturalist authentication:

1. Go to https://www.inaturalist.org/oauth/applications/new
2. Create a new application with these settings:
   - **Name**: Your app name (e.g., "My Tree Viewer")
   - **Redirect URI**: `https://[your-username].github.io/iNat-Trees/auth/callback`
   - **Confidential**: No (this is a client-side app)
3. Copy your **Application ID** (Client ID)
4. Update `auth.js` line 2 with your Client ID:
   ```javascript
   const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
   ```
5. Commit and push the changes

**Note**: The app works without authentication for viewing any user's public observations. Authentication is only needed for accessing private observations or user-specific features.

## Architecture

This is a fully static web application that can be hosted on GitHub Pages:

- **Frontend**: Vanilla JavaScript with Bootstrap 5
- **Visualization**: Markmap (D3-based mind mapping)
- **Backend**: Supabase Edge Functions (serverless)
- **Authentication**: iNaturalist OAuth with PKCE flow

### Key Files

- `index.html` - Main application page
- `script.js` - Core tree building logic
- `compare-users.js` - User comparison functionality
- `auth.js` - iNaturalist OAuth authentication
- `markmap-integration.js` - Tree visualization
- `auth/callback.html` - OAuth redirect handler

## Local Development

To run locally:

1. Clone the repository
2. Start a local web server (GitHub Pages requires HTTPS for OAuth):
   ```bash
   # Using Python
   python -m http.server 8000

   # Or using Node.js
   npx http-server
   ```
3. Open `http://localhost:8000` in your browser

**Note**: OAuth authentication won't work on localhost without updating your iNaturalist app's redirect URI to include `http://localhost:8000/auth/callback`.

## API Usage

This app uses the following external APIs:

- **iNaturalist API**: Public observation data
- **Supabase Edge Functions**: Tree building and taxon search
  - `build-taxonomy`: Generates phylogenetic trees
  - `search-taxa`: Autocomplete for taxon search

The Supabase functions are pre-configured and require no setup.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Requires a modern browser with ES6 module support.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - feel free to use and modify for your own projects.

## Acknowledgments

- Built with [iNaturalist](https://www.inaturalist.org/) data
- Powered by [Supabase](https://supabase.com/)
- Visualizations by [Markmap](https://markmap.js.org/)
- UI framework: [Bootstrap 5](https://getbootstrap.com/)

## Support

For issues or questions:
- Open an issue on GitHub
- Check the iNaturalist forums
- Review the iNaturalist API documentation
