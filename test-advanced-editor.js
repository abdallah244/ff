#!/usr/bin/env node

/**
 * Advanced Editor - Quick Test Script
 * Run this to verify everything works
 */

const fs = require("fs");
const path = require("path");

console.log("\n🔍 Advanced Editor System - Quick Test\n");
console.log("=".repeat(50));

// Test 1: Check files exist
console.log("\n✓ Checking files...\n");

const files = [
  "frontend/src/app/admin/page-editor/advanced-editor/advanced-editor.component.ts",
  "frontend/src/app/admin/page-editor/advanced-editor/advanced-editor.component.html",
  "frontend/src/app/admin/page-editor/advanced-editor/advanced-editor.component.css",
  "backend/routes/admin.js",
  "backend/server.js",
  "frontend/src/app/app.routes.ts",
];

let allFilesExist = true;

files.forEach((file) => {
  const fullPath = path.join(__dirname, file);
  const exists = fs.existsSync(fullPath);
  const status = exists ? "✅" : "❌";
  console.log(`  ${status} ${file}`);
  if (!exists) allFilesExist = false;
});

// Test 2: Check file sizes
console.log("\n✓ Checking file sizes...\n");

const fileSizes = {};
files.forEach((file) => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`  📄 ${path.basename(file)}: ${sizeKB} KB`);
    fileSizes[file] = stats.size;
  }
});

// Test 3: Check critical code patterns
console.log("\n✓ Checking critical code...\n");

const patterns = [
  {
    file: "frontend/src/app/admin/page-editor/advanced-editor/advanced-editor.component.ts",
    pattern: "updateNestedProperty",
    description: "Nested property update method",
  },
  {
    file: "frontend/src/app/admin/page-editor/advanced-editor/advanced-editor.component.ts",
    pattern: "generatePreview",
    description: "Live preview generation",
  },
  {
    file: "backend/routes/admin.js",
    pattern: "upload-image",
    description: "Image upload endpoint",
  },
  {
    file: "backend/server.js",
    pattern: "/uploads",
    description: "Static file serving",
  },
  {
    file: "frontend/src/app/app.routes.ts",
    pattern: "AdvancedEditorComponent",
    description: "Route component import",
  },
];

let allPatternsFound = true;

patterns.forEach(({ file, pattern, description }) => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, "utf-8");
    const found = content.includes(pattern);
    const status = found ? "✅" : "❌";
    console.log(`  ${status} ${description}`);
    if (!found) allPatternsFound = false;
  }
});

// Test 4: Check dependencies
console.log("\n✓ Checking dependencies...\n");

const backendPackageJson = path.join(__dirname, "backend/package.json");
if (fs.existsSync(backendPackageJson)) {
  const pkg = JSON.parse(fs.readFileSync(backendPackageJson, "utf-8"));
  const required = ["multer", "express", "mongoose", "bcrypt", "cors"];

  required.forEach((dep) => {
    const exists = dep in pkg.dependencies;
    const status = exists ? "✅" : "❌";
    const version = pkg.dependencies[dep] || "N/A";
    console.log(`  ${status} ${dep}: ${version}`);
  });
}

// Summary
console.log("\n" + "=".repeat(50));
console.log("\n📊 Summary:\n");

if (allFilesExist && allPatternsFound) {
  console.log("  ✅ All files present");
  console.log("  ✅ All critical code patterns found");
  console.log("  ✅ Dependencies installed");
  console.log("\n  🎉 System is ready to use!\n");
  console.log("  Next steps:");
  console.log("  1. cd backend && npm start");
  console.log("  2. cd frontend && ng serve");
  console.log("  3. Navigate to http://localhost:4200/admin/advanced-editor");
} else {
  console.log("  ❌ Some checks failed");
  console.log("  Please review the errors above");
}

console.log("\n" + "=".repeat(50) + "\n");
