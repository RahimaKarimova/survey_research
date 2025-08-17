import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The name of your GitHub repository
// For example, if your repository is https://github.com/your-username/my-survey-app,
// then REPO_NAME should be 'my-survey-app'
const REPO_NAME = 'survey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This is crucial for GitHub Pages deployment
  base: `/${REPO_NAME}/`,
})
