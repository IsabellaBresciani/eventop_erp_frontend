import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CUSTOMERS, CUSTOMERS_CONF } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const tenant = process.argv[2];

if (!tenant) {
  console.error('Error: Tenant name is required. Usage: node loadConfig.js <tenant>');
  process.exit(1);
}

if (!CUSTOMERS.includes(tenant)) {
  console.error(`Error: Invalid tenant "${tenant}". Valid tenants are: ${CUSTOMERS.join(', ')}`);
  process.exit(1);
}

console.log(`Loading unified configuration for tenant: ${tenant}`);

const baseConfigPath = path.join(rootDir, 'config', 'base', 'config.json');
const tenantConfigPath = path.join(rootDir, 'config', tenant, 'config.json');

const targetConfigDir = path.join(rootDir, 'src', 'config');
const targetConfigPath = path.join(targetConfigDir, 'tenant.json');
const targetTextsPath = path.join(targetConfigDir, 'baseText.json');
const targetFeaturesPath = path.join(targetConfigDir, 'featureConfig.json');

// Helper to deep merge objects
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return mergeDeep(target, ...sources);
}

// Read unified configs
let baseUnifiedConfig = {};
if (fs.existsSync(baseConfigPath)) {
  baseUnifiedConfig = JSON.parse(fs.readFileSync(baseConfigPath, 'utf8'));
}

let tenantUnifiedConfig = {};
if (fs.existsSync(tenantConfigPath)) {
  tenantUnifiedConfig = JSON.parse(fs.readFileSync(tenantConfigPath, 'utf8'));
}

// Tenant config (script based fallback/override)
const scriptTenantConfig = CUSTOMERS_CONF[tenant] || {};

// Merge configs
const finalUnified = mergeDeep({}, baseUnifiedConfig, tenantUnifiedConfig);
finalUnified.config = { ...finalUnified.config, ...scriptTenantConfig };

// Ensure src/config exists
if (!fs.existsSync(targetConfigDir)) {
  fs.mkdirSync(targetConfigDir, { recursive: true });
}

// Write the separated configs to src/config
fs.writeFileSync(targetConfigPath, JSON.stringify(finalUnified.config || {}, null, 2), 'utf8');
fs.writeFileSync(targetTextsPath, JSON.stringify(finalUnified.texts || {}, null, 2), 'utf8');
fs.writeFileSync(targetFeaturesPath, JSON.stringify(finalUnified.features || {}, null, 2), 'utf8');

console.log(`✅ Configuration, texts, and features successfully injected for ${tenant}.`);
