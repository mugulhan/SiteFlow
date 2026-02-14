function sanitizeSlug(slug) {
  if (typeof slug !== "string") {
    return "";
  }
  let value = slug.toLowerCase().trim();
  value = value.replace(/\.(html?|php|aspx?)$/, "");
  value = value.replace(/_/g, "-");
  value = value.replace(/[^a-z0-9-]/g, "-");
  value = value.replace(/-+/g, "-").replace(/^-+|-+$/g, "");

  while (/-((v\d+)|(final|draft|copy|test|beta|rev\d+))$/.test(value)) {
    value = value.replace(/-((v\d+)|(final|draft|copy|test|beta|rev\d+))$/, "");
  }

  const parts = value
    .split("-")
    .map((part) => part.trim())
    .filter((part) => {
      if (!part) {
        return false;
      }
      if (/^\d{2,}$/.test(part)) {
        return false;
      }
      if (/^\d{4}$/.test(part)) {
        return false;
      }
      return true;
    });

  return parts.join("-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}

function extractSlug(url) {
  if (typeof url !== "string") {
    return "";
  }
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    const raw = segments.length ? segments[segments.length - 1] : "";
    let decoded = raw;
    try {
      decoded = decodeURIComponent(raw);
    } catch (_error) {
      decoded = raw;
    }
    return sanitizeSlug(decoded);
  } catch (_error) {
    return "";
  }
}

function extractGroupKey(url) {
  if (typeof url !== "string") {
    return "/";
  }
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length <= 1) {
      return "/";
    }
    return `/${segments.slice(0, -1).join("/")}`;
  } catch (_error) {
    return "/";
  }
}

function levenshtein(a, b) {
  if (a === b) {
    return 0;
  }
  if (!a) {
    return b.length;
  }
  if (!b) {
    return a.length;
  }
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = new Array(rows);
  for (let i = 0; i < rows; i += 1) {
    matrix[i] = new Array(cols);
    matrix[i][0] = i;
  }
  for (let j = 0; j < cols; j += 1) {
    matrix[0][j] = j;
  }
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[rows - 1][cols - 1];
}

function slugSimilarity(a, b) {
  if (!a && !b) {
    return 1;
  }
  if (!a || !b) {
    return 0;
  }
  const distance = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) {
    return 1;
  }
  return 1 - distance / maxLen;
}

