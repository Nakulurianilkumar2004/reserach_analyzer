from google import genai

# Gemini API Key
GEMINI_API_KEY = ""

# Create client
client = genai.Client(api_key=GEMINI_API_KEY)


def ask_gemini(question, context=None):

    if context:
        prompt = f"""
        Use the following research context to answer the question.

        Context:
        {context}

        Question:
        {question}
        """
    else:
        prompt = question

    try:
        response = client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=prompt
        )

        return response.text

    except Exception as e:
        return f"Gemini API Error: {str(e)}"