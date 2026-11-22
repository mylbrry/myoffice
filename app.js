'use strict';

const themeInputs = document.querySelectorAll('input[name="theme"]');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const preferenceKey = 'ayman_portal_theme';
let preference = 'system';

try {
  const stored = localStorage.getItem(preferenceKey);
  if (['system', 'light', 'dark'].includes(stored)) preference = stored;
} catch {
  // Theme selection still works when browser storage is unavailable.
}

function renderTheme() {
  const resolved = preference === 'system'
    ? (systemTheme.matches ? 'dark' : 'light')
    : preference;
  document.documentElement.dataset.theme = resolved;
  themeInputs.forEach(input => {
    input.checked = input.value === preference;
  });
}

themeInputs.forEach(input => {
  input.addEventListener('change', () => {
    preference = input.value;
    try {
      localStorage.setItem(preferenceKey, preference);
    } catch {
      // Keep the selection for this session.
    }
    renderTheme();
  });
});
systemTheme.addEventListener('change', renderTheme);
renderTheme();

// One page-memory Google session. Never persist a token or password.
const defaultClientId='363296996392-m5tr59up374n6s94kjmqpefd2o205lui.apps.googleusercontent.com';
const requiredScopes=['https://www.googleapis.com/auth/drive.readonly','https://www.googleapis.com/auth/drive.file'];
const form=document.getElementById('portal-form'),status=document.getElementById('connection-status'),entryButton=form.querySelector('[type=submit]'),frame=document.getElementById('workspace-frame');
let portalConfig={clientId:defaultClientId,folderId:'',passwordFileId:''},portalSession=null,portalAuthorized=false,portalBusy=false,portalTimer;
try{Object.assign(portalConfig,JSON.parse(localStorage.getItem('myoffice_drive_connection_v1')||'{}'));}catch{}
const field=id=>document.getElementById(id);
field('portal-client').value=portalConfig.clientId;field('portal-folder').value=portalConfig.folderId;field('portal-password-file').value=portalConfig.passwordFileId||'';
const requestedSpace=new URLSearchParams(location.search).get('space');if(requestedSpace==='writing')field('destination').value='writing';
function portalMessage(text,error=false){status.textContent=text;status.setAttribute('role',error?'alert':'status');}
function configFromForm(){const clientId=field('portal-client').value.trim(),raw=field('portal-folder').value.trim(),passwordRaw=field('portal-password-file').value.trim(),passwordFileId=passwordRaw.includes('/file/d/')?passwordRaw.split('/file/d/')[1].split(/[/?#]/)[0]:passwordRaw;const folderId=raw.includes('/folders/')?raw.split('/folders/')[1].split(/[/?#]/)[0]:raw;if(!/^[\w-]+\.apps\.googleusercontent\.com$/.test(clientId))throw Error('Enter the Web application client ID in Connection settings.');if((folderId&&!/^[\w-]+$/.test(folderId))||(passwordFileId&&!/^[\w-]+$/.test(passwordFileId)))throw Error('Use a valid Drive folder/file ID.');const next={clientId,folderId,passwordFileId};if(JSON.stringify(next)!==JSON.stringify(portalConfig)){portalSession=null;portalAuthorized=false;}portalConfig=next;try{localStorage.setItem('myoffice_drive_connection_v1',JSON.stringify(next));}catch{}return next;}
async function driveRead(path,params={},text=false){if(!PortalModel.validateSession(portalSession))throw Error('Your Google session expired. Press Enter to reconnect.');const url=new URL('https://www.googleapis.com/drive/v3/'+path);Object.entries(params).forEach(([k,v])=>url.searchParams.set(k,v));const r=await fetch(url,{headers:{Authorization:'Bearer '+portalSession.token},cache:'no-store',referrerPolicy:'no-referrer'});if(!r.ok){if(r.status===401){portalSession=null;portalAuthorized=false;throw Error('Your Google session expired. Press Enter to reconnect.');}throw Error(r.status===404?'Library/password file not found for this Google account.':'Google could not read the library/password file ('+r.status+').');}return text?r.text():r.json();}
async function driveList(q,fields){let next='',files=[];do{const r=await driveRead('files',{q,fields:'nextPageToken,files('+fields+')',pageSize:'1000',...(next?{pageToken:next}:{})});files.push(...r.files||[]);next=r.nextPageToken||'';}while(next);return files;}
async function checkPassword(){portalMessage('Checking the private password file in Google Drive…');let folder=portalConfig.folderId;if(!folder){const folders=await driveList("trashed = false and mimeType = 'application/vnd.google-apps.folder' and name = 'My Library'",'id,name');if(folders.length!==1)throw Error('Choose your Library folder in Connection settings.');folder=folders[0].id;}let file;if(portalConfig.passwordFileId){file=await driveRead('files/'+portalConfig.passwordFileId,{fields:'id,name,size,mimeType,trashed'});if(file.trashed)throw Error('The password file is in Trash. Choose an active file.');}else{const found=(await driveList("trashed = false and '"+folder+"' in parents",'id,name,size,mimeType')).filter(f=>/^password/i.test(f.name));if(found.length!==1)throw Error(found.length?'More than one password file. Set its file ID in Connection settings.':'No password file was found in the Library folder.');file=found[0];}if(Number(file.size)>65536||file.mimeType==='application/vnd.google-apps.document')throw Error('Use the original text/RTF password file, below 64 KB.');const raw=await driveRead('files/'+file.id,{alt:'media'},true);if(!PortalModel.matches(raw,field('portal-password').value)){field('portal-password').value='';throw Error('Incorrect password. Please try again.');}field('portal-password').value='';portalAuthorized=true;portalMessage('Password verified. Opening your workspace…');await openSpace(field('destination').value);}
async function canLeave(){try{return await frame.contentWindow?.PortalFrame?.prepareLeave()!==false;}catch{return true;}}
async function showPortal(message='',lock=false){if(lock&&!await canLeave())return;if(lock){portalSession=null;clearTimeout(portalTimer);frame.removeAttribute('src');frame.dataset.space='';}field('portal-shell').hidden=true;document.body.classList.remove('workspace-open');field('portal-password').value='';portalAuthorized=false;portalMessage(message||'Enter your library password. Google connects when needed.');field('portal-password').focus();}
async function openSpace(space){if(!portalAuthorized||!PortalModel.validateSession(portalSession))return showPortal('Your session expired. Enter your password to reconnect.');if(!['library','writing'].includes(space))return;const same=frame.dataset.space===space&&frame.hasAttribute('src');if(!same&&!await canLeave())return;field('portal-shell').hidden=false;document.body.classList.add('workspace-open');field('session-space').textContent=space==='writing'?'Writing Workspace':'My Library';if(same)await frame.contentWindow?.PortalFrame?.resume();else{frame.dataset.space=space;frame.src=space==='writing'?'writing.html':'library.html#dashboard';}clearTimeout(portalTimer);portalTimer=setTimeout(()=>showPortal('Google session expired. Enter your password to reconnect; your open draft is kept.'),Math.max(0,portalSession.expiresAt-Date.now()));}
function ownFrame(source){try{return source===frame.contentWindow&&source.location.origin===location.origin;}catch{return false;}}
window.PortalHost=Object.freeze({acquire(source){if(!ownFrame(source)||!portalAuthorized||!PortalModel.validateSession(portalSession))return null;return {...portalSession,scopes:[...portalSession.scopes],config:{...portalConfig}};},navigate(source,space){if(!ownFrame(source))return;if(space==='portal')return showPortal();return openSpace(space);},login(source,message){if(ownFrame(source))return showPortal(message||'Enter your password to reconnect.');}});
field('portal-home').addEventListener('click',()=>showPortal());field('portal-lock').addEventListener('click',()=>showPortal('Workspace locked.',true));
form.addEventListener('submit',e=>{e.preventDefault();if(portalBusy)return;try{configFromForm();if(!field('portal-password').value)return;if(!window.google?.accounts?.oauth2)throw Error('Google sign-in is loading. Please try again.');portalBusy=true;entryButton.disabled=true;const done=()=>{portalBusy=false;entryButton.disabled=false;};if(PortalModel.validateSession(portalSession)){checkPassword().catch(e=>portalMessage(e.message,true)).finally(done);return;}portalMessage('Connecting your Google account…');const client=google.accounts.oauth2.initTokenClient({client_id:portalConfig.clientId,scope:requiredScopes.join(' '),include_granted_scopes:false,callback:async r=>{try{if(r.error||!r.access_token||!google.accounts.oauth2.hasGrantedAllScopes(r,...requiredScopes))throw Error('Google library permission was not granted. Please allow the existing read and app-file permissions.');portalSession={id:crypto.randomUUID(),token:r.access_token,expiresAt:Date.now()+Math.max(0,Number(r.expires_in||3600)-30)*1000,scopes:[...requiredScopes]};await checkPassword();}catch(e){portalMessage(e.message,true);}finally{done();}},error_callback:()=>{portalMessage('Google sign-in was closed or blocked. Press Enter to try again.',true);done();}});client.requestAccessToken({prompt:''});}catch(e){portalBusy=false;entryButton.disabled=false;portalMessage(e.message,true);}});
function ready(){entryButton.disabled=false;portalMessage('Enter your library password. Google connects when needed.');}
if(window.google?.accounts?.oauth2)ready();else{const sdk=document.createElement('script');sdk.src='https://accounts.google.com/gsi/client';sdk.async=true;sdk.onload=ready;sdk.onerror=()=>{entryButton.disabled=false;portalMessage('Google sign-in could not load. Check the connection and reload.',true);};document.head.append(sdk);}
