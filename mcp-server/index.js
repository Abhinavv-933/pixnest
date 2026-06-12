const { McpServer }         = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { z }    = require('zod');
const axios    = require('axios');
const fs       = require('fs');
const path     = require('path');

//Inline .env Loader 
// Reads .env from the same directory as this file; ignores missing file.
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) return;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    });
}

// Config 
const API_BASE = process.env.PIXNEST_API_URL || 'http://localhost:5000/api';
const EMAIL    = process.env.PIXNEST_EMAIL    || 'your@email.com';
const PASSWORD = process.env.PIXNEST_PASSWORD || 'yourpassword';

//Auth State 
let cachedToken = null;

async function getToken() {
  if (cachedToken) return cachedToken;
  const res = await axios.post(`${API_BASE}/auth/login`, { email: EMAIL, password: PASSWORD });
  cachedToken = res.data.token;
  return cachedToken;
}

function apiClient() {
  return {
    get: async (path, params = {}) => {
      const token = await getToken();
      return axios.get(`${API_BASE}${path}`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    post: async (path, body = {}) => {
      const token = await getToken();
      return axios.post(`${API_BASE}${path}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
  };
}

// MCP Server 

const server = new McpServer({
  name: 'pixnest',
  version: '1.0.0',
});


// Tool 1: list_vault
// Lists all folders and images at the root level or inside a specific folder.

server.tool(
  'list_vault',
  'List folders and images inside your Pixnest vault. Pass a folderId to browse inside a specific folder, or omit it to see root-level contents.',
  {
    folderId: z.string().optional().describe('The MongoDB _id of the folder to list contents of. Omit to list root.'),
  },
  async ({ folderId }) => {
    const api = apiClient();
    const parentId = folderId || '';

    const [foldersRes, imagesRes] = await Promise.all([
      api.get('/folders', { parentId }),
      api.get('/images', { folderId: parentId }),
    ]);

    const folders = foldersRes.data;
    const images  = imagesRes.data;

    if (folders.length === 0 && images.length === 0) {
      return {
        content: [{
          type: 'text',
          text: folderId
            ? `📂 Folder (id: ${folderId}) is empty — no sub-folders or images.`
            : '📂 Your Pixnest vault is empty. Try creating a folder or uploading an image first.',
        }],
      };
    }

    const lines = [];

    if (folderId) {
      lines.push(`📂 Contents of folder id: ${folderId}\n`);
    } else {
      lines.push('📂 Pixnest Vault — Root Level\n');
    }

    if (folders.length > 0) {
      lines.push(`FOLDERS (${folders.length}):`);
      folders.forEach(f => {
        lines.push(`  📁 ${f.name}  [id: ${f._id}]  created: ${new Date(f.createdAt).toLocaleDateString()}`);
      });
    }

    if (images.length > 0) {
      lines.push(`\nIMAGES (${images.length}):`);
      images.forEach(img => {
        const size = img.size
          ? img.size < 1024 * 1024
            ? `${(img.size / 1024).toFixed(1)} KB`
            : `${(img.size / (1024 * 1024)).toFixed(1)} MB`
          : 'unknown size';
        lines.push(`  🖼️  ${img.name}  [id: ${img._id}]  ${size}  ${img.url}`);
      });
    }

    return { content: [{ type: 'text', text: lines.join('\n') }] };
  }
);

// Tool 2: create_folder
// Creates a new folder at root or inside an existing parent folder.

server.tool(
  'create_folder',
  'Create a new folder in your Pixnest vault. Optionally nest it inside an existing folder by providing a parentId.',
  {
    name: z.string().min(1).describe('The name for the new folder.'),
    parentId: z.string().optional().describe('The _id of the parent folder to nest inside. Omit to create at root.'),
  },
  async ({ name, parentId }) => {
    const api = apiClient();

    const res = await api.post('/folders', {
      name,
      parent: parentId || null,
    });

    const folder = res.data;
    const location = parentId ? `inside folder id: ${parentId}` : 'at root level';

    return {
      content: [{
        type: 'text',
        text: `✅ Folder created successfully!\n\n📁 Name: ${folder.name}\n🆔 ID: ${folder._id}\n📍 Location: ${location}\n🕒 Created: ${new Date(folder.createdAt).toLocaleString()}`,
      }],
    };
  }
);


// Tool 3: search_assets
// Searches all folders and images in the vault by name keyword.

server.tool(
  'search_assets',
  'Search your Pixnest vault for folders and images by name. Returns all matches containing the keyword (case-insensitive).',
  {
    query: z.string().min(1).describe('The keyword to search for across folder and image names.'),
  },
  async ({ query }) => {
    const api = apiClient();

    // Fetch all root content first, then do a flat keyword search
    // Since the backend doesn't have a search endpoint, we fetch everything and filter client-side
    const keyword = query.toLowerCase().trim();

    const [foldersRes, imagesRes] = await Promise.all([
      api.get('/folders', { parentId: '' }),
      api.get('/images', { folderId: '' }),
    ]);

    const allFolders = foldersRes.data.filter(f => f.name.toLowerCase().includes(keyword));
    const allImages  = imagesRes.data.filter(i => i.name.toLowerCase().includes(keyword));

    if (allFolders.length === 0 && allImages.length === 0) {
      return {
        content: [{
          type: 'text',
          text: `🔍 No results found for "${query}" in your vault root.\n\nTip: search only covers root-level items. Try navigating into folders using list_vault first.`,
        }],
      };
    }

    const lines = [`🔍 Search results for "${query}":\n`];

    if (allFolders.length > 0) {
      lines.push(`FOLDERS (${allFolders.length} match${allFolders.length > 1 ? 'es' : ''}):`);
      allFolders.forEach(f => {
        lines.push(`  📁 ${f.name}  [id: ${f._id}]`);
      });
    }

    if (allImages.length > 0) {
      lines.push(`\nIMAGES (${allImages.length} match${allImages.length > 1 ? 'es' : ''}):`);
      allImages.forEach(img => {
        lines.push(`  🖼️  ${img.name}  [id: ${img._id}]  ${img.url}`);
      });
    }

    return { content: [{ type: 'text', text: lines.join('\n') }] };
  }
);


async function main() {
  // Eagerly authenticate so we fail fast on bad credentials
  try {
    await getToken();
    console.error('✅ Pixnest MCP: authenticated successfully');
  } catch (err) {
    console.error('❌ Pixnest MCP: authentication failed —', err.response?.data?.message || err.message);
    console.error('   Check PIXNEST_EMAIL and PIXNEST_PASSWORD env vars.');
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🚀 Pixnest MCP server running on stdio');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
