import { NextResponse } from 'next/server';

const baseURL = "https://idchat-api-containerapp01-dev.orangepebble-16234c4b.switzerlandnorth.azurecontainerapps.io";
const llmFunctionDefinition = `
        {
        "name": "determine_function",
        "description": "Given a natural language input, determine which of the two functions should be called: /client or /stock. Output should be formatted in JSON: {'endpoint': *selected endpoint*, 'args': *argument like name or ticker*}. If asked 'analyze APPLE' you'd give {'endpoint': '/stock', 'args': 'APPLE'}",
        "strict": true,
        "parameters": {
            "type": "object",
            "required": [
            "input"
            ],
            "properties": {
            "input": {
                "type": "string",
                "description": "Natural language input that will help determine which function to call."
            }
            },
            "additionalProperties": false
        }}`;

async function getFunctionFromNL(nlInput : string) {
    try {
        const response = await fetch(`${baseURL}/llm?query=${llmFunctionDefinition}%20${nlInput}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: ''
        });

        const object = await response.json();
        const content = object['content']
                        .replace('json', '')
                        .replaceAll('```', '');
        const data = JSON.parse(content);

        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function POST(request: Request) {
    try {
        const { naturalLanguage } = await request.json();

        if (!naturalLanguage) {
            return NextResponse.json({ error: 'Natural language is required' }, { status: 400 });
        }

        const result = await getFunctionFromNL(naturalLanguage);

        if (!result) {
            return NextResponse.json({ error: 'Failed to fetch LLM data' }, { status: 500 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 