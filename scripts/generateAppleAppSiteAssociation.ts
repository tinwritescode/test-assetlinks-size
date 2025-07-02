import * as fs from "fs";
import * as path from "path";

interface AppSiteAssociation {
  webcredentials: {
    apps: string[];
  };
}

const TEAM_ID = "ABCDE12345";
const BASE_BUNDLE_ID = "xyz.mocaverse.airkit";

function generateAppSiteAssociation(numApps: number): AppSiteAssociation {
  const appIDs = [];

  // Generate app IDs
  for (let i = 1; i <= numApps; i++) {
    const bundleId =
      i === 1 ? `${BASE_BUNDLE_ID}_example` : `${BASE_BUNDLE_ID}_example${i}`;
    appIDs.push(`${TEAM_ID}.${bundleId}`);
  }

  return {
    webcredentials: {
      apps: appIDs,
    },
  };
}

function main() {
  // Get number of apps from command line argument or default to 1
  const numApps = parseInt(process.argv[2]) || 1;

  // Generate the association file
  const association = generateAppSiteAssociation(numApps);

  // Create .well-known directory if it doesn't exist
  const wellKnownDir = path.join(process.cwd(), ".well-known");
  if (!fs.existsSync(wellKnownDir)) {
    fs.mkdirSync(wellKnownDir, { recursive: true });
  }

  // Write to file with pretty formatting for n <= 2, otherwise minified
  const filePath = path.join(wellKnownDir, "apple-app-site-association");
  const jsonContent =
    numApps <= 2
      ? JSON.stringify(association, null, 2)
      : JSON.stringify(association).replace(/\s+/g, "");
  fs.writeFileSync(filePath, jsonContent);

  // Also write to public directory for static serving
  const publicWellKnownDir = path.join(process.cwd(), "public", ".well-known");
  if (!fs.existsSync(publicWellKnownDir)) {
    fs.mkdirSync(publicWellKnownDir, { recursive: true });
  }
  const publicFilePath = path.join(
    publicWellKnownDir,
    "apple-app-site-association"
  );
  fs.writeFileSync(publicFilePath, jsonContent);

  console.log(`Generated apple-app-site-association with ${numApps} apps`);
  console.log(`File size: ${jsonContent.length} bytes`);
}

main();
