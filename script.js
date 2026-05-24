function toggleBranch(branch) {
    const button = branch.querySelector(':scope > .row .toggle');
    const collapsed = branch.classList.toggle('collapsed');
    button.textContent = collapsed ? '▸' : '▾';
    button.setAttribute('aria-expanded', (!collapsed).toString());
}

document.querySelectorAll('.toggle').forEach((button) => {
    button.addEventListener('click', () => {
        const branch = button.closest('.branch');
        toggleBranch(branch);
    });
});

document.querySelectorAll('.branch > .row .label').forEach((label) => {
    label.tabIndex = 0;
    label.setAttribute('role', 'button');

    label.addEventListener('click', () => {
        toggleBranch(label.closest('.branch'));
    });

    label.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }

        event.preventDefault();
        toggleBranch(label.closest('.branch'));
    });
});

const littleGuy = document.querySelector('.little-guy');
const adventureShell = document.querySelector('.adventure-shell');
const sceneTitle = document.querySelector('.adventure-scene-title');
const sceneImage = document.querySelector('.adventure-scene-image');
const sceneText = document.querySelector('.adventure-scene-text');
const choices = document.querySelector('.adventure-choices');
const backButton = document.querySelector('.adventure-back');
const restartButton = document.querySelector('.adventure-restart');
const closeButton = document.querySelector('.adventure-close');
const clock = document.querySelector('.xp-clock');
const explorerWindow = document.querySelector('.xp-explorer');
const minimizeButton = document.querySelector('.xp-window-minimize');
const explorerTask = document.querySelector('.xp-task');
const adventureTask = document.querySelector('.adventure-task');
let topWindowZIndex = 5;
const littleGuyStops = [
    { top: '170px', left: '104px' },
    { top: '72%', left: '82%' }
];
const scenes = {
    start: {
        title: 'You find yourself looking at a little guy',
        introImage: 'img/little-guy.png',
        text: '"You\'ve been working and rotting inside for 2 days, lets get you out of that funk!" \n Okay.. not sure how he knows that. Guess he\'s got a point though.',
        choices: [
            ['The house is a mess, lets knock off some tasks', 'houseFixes'],
            ['I really need to get outside', 'goOutside'],
            ['My brain needs a creative outlet right now', 'creativeOutlet'],
            ['Book a flight', 'bookFlight']
        ]
    },
    bookFlight: {
        title: 'Book a Flight',
        text: 'The sensible thing would be to compare prices, dates, and annual leave. The little guy has already opened a new tab.',
        choices: [
            ['Go skiing in the Alps', 'skiingEnding'],
            ['Go motorbiking in Vietnam', 'vietnamEnding'],
            ['Island hopping in the Philippines', 'philippinesEnding']
        ]
    },
    houseFixes: {
        title: 'House Fixes',
        text: 'The house has entered that specific state where every small job is quietly looking at you.',
        choices: [
            ['There\'s an error flashing in HomeAssistant - Investigate', 'smartHome'],
            ['My room could use a refresh, lets rearrange it', 'roomEnding'],
            ['The ironing board is wobbly - 3D print a new foot', 'ironingBoardEnding']
        ]
    },
    smartHome: {
        title: 'Localhost Knows Something',
        text: 'HomeAssistant says the office lamp has achieved sentience. The local LLM says that is statistically unlikely but not impossible.',
        choices: [
            ['Ask the local model for advice', 'model'],
            ['Power cycle the lamp like a professional', 'lamp']
        ]
    },
    model: {
        title: 'The Model Is Very Confident',
        text: 'It recommends tea, a firmware update, and apologising to the lamp. One of those is actionable.',
        choices: [
            ['Make tea', 'teaEnding'],
            ['Update the firmware', 'firmwareEnding']
        ]
    },
    lamp: {
        title: 'Ancient Ritual',
        text: 'Off. On. Off. On. The lamp returns to normal and the house pretends nothing happened.',
        choices: [
            ['Return to house fixes', 'houseFixes'],
            ['Call that enough productivity for now', 'lampEnding']
        ]
    },
    goOutside: {
        title: 'Go Outside',
        text: 'What should we do?',
        choices: [
            ['Go to badminton', 'badmintonEnding'],
            ['Go for a bike ride', 'bikeEnding'],
            ['Find a gig tonight', 'jazzEnding']
        ]
    },
    creativeOutlet: {
        title: 'Creative Outlet',
        text: 'Which of the 200 unfinished projects should we work on?',
        choices: [
            ['Take and edit some photos', 'photoEnding'],
            ['Work your robot buddy', 'matrixEnding'],
            ['Finish your Halloween costume', 'costumeEnding']
        ]
    },
    roomEnding: {
        title: 'Ending: Spatial Refactor',
        text: 'The room is technically the same size, but somehow has more room. This feels illegal.',
        choices: []
    },
    ironingBoardEnding: {
        title: 'Ending: Load-Bearing PLA',
        text: 'The ironing board stands again. You do not fully trust it, but its better than the wobble.',
        choices: []
    },
    teaEnding: {
        title: 'Ending: Hydrated Engineer',
        text: 'The lamp calms down. You calm down. The house is still weird, but now there is tea.',
        choices: []
    },
    firmwareEnding: {
        title: 'Ending: Release Manager',
        text: 'The firmware update succeeds. Nothing visibly changes, which is how you know it was enterprise-grade.',
        choices: []
    },
    lampEnding: {
        title: 'Ending: Technically Fixed',
        text: 'The lamp works, the dashboard is green, and no one has to know how much of the solution was unplugging it.',
        choices: []
    },
    skiingEnding: {
        title: 'Ending: Black Run',
        text: 'Ski trip with the boys. Fast runs, hot tub, empty wallet.',
        image: 'img/ski.JPG',
        choices: []
    },
    vietnamEnding: {
        title: 'Ending: Ha Giang Loop',
        text: 'Pretty damn good.',
        image: 'img/vietnam.JPG',
        caption: 'Một, hai, ba, zô',
        choices: []
    },
    philippinesEnding: {
        title: 'Ending: Snorkle fiend',
        text: 'Swimming with a turtle was pretty cool.',
        images: ['img/philippines-1.JPG', 'img/philippines-2.JPG'],
        choices: []
    },
    badmintonEnding: {
        title: 'Ending: Court Time',
        text: 'Smashing shuttles is always good for getting out of a funk',
        image: 'img/badminton-ending.png',
        caption: 'Up the Maggs',
        choices: []
    },
    bikeEnding: {
        title: 'Ending: Two Wheels',
        text: 'With no long-distance experience, you decide to cycle 100 miles from London to the cliffs of Dover. It takes 12 hours.',
        image: 'img/dover.JPG',
        choices: []
    },
    jazzEnding: {
        title: 'Ending: Tuna Fish',
        text: 'Hell yeah.',
        image: 'img/tuna-ending.jpg',
        caption: 'Chali 2na gives a world-ending performance of "Concrete Schoolyard" at the Jazz Cafe',
        choices: []
    },
    photoEnding: {
        title: 'Ending: Professional street photographer',
        text: 'You come back with one good photo and eighty-seven mediocre ones. It\'ll wash out in the edit.',
        image: 'img/street.JPG',
        choices: []
    },
    matrixEnding: {
        title: 'Ending: Robot Buddy Maintenance',
        text: 'The robot strictly disobeys what its told. Maybe hooking it up to a 0.5B LLM was a mistake.',
        choices: []
    },
    costumeEnding: {
        title: 'Ending: Seasonal Engineering',
        text: 'Best costume winner 3 years running, obviously.',
        image: 'img/wii.jpg',
        caption: 'Making the nunchuck dispense beer was smart to bribe the judges',
        choices: []
    }
};
let littleGuyClicks = 0;
let currentScene = 'start';
let history = [];

