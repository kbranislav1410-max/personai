/**
 * MVP Scoring Engine - Keyword-based matching
 * Scores candidates based on keyword matches in resume text against position requirements
 */

type ScoringWeights = {
  mustHave: number;
  niceToHave: number;
  custom: number;
};

type ScoringInput = {
  resumeText: string;
  mustHaveRequirements: string;
  niceToHaveRequirements: string;
  customRequirements?: string;
  weights?: ScoringWeights;
};

type ScoringResult = {
  score: number; // 0-100
  recommendation: 'yes' | 'maybe' | 'no';
  summary: string;
  strengths: string;
  gaps: string;
  mustHaveMatches: string[];
  niceToHaveMatches: string[];
  customMatches: string[];
};

/**
 * Extract keywords from text
 * Splits on common delimiters and filters out short/common words
 */
function extractKeywords(text: string): string[] {
  if (!text || !text.trim()) return [];
  
  const normalized = text.toLowerCase();
  
  // Split on punctuation, newlines, bullets, etc.
  const words = normalized
    .split(/[,;\n•\|\/\\\-]/)
    .flatMap(phrase => phrase.trim().split(/\s+/))
    .filter(word => word.length > 2) // Filter out very short words
    .filter(word => !['and', 'the', 'for', 'with', 'from', 'that', 'this', 'have', 'has', 'are', 'was', 'were', 'been'].includes(word));
  
  // Also extract multi-word phrases (2-3 words)
  const phrases: string[] = [];
  const phraseParts = normalized.split(/[,;\n•]/).map(p => p.trim());
  
  for (const part of phraseParts) {
    const partWords = part.split(/\s+/).filter(w => w.length > 0);
    if (partWords.length >= 2 && partWords.length <= 3) {
      phrases.push(part.trim());
    }
  }
  
  return [...new Set([...words, ...phrases])];
}

/**
 * Calculate match score between resume text and requirements
 */
function calculateMatches(resumeText: string, requirements: string): { matchedKeywords: string[]; matchRate: number } {
  if (!requirements || !requirements.trim()) {
    return { matchedKeywords: [], matchRate: 0 };
  }
  
  const resumeLower = resumeText.toLowerCase();
  const keywords = extractKeywords(requirements);
  
  if (keywords.length === 0) {
    return { matchedKeywords: [], matchRate: 0 };
  }
  
  const matched = keywords.filter(keyword => {
    // Check if keyword appears in resume (keywords are already lowercase)
    return resumeLower.includes(keyword);
  });
  
  const matchRate = matched.length / keywords.length;
  
  return { matchedKeywords: matched, matchRate };
}

/**
 * Generate summary text based on matches and gaps
 */
function generateSummary(
  mustHaveMatches: string[],
  niceToHaveMatches: string[],
  customMatches: string[],
  mustHaveKeywords: string[],
  niceToHaveKeywords: string[],
  customKeywords: string[],
  recommendation: 'yes' | 'maybe' | 'no'
): string {
  const totalMatches = mustHaveMatches.length + niceToHaveMatches.length + customMatches.length;
  const totalKeywords = mustHaveKeywords.length + niceToHaveKeywords.length + customKeywords.length;
  
  let summary = '';
  
  if (recommendation === 'yes') {
    summary = `Strong candidate with excellent alignment to position requirements. `;
    summary += `Matches ${mustHaveMatches.length} of ${mustHaveKeywords.length} must-have requirements `;
    summary += `and ${niceToHaveMatches.length} of ${niceToHaveKeywords.length} nice-to-have skills. `;
    
    if (mustHaveMatches.length > 0) {
      const topMatches = mustHaveMatches.slice(0, 3).join(', ');
      summary += `Demonstrates proficiency in ${topMatches}.`;
    }
  } else if (recommendation === 'maybe') {
    summary = `Potentially suitable candidate with partial match to requirements. `;
    summary += `Meets ${mustHaveMatches.length} of ${mustHaveKeywords.length} must-have criteria. `;
    
    const missingMustHave = mustHaveKeywords.length - mustHaveMatches.length;
    if (missingMustHave > 0) {
      summary += `May need development in ${missingMustHave} key area${missingMustHave > 1 ? 's' : ''}. `;
    }
    
    if (niceToHaveMatches.length > 0) {
      summary += `Shows strength in ${niceToHaveMatches.length} additional skill${niceToHaveMatches.length > 1 ? 's' : ''}.`;
    }
  } else {
    summary = `Limited alignment with position requirements. `;
    summary += `Matches only ${mustHaveMatches.length} of ${mustHaveKeywords.length} must-have requirements. `;
    
    if (totalMatches > 0) {
      summary += `Shows some relevant experience but significant gaps in core competencies. `;
    } else {
      summary += `Resume does not demonstrate required qualifications for this role.`;
    }
  }
  
  return summary;
}

