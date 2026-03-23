"use client";

import { useCallback, useEffect, useState } from "react";
import { CompanyProfile, EMPTY_COMPANY_PROFILE } from "../types";

const STORAGE_KEY = "personai_company";

function loadProfile(): CompanyProfile {
  if (typeof window === "undefined") return EMPTY_COMPANY_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CompanyProfile) : EMPTY_COMPANY_PROFILE;
  } catch {
    return EMPTY_COMPANY_PROFILE;
  }
}

function saveToStorage(profile: CompanyProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // storage unavailable — silently ignore
  }
}

export function useCompany() {
  const [profile, setProfile] = useState<CompanyProfile>(EMPTY_COMPANY_PROFILE);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(loadProfile());
  }, []);

  const saveProfile = useCallback((updated: CompanyProfile) => {
    saveToStorage(updated);
    setProfile(updated);
  }, []);

  return { profile, saveProfile };
}
