import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { tabooList } from "@/lib/data/categories/index";
import { CATEGORIES_CONFIG } from "@/lib/constants/categories";

const CATEGORY_ORDER = [
  "General",
  "AI",
  "Software Engineering",
  "Data",
  "Product Management",
  "Data Structures & Algorithms",
  "System Design",
  "Game Development",
  "DevOps",
  "Cybersecurity",
  "UX Design",
  "Responsible Tech",
];

export function GlossaryGenerator() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = tabooList.filter((entry) => {
    const matchesSearch =
      !search ||
      entry.word.toLowerCase().includes(search.toLowerCase()) ||
      entry.explanation?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !activeCategory || entry.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = CATEGORY_ORDER.filter((cat) =>
    tabooList.some((e) => e.category === cat),
  );

  const byCategory = categories.reduce<Record<string, typeof tabooList>>(
    (acc, cat) => {
      acc[cat] = filtered.filter((e) => e.category === cat);
      return acc;
    },
    {},
  );

  const configKey = (cat: string) => {
    const map: Record<string, string> = {
      "Data Structures & Algorithms": "DSA",
      "Game Development": "Game Dev",
    };
    return map[cat] ?? cat;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Techie Taboo Glossary
            </h1>
            <p className="text-muted-foreground">
              Browse all {tabooList.length} tech terms and their plain-English
              explanations.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <Input
              placeholder="Search terms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === null
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                All
              </button>
              {categories.map((cat) => {
                const cfg = CATEGORIES_CONFIG[configKey(cat)];
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(isActive ? null : cat)}
                    style={
                      isActive && cfg
                        ? { backgroundColor: cfg.color, color: cfg.textColor }
                        : {}
                    }
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      isActive
                        ? ""
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No terms match your search.
            </p>
          ) : (
            categories.map((cat) => {
              const entries = byCategory[cat];
              if (!entries || entries.length === 0) return null;
              const cfg = CATEGORIES_CONFIG[configKey(cat)];
              return (
                <Card key={cat}>
                  <CardHeader
                    className="py-3 px-5 rounded-t-lg"
                    style={
                      cfg
                        ? { backgroundColor: cfg.color, color: cfg.textColor }
                        : {}
                    }
                  >
                    <CardTitle className="text-base font-semibold">
                      {cat}{" "}
                      <span className="font-normal opacity-70 text-sm">
                        ({entries.length})
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <dl className="divide-y divide-border">
                      {entries.map((entry) => (
                        <div key={entry.index} className="px-5 py-3">
                          <dt className="font-semibold text-sm">
                            {entry.word}
                          </dt>
                          {entry.explanation && (
                            <dd className="text-sm text-muted-foreground mt-0.5">
                              {entry.explanation}
                            </dd>
                          )}
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
