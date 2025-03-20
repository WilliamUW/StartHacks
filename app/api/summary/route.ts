import { NextRequest, NextResponse } from 'next/server';

interface StockSummary {
  [key: string]: {
    'Valor number': string;
    'Ticker symbol': string;
    'ISIN': string;
    'Instrument type': string;
    'Outstanding Securities': string;
    'Name': string;
    'open': string;
    'close': number;
    'high': string;
    'low': string;
    'vol': string;
  }
}

export async function POST(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('query');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Mock data for demonstration - replace with actual API call
    const summaryData: StockSummary = {
      [query]: {
        'Valor number': '908440',
        'Ticker symbol': query,
        'ISIN': 'US0378331005',
        'Instrument type': '1 - "Share, unit, particip. cert. in companies..."',
        'Outstanding Securities': '15022073000',
        'Name': 'Apple Rg',
        'open': '214.13',
        'close': 215.24,
        'high': '218.76',
        'low': '213.75',
        'vol': '46418'
      }
    };

    const response = {
      message: Object.entries(summaryData[query])
        .map(([key, value]) => `${key.padEnd(65)} ${value}`)
        .join('\n'),
      object: JSON.stringify({
        tool: 'Summary',
        data: [JSON.stringify(summaryData)]
      })
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in summary endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 