import fs from "fs";
import path from "path";

export function saveToJson(filePath: string, keys: string[], value: any) {
  const resolvedPath = path.resolve(filePath);
  let data: Record<string, any> = {};
  if (fs.existsSync(resolvedPath)) {
    const raw = fs.readFileSync(resolvedPath, "utf-8");
    try {
      data = JSON.parse(raw);
    } catch {
      data = {};
    }
  }
  else {
    console.log(`⚠️ File not found: ${resolvedPath}`);
    return;
  }

  let current = data;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }

  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  fs.writeFileSync(resolvedPath, JSON.stringify(data, null, 2), "utf-8");
}

export function readFromJson(filePath: string, keys?: string[]): any {
  const resolvedPath = path.resolve(filePath);

  if (!fs.existsSync(resolvedPath)) {
    console.log(`⚠️ File not found: ${resolvedPath}`);
    return null;
  }

  const raw = fs.readFileSync(resolvedPath, "utf-8");
  let data: Record<string, any> = {};
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return null;
  }

  if (!keys || keys.length === 0) {
    return data;
  }

  let current: any = data;
  for (const key of keys) {
    if (current == null || typeof current !== "object" || !(key in current)) {
      return null;
    }
    current = current[key];
  }

  return current;
}
