/* Keep a single authenticated Portal document alive while changing workspaces. */
(function(){'use strict';const space=document.documentElement.dataset.space||'library';if(parent===window){document.documentElement.style.visibility='hidden';location.replace('index.html?space='+space);return;}
let sessionId='';
function host(){try{return parent.location.origin===location.origin?parent.PortalHost:null;}catch{return null;}}
window.PortalFrame=Object.freeze({
 session(){const s=host()?.acquire(window);if(s)sessionId=s.id;return s;},
 async resume(){const s=host()?.acquire(window);if(!s||s.id===sessionId)return;sessionId=s.id;if(space==='library')await MyLibraryDrive.adoptSession(s);else WriterCloud.adoptSession(s);},
 async prepareLeave(){if(space==='library'&&window.LibraryReader)await LibraryReader.flush();if(space==='writing'&&typeof current==='function'){remember();if(docs.some(d=>d.dirty||d.auxDirty)||cloudOperation)return confirm('There are unsaved document or scratchpad changes. Leave and discard them?');}return true;},
 login(message){host()?.login(window,message);},
 navigate(destination){return host()?.navigate(window,destination);}
});
document.addEventListener('click',e=>{const link=e.target.closest('a[href]');if(!link||link.target==='_blank'||e.ctrlKey||e.metaKey)return;const url=new URL(link.href,location.href);if(url.origin!==location.origin||url.hash&&url.pathname===location.pathname)return;const name=url.pathname.split('/').pop();if(['index.html','library.html','writing.html'].includes(name)){e.preventDefault();e.stopImmediatePropagation();window.PortalFrame.navigate(name==='index.html'?'portal':name==='writing.html'?'writing':'library');}},true);
})();
