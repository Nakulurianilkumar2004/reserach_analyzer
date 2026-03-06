import numpy as np


def cosine(a, b):

    a = np.array(a)
    b = np.array(b)

    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


def search_similar(question_embedding, embeddings):

    scores = []

    for item in embeddings:

        sim = cosine(question_embedding, item["embedding"])

        scores.append((sim, item["text"]))

    scores.sort(reverse=True)

    return [x[1] for x in scores[:3]]