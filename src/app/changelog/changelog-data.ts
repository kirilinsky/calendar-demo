const OWNER = "kirilinsky";
const REPO = "dateforge-react-calendar";

const CHANGELOG_RAW = `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/CHANGELOG.md`;
const RELEASES_API = `https://api.github.com/repos/${OWNER}/${REPO}/releases?per_page=100`;

export const REPO_URL = `https://github.com/${OWNER}/${REPO}`;
export const RELEASES_URL = `${REPO_URL}/releases`;
export const CHANGELOG_FILE_URL = `${REPO_URL}/blob/main/CHANGELOG.md`;

export type ReleaseKind = "major" | "minor" | "patch" | "other";

/** One markdown block inside an entry: a paragraph or a (possibly nested) bullet. */
export type Block =
  | { type: "p"; text: string }
  | { type: "li"; text: string; depth: number };

export type Entry = {
  pr: number | null;
  prUrl: string | null;
  commit: string | null;
  commitUrl: string | null;
  /** First line of the changeset, already stripped of the PR/commit/Thanks preamble. */
  title: string;
  body: Block[];
};

export type Section = {
  /** Heading as written, e.g. "Minor Changes". */
  heading: string;
  kind: ReleaseKind;
  entries: Entry[];
};

export type Version = {
  version: string;
  /** Anchor id, e.g. "v3-2-0". */
  id: string;
  kind: ReleaseKind;
  date: string | null;
  sections: Section[];
};

function kindFromHeading(heading: string): ReleaseKind {
  const h = heading.toLowerCase();
  if (h.includes("major")) return "major";
  if (h.includes("minor")) return "minor";
  if (h.includes("patch")) return "patch";
  return "other";
}

function versionId(version: string) {
  return `v${version.replace(/\./g, "-")}`;
}

/** Kind of the whole release: the strongest section it carries. */
function versionKind(sections: Section[]): ReleaseKind {
  if (sections.some((s) => s.kind === "major")) return "major";
  if (sections.some((s) => s.kind === "minor")) return "minor";
  if (sections.some((s) => s.kind === "patch")) return "patch";
  return "other";
}

const PREAMBLE =
  /^\[#(\d+)\]\(([^)]+)\)\s*(?:\[`([0-9a-f]+)`\]\(([^)]+)\)\s*)?(?:Thanks \[@[^\]]+\]\([^)]*\)!\s*)?-\s*/;

/** Turn the raw lines of one bullet (already dedented) into paragraphs and nested bullets. */
function parseBlocks(lines: string[]): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let bullet: { text: string[]; depth: number } | null = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "p", text: paragraph.join(" ").trim() });
      paragraph = [];
    }
  };
  const flushBullet = () => {
    if (bullet) {
      blocks.push({
        type: "li",
        text: bullet.text.join(" ").trim(),
        depth: bullet.depth,
      });
      bullet = null;
    }
  };

  for (const line of lines) {
    if (!line.trim()) {
      flushParagraph();
      flushBullet();
      continue;
    }
    const match = line.match(/^(\s*)[-*]\s+(.*)$/);
    if (match) {
      flushParagraph();
      flushBullet();
      // Changesets indents nested levels by 2 (CHANGELOG.md) or 4 (release bodies).
      const indent = match[1].length;
      bullet = { text: [match[2]], depth: indent >= 4 ? 1 : indent >= 2 ? 1 : 0 };
      continue;
    }
    if (bullet) bullet.text.push(line.trim());
    else paragraph.push(line.trim());
  }
  flushParagraph();
  flushBullet();
  return blocks;
}

function parseEntry(raw: string): Entry {
  const dedented = raw
    .split("\n")
    .map((line) => (line.startsWith("  ") ? line.slice(2) : line))
    .join("\n");

  const match = dedented.match(PREAMBLE);
  const rest = match ? dedented.slice(match[0].length) : dedented;
  const [first, ...tail] = rest.split("\n");

  return {
    pr: match?.[1] ? Number(match[1]) : null,
    prUrl: match?.[2] ?? null,
    commit: match?.[3]?.slice(0, 7) ?? null,
    commitUrl: match?.[4] ?? null,
    title: first.trim(),
    body: parseBlocks(tail),
  };
}

/** Split a block of markdown on top-level `- ` bullets, keeping their indented continuation. */
function splitEntries(body: string): string[] {
  const entries: string[] = [];
  let current: string[] | null = null;

  for (const line of body.split("\n")) {
    if (/^[-*]\s+/.test(line)) {
      if (current) entries.push(current.join("\n"));
      current = [line.replace(/^[-*]\s+/, "")];
    } else if (current) {
      current.push(line);
    }
  }
  if (current) entries.push(current.join("\n"));
  return entries.map((entry) => entry.replace(/\s+$/, ""));
}

function parseSections(body: string): Section[] {
  const parts = body.split(/^###\s+(.+)$/m);
  const sections: Section[] = [];

  // parts[0] is anything before the first heading — changesets never puts entries there.
  for (let i = 1; i < parts.length; i += 2) {
    const heading = parts[i].trim();
    const entries = splitEntries(parts[i + 1] ?? "").map(parseEntry);
    if (!entries.length) continue;
    sections.push({ heading, kind: kindFromHeading(heading), entries });
  }
  return sections;
}

export function parseChangelog(
  markdown: string,
  dates: Map<string, string>,
): Version[] {
  const parts = markdown.split(/^##\s+(.+)$/m);
  const versions: Version[] = [];

  for (let i = 1; i < parts.length; i += 2) {
    const version = parts[i].trim().replace(/^v/, "");
    const sections = parseSections(parts[i + 1] ?? "");
    if (!sections.length) continue;
    versions.push({
      version,
      id: versionId(version),
      kind: versionKind(sections),
      date: dates.get(version) ?? null,
      sections,
    });
  }
  return versions;
}

async function getReleaseDates(): Promise<Map<string, string>> {
  const dates = new Map<string, string>();
  try {
    const res = await fetch(RELEASES_API, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return dates;
    const releases: Array<{ tag_name?: string; published_at?: string }> =
      await res.json();
    for (const release of releases) {
      if (!release.tag_name || !release.published_at) continue;
      dates.set(release.tag_name.replace(/^v/, ""), release.published_at);
    }
  } catch {
    // Rate limit or network hiccup — dates are decoration, the entries are not.
  }
  return dates;
}

export async function getChangelog(): Promise<Version[]> {
  try {
    const [res, dates] = await Promise.all([
      fetch(CHANGELOG_RAW, { next: { revalidate: 3600 } }),
      getReleaseDates(),
    ]);
    if (!res.ok) return [];
    return parseChangelog(await res.text(), dates);
  } catch {
    return [];
  }
}
