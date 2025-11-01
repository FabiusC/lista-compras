import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import type { ItemCompra } from '../types';

// Configuración de Firebase (usaremos variables de entorno)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lista-compras-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lista-compras-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Inicializar Firebase solo si tenemos configuración válida
let app: any = null;
let db: any = null;
let isFirebaseAvailable = false;

try {
  if (firebaseConfig.apiKey !== "demo-key") {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    isFirebaseAvailable = true;
  }
} catch (error) {
  console.warn('Firebase no está configurado, usando almacenamiento local');
}

const DATA_COLLECTION = 'lista-compras';
const DATA_DOC_ID = 'datos-principales';

export interface SyncData {
  items: ItemCompra[];
  lastModified: number;
}

// Usar localStorage como fallback
const LOCAL_STORAGE_KEY = 'lista-compras-sync';

export const syncService = {
  isAvailable: () => isFirebaseAvailable,

  // Guardar datos
  saveData: async (items: ItemCompra[]): Promise<void> => {
    const syncData: SyncData = {
      items,
      lastModified: Date.now()
    };

    if (isFirebaseAvailable && db) {
      try {
        const docRef = doc(db, DATA_COLLECTION, DATA_DOC_ID);
        await setDoc(docRef, syncData, { merge: true });
      } catch (error) {
        console.error('Error guardando en Firebase:', error);
        // Fallback a localStorage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(syncData));
      }
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(syncData));
    }
  },

  // Cargar datos
  loadData: async (): Promise<ItemCompra[] | null> => {
    if (isFirebaseAvailable && db) {
      try {
        const docRef = doc(db, DATA_COLLECTION, DATA_DOC_ID);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as SyncData;
          // Sincronizar con localStorage también
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
          return data.items;
        }
      } catch (error) {
        console.error('Error cargando de Firebase:', error);
      }
    }

    // Fallback a localStorage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as SyncData;
        return data.items;
      }
    } catch (error) {
      console.error('Error cargando de localStorage:', error);
    }

    return null;
  },

  // Suscribirse a cambios en tiempo real
  subscribeToChanges: (callback: (items: ItemCompra[]) => void): (() => void) => {
    if (isFirebaseAvailable && db) {
      try {
        const docRef = doc(db, DATA_COLLECTION, DATA_DOC_ID);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as SyncData;
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
            callback(data.items);
          }
        }, (error) => {
          console.error('Error en suscripción Firebase:', error);
          // Fallback a localStorage en caso de error
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) {
            try {
              const data = JSON.parse(stored) as SyncData;
              callback(data.items);
            } catch (e) {
              console.error('Error parseando localStorage:', e);
            }
          }
        });
        return unsubscribe;
      } catch (error) {
        console.error('Error suscribiéndose a Firebase:', error);
      }
    }

    // Fallback: escuchar cambios en localStorage (solo mismo dispositivo)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
        try {
          const data = JSON.parse(e.newValue) as SyncData;
          callback(data.items);
        } catch (error) {
          console.error('Error procesando cambio de almacenamiento:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Retornar función para desuscribirse
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }
};