function renderScene(sceneId) {
    const scene = scenes[sceneId];
    currentScene = sceneId;
    sceneTitle.textContent = scene.title;
    sceneImage.hidden = !scene.introImage;
    sceneImage.src = scene.introImage || '';
    sceneImage.alt = scene.introImage ? scene.title : '';
    sceneText.textContent = scene.text;
    choices.innerHTML = '';

    scene.choices.forEach(([label, nextScene], index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = `${index + 1}. ${label}`;
        button.addEventListener('click', () => {
            history.push(currentScene);
            renderScene(nextScene);
        });
        choices.appendChild(button);
    });

    if (scene.choices.length === 0) {
        const imageSlot = document.createElement('div');
        imageSlot.className = 'adventure-ending-image-slot';
        const sceneImages = scene.images || (scene.image ? [scene.image] : []);

        sceneImages.forEach((imageSrc) => {
            const image = document.createElement('img');
            image.className = 'adventure-ending-image';
            image.src = imageSrc;
            image.alt = scene.title;
            imageSlot.appendChild(image);
        });

        if (sceneImages.length > 0) {
            const satGuy = document.createElement('img');
            satGuy.className = 'adventure-ending-sat-guy';
            satGuy.src = 'img/sat-guy.png';
            satGuy.alt = '';
            satGuy.setAttribute('aria-hidden', 'true');
            imageSlot.appendChild(satGuy);
        }

        choices.appendChild(imageSlot);

        if (scene.caption) {
            const caption = document.createElement('p');
            caption.className = 'adventure-ending-caption';
            caption.textContent = scene.caption;
            choices.appendChild(caption);
        }

        const ending = document.createElement('p');
        ending.className = 'adventure-ending';
        ending.textContent = 'Process complete.';
        choices.appendChild(ending);
    }

    backButton.disabled = history.length === 0;
}

