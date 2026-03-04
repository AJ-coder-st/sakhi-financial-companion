import schemes from "../data/schemes.json";

export interface Scheme {
  name: string;
  maxLoan: number;
  targetOccupation?: string;
  incomeLimit?: number;
  description: string;
  locations?: string[];
}

export interface SchemeMatchInput {
  income: number;
  occupation?: string;
  location?: string;
}

export async function matchSchemes(
  input: SchemeMatchInput,
): Promise<Scheme[]> {
  const normalizedOccupation = (input.occupation || "").toLowerCase();
  const normalizedLocation = (input.location || "").toLowerCase();

  const allSchemes = (schemes as Scheme[]) || [];

  const scored = allSchemes
    .map((scheme) => {
      let score = 0;

      // Income eligibility
      if (scheme.incomeLimit != null) {
        if (input.income <= scheme.incomeLimit) {
          score += 3;
        } else {
          // Not eligible on income
          return null;
        }
      } else {
        score += 1;
      }

      // Occupation match
      if (scheme.targetOccupation) {
        const target = scheme.targetOccupation.toLowerCase();
        if (normalizedOccupation.includes(target) || target.includes(normalizedOccupation)) {
          score += 3;
        }
      }

      // Location preference (if present)
      if (scheme.locations && scheme.locations.length > 0) {
        const matchesLocation = scheme.locations.some((loc) =>
          normalizedLocation.includes(loc.toLowerCase()),
        );
        if (matchesLocation) {
          score += 2;
        }
      }

      // Higher max loan is slightly better
      score += Math.min(2, scheme.maxLoan / 50000);

      return { scheme, score };
    })
    .filter(Boolean) as { scheme: Scheme; score: number }[];

  scored.sort((a, b) => b.score - a.score);

  return scored.map((item) => item.scheme).slice(0, 5);
}

