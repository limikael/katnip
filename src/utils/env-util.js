import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

/**
 * Loads environment variables from .env files using a tag-based system.
 * 
 * @param {string} cwd - Directory to search for .env files.
 * @param {string[]} tags - Tags to match against file names.
 * @returns {Record<string, string>} - Merged env object.
 */
export function loadTaggedEnv(cwd, tags) {
    if (!fs.existsSync(cwd))
        return {};

    const result = {};
    const baseEnvPath = path.join(cwd, ".env");

    // Load base .env if it exists
    if (fs.existsSync(baseEnvPath)) {
        Object.assign(result, dotenv.parse(fs.readFileSync(baseEnvPath)));
    }

    // Load all .env.* files
    const files = fs.readdirSync(cwd)
        .filter(f => f.startsWith(".env.") && !f.endsWith(".example"))
        .map(f => ({
            file: f,
            tagParts: f.slice(".env.".length).split(".")
        }))
        .filter(({ tagParts }) => tagParts.every(tag => tags.includes(tag)))
        .sort((a, b) => a.tagParts.length - b.tagParts.length); // fewer tags first

    // Load in sorted order
    for (const { file } of files) {
        const fullPath = path.join(cwd, file);
        Object.assign(result, dotenv.parse(fs.readFileSync(fullPath)));
    }

    return result;
}