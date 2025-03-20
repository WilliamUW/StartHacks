import { NextRequest, NextResponse } from "next/server";

const COMPANY_DATA_API_URL = "https://idchat-api-containerapp01-dev.orangepebble-16234c4b.switzerlandnorth.azurecontainerapps.io/companydatasearch";

export async function POST(request: NextRequest) {
  try {
    // Get query parameter from the URL
    console.log("request", request);
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    // Make request to external API
    const response = await fetch(COMPANY_DATA_API_URL + "?query=" + encodeURIComponent(query), {
      method: "POST",
      headers: {
        "accept": "application/json",
      },
    });
    console.log("response", response);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Return the response
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in company data search:", error);
    return NextResponse.json(
      { error: "Failed to fetch company data" },
      { status: 500 }
    );
  }
} 