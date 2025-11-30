import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  //URL validation
  if (!url) {
    return NextResponse.json(
      { error: "Invalid URL" },
      { status: 400 }
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json(
      { error: "Invalid URL" },
      { status: 400 }
    );
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return NextResponse.json(
      { error: "Invalid URL" },
      { status: 400 }
    );
  }

  //20-second timeout
  const TIMEOUT_MS = 20000;

  const timeoutPromise = new Promise<NextResponse>((resolve) => {
    setTimeout(() => {
      resolve(
        NextResponse.json(
          { error: "Timeout" },
          { status: 504 }
        )
      );
    }, TIMEOUT_MS);
  });

  const scrapePromise = (async () => {
    let browser;
    try {
      
      browser = await chromium.launch({ headless: true });

      const context = await browser.newContext({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      });

      const page = await context.newPage();

      await page.goto(url, {
        waitUntil: "networkidle",
      });

      //Extract title
      const title = await page.title();

      //Extract meta description
      const metaDescription =
        (await page
          .locator('meta[name="description"]')
          .getAttribute("content")) || "";

      //Extract first h1
      const h1 =
        (await page.locator("h1").first().textContent())?.trim() || "";

      await browser.close();

      return NextResponse.json({
        title,
        metaDescription,
        h1,
        status: 200,
      });
    } catch (err) {
      if (browser) await browser.close();
      return NextResponse.json(
        { error: "Timeout" },
        { status: 504 }
      );
    }
  })();

  return Promise.race([timeoutPromise, scrapePromise]);
}