function openAdventure() {
    adventureShell.hidden = false;
    adventureTask.hidden = false;
    adventureTask.classList.add('xp-task-active');
    adventureTask.setAttribute('aria-pressed', 'true');
    littleGuy.hidden = true;
    history = [];
    renderScene('start');
}

function closeAdventure() {
    adventureShell.hidden = true;
    adventureTask.hidden = true;
    adventureTask.classList.remove('xp-task-active');
    adventureTask.setAttribute('aria-pressed', 'false');
    littleGuy.hidden = false;
    littleGuyClicks = 0;
    littleGuy.style.top = '';
    littleGuy.style.left = '';
    littleGuy.style.right = '';
    littleGuy.style.bottom = '';
}

littleGuy.addEventListener('click', () => {
    if (littleGuyClicks >= littleGuyStops.length) {
        openAdventure();
        return;
    }

    const stop = littleGuyStops[littleGuyClicks];
    littleGuy.style.right = 'auto';
    littleGuy.style.bottom = 'auto';
    littleGuy.style.top = stop.top;
    littleGuy.style.left = stop.left;
    littleGuyClicks += 1;
});

backButton.addEventListener('click', () => {
    const previousScene = history.pop();
    if (previousScene) {
        renderScene(previousScene);
    }
});

restartButton.addEventListener('click', () => {
    history = [];
    renderScene('start');
});

closeButton.addEventListener('click', closeAdventure);

adventureTask.addEventListener('click', () => {
    if (!adventureShell.hidden) {
        adventureShell.style.zIndex = String(++topWindowZIndex);
    }
});

function updateClock() {
    clock.textContent = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
}

updateClock();
setInterval(updateClock, 30000);

function setExplorerMinimized(minimized) {
    explorerWindow.hidden = minimized;
    explorerTask.classList.toggle('xp-task-active', !minimized);
    explorerTask.classList.toggle('xp-task-minimized', minimized);
    explorerTask.setAttribute('aria-pressed', (!minimized).toString());
}

minimizeButton.addEventListener('click', () => {
    setExplorerMinimized(true);
});

explorerTask.addEventListener('click', () => {
    setExplorerMinimized(!explorerWindow.hidden);
});

document.querySelectorAll('[data-draggable-window]').forEach((windowElement) => {
    const handle = windowElement.querySelector('[data-drag-handle]');

    handle.addEventListener('pointerdown', (event) => {
        if (event.target.closest('.xp-window-controls')) {
            return;
        }

        if (event.button !== 0) {
            return;
        }

        const rect = windowElement.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        windowElement.style.position = 'fixed';
        windowElement.style.left = `${rect.left}px`;
        windowElement.style.top = `${rect.top}px`;
        windowElement.style.transform = 'none';
        windowElement.style.zIndex = String(++topWindowZIndex);
        handle.setPointerCapture(event.pointerId);

        function moveWindow(moveEvent) {
            const maxLeft = window.innerWidth - windowElement.offsetWidth;
            const maxTop = window.innerHeight - windowElement.offsetHeight - 34;
            const nextLeft = Math.min(Math.max(0, moveEvent.clientX - offsetX), Math.max(0, maxLeft));
            const nextTop = Math.min(Math.max(0, moveEvent.clientY - offsetY), Math.max(0, maxTop));

            windowElement.style.left = `${nextLeft}px`;
            windowElement.style.top = `${nextTop}px`;
        }

        function stopDragging() {
            handle.removeEventListener('pointermove', moveWindow);
            handle.removeEventListener('pointerup', stopDragging);
            handle.removeEventListener('pointercancel', stopDragging);
        }

        handle.addEventListener('pointermove', moveWindow);
        handle.addEventListener('pointerup', stopDragging);
        handle.addEventListener('pointercancel', stopDragging);
    });
});

document.addEventListener('keydown', (event) => {
    if (adventureShell.hidden) {
        return;
    }

    const choiceIndex = Number(event.key) - 1;
    const choiceButton = choices.querySelectorAll('button')[choiceIndex];
    if (choiceButton) {
        choiceButton.click();
    }

    if (event.key === 'Escape') {
        closeAdventure();
    }
});
