# Contributing

Contributions are welcome when they improve the scientific accuracy, coverage, or usability of the method atlas.

## Suggesting a Method

Use the `Suggest method` form on the website or the GitHub issue template named
`Method suggestion`. The website form produces a candidate CSV row so curators
can review and copy classifications more easily.

Please include:

- method name
- citation or DOI
- method family
- correspondence
- missingness
- granularity
- prior knowledge category
- latent design
- architecture
- application level
- supervision
- primary application task
- short rationale for the classification

## Updating the Library

Curated method entries live in:

```text
data/integration_methods_library.csv
```

For pull requests:

1. Keep one method per row.
2. Prefer existing controlled values from `docs/schema.md`.
3. Set `needs_curation=yes` if a classification is uncertain.
4. Add a short note in `curation_notes` when judgement calls are involved.
5. Keep manuscript drafts, private notes, and extractor scripts out of this repository.

## Review Criteria

Changes should be evidence-backed, consistent with the schema, and useful for researchers selecting multimodal integration methods.
