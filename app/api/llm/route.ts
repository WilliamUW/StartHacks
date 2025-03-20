import { NextResponse } from 'next/server';

const baseURL = "https://idchat-api-containerapp01-dev.orangepebble-16234c4b.switzerlandnorth.azurecontainerapps.io";
const llmFunctionDefinition = `
    {
        "name": "determine_function",
        "description": "Given a natural language input, you will do 2 things. 1) If the natural langugage input can be classified into a request for a function call. If the interaction can be seen as a request to pull up a client's information or to return information about a stock then you wil set the function to /client or /stock accordingly. If the input can be classified as a request to do a banking transaction of some sort (think moving money around) then you will set the function to /transaction. 2) You will then return the args that each function will take. So for client -  the arg would be their name. For stock the ticker would be returned. For transaction, a string confirming that the transaction has been scheduled would be saved as the arg. The output would be returned in a formatted JSON: {'endpoint': *selected endpoint*, 'args': *argument like name or ticker or sale*}. If natural language cannot be sorted return {'endpoint': null, 'args': null}",
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
        }
    }`;

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