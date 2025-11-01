# Configuración de Sincronización entre Dispositivos

Esta aplicación utiliza Firebase Firestore para sincronizar los datos entre diferentes dispositivos en tiempo real. Si no configuras Firebase, la aplicación funcionará normalmente usando localStorage (solo en el mismo dispositivo/navegador).

## 📋 Pasos para Configurar Firebase

### 1. Crear un Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto" o "Add project"
3. Ingresa un nombre para tu proyecto (ej: "lista-compras")
4. Sigue los pasos del asistente
5. Una vez creado, selecciona tu proyecto

### 2. Habilitar Firestore Database

1. En el menú lateral, ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Iniciar en modo de prueba" (para desarrollo)
4. Elige una ubicación para tu base de datos
5. Haz clic en "Habilitar"

### 3. Configurar Reglas de Seguridad

En la pestaña "Reglas" de Firestore, configura las siguientes reglas para permitir lectura/escritura pública (solo para desarrollo):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /lista-compras/{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ IMPORTANTE**: Estas reglas permiten acceso público. Para producción, deberías implementar autenticación.

### 4. Obtener las Credenciales

1. Ve a la configuración del proyecto (⚙️ > Configuración del proyecto)
2. En "Tus apps", haz clic en el ícono de web (</>)
3. Registra tu app con un nombre
4. Copia las credenciales de configuración

### 5. Configurar Variables de Entorno

1. Crea un archivo `.env` en la raíz del proyecto
2. Copia el contenido de `.env.example` y reemplaza los valores:

```env
VITE_FIREBASE_API_KEY=tu-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 6. Para Producción (Netlify, Vercel, etc.)

Agrega estas variables de entorno en la configuración de tu plataforma de hosting:
- Ve a la configuración de tu sitio
- Busca la sección "Environment Variables" o "Variables de Entorno"
- Agrega cada variable con su valor correspondiente

## ✅ Verificación

Una vez configurado:
1. Abre la aplicación en dos dispositivos diferentes
2. Agrega o modifica un item en un dispositivo
3. Deberías ver los cambios reflejarse automáticamente en el otro dispositivo

## 📝 Notas

- Si no configuras Firebase, la app funcionará con localStorage (solo local)
- Los cambios se sincronizan en tiempo real cuando Firebase está configurado
- Firebase tiene un plan gratuito generoso para uso básico

