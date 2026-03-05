"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type DiscoverFilters = {
  roles: string[];
  tasks: string[];
  prices: string[];
};

export type DiscoverContextType = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: DiscoverFilters;
  setFilters: (filters: DiscoverFilters | ((prev: DiscoverFilters) => DiscoverFilters)) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const DiscoverContext = createContext<DiscoverContextType | null>(null);

export function useDiscover() {
  const context = useContext(DiscoverContext);
  if (!context) {
    throw new Error("useDiscover must be used within a DiscoverProvider");
  }
  return context;
}

export function DiscoverProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("New & NoteWorthy");
  const [filters, setFilters] = useState<DiscoverFilters>({
    roles: [],
    tasks: [],
    prices: [],
  });

  return (
    <DiscoverContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </DiscoverContext.Provider>
  );
}
