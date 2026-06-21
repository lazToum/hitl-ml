import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useReaderStore } from "../store";
import { WordsearchWidget } from "./WordsearchWidget";
import { GameBreak } from "./GameBreak";
import type { WordsearchData } from "../types";
/**
 * Parses wordsearch blocks from MyST markdown.
 *
 * Format:
 * ```{code-block} text
 * :class: wordsearch
 * WORDS: WORD1,WORD2,...
 * A B C D ... (15-col rows)
 * ```
 */
function parseWordsearchBlocks(markdown: string): {
  blocks: WordsearchData[];
  stripped: string;
} {
  const blocks: WordsearchData[] = [];
  const PATTERN = /```\{code-block\}\s+text\n:class:\s*wordsearch\n([\s\S]*?)```/gm;

  const stripped = markdown.replace(PATTERN, (_match, inner: string) => {
    const lines = inner.split("\n").filter((l) => l.trim() !== "");
    const wordsLine = lines.find((l) => l.startsWith("WORDS:"));
    const words = wordsLine
      ? wordsLine
          .replace("WORDS:", "")
          .trim()
          .split(",")
          .map((w) => w.trim().toUpperCase())
          .filter(Boolean)
      : [];

    const gridLines = lines.filter(
      (l) => !l.startsWith("WORDS:") && !l.startsWith(":")
    );
    const grid = gridLines
      .map((l) => l.trim().split(/\s+/).map((c) => c.toUpperCase()))
      .filter((row) => row.length > 0);

    if (words.length > 0 && grid.length > 0) {
      blocks.push({ words, grid });
    }

    // Replace with an empty placeholder we'll inject via components
    return `[WORDSEARCH_BLOCK_${blocks.length - 1}]`;
  });

  return { blocks, stripped };
}

/**
 * Strip MyST-specific directive syntax that react-markdown can't handle.
 * Converts common admonitions to blockquotes for readability.
 */
