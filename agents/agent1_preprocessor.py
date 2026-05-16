import re
from typing import Dict, Any
from core.nlp_engine import get_nlp

def get_doc(text):
    nlp = get_nlp()
    return nlp(text)

def process_corpus(text: str) -> Dict[str, Any]:
    """
    Cleans, tokenizes, and segments the raw corpus into sentences.
    Returns structured data for downstream agents.
    """
    nlp = get_nlp()
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
