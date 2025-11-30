"use client";

import { useState } from "react";
import Head from "next/head";

type SearchResult = {
  id: string;
  title: string;
  body: string;
};

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [summary, setSummary] = useState("");
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    setResults([]);
    setSummary("");
    setSources([]);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (data.message) {
        setMessage(data.message);
      }

      setResults(data.results || []);
      setSummary(data.summary || "");
      setSources(data.sources || []);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const hasResults = results.length > 0;

  return (
  
	<>
	<Head>
        <title>FAQ Search App</title>
        <meta name="description" content="Search FAQs by relevance" />
     </Head>
  
    <main
      style={{
        padding: "2rem",
        maxWidth: 600,
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>FAQ Search</h1>

      {/* Search input + button */}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <input
          style={{ flex: 1, padding: "0.5rem" }}
          type="text"
          placeholder="Search FAQs (e.g. trust badges)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>
          Error: {error}
        </p>
      )}

      {/* Info message*/}
      {message && !hasResults && !error && (
        <p style={{ marginTop: "1rem" }}>{message}</p>
      )}

      {/* Empty state*/}
      {!loading && !error && !hasResults && !message && (
        <p style={{ marginTop: "1rem" }}>Try searching for an FAQ above.</p>
      )}

      {/* Results */}
      {hasResults && (
        <section style={{ marginTop: "2rem" }}>
          <h2>Results</h2>
          {results.map((item) => (
            <article
              key={item.id}
              style={{
                border: "1px solid #ddd",
                padding: "0.75rem",
                borderRadius: 8,
                marginBottom: "0.75rem",
              }}
            >
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}

          {/*summary + sources */}
          {summary && (
            <div style={{ marginTop: "1rem", fontStyle: "italic" }}>
              <strong>Summary:</strong> {summary}
            </div>
          )}
          {sources.length > 0 && (
            <div style={{ marginTop: "0.5rem" }}>
              <strong>Sources:</strong> [{sources.join(", ")}]
            </div>
          )}
        </section>
      )}
    </main>
	</>
  );
}
