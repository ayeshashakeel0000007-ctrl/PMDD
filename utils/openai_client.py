import os
from openai import AsyncOpenAI
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def get_structured_completion(prompt: str, system_prompt: str, response_model: BaseModel, model: str = "gpt-4o-mini"):
    """
    Calls OpenAI API asynchronously with strict structured output enforcement via Pydantic schema.
    """
    response = await client.beta.chat.completions.parse(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        response_format=response_model,
        temperature=0.1
    )
    return response.choices[0].message.parsed