function preprocessMarkdown(raw: string): string {
  return (
    raw
      // Remove front matter
      .replace(/^---[\s\S]*?---\n?/, "")
      // Strip {only} latex blocks (PDF-only content — not for the web reader)
      .replace(/<!-- html-link-injected -->\n```\{only\} latex[\s\S]*?```\n?/gm, "")
      // Strip any remaining {only} directive blocks
      .replace(/```\{only\}\s+\w+[\s\S]*?```\n?/gm, "")
      // Convert MyST admonitions  ::: {admonition} ... ::: to blockquotes
      .replace(/:::\{admonition\}\s+(.*?)\n([\s\S]*?):::/gm, (_m, title: string, body: string) => {
        const lines = body
          .split("\n")
          .map((l: string) => `> ${l}`)
          .join("\n");
        return `> **${title}**\n${lines}`;
      })
      // Convert ::: note/tip/warning/important shortcuts
      .replace(/:::\s*\{?(note|tip|warning|important)\}?\n([\s\S]*?):::/gm, (_m, kind: string, body: string) => {
        const lines = body
          .split("\n")
          .map((l: string) => `> ${l}`)
          .join("\n");
        return `> **${kind.charAt(0).toUpperCase() + kind.slice(1)}**\n${lines}`;
      })
      // Remove remaining ::: markers
      .replace(/:::.*$/gm, "")
      // Remove {cite}`...` references
      .replace(/\{cite\}`[^`]*`/g, "")
      // Remove MyST roles like {term}`...` → just the content
      .replace(/\{[a-z-]+\}`([^`]*)`/g, "$1")
      // Strip raw HTML tags (answer-box spans, etc.) — react-markdown shows them as text
      .replace(/<[^>]+>/g, "")
      // Convert {epigraph} blocks to styled blockquotes
      .replace(/```\{epigraph\}\n([\s\S]*?)```/gm, (_m: string, body: string) => {
        const lines = body.trimEnd().split("\n");
        // Find attribution line (starts with --)
        const attrIdx = lines.findIndex(l => l.trim().startsWith("--"));
        const quoteLines = attrIdx >= 0 ? lines.slice(0, attrIdx) : lines;
        const attrLine  = attrIdx >= 0 ? lines[attrIdx].replace(/^--\s*/, "").trim() : null;
        const quoteMd = quoteLines.map(l => `> *${l.trim()}*`).join("\n");
        return attrLine ? `${quoteMd}\n>\n> — ${attrLine}` : quoteMd;
      })
      // Convert code-cell directives to code blocks
      .replace(/```\{code-cell\}\s+\w+\n(:.*\n)*?([\s\S]*?)```/gm, (_m: string, _opts: string, code: string) => {
        return "```python\n" + code + "```";
      })
  );
}

interface MarkdownViewProps {
  chapterTitle?: string;
  readMinutes?: number;
}

export function MarkdownView({ chapterTitle, readMinutes }: MarkdownViewProps = {}) {
  const markdownContent = useReaderStore((s) => s.markdownContent);
  const loadingContent = useReaderStore((s) => s.loadingContent);
  const contentError = useReaderStore((s) => s.contentError);
  const ttsParagraphIndex = useReaderStore((s) => s.ttsParagraphIndex);

  const { blocks: wordsearchBlocks, stripped } = useMemo(
    () => parseWordsearchBlocks(markdownContent),
    [markdownContent]
  );

  const processedMarkdown = useMemo(
    () => preprocessMarkdown(stripped),
    [stripped]
  );

  if (loadingContent) {
    return <div className="markdown-view markdown-view--loading">Loading chapter...</div>;
  }

  if (contentError) {
    return (
      <div className="markdown-view markdown-view--error">
        <p>Failed to load chapter: {contentError}</p>
      </div>
    );
  }

  if (!markdownContent) {
    return <div className="markdown-view markdown-view--empty" />;
  }

  // Replace [WORDSEARCH_BLOCK_N] placeholders with actual widget elements
  // We do this by splitting the processed markdown around these markers
  const parts = processedMarkdown.split(/\[WORDSEARCH_BLOCK_(\d+)\]/);

  // Track paragraph index across rendered text blocks for TTS highlighting
  let paragraphCounter = 0;

  return (
    <div className="markdown-view">
      {parts.map((part, i) => {
        // Even indices are markdown text, odd indices are wordsearch block indices
        if (i % 2 === 0) {
          // Count paragraphs in this part so we can assign classes
          const localParas = part
            .split(/\n{2,}/)
            .map((p) => p.trim())
            .filter((p) => p && !/^#{1,6}\s/.test(p) && !/^[:{]{3}/.test(p) && !/^```/.test(p) && !/^---/.test(p));

          const startIdx = paragraphCounter;
          paragraphCounter += localParas.length;

          return (
            <MarkdownSection
              key={i}
              markdown={part}
              activeParagraphIndex={ttsParagraphIndex}
              paragraphStartOffset={startIdx}
            />
          );
        } else {
          const blockIdx = parseInt(part, 10);
          const block = wordsearchBlocks[blockIdx];
          return block ? (
            <WordsearchWidget key={`ws-${blockIdx}`} data={block} />
          ) : null;
        }
      })}
      <GameBreak
        chapterTitle={chapterTitle}
        readMinutes={readMinutes}
        vocabWords={wordsearchBlocks[0]?.words ?? []}
      />
    </div>
  );
}

interface MarkdownSectionProps {
  markdown: string;
  activeParagraphIndex: number;
  paragraphStartOffset: number;
}

function MarkdownSection({
  markdown,
  activeParagraphIndex,
  paragraphStartOffset,
}: MarkdownSectionProps) {
  // We'll wrap rendered <p> tags in a span with highlighting via a custom component
  let localParagraphIdx = paragraphStartOffset;

  const components: React.ComponentProps<typeof ReactMarkdown>["components"] = {
    p({ children }) {
      const myIdx = localParagraphIdx++;
      const isActive = myIdx === activeParagraphIndex;
      return (
        <p
          data-para-idx={myIdx}
          className={isActive ? "para--active" : undefined}
        >
          {children}
        </p>
      );
    },
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {markdown}
    </ReactMarkdown>
  );
}
