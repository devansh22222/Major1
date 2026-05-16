"""
rag.py
------
Core Retrieval-Augmented Generation (RAG) pipeline for the
National Formulary of India (NFI) 2011.

The module exposes a single public function ``answer(question)`` that:
  1. Retrieves the top-k most relevant chunks from the ChromaDB vector store.
  2. Builds a prompt with those chunks as context.
  3. Calls the configured LLM to produce a grounded answer.

Environment variables
---------------------
OPENAI_API_KEY   – Required for the default OpenAI backend.
OPENAI_MODEL     – Model name (default: gpt-4o-mini).
CHROMA_DIR       – Path to the ChromaDB store (default: chroma_db).
COLLECTION_NAME  – Collection name (default: nfi_2011).
EMBEDDING_MODEL  – HuggingFace model for query embedding
                   (default: sentence-transformers/all-mpnet-base-v2).
TOP_K            – Number of chunks to retrieve (default: 5).
"""

import os
from functools import lru_cache

from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

CHROMA_DIR = os.getenv("CHROMA_DIR", "chroma_db")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "nfi_2011")
EMBEDDING_MODEL = os.getenv(
    "EMBEDDING_MODEL", "sentence-transformers/all-mpnet-base-v2"
)
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
TOP_K = int(os.getenv("TOP_K", "5"))
FETCH_K = max(TOP_K * 5, 30)
NEIGHBOR_WINDOW = 1

# ---------------------------------------------------------------------------
# Prompt template
# ---------------------------------------------------------------------------

_SYSTEM_PROMPT = """You are a helpful medical information assistant specialised in \
the National Formulary of India (NFI) 2011. Prefer the context passages provided \
below when they contain relevant information. If the context does not contain the \
answer, use your own general medical knowledge to provide the best helpful answer \
you can, and clearly say that the answer is based on general knowledge rather than \
the NFI 2011. Do not refuse just because the context is incomplete. If the context \
is partially relevant, combine it with general knowledge and briefly note any \
missing details.

Context:
{context}"""

_PROMPT = ChatPromptTemplate.from_messages(
    [
        ("system", _SYSTEM_PROMPT),
        ("human", "{question}"),
    ]
)

# ---------------------------------------------------------------------------
# Cached components (initialised once per process)
# ---------------------------------------------------------------------------


@lru_cache(maxsize=1)
def _get_vectorstore():
    """Load the ChromaDB vector store (cached after first call)."""
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        encode_kwargs={"normalize_embeddings": True},
    )
    return Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=embeddings,
        persist_directory=CHROMA_DIR,
    )


def _doc_position(doc):
    """Return the (page, chunk) position for a retrieved document if available."""
    try:
        page = int(doc.metadata.get("page"))
        chunk = int(doc.metadata.get("chunk"))
    except (TypeError, ValueError):
        return None
    return page, chunk


def _expand_with_neighbors(candidate_docs, neighbor_window: int = NEIGHBOR_WINDOW):
    """Keep primary hits and adjacent chunks from the same page."""
    if not candidate_docs:
        return []

    lookup = {}
    for doc in candidate_docs:
        position = _doc_position(doc)
        if position is not None:
            lookup[position] = doc

    selected = {}
    for doc in candidate_docs[:TOP_K]:
        position = _doc_position(doc)
        if position is None:
            selected[id(doc)] = doc
            continue

        page, chunk = position
        for offset in range(-neighbor_window, neighbor_window + 1):
            neighbor = lookup.get((page, chunk + offset))
            if neighbor is not None:
                selected[(page, chunk + offset)] = neighbor

    if not selected:
        return candidate_docs[:TOP_K]

    ordered_docs = []
    for key in sorted(selected, key=lambda item: item if isinstance(item, tuple) else (10**9, 10**9)):
        ordered_docs.append(selected[key])
    return ordered_docs


@lru_cache(maxsize=1)
def _get_llm():
    """Instantiate the LLM (cached after first call)."""
    return ChatOpenAI(model=OPENAI_MODEL, temperature=0)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def _format_docs(docs) -> str:
    """Concatenate retrieved document chunks into a single context string."""
    parts = []
    for i, doc in enumerate(docs, start=1):
        page = doc.metadata.get("page", "?")
        parts.append(f"[Chunk {i} | NFI p.{page}]\n{doc.page_content}")
    return "\n\n".join(parts)


def answer(question: str) -> dict:
    """
    Run the RAG pipeline for *question* and return a dict with keys:

    - ``answer``  : the LLM-generated answer string
    - ``sources`` : list of ``{page, chunk, text}`` dicts for each retrieved chunk
    """
    vectorstore = _get_vectorstore()
    llm = _get_llm()

    # Retrieve a larger candidate pool, then keep strong hits plus neighbors.
    candidate_docs = vectorstore.similarity_search(question, k=FETCH_K)
    docs = _expand_with_neighbors(candidate_docs)

    # Build context string
    context = _format_docs(docs)

    # Call the LLM
    chain = (
        {"context": RunnablePassthrough(), "question": RunnablePassthrough()}
        | _PROMPT
        | llm
        | StrOutputParser()
    )
    response = chain.invoke({"context": context, "question": question})

    sources = [
        {
            "page": doc.metadata.get("page", "?"),
            "chunk": doc.metadata.get("chunk", "?"),
            "text": doc.page_content,
        }
        for doc in docs
    ]

    return {"answer": response, "sources": sources}


# ---------------------------------------------------------------------------
# CLI convenience
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python rag.py \"<your question>\"")
        sys.exit(1)

    question = " ".join(sys.argv[1:])
    result = answer(question)
    print("\n=== Answer ===")
    print(result["answer"])
    print("\n=== Sources ===")
    for src in result["sources"]:
        clean_text = src["text"][:120].replace("\n", " ")

        print(
            f"  • NFI page {src['page']} (chunk {src['chunk']}): "
            f"{clean_text} …"
        )
