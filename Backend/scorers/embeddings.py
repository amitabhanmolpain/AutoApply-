from __future__ import annotations
import numpy as np
from typing import Union

# Lazy import — only loads the model when first used
_model = None
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
# Lightweight 80MB model — fast on CPU, good semantic similarity


def _get_model():
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer(MODEL_NAME)
        except ImportError:
            raise ImportError(
                "sentence-transformers not installed.\n"
                "Run: pip install sentence-transformers"
            )
    return _model


def encode(texts: Union[str, list[str]]) -> np.ndarray:
    """
    Encode one or more strings into embedding vectors.
    Returns shape (n, 384) for all-MiniLM-L6-v2.
    Single string → still returns 2D array (1, 384).
    """
    if isinstance(texts, str):
        texts = [texts]
    model = _get_model()
    return model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """
    Cosine similarity between two 1D vectors.
    Both must already be L2-normalized (encode() does this).
    Returns float in range [-1, 1] — for text, typically [0, 1].
    """
    return float(np.dot(a.flatten(), b.flatten()))


def batch_similarity(query: np.ndarray, corpus: np.ndarray) -> np.ndarray:
    """
    Similarity of one query vector against a batch of corpus vectors.
    query  : shape (384,) or (1, 384)
    corpus : shape (N, 384)
    Returns: shape (N,) — one score per corpus entry
    """
    q = query.flatten()
    return corpus @ q