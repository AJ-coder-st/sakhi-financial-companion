import schemes from "../../data/schemes.json";

export interface UserProfile {
  income: number;
  occupation: string;
  gender: "male" | "female" | "other";
  hasOwnBusiness: boolean;
  businessType?: string;
  location: "rural" | "semi-urban" | "urban";
  isGroupMember?: boolean;
  age: number;
}

export interface Scheme {
  id?: number;
  name: string;
  nameHi?: string;
  maxLoan: number;
  minLoan?: number;
  interestRate?: string;
  loanTenure?: string;
  targetOccupation?: string | string[];
  incomeLimit?: number;
  description: string;
  descriptionHi?: string;
  eligibility?: string[];
  benefits?: string[];
  locations?: string[];
  matchScore?: number;
}

export interface SchemeMatchInput {
  income: number;
  occupation?: string;
  location?: string;
  gender?: "male" | "female" | "other";
  hasOwnBusiness?: boolean;
  isGroupMember?: boolean;
  age?: number;
}

/**
 * Calculate match score for a user-scheme pair
 */
const calculateMatchScore = (userProfile: Partial<UserProfile>, scheme: Scheme): number => {
  let score = 0;

  // Income match (25 points max)
  if (scheme.incomeLimit != null) {
    if (userProfile.income && userProfile.income <= scheme.incomeLimit) {
      score += 25;
    } else if (userProfile.income && userProfile.income <= (scheme.incomeLimit || 0) * 1.2) {
      score += 15;
    }
  } else {
    score += 25;
  }

  // Occupation match (30 points max)
  if (scheme.targetOccupation && userProfile.occupation) {
    const targets = Array.isArray(scheme.targetOccupation)
      ? scheme.targetOccupation
      : [scheme.targetOccupation];

    const occupationMatch = targets.some(
      (occ) =>
        occ.toLowerCase() === userProfile.occupation.toLowerCase() ||
        userProfile.occupation.toLowerCase().includes(occ.toLowerCase())
    );

    if (occupationMatch) {
      score += 30;
    } else if (targets.includes("all citizens")) {
      score += 20;
    }
  }

  // Location match (20 points max)
  if (scheme.locations && scheme.locations.length > 0 && userProfile.location) {
    if (scheme.locations.includes(userProfile.location)) {
      score += 20;
    } else if (scheme.locations.length > 1) {
      score += 10;
    }
  }

  // Gender-specific schemes (15 points max)
  if (
    userProfile.gender === "female" &&
    (scheme.name.toLowerCase().includes("women") ||
      scheme.name.toLowerCase().includes("mahila"))
  ) {
    score += 15;
  } else if (!scheme.name.toLowerCase().includes("women")) {
    score += 10;
  }

  // Business/SHG status (10 points max)
  if (userProfile.hasOwnBusiness && scheme.name.includes("Mudra")) {
    score += 10;
  } else if (userProfile.isGroupMember && scheme.name.includes("SHG")) {
    score += 10;
  }

  return Math.min(100, Math.round(score));
};

/**
 * Match schemes based on user input
 */
export async function matchSchemes(
  input: SchemeMatchInput | UserProfile,
): Promise<Scheme[]> {
  const userProfile: Partial<UserProfile> = {
    income: input.income,
    occupation: "occupation" in input ? input.occupation : "",
    gender: "gender" in input ? input.gender : "other",
    hasOwnBusiness: "hasOwnBusiness" in input ? input.hasOwnBusiness : false,
    location:
      (("location" in input && input.location) as "rural" | "semi-urban" | "urban") || "semi-urban",
    isGroupMember: "isGroupMember" in input ? input.isGroupMember : false,
    age: "age" in input ? input.age : 25,
  };

  const allSchemes = (schemes as Scheme[]) || [];

  const scored = allSchemes
    .map((scheme) => {
      const score = calculateMatchScore(userProfile, scheme);
      return score > 0 ? { scheme, score } : null;
    })
    .filter(Boolean) as { scheme: Scheme; score: number }[];

  scored.sort((a, b) => b.score - a.score);

  return scored
    .map((item) => ({
      ...item.scheme,
      matchScore: item.score,
    }))
    .slice(0, 5);
}

/**
 * Get top 3 matching schemes
 */
export const getTopSchemes = async (
  input: UserProfile | SchemeMatchInput,
  topN: number = 3
): Promise<Scheme[]> => {
  const matched = await matchSchemes(input);
  return matched.slice(0, topN);
};

/**
 * Check eligibility for a specific scheme
 */
export const checkEligibility = (
  userProfile: Partial<UserProfile>,
  scheme: Scheme
): {
  isEligible: boolean;
  reasons: string[];
  concerns: string[];
} => {
  const reasons: string[] = [];
  const concerns: string[] = [];

  // Check income limit
  if (
    scheme.incomeLimit != null &&
    userProfile.income &&
    userProfile.income > scheme.incomeLimit
  ) {
    concerns.push(
      `Income exceeds limit of ₹${scheme.incomeLimit.toLocaleString()}`
    );
  } else if (userProfile.income) {
    reasons.push(
      `Income of ₹${userProfile.income.toLocaleString()} is within limits`
    );
  }

  // Check age
  if (userProfile.age && userProfile.age >= 18) {
    reasons.push("Age requirement met (18+)");
  } else if (userProfile.age && userProfile.age < 18) {
    concerns.push("Must be 18 years or older");
  }

  // Check occupation
  if (scheme.targetOccupation && userProfile.occupation) {
    const targets = Array.isArray(scheme.targetOccupation)
      ? scheme.targetOccupation
      : [scheme.targetOccupation];

    if (targets.some((t) => t.toLowerCase().includes(userProfile.occupation!.toLowerCase()))) {
      reasons.push(`Occupation match: ${userProfile.occupation}`);
    }
  }

  const isEligible = concerns.length === 0 && reasons.length >= 1;

  return {
    isEligible,
    reasons,
    concerns,
  };
};
