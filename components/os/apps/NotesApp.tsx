"use client";

import { useState } from "react";
import AppSidebar from "../AppSidebar";
import Sym from "../Sym";

/* ─────────────────────────────────────────────────────────────
   Reusable SVG diagram primitives (theme-aware via CSS vars)
   ───────────────────────────────────────────────────────────── */

function ArrowDefs({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        markerWidth="9"
        markerHeight="9"
        refX="7"
        refY="3"
        orient="auto"
        markerUnits="userSpaceOnUse"
      >
        <path className="dgm-head" d="M0,0 L7,3 L0,6 Z" />
      </marker>
    </defs>
  );
}

type BoxProps = {
  x: number; y: number; w: number; h: number;
  label: string; sub?: string; variant?: "accent" | "store" | "queue";
};

function Box({ x, y, w, h, label, sub, variant }: BoxProps) {
  return (
    <g>
      <rect
        className={`dgm-box${variant ? ` dgm-box--${variant}` : ""}`}
        x={x} y={y} width={w} height={h} rx={11}
      />
      <text className="dgm-label" x={x + w / 2} y={sub ? y + h / 2 - 5 : y + h / 2} textAnchor="middle" dominantBaseline="central">
        {label}
      </text>
      {sub && (
        <text className="dgm-sub" x={x + w / 2} y={y + h / 2 + 11} textAnchor="middle" dominantBaseline="central">
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, head, dashed }: { x1: number; y1: number; x2: number; y2: number; head: string; dashed?: boolean }) {
  return <line className={`dgm-arrow${dashed ? " is-dashed" : ""}`} x1={x1} y1={y1} x2={x2} y2={y2} markerEnd={`url(#${head})`} />;
}

function ALabel({ x, y, children }: { x: number; y: number; children: string }) {
  return <text className="dgm-edge" x={x} y={y} textAnchor="middle">{children}</text>;
}

/* ─── URL shortener high-level design ─── */
function UrlShortenerDiagram() {
  const h = "us-head";
  return (
    <svg className="dgm" viewBox="0 0 800 380" role="img" aria-label="URL shortener architecture: client to load balancer to stateless app servers, backed by a key-generation service, a Redis cache, a key-value store, and an async Kafka analytics pipeline.">
      <ArrowDefs id={h} />

      <Box x={20} y={158} w={132} h={64} label="Client" sub="browser / API" />
      <Box x={196} y={158} w={140} h={64} label="Load Balancer" sub="+ rate limit" />
      <Box x={380} y={150} w={150} h={80} label="App Servers" sub="stateless · L7" variant="accent" />

      <Box x={380} y={36} w={150} h={62} label="Key-Gen Service" sub="base62 ranges" variant="queue" />
      <Box x={612} y={104} w={158} h={60} label="Redis Cache" sub="hot code → URL" />
      <Box x={612} y={186} w={158} h={60} label="Key-Value Store" sub="code → long URL" variant="store" />
      <Box x={380} y={286} w={150} h={58} label="Kafka" sub="click events" variant="queue" />
      <Box x={612} y={286} w={158} h={58} label="Analytics Store" sub="OLAP / columnar" variant="store" />

      <Arrow x1={152} y1={190} x2={192} y2={190} head={h} />
      <Arrow x1={336} y1={190} x2={376} y2={190} head={h} />
      <Arrow x1={455} y1={150} x2={455} y2={102} head={h} />
      <ALabel x={500} y={126}>pre-fetch keys</ALabel>
      <Arrow x1={530} y1={172} x2={608} y2={138} head={h} />
      <ALabel x={585} y={150}>read (cache)</ALabel>
      <Arrow x1={530} y1={208} x2={608} y2={214} head={h} />
      <ALabel x={585} y={232}>miss → DB</ALabel>
      <Arrow x1={455} y1={230} x2={455} y2={284} head={h} dashed />
      <ALabel x={487} y={262}>async</ALabel>
      <Arrow x1={530} y1={314} x2={608} y2={314} head={h} dashed />
    </svg>
  );
}

/* ─── Web crawler high-level design ─── */
function WebCrawlerDiagram() {
  const h = "wc-head";
  return (
    <svg className="dgm" viewBox="0 0 800 360" role="img" aria-label="Web crawler architecture: seed URLs feed a URL frontier of politeness and priority queues, fetchers download pages via DNS and robots checks, parsers extract content and links, deduplication filters guard storage and a Bloom filter re-enqueues unseen URLs back into the frontier.">
      <ArrowDefs id={h} />

      <Box x={16} y={40} w={120} h={64} label="Seed URLs" />
      <Box x={172} y={32} w={150} h={80} label="URL Frontier" sub="priority + politeness" variant="queue" />
      <Box x={358} y={40} w={150} h={64} label="Fetchers" sub="DNS · robots.txt" variant="accent" />
      <Box x={544} y={40} w={150} h={64} label="Parser" sub="HTML / extract" />

      <Box x={544} y={150} w={150} h={60} label="Content Seen?" sub="simhash near-dup" />
      <Box x={544} y={258} w={150} h={60} label="Doc Store + Index" variant="store" />

      <Box x={358} y={150} w={150} h={60} label="Link Extractor" sub="normalize URLs" />
      <Box x={172} y={150} w={150} h={60} label="URL Seen?" sub="Bloom filter" variant="store" />

      <Arrow x1={136} y1={72} x2={168} y2={72} head={h} />
      <Arrow x1={322} y1={72} x2={354} y2={72} head={h} />
      <Arrow x1={508} y1={72} x2={540} y2={72} head={h} />
      <Arrow x1={619} y1={104} x2={619} y2={148} head={h} />
      <Arrow x1={619} y1={210} x2={619} y2={256} head={h} />
      <ALabel x={655} y={236}>store new</ALabel>
      <Arrow x1={560} y1={104} x2={470} y2={148} head={h} />
      <ALabel x={530} y={130}>links</ALabel>
      <Arrow x1={356} y1={180} x2={324} y2={180} head={h} />
      <Arrow x1={247} y1={150} x2={247} y2={114} head={h} dashed />
      <ALabel x={300} y={134}>re-enqueue</ALabel>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Posts
   ───────────────────────────────────────────────────────────── */

type CategoryId = "system-design" | "go";

type Post = {
  id: string;
  title: string;
  blurb: string;
  date: string;
  read: string;
  category: CategoryId;
  featured?: boolean;
  tags: string[];
  body: React.ReactNode;
};

const POSTS: Post[] = [
  {
    id: "url-shortener",
    title: "Designing a URL Shortener",
    blurb: "How a TinyURL-style service turns a long link into a 7-character code and serves billions of redirects with single-digit-millisecond latency.",
    date: "May 28, 2026",
    read: "8 min read",
    category: "system-design",
    featured: true,
    tags: ["System Design", "Distributed Systems", "Caching"],
    body: (
      <>
        <p className="os-note__lead">
          A URL shortener looks trivial — map a short code to a long link — but it&apos;s a clean lens on
          the read-heavy, low-latency, horizontally-scaled systems we build every day. Here&apos;s the
          high-level design I&apos;d whiteboard.
        </p>

        <h2 className="os-note__h2">1 · Requirements</h2>
        <p className="os-note__p"><b>Functional:</b> create a short code for a URL, optional custom alias and expiry, and redirect from code → original URL.</p>
        <p className="os-note__p"><b>Non-functional:</b> redirects must be fast (&lt;10&nbsp;ms p99) and highly available; the system is read-heavy at roughly a <b>100:1</b> read-to-write ratio; codes are not guessable or sequential.</p>

        <h2 className="os-note__h2">2 · Back-of-the-envelope</h2>
        <ul className="os-note__ul">
          <li>100M new URLs / month ≈ <b>~40 writes/s</b>, and at 100:1 that&apos;s <b>~4K reads/s</b> (plan for 10× peaks).</li>
          <li>Store ~5 years → ~6B records × ~500 bytes ≈ <b>~3 TB</b>. Comfortable for a partitioned KV store.</li>
          <li>Key space: <b>base62</b> (a–z, A–Z, 0–9). 62⁷ ≈ 3.5 trillion codes — 7 characters is plenty.</li>
        </ul>

        <h2 className="os-note__h2">3 · API</h2>
        <pre className="os-note__code">{`POST /api/v1/shorten
  { "url": "https://example.com/very/long/path", "alias?": "...", "ttl?": 0 }
  → 201 { "code": "aZ3xK9q", "shortUrl": "https://tro.sh/aZ3xK9q" }

GET /{code}
  → 301/302 Location: https://example.com/very/long/path`}</pre>

        <h2 className="os-note__h2">4 · Generating the short code</h2>
        <p className="os-note__p">Three common approaches, each with a trade-off:</p>
        <ul className="os-note__ul">
          <li><b>Hash &amp; truncate</b> (MD5 of the URL → first 7 chars). Simple, but collisions force retries and identical URLs collapse to one code.</li>
          <li><b>Counter + base62.</b> A global auto-increment encoded to base62. Compact and collision-free, but a single counter is a bottleneck — so hand out <b>ranges</b> to each app server via a coordinator (ZooKeeper / a ticket server).</li>
          <li><b>Key Generation Service (KGS).</b> Pre-generate random unique keys offline into a &quot;available keys&quot; table; app servers just claim one. No hot-path collision checks at all.</li>
        </ul>
        <p className="os-note__p">I&apos;d ship the <b>KGS / counter-range</b> hybrid: keys are pre-minted, so writes never block on uniqueness.</p>

        <h2 className="os-note__h2">5 · Architecture</h2>
        <figure className="os-note__figure">
          <UrlShortenerDiagram />
          <figcaption>Write path mints a key and persists <code>code → URL</code>; the read path is a cache-first lookup with an async analytics fork.</figcaption>
        </figure>

        <h2 className="os-note__h2">6 · The read path (the part that matters)</h2>
        <p className="os-note__p">
          Redirects dominate traffic, so optimize them ruthlessly. Look up the code in <b>Redis</b> first
          (cache-aside); on a miss, read the KV store and backfill the cache. Hot codes live in memory, so
          the database barely sees read load. Put a <b>CDN / edge</b> in front for geographically-close
          redirects.
        </p>
        <p className="os-note__callout">
          <b>301 vs 302?</b> A <b>301</b> (permanent) lets browsers cache the redirect — fewer hops, but you
          lose click analytics. A <b>302</b> (temporary) routes every click through your servers so you can
          count it. Most shorteners choose <b>302</b> on purpose.
        </p>

        <h2 className="os-note__h2">7 · Scaling &amp; data model</h2>
        <ul className="os-note__ul">
          <li><b>Stateless app tier</b> behind a load balancer — scale horizontally, no sticky sessions.</li>
          <li><b>Partition</b> the KV store by a hash of the code so reads/writes spread evenly; no range hotspots.</li>
          <li><b>Analytics</b> is forked off the hot path through <b>Kafka</b> → a columnar store, so counting clicks never slows a redirect.</li>
          <li><b>Expiry / cleanup:</b> a TTL column plus a lazy sweep — expired codes are reclaimed and can re-enter the key pool.</li>
        </ul>

        <h2 className="os-note__h2">Takeaways</h2>
        <p className="os-note__p">
          The whole design hinges on two ideas: <b>pre-mint keys</b> so writes never contend, and treat the
          read path as a <b>cache problem</b>, not a database problem. Everything else is standard
          stateless-tier scaling.
        </p>
      </>
    ),
  },
  {
    id: "web-crawler",
    title: "Designing a Web Crawler",
    blurb: "A polite, scalable crawler that fetches billions of pages without hammering any single host — built around a URL frontier, dedup filters, and a crawl loop.",
    date: "May 19, 2026",
    read: "9 min read",
    category: "system-design",
    tags: ["System Design", "Crawlers", "Scalability"],
    body: (
      <>
        <p className="os-note__lead">
          A web crawler is a deceptively deep system: it&apos;s a distributed BFS over a hostile, infinite,
          partly-broken graph — while staying <em>polite</em>. Here&apos;s the high-level design.
        </p>

        <h2 className="os-note__h2">1 · Requirements</h2>
        <p className="os-note__p"><b>Functional:</b> start from seed URLs, download pages, extract links, and store content for downstream indexing.</p>
        <p className="os-note__p"><b>Non-functional:</b> <b>scalable</b> to billions of pages, <b>polite</b> (respect <code>robots.txt</code> and per-host rate limits), <b>robust</b> against traps and malformed HTML, and <b>extensible</b> for new content types.</p>

        <h2 className="os-note__h2">2 · Back-of-the-envelope</h2>
        <ul className="os-note__ul">
          <li>1B pages / month ≈ <b>~400 pages/s</b> sustained (peaks much higher).</li>
          <li>~500&nbsp;KB/page → <b>~500 TB/month</b> of raw content. Storage and bandwidth dominate cost.</li>
          <li>The link graph is huge, so the <b>&quot;seen URL&quot;</b> set must be memory-cheap → a Bloom filter, not a hash set.</li>
        </ul>

        <h2 className="os-note__h2">3 · Architecture &amp; the crawl loop</h2>
        <figure className="os-note__figure">
          <WebCrawlerDiagram />
          <figcaption>The frontier feeds fetchers; parsed links are normalized, dedup-checked, and the unseen ones loop back into the frontier.</figcaption>
        </figure>
        <p className="os-note__p">
          Everything orbits the <b>URL Frontier</b>: a fetcher pulls a URL, resolves DNS, checks
          <code> robots.txt</code>, downloads the page, the parser extracts content and links, new links
          are filtered through the &quot;seen&quot; set, and survivors are re-enqueued. Repeat, forever.
        </p>

        <h2 className="os-note__h2">4 · Politeness (the hard part)</h2>
        <p className="os-note__p">
          You must never overwhelm one host. The frontier is two-tier: <b>front queues</b> prioritize
          (freshness, page rank), and <b>back queues</b> enforce politeness — <b>one queue per host</b>, each
          with its own crawl-delay. A router maps hostname → back-queue so a single worker owns a host and
          paces its requests.
        </p>
        <p className="os-note__callout">
          <b>Why per-host queues?</b> Politeness is a property of a <i>host</i>, not the whole crawler.
          Sharding the frontier by hostname lets you crawl thousands of sites in parallel while each site
          sees a gentle, rate-limited trickle.
        </p>

        <h2 className="os-note__h2">5 · Deduplication</h2>
        <ul className="os-note__ul">
          <li><b>URL dedup:</b> a <b>Bloom filter</b> answers &quot;have I seen this URL?&quot; in O(1) and a few bits per URL — tiny false-positive rate, never a false negative that re-crawls.</li>
          <li><b>Content dedup:</b> hash the page; mirrors and boilerplate repeat constantly. Use <b>simhash</b> to catch <i>near</i>-duplicates, not just exact matches.</li>
          <li><b>Canonicalize</b> URLs first (lowercase host, strip fragments, sort query params) so trivially-different URLs collapse before they hit the filter.</li>
        </ul>

        <h2 className="os-note__h2">6 · Robustness &amp; traps</h2>
        <ul className="os-note__ul">
          <li><b>Spider traps:</b> infinite calendars or dynamic URLs. Cap path depth and per-host page budgets.</li>
          <li><b>Freshness:</b> recrawl priority is adaptive — news re-crawls hourly, an archive page monthly.</li>
          <li><b>Failures:</b> timeouts and 5xx get exponential-backoff retries; persistent failures are quarantined.</li>
        </ul>

        <h2 className="os-note__h2">7 · Scaling</h2>
        <p className="os-note__p">
          Shard the frontier and fetchers by hostname across many workers; keep a distributed,
          checkpointed frontier so a crash resumes instead of restarting. DNS is a hidden bottleneck — run a
          <b> caching resolver</b>. Content lands in a distributed blob store; metadata and the link graph go
          to a separate index.
        </p>

        <h2 className="os-note__h2">Takeaways</h2>
        <p className="os-note__p">
          A crawler is a loop wrapped around a <b>frontier</b>. Get politeness (per-host queues) and dedup
          (Bloom + simhash) right, and the rest is throughput engineering: shard by host, cache DNS, and
          checkpoint everything.
        </p>
      </>
    ),
  },

  /* ─────────────── Go Deep Dives ─────────────── */
  {
    id: "go-124",
    title: "What's New in Go 1.24",
    blurb: "Generic type aliases, tool directives in go.mod, weak pointers, an os.Root sandbox, and a Swiss-Tables map that's faster for free.",
    date: "Mar 4, 2026",
    read: "7 min read",
    category: "go",
    featured: true,
    tags: ["Go", "Go 1.24", "Language"],
    body: (
      <>
        <p className="os-note__lead">
          Go 1.24 (Feb 2025) is a deceptively big release: a faster runtime you get for free, real generic
          type aliases, first-class tool dependencies, and a couple of long-requested safety primitives.
          Here are the parts I actually reach for.
        </p>

        <h2 className="os-note__h2">Faster maps, for free</h2>
        <p className="os-note__p">
          The built-in <code>map</code> is now implemented with <b>Swiss Tables</b>. You change nothing and
          get lower memory and faster lookups on large maps — the runtime also improved small-object
          allocation and mutex internals. Across the board it&apos;s a <b>~2–3% CPU</b> win on real workloads.
        </p>

        <h2 className="os-note__h2">Generic type aliases</h2>
        <p className="os-note__p">A type alias can finally take type parameters — handy for shortening verbose generic types:</p>
        <pre className="os-note__code">{`// before: you could only alias concrete types
type Set[T comparable] = map[T]struct{}

func main() {
    seen := Set[string]{}      // map[string]struct{}
    seen["a"] = struct{}{}
}`}</pre>

        <h2 className="os-note__h2">Tool dependencies in go.mod</h2>
        <p className="os-note__p">
          The old <code>tools.go</code> + blank-import hack is dead. Track CLI tools directly in
          <code> go.mod</code> with a <code>tool</code> directive:
        </p>
        <pre className="os-note__code">{`go get -tool golang.org/x/tools/cmd/stringer
go tool stringer -type=Pill   # run a pinned tool version`}</pre>
        <p className="os-note__p">Tool versions are now reproducible across the whole team — no more &quot;works on my machine&quot; codegen.</p>

        <h2 className="os-note__h2">Weak pointers + AddCleanup</h2>
        <p className="os-note__p">
          The new <code>weak</code> package gives <b>weak pointers</b> — references that don&apos;t keep an
          object alive. Perfect for canonicalization maps and caches that must not leak. Pair it with
          <code> runtime.AddCleanup</code>, a saner replacement for finalizers (multiple cleanups per object,
          no resurrection footguns).
        </p>

        <h2 className="os-note__h2">os.Root: a directory sandbox</h2>
        <p className="os-note__p">
          <code>os.Root</code> scopes filesystem access to a single directory — every <code>Open</code>/
          <code>Create</code> is resolved inside it, so symlinks and <code>../</code> can&apos;t escape. If you&apos;ve
          ever hand-rolled path-traversal guards on an upload handler, this replaces them:
        </p>
        <pre className="os-note__code">{`root, _ := os.OpenRoot("/srv/uploads")
defer root.Close()
f, err := root.Open(userPath) // can't traverse outside /srv/uploads`}</pre>

        <h2 className="os-note__h2">Smaller wins worth knowing</h2>
        <ul className="os-note__ul">
          <li><code>testing.B.Loop()</code> — <code>for b.Loop() {`{ ... }`}</code> replaces the error-prone <code>for i := 0; i &lt; b.N; i++</code> and keeps the loop body from being optimized away.</li>
          <li><code>json:&quot;...,omitzero&quot;</code> — omit true zero values (fixes <code>omitempty</code>&apos;s blind spots with structs and <code>time.Time</code>).</li>
          <li>Post-quantum + modern crypto: <code>crypto/mlkem</code>, <code>crypto/hkdf</code>, <code>crypto/pbkdf2</code>, <code>crypto/sha3</code>.</li>
          <li><code>encoding.TextAppender</code> / <code>BinaryAppender</code> — append-to-buffer marshalling without throwaway allocations.</li>
        </ul>

        <h2 className="os-note__h2">Takeaways</h2>
        <p className="os-note__p">
          Upgrade for the free runtime speedup alone. Then adopt <code>tool</code> directives to kill the
          tools.go hack, and reach for <code>os.Root</code> anywhere user input touches the filesystem.
        </p>
      </>
    ),
  },
  {
    id: "go-generic-stdlib",
    title: "slices, maps & the Generic Standard Library",
    blurb: "Go 1.21 shipped generic slices and maps packages plus min/max/clear builtins — the everyday helpers that finally killed copy-pasted for-loops.",
    date: "Feb 18, 2026",
    read: "6 min read",
    category: "go",
    tags: ["Go", "Generics", "Standard Library"],
    body: (
      <>
        <p className="os-note__lead">
          Before Go 1.21 every codebase had its own <code>containsString</code> and <code>sortByName</code>.
          The generic <code>slices</code> and <code>maps</code> packages (plus three new builtins) replaced
          all of it. This is the toolkit I now use daily.
        </p>

        <h2 className="os-note__h2">New builtins: min, max, clear</h2>
        <pre className="os-note__code">{`hi := max(a, b, c)     // variadic, any ordered type
lo := min(x, y)
clear(m)               // empty a map (or zero a slice)`}</pre>

        <h2 className="os-note__h2">The slices package</h2>
        <p className="os-note__p">Type-safe, allocation-aware helpers over any <code>[]T</code>:</p>
        <pre className="os-note__code">{`nums := []int{3, 1, 2}
slices.Sort(nums)                       // [1 2 3]
slices.SortFunc(users, func(a, b User) int {
    return cmp.Compare(a.Age, b.Age)    // cmp.Compare returns -1/0/1
})
i, ok := slices.BinarySearch(nums, 2)   // 1, true
has  := slices.Contains(nums, 3)        // true
nums  = slices.Delete(nums, 0, 1)       // remove index 0
out   = slices.Concat(a, b, c)          // 1.22+`}</pre>
        <p className="os-note__p">
          Highlights: <code>Sort</code>, <code>SortFunc</code>, <code>Contains</code>, <code>Index</code>,
          <code> Insert</code>, <code>Delete</code>, <code>Compact</code> (dedupe adjacent), <code>Reverse</code>,
          <code> Equal</code>, <code>Clone</code>, and <code>BinarySearch</code>.
        </p>

        <h2 className="os-note__h2">The maps package</h2>
        <pre className="os-note__code">{`m := map[string]int{"a": 1, "b": 2}
keys := slices.Sorted(maps.Keys(m))     // Go 1.23: range-over-func iterators
clone := maps.Clone(m)
maps.DeleteFunc(m, func(k string, v int) bool { return v == 0 })`}</pre>
        <p className="os-note__p">
          In Go 1.23 <code>maps.Keys</code>/<code>Values</code> return <b>iterators</b> (<code>iter.Seq</code>),
          which compose cleanly with <code>slices.Sorted</code> and <code>slices.Collect</code>.
        </p>

        <h2 className="os-note__h2">The cmp package</h2>
        <p className="os-note__p">
          <code>cmp.Compare</code> and <code>cmp.Less</code> give a standard ordering for <code>SortFunc</code>,
          and <code>cmp.Or</code> (1.22) returns the first non-zero argument — a tidy way to write fallbacks:
        </p>
        <pre className="os-note__code">{`name := cmp.Or(req.Name, cfg.Name, "anonymous")`}</pre>

        <h2 className="os-note__h2">Takeaways</h2>
        <p className="os-note__p">
          Delete your hand-rolled slice utilities. <code>slices</code> + <code>maps</code> + <code>cmp</code>
          are well-tested, generic, and often faster than the loop you&apos;d write — and they read better too.
        </p>
      </>
    ),
  },
  {
    id: "go-slog",
    title: "Structured Logging with log/slog",
    blurb: "Go 1.21 put structured, leveled logging in the standard library. Here's how to wire JSON logs, levels, and context attributes without a third-party logger.",
    date: "Jan 27, 2026",
    read: "6 min read",
    category: "go",
    tags: ["Go", "Observability", "Standard Library"],
    body: (
      <>
        <p className="os-note__lead">
          For years &quot;logging in Go&quot; meant picking between zap, zerolog, and logrus. Go 1.21&apos;s
          <code> log/slog</code> brought fast, structured, leveled logging into the stdlib — and for most
          services it&apos;s all you need.
        </p>

        <h2 className="os-note__h2">The basics</h2>
        <pre className="os-note__code">{`slog.Info("order placed",
    "orderID", id,
    "merchant", m,
    "amount", 499)
// key/value attrs, not printf — machine-parseable by default`}</pre>

        <h2 className="os-note__h2">Pick a handler (text vs JSON)</h2>
        <p className="os-note__p">A <code>Logger</code> wraps a <code>Handler</code>. Use JSON in production so log pipelines can index fields:</p>
        <pre className="os-note__code">{`h := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
    Level: slog.LevelDebug,
})
slog.SetDefault(slog.New(h))   // package-level slog.Info now emits JSON
// {"time":"...","level":"INFO","msg":"order placed","orderID":42,...}`}</pre>

        <h2 className="os-note__h2">Context attributes with With</h2>
        <p className="os-note__p">
          Attach fields once and they ride along on every line — ideal for request-scoped loggers:
        </p>
        <pre className="os-note__code">{`reqLog := slog.With("requestID", rid, "user", uid)
reqLog.Info("handling")        // both attrs included
reqLog.WithGroup("db").Info("query", "rows", n) // db.rows=n`}</pre>

        <h2 className="os-note__h2">Performance: Attr and LogValuer</h2>
        <ul className="os-note__ul">
          <li>Use typed constructors — <code>slog.Int</code>, <code>slog.String</code> — to avoid the <code>any</code> boxing on hot paths.</li>
          <li>Implement <code>slog.LogValuer</code> on a type to compute its log form <b>lazily</b>, so expensive fields cost nothing when the level is disabled.</li>
          <li>Below the handler&apos;s level, <code>slog</code> short-circuits before formatting — disabled <code>Debug</code> lines are nearly free.</li>
        </ul>
        <pre className="os-note__code">{`func (u User) LogValue() slog.Value {
    return slog.GroupValue(slog.String("id", u.ID)) // omit PII
}`}</pre>

        <h2 className="os-note__h2">Takeaways</h2>
        <p className="os-note__p">
          Reach for <code>slog</code> first. Set a JSON handler as the default at startup, build a
          request-scoped logger with <code>With</code>, and use <code>LogValuer</code> to keep sensitive or
          expensive fields under control. No dependency required.
        </p>
      </>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   App
   ───────────────────────────────────────────────────────────── */

type Filter = "all" | CategoryId | "featured";

const CATEGORIES: { id: Filter; label: string; icon: string; sub: string }[] = [
  { id: "all", label: "All Posts", icon: "article", sub: "Everything I've written — system design and Go deep dives." },
  { id: "system-design", label: "System Design", icon: "hub", sub: "Whiteboard-style breakdowns of read-heavy, scaled systems." },
  { id: "go", label: "Go Deep Dives", icon: "code", sub: "New Go releases, standard-library additions, and how I use them." },
  { id: "featured", label: "Featured", icon: "bolt", sub: "The posts I'd hand someone first." },
];

const matches = (p: Post, f: Filter) =>
  f === "all" ? true : f === "featured" ? !!p.featured : p.category === f;

export default function NotesApp() {
  const [filter, setFilter] = useState<Filter>("all");
  const [activeId, setActiveId] = useState(POSTS[0].id);
  const [reading, setReading] = useState(false); // mobile: list ↔ reader

  const visible = POSTS.filter((p) => matches(p, filter));
  const post = visible.find((p) => p.id === activeId) ?? visible[0] ?? POSTS[0];
  const category = CATEGORIES.find((c) => c.id === filter) ?? CATEGORIES[0];

  const open = (id: string) => {
    setActiveId(id);
    setReading(true);
  };

  const selectCategory = (f: Filter) => {
    setFilter(f);
    const first = POSTS.find((p) => matches(p, f));
    if (first) setActiveId(first.id); // keep reader in sync with the filter
    setReading(false);
  };

  return (
    <div className="os-shell">
      <AppSidebar
        title="Notes"
        status={`${POSTS.length} published`}
        items={CATEGORIES.map((c) => ({
          icon: c.icon,
          label: c.label,
          active: filter === c.id,
          onClick: () => selectCategory(c.id),
          badge: String(POSTS.filter((p) => matches(p, c.id)).length),
        }))}
        foot={{ initials: "TM", name: "Tarosh Mathuria", role: "Engineering notes" }}
      />

      <div className="os-main">
        <div className={`os-notes${reading ? " is-reading" : ""}`}>
          {/* Post list */}
          <div className="os-notes__list">
            <div className="os-notes__list-head">
              <span className="os-eyebrow">The Blog</span>
              <h1 className="os-notes__list-title">{category.label === "All Posts" ? "Engineering notes" : category.label}</h1>
              <p className="os-notes__list-sub">{category.sub}</p>
            </div>
            {visible.map((p) => (
              <button
                key={p.id}
                className={`os-notes__item${p.id === activeId ? " is-active" : ""}`}
                onClick={() => open(p.id)}
              >
                <span className="os-notes__item-title">{p.title}</span>
                <span className="os-notes__item-blurb">{p.blurb}</span>
                <span className="os-notes__item-meta">
                  <span>{p.date}</span>
                  <span className="os-notes__dot">·</span>
                  <span>{p.read}</span>
                </span>
              </button>
            ))}
          </div>

          {/* Reader */}
          <article className="os-notes__reader">
            <button className="os-notes__back" onClick={() => setReading(false)}>
              <Sym name="chevron_left" size={18} /> All posts
            </button>
            <header className="os-note__head">
              <div className="os-note__tags">
                {post.tags.map((t) => (
                  <span key={t} className="os-pill">{t}</span>
                ))}
              </div>
              <h1 className="os-note__title">{post.title}</h1>
              <div className="os-note__byline">
                <span className="os-notes__avatar">TM</span>
                <span>Tarosh Mathuria</span>
                <span className="os-notes__dot">·</span>
                <span>{post.date}</span>
                <span className="os-notes__dot">·</span>
                <span>{post.read}</span>
              </div>
            </header>
            <div className="os-note__body">{post.body}</div>
          </article>
        </div>
      </div>
    </div>
  );
}
