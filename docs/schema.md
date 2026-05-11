# Method Library Schema

The app reads `data/integration_methods_library.csv`. Each row describes one integration method and exposes the review axes used in the manuscript section on current methods and their mathematical foundations.

## Core Columns

| Column | Meaning |
| --- | --- |
| `method_id` | Stable lowercase identifier for the method. |
| `method` | Display name. |
| `method_family` | Curated family, such as `Deterministic`, `Probabilistic`, `VAE / Representation learning`, `Foundation models`, `MIL`, or `Contrastive learning`. |
| `method_scope` | Broad source group: `analytical` or `deep_learning`. |
| `method_doi` | DOI for the primary method publication, or `to_be_curated`. |
| `publication_url` | DOI resolver or publication URL for the primary method paper, or `to_be_curated`. |
| `publication_date` | Month-level publication date in `YYYY-MM` format when DOI metadata supports it. |
| `publisher` | Publisher or proceedings source returned by DOI metadata, or manually curated for non-DOI publications. |
| `resource_url` | Public software, package, web service, or documentation URL, or `to_be_curated`. |
| `resource_type` | Resource category, such as `software`, `package`, `web service`, `documentation`, or `to_be_curated`. |
| `axis_correspondence` | Data correspondence axis: `paired`, `partial`, `unpaired`, or `to_be_curated`. |
| `axis_missingness` | Missingness axis: `none`, `partial`, `modality`, `generative`, or `to_be_curated`. |
| `axis_granularity` | Granularity axis: `single-level`, `multi-level`, or `to_be_curated`. |
| `axis_prior_knowledge` | Prior knowledge axis: `none`, `structure`, `supervision`, `soft`, or `to_be_curated`. |
| `axis_latent_design` | Latent design axis: `structured`, `unstructured`, or `to_be_curated`. |
| `axis_architecture` | Architecture axis: `white-box`, `black-box`, or `to_be_curated`. |
| `axis_application_level` | Application level axis: `general-purpose`, `application-driven`, or `to_be_curated`. |
| `axis_supervision` | Supervision axis used by the method entry. |
| `application_primary_task` | Main task label from the manuscript table. |
| `application_tasks` | Semicolon-delimited task list derived from `application_primary_task`. |
| `needs_curation` | `yes` for rows with incomplete axis values. |
| `curation_notes` | Free-text curator note. |

## Provenance Columns

| Column | Meaning |
| --- | --- |
| `source_table` | Manuscript supplementary table provenance. |
| `source_docx_table_index` | Original DOCX table index used during extraction. |
| `source_docx_row_index` | Original DOCX row index used during extraction. |
| `data_pairedness` | Legacy extracted value retained for audit. |
| `data_missingness` | Legacy extracted value retained for audit. |
| `method_integration_level` | Legacy extracted value retained for audit. |
| `method_uncertainty` | Legacy extracted value retained for audit, not a central review-axis filter. |
| `method_prior_knowledge` | Legacy extracted value retained for audit. |
| `supervision` | Legacy extracted supervision value retained for audit. |

## Curation Standard

Each new method should include the six central axes, application level, supervision, a primary DOI/publication link, an online resource link when available, a clear method family, and at least one application type. If evidence is ambiguous, keep `needs_curation=yes` and explain the judgement call in `curation_notes`.
