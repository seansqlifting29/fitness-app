// Firebase SDK, bundled into public/firebase.js by build.sh. The app loads it only when cloud sync is set up.
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, collection, getDocs, query, where, writeBatch } from 'firebase/firestore/lite';

const timeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);

window.FitFirebase = {
  init(config) {
    const app = initializeApp(config);
    const auth = getAuth(app);
    const db = getFirestore(app);
    return {
      onUser: cb => onAuthStateChanged(auth, u => cb(u ? { uid: u.uid, email: u.email } : null)),
      signIn: (e, p) => signInWithEmailAndPassword(auth, e, p),
      signUp: (e, p) => createUserWithEmailAndPassword(auth, e, p),
      reset: e => sendPasswordResetEmail(auth, e),
      signOut: () => signOut(auth),
      // documents in users/{uid}/{col} changed after `since` (ms)
      async pull(uid, col, since) {
        const ref = collection(db, 'users', uid, col);
        const snap = await timeout(getDocs(since ? query(ref, where('t', '>', since)) : ref), 15000);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      },
      // items: [{col, id, v, t}]
      async push(uid, items) {
        for (let i = 0; i < items.length; i += 400) {
          const b = writeBatch(db);
          items.slice(i, i + 400).forEach(it => b.set(doc(db, 'users', uid, it.col, it.id), { v: it.v, t: it.t }));
          await timeout(b.commit(), 20000);
        }
      },
    };
  },
};
