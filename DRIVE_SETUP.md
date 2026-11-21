# Google connection setup — v0.8

The existing My Office Web client can be reused. This release requires no new scopes, full-Drive write permission, billing change or public sharing.

1. Use the Google Cloud project containing the Web application OAuth client. Enable Google Drive API and Google Docs API.
2. In Google Auth Platform, complete branding and audience. If the app is in Testing, add the intended Google account as a test user. Follow any verification requirements Google displays before broader distribution.
3. Declare `https://www.googleapis.com/auth/drive.readonly` for Library reading and `https://www.googleapis.com/auth/drive.file` for app-created uploads, research and writing documents.
4. Set the Authorized JavaScript origin to `https://mylbrry.github.io` without a path. The popup token model used here has no redirect callback URL.
5. Enter only the public client ID ending in `.apps.googleusercontent.com` in the site's connection settings. Never enter a client secret or password into this site.
6. Open Library → Connect Drive. Optionally enter a folder URL/ID; blank discovers My Library. Use the account that can access the books. The chosen folder limits application listing; OAuth reading permission is broader than that folder.
7. Enable saving when required and reconnect with the same account. Both Drive scopes must be granted. Google popup closure can be normal after successful authorization; check the site's connected state.
8. Writing Workspace → Connect Google uses the same client ID and `drive.file`. It lists only native Google documents created by this workspace.

## Operation

- PDF/EPUB upload creates files in My Office Books, discovered automatically on reconnect. The legacy Library_Metadata.json is not modified.
- Reading positions/bookmarks, catalogue edits, notes, ideas, projects and collections use separate immutable Drive event records. Archive/restore changes the workspace view, never deletes the source.
- Open a conflict from Research Tray / Ideas Board → Conflicts, review retained versions and choose which to use. A new revision resolves the branch; old records remain.
- Library refresh reloads saved records. Expired sessions require reconnecting; tokens are never persisted.
- Writer Save to Drive explicitly saves supported draft content. Save scratchpad separately to retain document notes and pins. Unsaved page content is temporary. PDF/Word exports require the current version to be saved.
- DOCX import is text only and imports into a new draft. Complex native Google documents are rejected for editing here to preserve unsupported structures.
- A failed or uncertain save must be checked in Drive/Refresh before retrying. Stale revisions require reopening or saving a new document; no blind overwrite is used.

## Acceptance checks

Use disposable QA records: upload a PDF and EPUB, verify titles after reconnect, navigate and bookmark both, change catalogue tags, create/link/archive/restore a note/idea/project/collection, send research to a draft, save/reopen text and formatting, save/reopen scratchpad and pin, import TXT/MD/DOCX, and export TXT/MD/PDF/DOCX. Verify original file and legacy metadata remain intact. Browser-managed download handling varies; use the browser's downloads list.

For origin mismatch, compare the exact authorized origin with the website. For a blocked popup, allow popups for this site. For disabled API errors, enable the named API in the client-owning project. No refresh token is stored; connection after page reload is intentional.

## Official references

- [Create a Google API client ID](https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid)
- [Google Identity token model](https://developers.google.com/identity/oauth2/web/guides/use-token-model)
- [Drive scopes](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)
- [Drive search](https://developers.google.com/workspace/drive/api/guides/search-files)
- [Docs batch updates and revision control](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/batchUpdate)
