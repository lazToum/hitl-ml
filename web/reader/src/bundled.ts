import type { BookManifest, Edition } from "./types";

const SUMMER_MODULES = import.meta.glob(
  "../public/summer/chapters/*.md",
  { query: "?raw", import: "default", eager: true }
) as Record<string, string>;

const WINTER_MODULES = import.meta.glob(
  "../public/winter/chapters/*.md",
  { query: "?raw", import: "default", eager: true }
) as Record<string, string>;

const SPRING_MODULES = import.meta.glob(
  "../public/spring/chapters/*.md",
  { query: "?raw", import: "default", eager: true }
) as Record<string, string>;

const AUTUMN_MODULES = import.meta.glob(
  "../public/autumn/chapters/*.md",
  { query: "?raw", import: "default", eager: true }
) as Record<string, string>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
import summerManifestRaw from "../public/summer/summer-book.manifest.json";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import winterManifestRaw from "../public/winter/winter-book.manifest.json";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import springManifestRaw from "../public/spring/spring-book.manifest.json";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import autumnManifestRaw from "../public/autumn/autumn-book.manifest.json";

export const BUNDLED_MANIFESTS: Record<Edition, BookManifest> = {
  summer: summerManifestRaw as BookManifest,
  winter: winterManifestRaw as BookManifest,
  spring: springManifestRaw as BookManifest,
  autumn: autumnManifestRaw as BookManifest,
};

// Keep legacy export for any code that imports it directly
export const BUNDLED_MANIFEST = BUNDLED_MANIFESTS.summer;

const EDITION_MODULES: Record<Edition, Record<string, string>> = {
  summer: SUMMER_MODULES,
  winter: WINTER_MODULES,
  spring: SPRING_MODULES,
  autumn: AUTUMN_MODULES,
};

export function getBundledChapter(edition: Edition, mdPath: string): string | null {
  const modules = EDITION_MODULES[edition];
  const filename = mdPath.split("/").pop() ?? mdPath;
  return modules[`../public/${edition}/chapters/${filename}`] ?? null;
}