/**
 * Main scoring function
 * Analyzes resume text against position requirements and returns detailed scoring
 */
export function scoreCandidate(input: ScoringInput): ScoringResult {
  const weights = input.weights || { mustHave: 70, niceToHave: 20, custom: 10 };
  
  // Normalize weights to percentages
  const totalWeight = weights.mustHave + weights.niceToHave + weights.custom;
  const normalizedWeights = {
    mustHave: weights.mustHave / totalWeight,
    niceToHave: weights.niceToHave / totalWeight,
    custom: weights.custom / totalWeight,
  };
  
  // Calculate matches for each category
  const mustHaveResult = calculateMatches(input.resumeText, input.mustHaveRequirements);
  const niceToHaveResult = calculateMatches(input.resumeText, input.niceToHaveRequirements);
  const customResult = input.customRequirements 
    ? calculateMatches(input.resumeText, input.customRequirements)
    : { matchedKeywords: [], matchRate: 0 };
  
  // Calculate weighted score
  const weightedScore = 
    (mustHaveResult.matchRate * normalizedWeights.mustHave * 100) +
    (niceToHaveResult.matchRate * normalizedWeights.niceToHave * 100) +
    (customResult.matchRate * normalizedWeights.custom * 100);
  
  const finalScore = Math.round(Math.min(100, Math.max(0, weightedScore)));
  
  // Determine recommendation based on score
  let recommendation: 'yes' | 'maybe' | 'no';
  if (finalScore >= 75) {
    recommendation = 'yes';
  } else if (finalScore >= 50) {
    recommendation = 'maybe';
  } else {
    recommendation = 'no';
  }
  
  // Generate strengths and gaps
  const strengths: string[] = [];
  if (mustHaveResult.matchedKeywords.length > 0) {
    strengths.push(...mustHaveResult.matchedKeywords.slice(0, 5));
  }
  if (niceToHaveResult.matchedKeywords.length > 0) {
    strengths.push(...niceToHaveResult.matchedKeywords.slice(0, 3));
  }
  
  const mustHaveKeywords = extractKeywords(input.mustHaveRequirements);
  const niceToHaveKeywords = extractKeywords(input.niceToHaveRequirements);
  const customKeywords = input.customRequirements ? extractKeywords(input.customRequirements) : [];
  
  const gaps: string[] = [];
  const missingMustHave = mustHaveKeywords.filter(k => !mustHaveResult.matchedKeywords.includes(k));
  const missingNiceToHave = niceToHaveKeywords.filter(k => !niceToHaveResult.matchedKeywords.includes(k));
  
  gaps.push(...missingMustHave.slice(0, 5));
  if (gaps.length < 5) {
    gaps.push(...missingNiceToHave.slice(0, 5 - gaps.length));
  }
  
  const summary = generateSummary(
    mustHaveResult.matchedKeywords,
    niceToHaveResult.matchedKeywords,
    customResult.matchedKeywords,
    mustHaveKeywords,
    niceToHaveKeywords,
    customKeywords,
    recommendation
  );
  
  return {
    score: finalScore,
    recommendation,
    summary,
    strengths: strengths.join(', '),
    gaps: gaps.join(', '),
    mustHaveMatches: mustHaveResult.matchedKeywords,
    niceToHaveMatches: niceToHaveResult.matchedKeywords,
    customMatches: customResult.matchedKeywords,
  };
}

/**
 * Extract candidate name from resume text
 * Looks for name in the first few lines of the resume
 */
export function extractCandidateName(resumeText: string, fallbackFileName: string): string {
  if (!resumeText || !resumeText.trim()) {
    // Use filename as fallback
    return fallbackFileName.replace(/\.(pdf|docx)$/i, '').replace(/[-_]/g, ' ');
  }
  
  // Get first 5 lines
  const lines = resumeText.split('\n').map(l => l.trim()).filter(l => l.length > 0).slice(0, 5);
  
  // Look for a line that looks like a name (2-4 words, mostly capital letters, no special chars)
  for (const line of lines) {
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 4) {
      // Check if it looks like a name (starts with capitals, no numbers or special chars except spaces)
      if (/^[A-Z][a-zA-Z\s]+$/.test(line) && line.length < 50) {
        return line;
      }
    }
  }
  
  // If no name found, use filename
  return fallbackFileName.replace(/\.(pdf|docx)$/i, '').replace(/[-_]/g, ' ');
}
