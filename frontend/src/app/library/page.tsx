
"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Leaf, Search } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

type ApiClass =
  | string
  | {
      name?: unknown;
      class_name?: unknown;
      label?: unknown;
      is_background?: unknown;
      is_healthy?: unknown;
    };

function getClassName(item: ApiClass): string | null {
  if (typeof item === "string") {
    return item.trim() || null;
  }

  if (item && typeof item === "object") {
    const name = item.name ?? item.class_name ?? item.label;

    if (typeof name === "string" && name.trim()) {
      return name.trim();
    }
  }

  return null;
}

function formatLabel(value: string): string {
  return value
    .replace("___", " — ")
    .replaceAll("_", " ")
    .replaceAll(/\\/g, "");
}

function isBackgroundClass(value: string): boolean {
  return value === "Background_without_leaves";
}

function isHealthyClass(value: string): boolean {
  return value.toLowerCase().includes("healthy");
}

export default function LibraryPage() {
  const [classes, setClasses] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadClasses() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE}/api/classes`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `The model service could not return its class list (${response.status}).`,
          );
        }

        const data: unknown = await response.json();

        // Accept either { classes: [...] } or a direct array.
        let rawClasses: unknown[];

        if (Array.isArray(data)) {
          rawClasses = data;
        } else if (
          data !== null &&
          typeof data === "object" &&
          Array.isArray((data as { classes?: unknown }).classes)
        ) {
          rawClasses = (data as { classes: unknown[] }).classes;
        } else {
          throw new Error(
            "Unexpected class-list format. The API must return an array of classes.",
          );
        }

        const normalizedClasses = rawClasses
          .map((item) => getClassName(item as ApiClass))
          .filter((name): name is string => name !== null);

        if (normalizedClasses.length === 0) {
          throw new Error(
            "The model service returned no valid class names.",
          );
        }

        // Remove duplicate labels while preserving their original order.
        setClasses([...new Set(normalizedClasses)]);
      } catch (exception) {
        if (
          exception instanceof Error &&
          exception.name === "AbortError"
        ) {
          return;
        }

        setError(
          exception instanceof Error
            ? exception.message
            : "Unable to load the supported classes.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadClasses();

    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    return classes.filter((item) =>
      formatLabel(item).toLowerCase().includes(searchTerm),
    );
  }, [classes, query]);

  return (
    <main className="page-content">
      <section className="page-heading">
        <div>
          <p className="eyebrow">REFERENCE</p>
          <h1>Disease library.</h1>
          <p>
            Explore the plant classes supported by the model. These are
            classification labels, not a complete agricultural diagnosis
            guide.
          </p>
        </div>

        <span className="neutral-badge">
          <BookOpen size={14} />
          Model class reference
        </span>
      </section>

      <section className="card">
        <label htmlFor="class-search" className="card-title">
          Search supported classes
        </label>

        <div style={{ position: "relative", marginTop: 14 }}>
          <Search
            size={16}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 13,
              top: 13,
              color: "#7a857c",
            }}
          />

          <input
            id="class-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try tomato, healthy, rust…"
            style={{
              width: "100%",
              minHeight: 42,
              border: "1px solid var(--line)",
              borderRadius: 11,
              padding: "10px 12px 10px 39px",
              background: "#fff",
              color: "var(--ink)",
            }}
          />
        </div>

        {loading && (
          <p className="card-subtitle" role="status">
            Loading classes from the model service…
          </p>
        )}

        {error && !loading && (
          <div
            className="notice error-notice"
            role="alert"
            style={{ marginTop: 15 }}
          >
            {error} Check that FastAPI is running and refresh this page.
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="card-subtitle" style={{ marginBottom: 18 }}>
              Showing {filtered.length} of {classes.length} supported classes.
            </p>

            {filtered.length > 0 ? (
              <div className="class-grid">
                {filtered.map((item) => {
                  const background = isBackgroundClass(item);
                  const healthy = isHealthyClass(item);

                  return (
                    <article className="class-card" key={item}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          color: "var(--forest)",
                        }}
                      >
                        <Leaf size={17} />

                        <span className="neutral-badge">
                          {background
                            ? "Background class"
                            : healthy
                              ? "Healthy class"
                              : "Disease class"}
                        </span>
                      </div>

                      <h3>{formatLabel(item)}</h3>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No matching classes</h3>
                <p>Try another plant or disease name.</p>
              </div>
            )}
          </>
        )}
      </section>

      <div className="notice" style={{ marginTop: 17 }}>
        The background class in this dataset is broad and can contain images
        unrelated to leaves. Its prediction should not be interpreted as a
        reliable leaf detector.
      </div>
    </main>
  );
}
