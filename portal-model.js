/* Pure password-file compatibility and connection validation; no stored secrets. */
(function(root){'use strict';
function candidates(raw){if(typeof raw!=='string'||raw.length>65536)throw Error('Password file must contain at most 64 KB of text.');const value=raw.trim();if(!value)throw Error('The password file is empty.');return [...new Set([value,value.replace(/\{\\\w+[^}]*?\}/g,'').replace(/[{}]/g,'').trim()])].filter(Boolean);}
function matches(raw,input){return typeof input==='string'&&!!input&&candidates(raw).some(v=>{let diff=v.length^input.length;for(let i=0;i<Math.max(v.length,input.length);i++)diff|=(v.charCodeAt(i)||0)^(input.charCodeAt(i)||0);return diff===0;});}
function validateSession(s,now=Date.now()){return !!s&&typeof s.token==='string'&&!!s.token&&Number(s.expiresAt)>now&&s.scopes?.includes('https://www.googleapis.com/auth/drive.readonly')&&s.scopes?.includes('https://www.googleapis.com/auth/drive.file');}
const api={candidates,matches,validateSession};if(typeof module==='object')module.exports=api;else root.PortalModel=Object.freeze(api);
})(typeof window!=='undefined'?window:globalThis);
