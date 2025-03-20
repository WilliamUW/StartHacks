import { NextResponse } from 'next/server';

const baseURL = "https://idchat-api-containerapp01-dev.orangepebble-16234c4b.switzerlandnorth.azurecontainerapps.io";

async function fetchCompanyData(companyName: string, first: string, last: string) {
    try {
        const response = await fetch(`${baseURL}/ohlcv?query=${companyName}&first=${first}&last=${last}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: ''
        });

        const object = await response.json();
        const data = JSON.parse(object['object']);
        const company = JSON.parse(data['data']);

        const officialCompanyName = Object.keys(company)[0];
        const companyData = JSON.parse(company[officialCompanyName]);

        return {
            name: officialCompanyName,
            data: companyData
        };
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function POST(request: Request) {
    try {
        const { companyName, timeframe = '1M' } = await request.json();

        if (!companyName) {
            return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
        }

        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        // Calculate first date based on timeframe
        let firstDate = new Date();
        switch (timeframe) {
            case '1D':
                firstDate.setDate(date.getDate() - 1);
                break;
            case '1W':
                firstDate.setDate(date.getDate() - 7);
                break;
            case '1M':
                firstDate.setMonth(date.getMonth() - 1);
                break;
            case '3M':
                firstDate.setMonth(date.getMonth() - 3);
                break;
            case '1Y':
                firstDate.setFullYear(date.getFullYear() - 1);
                break;
            case '5Y':
                firstDate.setFullYear(date.getFullYear() - 5);
                break;
            default:
                firstDate.setMonth(date.getMonth() - 1); // Default to 1M
        }

        const formattedCompanyName = companyName.replace(' ', '%20');
        const first = `${String(firstDate.getDate()).padStart(2, '0')}.${String(firstDate.getMonth() + 1).padStart(2, '0')}.${firstDate.getFullYear()}`;
        const last = `${day}.${month}.${year}`;

        const result = await fetchCompanyData(formattedCompanyName, first, last);

        if (!result) {
            return NextResponse.json({ error: 'Failed to fetch company data' }, { status: 500 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 