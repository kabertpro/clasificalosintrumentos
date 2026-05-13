document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('login-screen');
    const splashScreen = document.getElementById('splash-screen');
    const gameScreen = document.getElementById('game-screen');
    const endGameScreen = document.getElementById('end-game-screen');
    const stageSummaryScreen = document.getElementById('stage-summary-screen');
    const mainGameContent = document.getElementById('main-game-content');
    const playerNameInput = document.getElementById('player-name');
    const startGameButton = document.getElementById('start-game-button');
    const countdownDisplay = document.getElementById('countdown');
    const splashMessage = document.getElementById('splash-message');
    const currentPlayerDisplay = document.getElementById('current-player');
    const scoreDisplay = document.getElementById('score');
    const stageDisplay = document.getElementById('stage');
    const timerDisplay = document.getElementById('timer');
    const instrumentContainer = document.getElementById('instrument-container');
    const categoriesContainer = document.getElementById('categories-container');
    const nextStageButton = document.getElementById('next-stage-button');
    const resetGameButton = document.getElementById('reset-game-button');
    const finalPlayerNameDisplay = document.getElementById('final-player-name');
    const finalScoreDisplay = document.getElementById('final-score');
    const playAgainButton = document.getElementById('play-again-button');
    const rotateMessage = document.getElementById('rotate-device-message');
    const errorMessagePopup = document.getElementById('error-message-popup');
    const summaryStageNumber = document.getElementById('summary-stage-number');
    const summaryStageScore = document.getElementById('summary-stage-score');
    const starRatingContainer = document.getElementById('star-rating');

    let playerName = '';
    let score = 0;
    let currentStage = 1;
    let instrumentsInPlay = [];
    let correctInstrumentsCount = 0;
    let timerInterval = null;
    let timeElapsed = 0;
    let isGameActive = false;
    const INSTRUMENTS_PER_STAGE = 5;
    const TOTAL_STAGES = 20;
    const STAR_TIME_THRESHOLD = 30;

    // ⚠️ RUTAS DE SUBCARPETAS:
    // Cambia los nombres de subcarpeta abajo si en GitHub se llaman diferente
    // (por ejemplo 'cuerdas' en vez de 'cuerda', o 'percusión' en vez de 'percusion')
    const FOLDER = {
        cuerda:    'instrumentos/cuerda',
        percusion: 'instrumentos/percusion',
        viento:    'instrumentos/viento'
    };

    const allInstruments = {
        cuerda: [
            'arpa.jpg', 'balalaika.jpg', 'banjo.jpg', 'violin.jpg', 'guitarra.jpg',
            'guitarra_electrica.jpg', 'mandolin.jpg', 'piano.jpg', 'ukelele.jpg'
        ],
        percusion: [
            'bateria.jpg', 'bongo.jpg', 'caja.jpg', 'castañuela.jpg', 'congas.jpg',
            'maracas.jpg', 'pandero.jpg', 'triangulo.jpg', 'xilofono.jpg'
        ],
        viento: [
            'armonica.jpg', 'flauta.jpg', 'flauta_traversa.jpg', 'gaita.jpg', 'saxofon.jpg',
            'trombon.jpg', 'trompeta.jpg', 'tuba.jpg', 'zampoña.jpg'
        ]
    };

    // ─── Pantalla completa ───────────────────────────────────────────────────────
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    function requestFullscreen(el) {
        if      (el.requestFullscreen)       return el.requestFullscreen();
        else if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
        else if (el.mozRequestFullScreen)    return el.mozRequestFullScreen();
        else if (el.msRequestFullscreen)     return el.msRequestFullscreen();
    }
    function exitFullscreen() {
        if      (document.exitFullscreen)       return document.exitFullscreen();
        else if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen)  return document.mozCancelFullScreen();
        else if (document.msExitFullscreen)     return document.msExitFullscreen();
    }
    function isFullscreen() {
        return !!(document.fullscreenElement || document.webkitFullscreenElement ||
                  document.mozFullScreenElement || document.msFullscreenElement);
    }

    function updateFullscreenBtn() {
        fullscreenBtn.textContent = isFullscreen() ? '✕' : '⛶';
        fullscreenBtn.title       = isFullscreen() ? 'Salir de pantalla completa' : 'Pantalla completa';
    }

    fullscreenBtn.addEventListener('click', () => {
        isFullscreen() ? exitFullscreen() : requestFullscreen(document.documentElement);
    });

    document.addEventListener('fullscreenchange',       updateFullscreenBtn);
    document.addEventListener('webkitfullscreenchange', updateFullscreenBtn);
    document.addEventListener('mozfullscreenchange',    updateFullscreenBtn);

    // ─── Orientación + fullscreen automático en móvil ────────────────────────────
    function isMobileDevice() {
        return ('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
               Math.min(window.screen.width, window.screen.height) <= 768;
    }

    function checkOrientation() {
        const isPortrait = window.innerHeight > window.innerWidth;
        const mobile     = isMobileDevice();

        if (isPortrait && mobile) {
            rotateMessage.style.display = 'flex';
        } else {
            rotateMessage.style.display = 'none';
            // Solicitar fullscreen automático en móvil landscape al hacer tap
            if (mobile && !isFullscreen()) {
                requestFullscreen(document.documentElement).catch(() => {});
            }
        }
    }

    // Activar fullscreen en móvil al primer toque del usuario (requiere gesto)
    function tryMobileFullscreen() {
        if (isMobileDevice() && !isFullscreen()) {
            requestFullscreen(document.documentElement).catch(() => {});
        }
        document.removeEventListener('touchstart', tryMobileFullscreen);
        document.removeEventListener('click',      tryMobileFullscreen);
    }
    document.addEventListener('touchstart', tryMobileFullscreen, { once: true });
    document.addEventListener('click',      tryMobileFullscreen, { once: true });

    window.addEventListener('resize',            checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    checkOrientation();

    // ─── Pantallas ───────────────────────────────────────────────────────────────
    function showScreen(screenElement) {
        document.querySelectorAll('.game-screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        screenElement.classList.remove('hidden');
        stageSummaryScreen.classList.add('hidden');
        errorMessagePopup.classList.add('hidden');
        errorMessagePopup.classList.remove('visible');
    }

    // ─── Botones ─────────────────────────────────────────────────────────────────
    startGameButton.addEventListener('click', () => {
        playerName = playerNameInput.value.trim();
        if (playerName) {
            currentPlayerDisplay.textContent = playerName;
            showScreen(splashScreen);
            splashMessage.textContent = '¡Prepárate para la música!';
            startCountdown();
        } else {
            alert('¡Por favor, escribe tu nombre para empezar a jugar!');
        }
    });

    playAgainButton.addEventListener('click', () => {
        resetGame();
        showScreen(loginScreen);
    });

    nextStageButton.addEventListener('click', () => {
        currentStage++;
        if (currentStage > TOTAL_STAGES) {
            endGame();
        } else {
            showScreen(splashScreen);
            splashMessage.textContent = `¡Etapa ${currentStage}!`;
            startIntermediateSplash();
        }
    });

    resetGameButton.addEventListener('click', () => {
        resetGame();
        showScreen(loginScreen);
    });

    // ─── Countdown ───────────────────────────────────────────────────────────────
    function startCountdown() {
        let count = 5;
        countdownDisplay.textContent = count;
        const countdownInterval = setInterval(() => {
            count--;
            countdownDisplay.textContent = count;
            if (count === 0) {
                clearInterval(countdownInterval);
                showScreen(gameScreen);
                isGameActive = true;
                startStage();
            }
        }, 1000);
    }

    function startIntermediateSplash() {
        let count = 3;
        countdownDisplay.textContent = count;
        const countdownInterval = setInterval(() => {
            count--;
            countdownDisplay.textContent = count;
            if (count === 0) {
                clearInterval(countdownInterval);
                showScreen(gameScreen);
                isGameActive = true;
                startStage();
            }
        }, 1000);
    }

    // ─── Reset / End ─────────────────────────────────────────────────────────────
    function resetGame() {
        score = 0;
        currentStage = 1;
        playerName = '';
        playerNameInput.value = '';
        scoreDisplay.textContent = score;
        stageDisplay.textContent = currentStage;
        instrumentContainer.innerHTML = '';
        document.querySelectorAll('.category-dropzone').forEach(dz => dz.innerHTML = '');
        correctInstrumentsCount = 0;
        stopTimer();
        timeElapsed = 0;
        timerDisplay.textContent = '0:00';
        isGameActive = false;
        stageSummaryScreen.classList.add('hidden');
        errorMessagePopup.classList.add('hidden');
        errorMessagePopup.classList.remove('visible');
    }

    function endGame() {
        stopTimer();
        isGameActive = false;
        finalPlayerNameDisplay.textContent = playerName;
        finalScoreDisplay.textContent = score;
        showScreen(endGameScreen);
    }

    // ─── Timer ───────────────────────────────────────────────────────────────────
    function startTimer() {
        stopTimer();
        timeElapsed = 0;
        timerDisplay.textContent = '0:00';
        timerInterval = setInterval(() => {
            timeElapsed++;
            const minutes = Math.floor(timeElapsed / 60);
            const seconds = timeElapsed % 60;
            timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    // ─── Etapa ───────────────────────────────────────────────────────────────────
    function startStage() {
        stageSummaryScreen.classList.add('hidden');
        stageDisplay.textContent = currentStage;
        scoreDisplay.textContent = score;
        instrumentContainer.innerHTML = '';
        document.querySelectorAll('.category-dropzone').forEach(dz => dz.innerHTML = '');
        correctInstrumentsCount = 0;

        const categories = Object.keys(allInstruments);
        const mainCategoryForStage = categories[(currentStage - 1) % categories.length];

        let selectedInstrumentsData = [];

        const mainCategoryInstruments = [...allInstruments[mainCategoryForStage]].sort(() => 0.5 - Math.random());
        let instrumentsFromMain = Math.min(Math.floor(INSTRUMENTS_PER_STAGE / 2) + 1, mainCategoryInstruments.length);
        selectedInstrumentsData = selectedInstrumentsData.concat(
            mainCategoryInstruments.slice(0, instrumentsFromMain).map(name => ({ name, category: mainCategoryForStage }))
        );

        while (selectedInstrumentsData.length < INSTRUMENTS_PER_STAGE) {
            const otherCategories = categories.filter(c => c !== mainCategoryForStage);
            const randomCategory = otherCategories[Math.floor(Math.random() * otherCategories.length)];
            const availableInstruments = allInstruments[randomCategory].filter(
                name => !selectedInstrumentsData.some(i => i.name === name)
            );
            if (availableInstruments.length > 0) {
                const randomInstrument = availableInstruments[Math.floor(Math.random() * availableInstruments.length)];
                selectedInstrumentsData.push({ name: randomInstrument, category: randomCategory });
            }
        }

        // Mezclar
        selectedInstrumentsData.sort(() => 0.5 - Math.random());
        instrumentsInPlay = selectedInstrumentsData;

        instrumentsInPlay.forEach(instrumentData => {
            const instrumentEl = document.createElement('div');
            instrumentEl.classList.add('instrument');
            instrumentEl.setAttribute('draggable', 'true');
            instrumentEl.dataset.category = instrumentData.category;
            instrumentEl.dataset.name = instrumentData.name;

            const img = document.createElement('img');
            img.src = `${FOLDER[instrumentData.category]}/${instrumentData.name}`;
            img.alt = instrumentData.name.replace('.jpg', '');
            img.draggable = false;
            instrumentEl.appendChild(img);

            instrumentContainer.appendChild(instrumentEl);
        });

        setupDragAndDrop();
        startTimer();
    }

    // ─── Drag & Drop ─────────────────────────────────────────────────────────────
    function setupDragAndDrop() {
        const instruments = instrumentContainer.querySelectorAll('.instrument');
        instruments.forEach(instrument => {
            instrument.removeEventListener('dragstart', dragStart);
            instrument.removeEventListener('touchstart', touchStart);
            instrument.addEventListener('dragstart', dragStart);
            instrument.addEventListener('touchstart', touchStart, { passive: false });
        });

        const categoryElements = document.querySelectorAll('.category');
        categoryElements.forEach(category => {
            category.removeEventListener('dragover', dragOver);
            category.removeEventListener('dragleave', dragLeave);
            category.removeEventListener('drop', drop);
            category.removeEventListener('touchmove', touchMove);
            category.removeEventListener('touchend', touchEnd);

            category.addEventListener('dragover', dragOver);
            category.addEventListener('dragleave', dragLeave);
            category.addEventListener('drop', drop);
            category.addEventListener('touchmove', touchMove, { passive: false });
            category.addEventListener('touchend', touchEnd);
        });
    }

    let draggedInstrument = null;
    let touchDraggingElement = null;

    function dragStart(e) {
        draggedInstrument = this;
        e.dataTransfer.setData('text/plain', 'instrument');
        setTimeout(() => { this.style.opacity = '0.5'; }, 0);
    }

    function dragOver(e) {
        e.preventDefault();
        if (draggedInstrument && !this.querySelector('.category-dropzone').contains(draggedInstrument)) {
            this.classList.add('drag-over');
        }
    }

    function dragLeave() {
        this.classList.remove('drag-over');
    }

    function drop(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        if (draggedInstrument) {
            handleInstrumentDrop(draggedInstrument, this);
            draggedInstrument.style.opacity = '1';
            draggedInstrument = null;
        }
    }

    function touchStart(e) {
        e.preventDefault();
        draggedInstrument = this;
        touchDraggingElement = this;
        this.style.position = 'fixed';
        this.style.zIndex = '100';
        this.style.opacity = '0.8';

        const touch = e.touches[0];
        const rect = this.getBoundingClientRect();
        this.dataset.offsetX = touch.clientX - rect.left;
        this.dataset.offsetY = touch.clientY - rect.top;
    }

    function touchMove(e) {
        e.preventDefault();
        if (touchDraggingElement) {
            const touch = e.touches[0];
            const offsetX = parseFloat(touchDraggingElement.dataset.offsetX);
            const offsetY = parseFloat(touchDraggingElement.dataset.offsetY);

            touchDraggingElement.style.left = `${touch.clientX - offsetX}px`;
            touchDraggingElement.style.top  = `${touch.clientY - offsetY}px`;

            let targetCategory = null;
            const elementsAtTouch = document.elementsFromPoint(touch.clientX, touch.clientY);
            for (let el of elementsAtTouch) {
                if (el.classList.contains('category')) {
                    targetCategory = el;
                    break;
                }
            }

            document.querySelectorAll('.category').forEach(cat => cat.classList.remove('drag-over'));
            if (targetCategory && !targetCategory.querySelector('.category-dropzone').contains(touchDraggingElement)) {
                targetCategory.classList.add('drag-over');
            }
        }
    }

    function touchEnd(e) {
        if (touchDraggingElement) {
            touchDraggingElement.style.opacity  = '1';
            touchDraggingElement.style.position = '';
            touchDraggingElement.style.left     = '';
            touchDraggingElement.style.top      = '';
            touchDraggingElement.style.zIndex   = '';

            const touch = e.changedTouches[0];
            const elementsAtDrop = document.elementsFromPoint(touch.clientX, touch.clientY);
            let droppedIntoCategory = false;

            for (let el of elementsAtDrop) {
                if (el.classList.contains('category')) {
                    handleInstrumentDrop(touchDraggingElement, el);
                    droppedIntoCategory = true;
                    break;
                }
            }

            document.querySelectorAll('.category').forEach(cat => cat.classList.remove('drag-over'));
            draggedInstrument = null;
            touchDraggingElement = null;
        }
    }

    // ─── Lógica de acierto ───────────────────────────────────────────────────────
    function handleInstrumentDrop(instrumentElement, targetCategoryElement) {
        if (!isGameActive) return;

        const dropCategory       = targetCategoryElement.dataset.category;
        const instrumentCategory = instrumentElement.dataset.category;
        const dropzone           = targetCategoryElement.querySelector('.category-dropzone');

        if (dropCategory === instrumentCategory) {
            score += 10;
            scoreDisplay.textContent = score;
            instrumentElement.classList.add('correct');
            instrumentElement.setAttribute('draggable', 'false');
            instrumentElement.removeEventListener('dragstart', dragStart);
            instrumentElement.removeEventListener('touchstart', touchStart);
            dropzone.appendChild(instrumentElement);
            correctInstrumentsCount++;
            checkStageCompletion();
        } else {
            score = Math.max(0, score - 5);
            scoreDisplay.textContent = score;
            instrumentElement.classList.add('incorrect');
            showErrorMessage();
            setTimeout(() => { instrumentElement.classList.remove('incorrect'); }, 500);
        }
    }

    function showErrorMessage() {
        errorMessagePopup.classList.remove('hidden');
        errorMessagePopup.classList.add('visible');
        setTimeout(() => {
            errorMessagePopup.classList.remove('visible');
            setTimeout(() => { errorMessagePopup.classList.add('hidden'); }, 300);
        }, 1500);
    }

    function checkStageCompletion() {
        if (correctInstrumentsCount === INSTRUMENTS_PER_STAGE && isGameActive) {
            stopTimer();
            isGameActive = false;
            showStageSummaryInSplash();
        }
    }

    function showStageSummaryInSplash() {
        let stars = 0;
        if      (timeElapsed <= STAR_TIME_THRESHOLD)     stars = 3;
        else if (timeElapsed <= STAR_TIME_THRESHOLD * 2) stars = 2;
        else                                              stars = 1;

        showScreen(splashScreen);

        let starDisplay = '';
        for (let i = 0; i < 3; i++) {
            starDisplay += i < stars ? '⭐' : '☆';
        }

        splashMessage.innerHTML = `
            <div style="font-size:1.8em; margin-bottom:16px;">¡Etapa ${currentStage} Completada!</div>
            <div style="font-size:2.5em; margin:12px 0;">${starDisplay}</div>
            <div style="font-size:1.3em;">Puntuación: ${score}</div>
            <div style="font-size:1.1em; margin-top:8px;">Tiempo: ${Math.floor(timeElapsed / 60)}:${(timeElapsed % 60).toString().padStart(2, '0')}</div>
        `;

        countdownDisplay.textContent = '3';

        let count = 3;
        const autoNextInterval = setInterval(() => {
            count--;
            countdownDisplay.textContent = count;
            if (count === 0) {
                clearInterval(autoNextInterval);
                currentStage++;
                if (currentStage > TOTAL_STAGES) {
                    endGame();
                } else {
                    splashMessage.textContent = `¡Etapa ${currentStage}!`;
                    countdownDisplay.textContent = '3';
                    startIntermediateSplash();
                }
            }
        }, 1000);
    }

    // Inicializar
    showScreen(loginScreen);
});
