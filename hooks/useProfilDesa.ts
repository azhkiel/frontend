// ============================================================
// useProfilDesa — fetch profil desa (termasuk logoUrl & namaDesa)
// Client-side hook, cache sederhana via module-level variable
// ============================================================

"use client";

import { useState, useEffect } from "react";
import type { Profil } from "@/lib/types";

// Module-level cache agar tidak refetch setiap render komponen
let _cachedProfil: Profil | null = null;
let _fetchPromise: Promise<Profil> | null = null;

async function fetchProfil(): Promise<Profil> {
  if (_cachedProfil) return _cachedProfil;
  if (_fetchPromise) return _fetchPromise;

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
  _fetchPromise = fetch(`${BASE_URL}?action=getProfil`)
    .then((r) => r.json())
    .then((data) => {
      _cachedProfil = data as Profil;
      _fetchPromise = null;
      return _cachedProfil;
    })
    .catch(() => {
      _fetchPromise = null;
      throw new Error("Gagal memuat profil desa");
    });

  return _fetchPromise;
}

export function useProfilDesa() {
  const [profil, setProfil] = useState<Profil | null>(_cachedProfil);
  const [isLoading, setIsLoading] = useState(!_cachedProfil);

  useEffect(() => {
    if (_cachedProfil) {
      setProfil(_cachedProfil);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetchProfil()
      .then((p) => {
        setProfil(p);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  return { profil, isLoading };
}
