# Ayman’s Library — My Office

Static GitHub Pages portal, Library and Writing Workspace. Durable user content stays in Google Drive. The public repository contains no private catalogue, account password, client secret or access token.

## Prepared v0.9 — Portal session

The Portal now has a password field. Enter performs the existing Google authorization when needed, reads the private password file from the selected My Library folder (or the explicitly configured file URL/ID), and opens a same-origin workspace frame. Library and Writer inherit the same page-memory authorization. No separate Connect Drive button is required in the normal entry flow. Direct workspace URLs return to the Portal.

Google authorization protects the Drive files. The password is an additional browser UI gate, **not server-side authentication equivalent to Apps Script**. A static GitHub Pages application cannot make a client-side comparison a server authorization boundary. Password text and tokens are never persisted, published or embedded in URLs. Missing/empty/ambiguous password files fail closed; there is no fallback password.

The parent Portal document stays loaded during workspace navigation. Returning to Portal preserves the current frame until a different workspace is selected or Lock is used. Reauthorization can resume the same writer draft. A full browser reload/new tab loses the in-memory token and requires Enter again. Google may display its own account/consent flow, especially on first use or expiry. Long-lived automatic refresh without user interaction requires a different backend authorization architecture.

Signed-out Library sample rendering is removed and starter writing sample documents are removed. The original catalogue and saved workspace documents are loaded from Drive after entry. Configuration stores only public client ID, folder ID and optional password-file ID. No existing Drive file, password or sharing is changed.

Status: local synthetic wrong/correct password, inherited Library/Writer connection, return/resume and Lock tests pass. The available Drive connector and original-account Drive UI did not locate a Password file; owner identification of the actual file is pending. Keep this change separate from production until the file is identified and live entry is verified.

## Release v0.8 — connected workspace

- **Books:** load existing library metadata and enabled additional folders; upload PDF/EPUB up to 200 MB into My Office Books. Edit title, author, category, tags and favorites through separate catalogue records.
- **Reader:** bundled PDF.js and EPUB.js provide PDF page navigation, zoom, contents, extracted page text, and EPUB section navigation. Save bookmarks, reading status and position, including EPUB CFI. Focus mode hides secondary UI. Scanned PDFs require an existing text layer for quotation extraction; OCR is not included.
- **Notes:** import existing notes read-only; create editable copies or new notes, associate source/page, tag, search, edit and archive/restore.
- **Projects:** link books, notes, ideas and tray items; browse Sources, Notes, Ideas and Writing tabs.
- **Research Tray:** collect a source or note, edit material, order it and move through To Read / Reading / Collected.
- **Ideas Board:** create and edit ideas, link ideas/notes/sources, drag positions and save them to Drive.
- **Collections / Tags:** create named collections, select books and browse categories or tag matches.
- **Reading / Insights:** display actual saved positions, bookmarks, collection counts and recorded reading days. Opening a book records activity when saving is enabled; this is not a duration tracker.
- **Writing:** explicit save/reopen of workspace-created native Google Docs; paragraphs, headings, bold/italic/underline, bullets and direction. Receive selected research as a new draft or insert into a chosen draft with a source reference in the text. TXT/Markdown/DOCX import creates a new draft; DOCX import is text only. Export current draft to TXT/Markdown; PDF/DOCX export uses the saved Google document. Pins and scratchpad have a separate explicit Save scratchpad action.
- **Layout:** shared System/Light/Dark appearance; glass or floating details panel, optional mouse-edge reveal and auto-hide; focus modes.

Signed-out Library screens and starter writing documents are labelled samples. Connect Google to access your own content. No universal full-library content index, OCR, text-to-speech, parallel reader, automatic cover lookup or desktop installation is included.

## Data and revision handling

Reading and catalogue settings, research, projects and collections append immutable event files compatible with `aymanResearchBridge=event-v1`. Existing source files and Library_Metadata.json are preserved. Source uploads use app-created files with their metadata in Drive descriptions. My Office Books is automatically included by this site; the older Apps Script library requires its own configuration to discover this folder.

Each research save checks current heads. Stale saves are rejected; concurrent versions remain in Drive. Review conflicts and choose a version to create a resolving revision. Archive is reversible and never deletes an original file. Writer documents use Google Docs required-revision guards; scratchpad/pin events are append-only and reject stale/conflicting revisions. Advanced Google document structures are rejected for editing here; use Google Docs to preserve tables, images, links, multiple tabs, suggestions, headers and footnotes.

Upload validation checks extension, header and size (not every EPUB component). Resumable uploads retain a preallocated ID and query status before resending remaining bytes. Page reload clears local resume state; inspect Drive before uploading again after an uncertain outcome. Do not automatically retry an uncertain create/save.

## Connection and privacy

See [DRIVE_SETUP.md](DRIVE_SETUP.md). Library reading requests `drive.readonly`; saving/uploading adds `drive.file`. Writer requests `drive.file`. No additional scope is needed for v0.8. Folder selection is an application filter, not a folder-scoped OAuth grant. Separate pages reconnect on demand.

Public OAuth client/folder settings and appearance/layout preferences are stored in localStorage. Access tokens, loaded books and drafts stay in page memory. A short pending research handoff uses same-origin sessionStorage until inserted. Durable data is in Drive. Unsaved drafts and scratchpad changes can be lost when leaving; save explicitly and wait for success. Disconnect/expiry clears the connected Library session; revoking the app grant is a separate Google Account operation. The site does not change file sharing.

## Validation

Run from the repository root:

```sh
node drive.test.cjs
node research.test.cjs
node upload.test.cjs
node writing-cloud.test.cjs
node library-complete.test.cjs
```

These cover normalization, pagination, deduplication, read-only rejection, memory-only tokens, late authorization, upload validation/resumption, Arabic/UTF-16 text, immutable revisions, stale/concurrent conflicts, project links, catalogue/bookmark bounds, archive/restore, and writer formatting/scratchpad/pin histories. Browser QA uses synthetic transport fixtures locally; fixtures are excluded from publication. A release QA record distinguishes local tests from live-account checks.

## Hosting and dependencies

Serve this repository root with GitHub Pages main/root. Portal: index.html; Library: library.html; writer: writing.html. No build or server is required. Library models adapt Drive data; drive.js handles API access, reader.js the reader, research-ui.js and library-complete.js the connected views, writing-cloud.js native Docs and writing-complete.js import/export and handoff.

Reader/import assets are pinned and served from the repository root: PDF.js 6.5.438, EPUB.js 0.3.93, JSZip 3.10.1 and Mammoth 1.11.0. See [THIRD_PARTY_LICENSES.txt](THIRD_PARTY_LICENSES.txt). PDF active content/XFA is disabled; EPUB scripts/popups are disabled; DOCX import uses raw text escaped before display. Original documents are not sent to a parsing service.
