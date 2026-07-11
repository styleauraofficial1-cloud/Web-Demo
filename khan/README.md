# Khan Production Monorepo

This repository begins the real implementation of the complete Khan specified in `vault/`.

It is not a chatbot MVP and not a separate Khan version. Construction follows dependencies while
all organs remain part of one continuous Khan.

## Runnable now

`services/reference-runtime` implements a connected reliability spine:

- persistent Khan identity
- authenticated owner principal
- scoped Khan Mode authority and bounded Beast Warrants
- signed hash-chained causal events
- durable missions
- provenance-aware memory quarantine
- content-addressed evidence
- transactional sandboxed file actions
- independent verification
- model routing boundary
- live brain JSON and Obsidian Canvas
- local API and futuristic GUI

Run:

```bash
python scripts/khan.py init
python scripts/khan.py demo
python scripts/khan.py serve
```

Then open `http://127.0.0.1:8765`.

The production Rust and C# foundations are included but must be compiled on a Windows development machine.
