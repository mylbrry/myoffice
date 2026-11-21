# v0.8 release verification — 22 November 2026

## Automated checks

All five Node suites pass: drive.test.cjs, research.test.cjs, upload.test.cjs, writing-cloud.test.cjs, library-complete.test.cjs. All first-party JavaScript passes node --check.

Coverage includes source normalization, pagination/deduplication, permission guards, memory-only tokens, interrupted upload resumption with fixed IDs, immutable research revisions, stale/concurrent conflicts, catalogue/bookmark bounds, Arabic text and UTF-16 formatting ranges, reversible archive/restore, and writer scratchpad/pin revision chains.

## Local browser verification

Synthetic OAuth/Drive transport is confined to unpublished fixtures. Checked PDF canvas/text and bookmark controls; EPUB display, collecting research and immediate exit; linked project idea tabs; collections; favorite/catalogue edits; idea archive/restore; research stages; selected-document handoff; DOCX text import with Arabic/English; Markdown download. Rapid EPUB exit exposed lifecycle errors; the reader now retains its actual container reference and finishes pending display work before disposing the book. Navigation is not blocked by detached-frame cleanup.

## Live Google account verification

Performed on disposable QA objects, preserving original books and Library_Metadata.json:

- Loaded the existing catalogue and reauthorized with the already configured Drive scopes.
- Opened uploaded QA PDF and EPUB using the bundled readers; extracted PDF text; saved a bookmark and reading activity.
- Saved a collected EPUB source, changed its tray stage, created a source-linked idea and a project linking the source/idea.
- Created a collection with the two QA books; edited QA catalogue tags and favorite.
- Archived/restored the new QA idea. Reloaded the site and reconnected: idea, collection members, tags, favorite, bookmark and tray stage remained.
- Created/saved a QA native Google document containing English/Arabic. Saved scratchpad and pin; reloaded/reconnected/reopened: both text and auxiliary data remained.
- Downloaded PDF and DOCX exports. Imported a DOCX and downloaded Markdown in the local browser check.
- Sent the saved tray material into the selected QA cloud document; the draft contains its source/page citation and was saved to Drive.

## Limits and acceptance

These are internal checks in the available Chrome session, not a claim of exhaustive cross-browser or accessibility certification. Owner manual acceptance in preferred browsers remains a separate next step. OCR, full-library content indexing, parallel reading and speech are outside this release. DOCX import is text only. Advanced native document structures are opened in Google Docs rather than edited here. Save is manual for writing and scratchpad; reader positions save when Library saving is enabled. QA records remain identifiable and can be archived; no original data was deleted.
