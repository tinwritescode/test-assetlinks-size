import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), ".well-known", "assetlinks.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const jsonContent = JSON.parse(fileContent);

    return NextResponse.json(jsonContent, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load assetlinks.json" },
      { status: 500 }
    );
  }
}
