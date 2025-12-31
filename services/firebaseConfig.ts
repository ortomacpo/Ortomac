
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Mapeamento das chaves do Vercel para o Firebase
// Priorizamos os nomes que você cadastrou (conforme imagem)
const firebaseConfig = {
  apiKey: process.env.apiKey || process.env.FIREBASE_API_KEY || "",
  authDomain: process.env.authDomain || process.env.FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.projectId || process.env.FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.storageBucket || process.env.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.messagingSenderId || process.env.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.appId || process.env.FIREBASE_APP_ID || ""
};

let db: any = null;
let isFirebaseReady = false;

// Verifica se as chaves mínimas estão presentes
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    isFirebaseReady = true;
    
    if (typeof window !== 'undefined') {
      enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn("Múltiplas abas abertas, persistência desativada.");
        } else if (err.code === 'unimplemented') {
          console.warn("Navegador sem suporte a persistência.");
        }
      });
    }
    console.log("🚀 Ortomac Cloud: Conectado com sucesso.");
  } catch (e) {
    console.error("❌ Falha na conexão Cloud:", e);
  }
} else {
  console.warn("⚠️ Ortomac Cloud: Variáveis de ambiente não detectadas no Vercel.");
}

export { db, isFirebaseReady };
