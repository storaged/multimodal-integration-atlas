# Method Library Schema

The app reads `data/integration_methods_library.csv`. Each row describes one integration method.

## Columns

| Column | Meaning |
| --- | --- |
| `method_id` | Stable lowercase identifier for the method. |
| `method` | Display name. |
| `method_family` | Curated family, such as `Deterministic`, `Probabilistic`, `VAE / Representation learning`, `Foundation models`, `MIL`, or `Contrastive learning`. |
| `method_scope` | Broad source group: `analytical` or `deep_learning`. |
| `source_table` | Manuscript supplementary table provenance. |
| `source_docx_table_index` | Original DOCX table index used during extraction. |
| `source_docx_row_index` | Original DOCX row index used during extraction. |
| `data_pairedness` | Pairing assumption: `paired`, `partial`, or `unpaired`. |
| `data_missingness` | Missingness setting: `none`, `partial`, `modality`, or `generative`. |
| `method_integration_level` | Integration level: `single` or `multi`. |
| `method_uncertainty` | Whether uncertainty is modelled explicitly: `yes` or `no`. |
| `method_prior_knowledge` | Prior knowledge type: `none`, `structure`, `supervision`, or `soft`. |
| `application_primary_task` | Main task label from the manuscript table. |
| `supervision` | Derived supervision class used by the UI. |
| `application_tasks` | Semicolon-delimited task list derived from `application_primary_task`. |
| `needs_curation` | `yes` for rows with incomplete axis values. |
| `curation_notes` | Free-text curator note. |

## Controlled Values

The current app assumes controlled values for filterable axes. If a new value is needed, add it consistently across rows and update this document.

Recommended values:

- `data_pairedness`: `paired`, `partial`, `unpaired`
- `data_missingness`: `none`, `partial`, `modality`, `generative`
- `method_integration_level`: `single`, `multi`
- `method_uncertainty`: `yes`, `no`
- `method_prior_knowledge`: `none`, `structure`, `supervision`, `soft`
- `method_scope`: `analytical`, `deep_learning`

## Curation Standard

Each new method should include all filterable axis values, a clear method family, and at least one application task. If evidence is ambiguous, keep `needs_curation=yes` and explain the uncertainty in `curation_notes`.
