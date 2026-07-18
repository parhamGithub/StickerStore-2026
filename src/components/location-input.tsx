"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin } from "lucide-react";

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function LocationInput({ value, onChange, placeholder = "City, Country" }: Props) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [fetching, setFetching] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setFetching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`,
        { headers: { "User-Agent": "StickerStore/1.0" } },
      );
      if (!res.ok) return;
      const data: Suggestion[] = await res.json();
      setSuggestions(data);
      setOpen(data.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => fetchSuggestions(query), 300);
    return () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } };
  }, [query, fetchSuggestions]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(s: Suggestion) {
    onChange(s.display_name);
    setQuery(s.display_name);
    setOpen(false);
  }

  function handleInputChange(val: string) {
    setQuery(val);
    onChange(val);
  }

  return (
    <div ref={rootRef} className="relative">
      <input
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
        className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 pr-8 text-[14px] text-foreground outline-none focus:border-coral transition-colors"
        placeholder={placeholder}
      />
      {fetching && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="size-4 animate-spin rounded-full border-2 border-foreground/15 border-t-coral" />
        </div>
      )}
      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 max-h-48 overflow-y-auto rounded-xl border border-foreground/10 bg-white shadow-lg">
          {suggestions.map((s, i) => (
            <button
              key={`${s.lat}-${s.lon}-${i}`}
              onClick={() => handleSelect(s)}
              className="flex w-full items-start gap-3 px-4 py-3 text-left text-[13px] text-foreground hover:bg-foreground/5 transition-colors cursor-pointer border-none"
            >
              <MapPin size={16} className="mt-0.5 shrink-0 text-text-secondary" />
              <span className="leading-snug">{s.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
