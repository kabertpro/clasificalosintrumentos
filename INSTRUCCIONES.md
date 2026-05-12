# 🎵 Guía: Publicar el juego en GitHub Pages

## Archivos que debes subir al repositorio

```
clasificalosinstrumentos/          ← raíz del repositorio
├── index.html
├── style.css
├── script.js
└── instrumentos/                  ← tu carpeta de imágenes
    ├── arpa.jpg
    ├── balalaika.jpg
    ├── banjo.jpg
    ├── violin.jpg
    ├── guitarra.jpg
    ├── guitarra_electrica.jpg
    ├── mandolin.jpg
    ├── piano.jpg
    ├── ukelele.jpg
    ├── bateria.jpg
    ├── bongo.jpg
    ├── caja.jpg
    ├── castañuela.jpg
    ├── congas.jpg
    ├── maracas.jpg
    ├── pandero.jpg
    ├── triangulo.jpg
    ├── xilofono.jpg
    ├── armonica.jpg
    ├── flauta.jpg
    ├── flauta_traversa.jpg
    ├── gaita.jpg
    ├── saxofon.jpg
    ├── trombon.jpg
    ├── trompeta.jpg
    ├── tuba.jpg
    └── zampoña.jpg
```

---

## Paso 1 — Subir los archivos a GitHub

### Opción A: desde el navegador (sin instalar nada)

1. Ve a https://github.com/kabertpro/clasificalosintrumentos
2. Haz clic en **"Add file" → "Upload files"**
3. Arrastra los 3 archivos (`index.html`, `style.css`, `script.js`) al área de carga
4. Escribe un mensaje de commit, por ejemplo: `Agrego archivos del juego`
5. Haz clic en **"Commit changes"**
6. Repite el paso para subir la **carpeta `instrumentos`**:
   - Haz clic en "Add file" → "Upload files"
   - Arrastra **todos los archivos .jpg** que están dentro de tu carpeta `instrumentos`
   - ⚠️ GitHub no permite subir carpetas vacías; debes seleccionar **los archivos dentro** de la carpeta
   - Antes de hacer commit, en el campo de nombre de archivo escribe `instrumentos/` al inicio si GitHub no lo detecta automáticamente
   - Haz clic en **"Commit changes"**

### Opción B: usando Git (terminal)

```bash
# Clona el repositorio vacío
git clone https://github.com/kabertpro/clasificalosintrumentos.git
cd clasificalosintrumentos

# Copia tus archivos aquí:
# - index.html, style.css, script.js  (en la raíz)
# - carpeta instrumentos/ con todas las imágenes

# Agrega todo
git add .
git commit -m "Agrego juego completo con imágenes"
git push origin main
```

---

## Paso 2 — Activar GitHub Pages

1. En tu repositorio, ve a **Settings** (⚙️)
2. En el menú izquierdo, selecciona **"Pages"**
3. En **"Branch"**, selecciona `main` y carpeta `/root` (raíz)
4. Haz clic en **"Save"**
5. Espera 1-2 minutos y tu juego estará en:

   👉 **https://kabertpro.github.io/clasificalosintrumentos/**

---

## Notas importantes

- Las imágenes deben tener el **mismo nombre exacto** que aparece en `script.js`
  (incluyendo tildes, como `castañuela.jpg` y `zampoña.jpg`)
- El nombre de la carpeta debe ser **`instrumentos`** (en minúsculas, sin acento)
- GitHub Pages puede tardar hasta 5 minutos en publicar los cambios

---

## ¿Qué cambié en los archivos?

- **index.html**: actualizado el mensaje de "girar dispositivo" con animación
- **style.css**: orientación horizontal forzada en móviles (portrait bloquea el juego);
  diseño ajustado para pantallas landscape pequeñas (teléfonos en horizontal)
- **script.js**: lógica de detección de orientación mejorada; drag táctil con
  `position: fixed` para mejor funcionamiento en móviles
