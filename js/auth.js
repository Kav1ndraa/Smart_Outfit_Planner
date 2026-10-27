/* Mandatory Firebase email/password authentication for Smart Outfit Planner. */
(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const overlay = $('#authOverlay');
  if (!overlay) return;
  let mode = 'login';
  let currentUser = null;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const strongPassword = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
  const config = window.SOP_FIREBASE_CONFIG || {};
  const configured = !!(window.SOP_FIREBASE_CONFIGURED && config.apiKey && !config.apiKey.includes('PASTE_') && config.projectId && !config.projectId.includes('YOUR_') && config.appId && !config.appId.includes('PASTE_'));
  const setError = (message) => { $('#authError').textContent = message; $('#authError').hidden = !message; };
  const authNav = () => {
    const nav = $('#accountNav'); if (!nav) return;
    if (currentUser) { nav.textContent = 'Sign out'; nav.href = '#signout'; nav.setAttribute('aria-label', `Sign out ${currentUser.email || 'account'}`); }
    else { nav.textContent = 'Login'; nav.href = '#account'; nav.removeAttribute('aria-label'); }
  };
  const lock = () => { currentUser = null; overlay.hidden = false; document.body.classList.add('auth-open','auth-required'); authNav(); };
  const unlock = (user) => {
    currentUser = user; document.body.classList.remove('auth-open','auth-required'); overlay.hidden = true; authNav();
    $('#authStatus').textContent = `Signed in as ${user.email || 'your account'}.`; toastSafe(`Welcome${user.email ? ', ' + user.email : ''}!`);
  };
  const setMode = (next) => {
    mode = next;
    document.querySelectorAll('[data-auth-mode]').forEach(b => b.classList.toggle('active', b.dataset.authMode === mode));
    $('#authTitle').textContent = mode === 'login' ? 'Your style. Your space.' : 'Create your style account.';
    $('#authSubmit').textContent = mode === 'login' ? 'Sign in securely' : 'Create account';
    $('#authPassword').autocomplete = mode === 'login' ? 'current-password' : 'new-password';
    $('#authPassword').value = ''; setError('');
  };
  $('#accountNav')?.addEventListener('click', async (e) => {
    e.preventDefault();
    if (currentUser && configured && window.firebase) { try { await firebase.auth().signOut(); } catch (_) { toastSafe('Could not sign out. Please try again.'); } }
    else { lock(); setError(''); }
  });
  document.querySelectorAll('[data-auth-mode]').forEach(b => b.addEventListener('click', () => setMode(b.dataset.authMode)));
  $('#togglePassword').addEventListener('click', () => { const field=$('#authPassword'); const visible=field.type==='password'; field.type=visible?'text':'password'; $('#togglePassword').textContent=visible?'Hide':'Show'; });
  $('#authForm').addEventListener('submit', async (e) => {
    e.preventDefault(); setError('');
    const email=$('#authEmail').value.trim(), password=$('#authPassword').value;
    if (!emailPattern.test(email)) { setError('Enter a valid email address, for example name@example.com.'); return; }
    if (!strongPassword.test(password)) { setError('Use at least 8 characters, including one uppercase letter and one special character.'); return; }
    if (!configured || !window.firebase || !firebase.apps.length) { setError('Secure login is not connected yet. Open SETUP-GUIDE.md and connect your Firebase project before signing in or creating an account.'); return; }
    const submit=$('#authSubmit'); submit.disabled=true; submit.textContent=mode==='login'?'Signing in…':'Creating account…';
    try {
      const result = mode==='login' ? await firebase.auth().signInWithEmailAndPassword(email,password) : await firebase.auth().createUserWithEmailAndPassword(email,password);
      unlock(result.user);
    } catch(err) {
      const messages={ 'auth/invalid-email':'Please enter a valid email address.','auth/user-not-found':'No account found for this email. Choose Create account first.','auth/wrong-password':'That password is incorrect. Please try again.','auth/invalid-credential':'Email or password is incorrect.','auth/email-already-in-use':'This email already has an account. Sign in instead.','auth/weak-password':'Choose a stronger password with at least 8 characters.','auth/too-many-requests':'Too many attempts. Please wait and try again.','auth/operation-not-allowed':'Enable Email/Password in Firebase Console → Authentication → Sign-in method.','auth/network-request-failed':'Network issue. Check your internet connection and try again.' };
      setError(messages[err.code] || 'Could not sign in. Check your details and Firebase setup.');
    } finally { submit.disabled=false; submit.textContent=mode==='login'?'Sign in securely':'Create account'; }
  });
  if (configured && window.firebase) {
    try { if (!firebase.apps.length) firebase.initializeApp(config); firebase.auth().onAuthStateChanged(user => user ? unlock(user) : lock()); }
    catch(e) { console.error('Firebase initialization failed:',e); lock(); }
  } else lock();
  function toastSafe(message) { const el=$('#toast'); if(!el)return; el.textContent=message; el.hidden=false; window.setTimeout(()=>{el.hidden=true;},2600); }
})();
