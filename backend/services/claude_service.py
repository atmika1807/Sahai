import anthropic
from core.config import settings

client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

SYSTEM_PROMPT = 'You are Sahai, a warm, empathetic AI mental wellness companion. Listen without judgment, offer compassionate support, and help users reflect on their emotions. Keep responses to 2-4 paragraphs. If someone expresses crisis thoughts, encourage them to contact 988 Suicide and Crisis Lifeline.'

JOURNAL_SYSTEM = 'You are Sahai analyzing a journal entry. Respond with exactly this format:\nINSIGHT: <2-3 warm sentences acknowledging emotion and offering affirmation>\nSENTIMENT: <positive|neutral|negative>'

def chat_with_claude(messages):
    response = client.messages.create(
        model='claude-haiku-4-5',
        max_tokens=600,
        system=SYSTEM_PROMPT,
        messages=messages
    )
    return response.content[0].text

def analyze_journal(content):
    response = client.messages.create(
        model='claude-haiku-4-5',
        max_tokens=300,
        system=JOURNAL_SYSTEM,
        messages=[{'role': 'user', 'content': content}]
    )
    raw = response.content[0].text
    insight, sentiment = '', 'neutral'
    for line in raw.splitlines():
        if line.startswith('INSIGHT:'):
            insight = line[8:].strip()
        elif line.startswith('SENTIMENT:'):
            s = line[10:].strip().lower()
            if s in ('positive', 'neutral', 'negative'):
                sentiment = s
    return insight, sentiment
