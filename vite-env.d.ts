// This augments the ImportMeta interface to include Vite's env variables.
// This is necessary to provide type safety for `import.meta.env`
// and to resolve TypeScript errors about 'env' not existing on 'ImportMeta'.

interface ImportMetaEnv {
    /**
     * The URL of the Google Apps Script web app for submitting survey data.
     * This is set in the `.env` file at the root of the project.
     */
    readonly VITE_GOOGLE_SHEET_URL: string;
    // You can add other environment variables here.
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
