import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { resolve } from "path";
import fs from "fs";

const BOOK_SUMMER_PATH = resolve(__dirname, "../book_summer");

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    viteSingleFile(),
    {
      name: "serve-book-summer",
      configureServer(server) {
        server.middlewares.use("/summer/chapters", (req, res, next) => {
          const filePath = resolve(
            BOOK_SUMMER_PATH,
            "chapters",
            (req.url ?? "").replace(/^\//, "")
          );
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath);
            const ext = filePath.split(".").pop() ?? "";
            const mimeMap: Record<string, string> = {
              md: "text/plain; charset=utf-8",
              png: "image/png",
              jpg: "image/jpeg",
              jpeg: "image/jpeg",
              svg: "image/svg+xml",
              gif: "image/gif",
              webp: "image/webp",
            };
            res.setHeader("Content-Type", mimeMap[ext] ?? "text/plain");
            res.end(content);
          } else {
            next();
          }
        });
      },
    },
  ],
});
