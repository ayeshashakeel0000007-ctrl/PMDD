import spacy
import re
from typing import List, Dict, Any

try:
    nlp = spacy.load('en_core_web_sm')
except OSError:
    import spacy.cli
    spacy.cli.download('en_core_web_sm')
    nlp = spacy.load('en_core_web_sm')

def process_corpus(text: str) -> Dict[str, Any]:
    """
    Cleans, tokenizes, and segments the raw corpus into sentences.
    Returns structured data for downstream agents.
    """
    # Clean text
    text = re.sub(r'\s+', ' ', text).strip()
    doc = nlp(text)
    
    segments = []
    for i, sent in enumerate(doc.sents):
        clean_sent = sent.text.strip()
        if not clean_sent:
            continue
            
        segments.append({
            'id': i,
            'text': clean_sent,
            'word_count': len([t for t in sent if not t.is_space and not t.is_punct]),
            'position': round(i / max(1, len(list(doc.sents))), 2)
        })
        
    return {
        'corpus_stats': {
            'total_sentences': len(segments),
            'total_words': sum(s['word_count'] for s in segments)
        },
        'segments': segments
    }
