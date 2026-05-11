# Multimodal Integration Atlas

Curated atlas of multimodal data integration methods for biology. The atlas lets researchers filter methods by the review axes: correspondence, missingness, granularity, prior knowledge, latent design, architecture, application level, supervision, and application type. Method cards also expose DOI/publication links, curated online resources, mechanism summaries, and a publication timeline when month-level metadata is available.

The project is designed as a companion resource for a review article. The manuscript is not included in this repository at this stage.

## Website

The app is a static GitHub Pages site. It reads the method library from:

```text
data/integration_methods_library.csv
```

No build step is required.

## Repository Structure

```text
.
├── index.html
├── styles.css
├── app.js
├── assets/
│   ├── multimodal-axes.png
│   └── method-families.png
├── data/
│   └── integration_methods_library.csv
├── docs/
│   └── schema.md
└── .github/
    ├── ISSUE_TEMPLATE/
    │   └── method_suggestion.yml
    └── workflows/
        └── pages.yml
```

## Contributing Method Entries

Researchers can suggest a new method or a correction from the site using the
guided `Suggest method` form. The form creates a prefilled GitHub issue and a
candidate CSV row for curator review. Curators can then update
`data/integration_methods_library.csv` through a pull request.

Rows marked `needs_curation=yes` are known incomplete entries and should be reviewed before downstream use.

## Local Preview

Because the app uses `fetch()` to load CSV data, preview it through a local server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Data License

The method classifications are curated for research use. Please cite the associated review article once available.
