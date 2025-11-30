import { NextRequest, NextResponse } from "next/server";
import faqs from "@/data/faqs.json";

type FaqItem = {
  id: string;
  title: string;
  body: string;
};

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const query = body?.query as string | undefined;
  if (!query || query.trim() === "") {
    
    return NextResponse.json(
      { error: "Query cannot be empty." },
      { status: 400 }
    );
  }

  const q = query.toLowerCase();

  const scored = (faqs as FaqItem[])
    .map((item) => {
      const titleText = item.title.toLowerCase();
      const bodyText = item.body.toLowerCase();

      let score = 0;

      // Simple scoring:
      // - Title match is more important (weight 2)
      // - Body match is less important (weight 1)
      const titleCount = titleText.split(q).length - 1;
      const bodyCount = bodyText.split(q).length - 1;

      score = titleCount * 2 + bodyCount * 1;

      return { ...item, score };
    })
    // Filter out items that have no match at all
    .filter((item) => item.score > 0)
    // Sort by score descending
    .sort((a, b) => b.score - a.score)
    // Only top 3 results
    .slice(0, 3);

  // If no matches, return empty array
  if (scored.length === 0) {
    return NextResponse.json({
      results: [],
      message: "No matching FAQs found for your query.",
      summary: "",
      sources: []
    });
  }

  const summary = scored
    .map((item) => item.body)
    .join(" ")
    .slice(0, 300);

  const sources = scored.map((item) => item.id);

  return NextResponse.json({
    results: scored.map(({ score, ...rest }) => rest), 
    summary,
    sources
  });
}
