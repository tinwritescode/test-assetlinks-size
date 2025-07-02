import * as fs from "fs";
import * as path from "path";

interface AssetLinksStatement {
  relation: string[];
  target: {
    namespace: string;
    package_name?: string;
    site?: string;
    sha256_cert_fingerprints?: string[];
  };
}

function generateRandomFingerprint(): string {
  const hexChars = "0123456789ABCDEF";
  const segments: string[] = [];

  for (let i = 0; i < 32; i++) {
    const segment = Array(2)
      .fill(0)
      .map(() => hexChars[Math.floor(Math.random() * hexChars.length)])
      .join("");
    segments.push(segment);
  }

  return segments.join(":");
}

function generateAssetlinks(
  numApps: number,
  basePackageName: string = "xyz.mocaverse.airkit"
): AssetLinksStatement[] {
  const statements: AssetLinksStatement[] = [];

  // Generate app statements
  for (let i = 0; i < numApps; i++) {
    const statement: AssetLinksStatement = {
      relation: [
        "delegate_permission/common.handle_all_urls",
        "delegate_permission/common.get_login_creds",
      ],
      target: {
        namespace: "android_app",
        package_name: `${basePackageName}_${i + 1}`,
        sha256_cert_fingerprints: [generateRandomFingerprint()],
      },
    };
    statements.push(statement);
  }

  // Add web statement
  const webStatement: AssetLinksStatement = {
    relation: ["delegate_permission/common.get_login_creds"],
    target: {
      namespace: "web",
      site: "https://account.staging.air3.com",
    },
  };
  statements.push(webStatement);

  return statements;
}

function main() {
  // Get number of apps from command line argument or default to 1
  const numApps = parseInt(process.argv[2]) || 1;

  // Generate the statements
  const statements = generateAssetlinks(numApps);

  // Create .well-known directory if it doesn't exist
  const wellKnownDir = path.join(process.cwd(), ".well-known");
  if (!fs.existsSync(wellKnownDir)) {
    fs.mkdirSync(wellKnownDir, { recursive: true });
  }

  // Write to file with proper formatting
  const filePath = path.join(wellKnownDir, "assetlinks.json");
  const jsonContent = JSON.stringify(statements, null, 2);
  fs.writeFileSync(filePath, jsonContent);

  console.log(`Generated assetlinks.json with ${numApps} apps`);
  console.log(`File size: ${jsonContent.length} bytes`);
}

main();
