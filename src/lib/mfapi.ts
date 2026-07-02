export const MFAPI_BASE_URL = "https://api.mfapi.in";

export type MfapiSchemeSearchResult = {
  schemeCode: number;
  schemeName: string;
};

export type MfapiSchemeMeta = {
  fund_house: string;
  scheme_type: string;
  scheme_category: string;
  scheme_code: number;
  scheme_name: string;
  isin_growth: string | null;
  isin_div_reinvestment: string | null;
};

export type MfapiNavPoint = {
  date: string;
  nav: string;
};

export type MfapiNavResponse = {
  meta: MfapiSchemeMeta;
  data: MfapiNavPoint[];
  status: "SUCCESS" | string;
};

export type FundSearchResult = {
  schemeCode: number;
  schemeName: string;
  nav: string | null;
  navDate: string | null;
  fundHouse: string | null;
  category: string | null;
};

type RequestOptions = {
  revalidate?: number;
};

async function mfapiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${MFAPI_BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: options.revalidate ?? 60 * 60,
    },
  });

  if (!response.ok) {
    throw new Error(`MFAPI request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function searchMutualFundSchemes(query: string) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  return mfapiFetch<MfapiSchemeSearchResult[]>(`/mf/search?q=${encodeURIComponent(trimmedQuery)}`, {
    revalidate: 60 * 60,
  });
}

export async function listMutualFundSchemes(limit = 100, offset = 0) {
  return mfapiFetch<MfapiSchemeSearchResult[]>(`/mf?limit=${limit}&offset=${offset}`, {
    revalidate: 24 * 60 * 60,
  });
}

export async function getLatestNav(schemeCode: number | string) {
  return mfapiFetch<MfapiNavResponse>(`/mf/${schemeCode}/latest`, {
    revalidate: 60 * 60,
  });
}

export async function getNavHistory(
  schemeCode: number | string,
  params: { startDate?: string; endDate?: string } = {},
) {
  const searchParams = new URLSearchParams();

  if (params.startDate) {
    searchParams.set("startDate", params.startDate);
  }

  if (params.endDate) {
    searchParams.set("endDate", params.endDate);
  }

  const queryString = searchParams.toString();

  return mfapiFetch<MfapiNavResponse>(`/mf/${schemeCode}${queryString ? `?${queryString}` : ""}`, {
    revalidate: 60 * 60,
  });
}

export async function searchFundsWithLatestNav(query: string, limit = 8) {
  const schemes = await searchMutualFundSchemes(query);
  const limitedSchemes = schemes.slice(0, limit);

  const funds = await Promise.all(
    limitedSchemes.map(async (scheme): Promise<FundSearchResult> => {
      try {
        const latest = await getLatestNav(scheme.schemeCode);
        const latestPoint = latest.data[0];

        return {
          schemeCode: scheme.schemeCode,
          schemeName: scheme.schemeName,
          nav: latestPoint?.nav ?? null,
          navDate: latestPoint?.date ?? null,
          fundHouse: latest.meta.fund_house,
          category: latest.meta.scheme_category,
        };
      } catch {
        return {
          schemeCode: scheme.schemeCode,
          schemeName: scheme.schemeName,
          nav: null,
          navDate: null,
          fundHouse: null,
          category: null,
        };
      }
    }),
  );

  return funds;
}