function analyzeUrlSimilarities(urls, options = {}) {
  const threshold =
    typeof options.threshold === "number" && Number.isFinite(options.threshold)
      ? Math.min(Math.max(options.threshold, 0), 1)
      : 0.8;
  const maxGroupSize =
    typeof options.maxGroupSize === "number" && Number.isFinite(options.maxGroupSize)
      ? Math.max(2, Math.floor(options.maxGroupSize))
      : 200;
  const minClusterSize =
    typeof options.minClusterSize === "number" && Number.isFinite(options.minClusterSize)
      ? Math.max(2, Math.floor(options.minClusterSize))
      : 2;
  const maxPairsPerGroup =
    typeof options.maxPairsPerGroup === "number" && Number.isFinite(options.maxPairsPerGroup)
      ? Math.max(5, Math.floor(options.maxPairsPerGroup))
      : 20;

  const entries = [];
  let skippedUrls = 0;
  (Array.isArray(urls) ? urls : []).forEach((url) => {
    const slug = extractSlug(url);
    if (!slug) {
      skippedUrls += 1;
      return;
    }
    entries.push({
      url,
      slug,
      groupKey: extractGroupKey(url),
    });
  });

  const grouped = new Map();
  entries.forEach((entry) => {
    const list = grouped.get(entry.groupKey) || [];
    list.push(entry);
    grouped.set(entry.groupKey, list);
  });

  const groups = [];
  grouped.forEach((groupEntries, groupKey) => {
    if (groupEntries.length < 2) {
      return;
    }
    const totalInGroup = groupEntries.length;
    const trimmed = totalInGroup > maxGroupSize;
    const items = trimmed ? groupEntries.slice(0, maxGroupSize) : groupEntries;
    const size = items.length;
    const matrix = new Array(size * size).fill(0);
    const parent = new Array(size);
    for (let i = 0; i < size; i += 1) {
      parent[i] = i;
    }
    const find = (idx) => {
      let current = idx;
      while (parent[current] !== current) {
        parent[current] = parent[parent[current]];
        current = parent[current];
      }
      return current;
    };
    const union = (a, b) => {
      const rootA = find(a);
      const rootB = find(b);
      if (rootA !== rootB) {
        parent[rootB] = rootA;
      }
    };

    for (let i = 0; i < size; i += 1) {
      for (let j = i + 1; j < size; j += 1) {
        const score = slugSimilarity(items[i].slug, items[j].slug);
        matrix[i * size + j] = score;
        matrix[j * size + i] = score;
        if (score >= threshold) {
          union(i, j);
        }
      }
    }

    const clustersMap = new Map();
    for (let i = 0; i < size; i += 1) {
      const root = find(i);
      const list = clustersMap.get(root) || [];
      list.push(i);
      clustersMap.set(root, list);
    }

    const clusters = [];
    let clusterIndex = 0;
    clustersMap.forEach((indices) => {
      if (indices.length < minClusterSize) {
        return;
      }
      const indexSet = new Set(indices);
      let sumMax = -1;
      let pivotIndex = indices[0];
      let pairSum = 0;
      let pairCount = 0;
      let maxSimilarity = 0;
      const pairScores = [];

      for (let i = 0; i < indices.length; i += 1) {
        const a = indices[i];
        let similaritySum = 0;
        for (let j = 0; j < indices.length; j += 1) {
          if (a === indices[j]) {
            continue;
          }
          const score = matrix[a * size + indices[j]] || 0;
          similaritySum += score;
        }
        if (similaritySum > sumMax) {
          sumMax = similaritySum;
          pivotIndex = a;
        }
      }

      for (let i = 0; i < indices.length; i += 1) {
        for (let j = i + 1; j < indices.length; j += 1) {
          const score = matrix[indices[i] * size + indices[j]] || 0;
          pairSum += score;
          pairCount += 1;
          if (score > maxSimilarity) {
            maxSimilarity = score;
          }
          pairScores.push({
            a: items[indices[i]].url,
            b: items[indices[j]].url,
            score,
          });
        }
      }

      pairScores.sort((a, b) => b.score - a.score);
      const clusterPairs = pairScores.slice(0, maxPairsPerGroup);
      const avgSimilarity = pairCount ? pairSum / pairCount : 0;
      const pivot = items[pivotIndex];
      const risk =
        avgSimilarity >= 0.9 ? "high" : avgSimilarity >= 0.8 ? "medium" : "low";

      clusters.push({
        clusterId: `${groupKey || "root"}:${clusterIndex + 1}`,
        size: indices.length,
        groupKey,
        pivot: pivot
          ? {
              url: pivot.url,
              slug: pivot.slug,
            }
          : null,
        avgSimilarity,
        maxSimilarity,
        risk,
        items: indices.map((idx) => ({
          url: items[idx].url,
          slug: items[idx].slug,
          similarity: idx === pivotIndex ? 1 : matrix[pivotIndex * size + idx] || 0,
          isPivot: idx === pivotIndex,
        })),
        pairs: clusterPairs,
      });
      clusterIndex += 1;
    });

    if (clusters.length) {
      groups.push({
        groupKey,
        totalUrls: totalInGroup,
        analyzedUrls: size,
        trimmed,
        clusters,
      });
    }
  });

  return {
    totalUrls: Array.isArray(urls) ? urls.length : 0,
    analyzedUrls: entries.length,
    skippedUrls,
    threshold,
    groups,
  };
}

module.exports = {
  analyzeUrlSimilarities,
  extractSlug,
  sanitizeSlug,
  slugSimilarity,
};
