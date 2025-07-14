function formatDateAsAgo(dateString) {
    if (!dateString) return ""; // Handle null or empty input

    try {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        // Normalize dates to midnight for day-level comparison
        const dateToCompare = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const todayToCompare = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const yesterdayToCompare = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

        if (dateToCompare.getTime() === todayToCompare.getTime()) {
            return "Regada hoy";
        } else if (dateToCompare.getTime() === yesterdayToCompare.getTime()) {
            return "Regada ayer";
        } else {
            // Calculate difference in days
            const diffTime = todayToCompare.getTime() - dateToCompare.getTime();
            // Use Math.floor for days difference if it's past, Math.ceil could be misleading for "X days ago"
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 1) {
                return `Regada hace ${diffDays} días`;
            } else if (diffDays === 1 ) {
                // This handles the case where it's more than 24 hours but less than 48 hours,
                // and wasn't caught by the simple "yesterday" check (e.g. due to time part).
                return "Regada ayer";
            } else if (diffDays < 0) {
                 // Date is in the future
                return ""; // Or a specific message like "Fecha futura"
            }
             else {
                // Default for less than 1 day difference not matching "hoy" (e.g. if times are slightly off but same day)
                // or any other unhandled cases. Could also be "Regada hoy" if dateToCompare is today.
                // For safety, returning empty if it's not clearly in the past or today/yesterday.
                return "";
            }
        }
    } catch (e) {
        console.error("Error parsing date:", e);
        return ""; // Invalid date string
    }
}

function isWateredToday(dateString) {
    try {
        const date = new Date(dateString);
        const today = new Date();

        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    } catch (e) {
        console.error("Error checking if watered today:", e);
        return false;
    }
}

const plantsData = [
    {
        name: "Dracaena",
        scientificName: "Dracaena fragrans - Tronco de Brasil",
        emoji: "🌱",
        imagePlaceholder: "Imagen de Dracaena",
        imageUrl: "image/dracaena_fragrans.png",
        watering: "Cuando los primeros 5 cm (o 1/3 de la maceta) estén bien secos.",
        checkFrequency: "7-14 días (más cerca de 7-10 días con calor).",
        tip: "Muy tolerante a la sequía. ¡No la ahogues! Agua reposada o filtrada es mejor."
    },
    {
        name: "Dracaena fragrans hawaiian",
        scientificName: "Dracaena fragrans hawaiian",
        emoji: "🌱",
        imagePlaceholder: "Imagen de Dracaena",
        imageUrl: "image/dracaena_fragrans_hawaiian.png",
        watering: "Cuando los primeros 5 cm (o 1/3 de la maceta) estén bien secos.",
        checkFrequency: "7-14 días (más cerca de 7-10 días con calor).",
        tip: "Muy tolerante a la sequía. ¡No la ahogues! Agua reposada o filtrada es mejor."
    },
    {
        name: "Calathea zebrina",
        scientificName: "Goeppertia zebrina",
        emoji: "🦓",
        imagePlaceholder: "Imagen de Calathea zebrina",
        imageUrl: "image/calatheazebra.jpg",
        watering: "Cuando el centímetro superior del sustrato comience a secarse. Mantener húmedo, no empapado.",
        checkFrequency: "2-4 días (necesita atención frecuente con calor).",
        tip: "¡Ama la humedad! El 66.8% es genial. Agua filtrada o de lluvia es ideal."
    },
    {
        name: "Areca",
        scientificName: "Chrysalidocarpus lutescens",
        emoji: "🌞",
        imagePlaceholder: "Imagen de Palmera Areca",
        imageUrl: "image/areca.png",
        watering: "Cuando los 2-4 cm superiores del sustrato estén secos.",
        checkFrequency: "4-7 días.",
        tip: "Le gusta la humedad ambiental. Evita que se seque por completo."
    },
    {
        name: "Photo colgante",
        scientificName: "Epipremnum aureum",
        emoji: "✨",
        imagePlaceholder: "Imagen de Poto Dorado Colgante",
        imageUrl: "image/potus.png",
        watering: "Cuando los 2-5 cm superiores del sustrato estén secos.",
        checkFrequency: "5-10 días.",
        tip: "Muy resistente. Similar al Potho Neón, mejor pecar de seco que de húmedo."
    },
    {
        name: "Potho Neón",
        scientificName: "Epipremnum aureum 'Neon'",
        emoji: "🪴",
        imagePlaceholder: "Imagen de Potho Neón", // Retained for consistency, though imageUrl is primary
        imageUrl: "image/potusneon.png",
        watering: "Cuando los 2-5 cm superiores del sustrato estén secos.",
        checkFrequency: "3-5 días (con 25.7°C).",
        tip: "Prefiere quedarse un poco corto de agua que pasarse. Hojas lacias pueden ser señal de sed."
    },
    {
        name: "Yuca",
        scientificName: "Yucca elephantipes",
        emoji: "🌵",
        imagePlaceholder: "Imagen de Yuca",
        imageUrl: "image/yuca.jpg",
        watering: "Cuando la mayor parte del sustrato esté seco. Muy tolerante a la sequía.",
        checkFrequency: "10-20 días (o más si está a pleno sol).",
        tip: "El exceso de riego es su enemigo. Drenaje excelente es crucial."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const allPlantsGrid = document.querySelector('#all-plants-container .grid');

    if (!allPlantsGrid) {
        console.error("The container for all plants (#all-plants-container .grid) was not found!");
        return;
    }

    function createPlantCard(plant) {
        const card = document.createElement('div');
        card.className = 'plant-card group';

        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'flex flex-col h-full';

        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'plant-image-wrapper';

        const img = document.createElement('img');
        img.src = plant.imageUrl || 'https://placehold.co/300x300/e2e8f0/94a3b8?text=' + encodeURIComponent(plant.imagePlaceholder || 'Plant Image');
        img.alt = plant.name;
        img.className = 'plant-image';
        img.onerror = function() {
            this.src = 'https://placehold.co/300x300/e2e8f0/94a3b8?text=' + encodeURIComponent(plant.imagePlaceholder || 'Error Loading');
        };
        imageWrapper.appendChild(img);

        const info = document.createElement('div');
        info.className = 'plant-info flex-grow';

        const nameContainer = document.createElement('div');
        nameContainer.className = 'flex items-center gap-2';

        const nameP = document.createElement('p');
        nameP.className = 'plant-name';
        nameP.textContent = plant.name;

        const statusIndicator = document.createElement('div');
        statusIndicator.className = 'status-dot';

        nameContainer.appendChild(nameP);
        nameContainer.appendChild(statusIndicator);

        const instructionsDiv = document.createElement('div');
        instructionsDiv.className = 'watering-instructions';

        const waterWhenP = document.createElement('p');
        const waterWhenLabel = document.createElement('span');
        waterWhenLabel.className = 'instruction-label';
        waterWhenLabel.textContent = 'Water when: ';
        waterWhenP.appendChild(waterWhenLabel);
        waterWhenP.appendChild(document.createTextNode(plant.watering || 'N/A'));

        const checkEveryP = document.createElement('p');
        const checkEveryLabel = document.createElement('span');
        checkEveryLabel.className = 'instruction-label';
        checkEveryLabel.textContent = 'Check every: ';
        checkEveryP.appendChild(checkEveryLabel);
        checkEveryP.appendChild(document.createTextNode(plant.checkFrequency || 'N/A'));

        instructionsDiv.appendChild(waterWhenP);
        instructionsDiv.appendChild(checkEveryP);

        if (plant.tip) {
            const tipP = document.createElement('p');
            tipP.className = 'text-xs text-slate-500 mt-1';
            tipP.innerHTML = `<span class="instruction-label">Tip:</span> ${plant.tip}`;
            instructionsDiv.appendChild(tipP);
        }

        info.appendChild(nameContainer);
        info.appendChild(instructionsDiv);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'mt-auto pt-4';

        const lastWateredDisplay = document.createElement('p');
        lastWateredDisplay.className = 'last-watered-display text-xs text-slate-600 mb-2 pt-2 border-t border-slate-100';
        const plantIdForElement = plant.name.replace(/\s+/g, '-').toLowerCase();
        lastWateredDisplay.id = `last-watered-${plantIdForElement}`;

        const wateredButton = document.createElement('button');
        wateredButton.className = 'watered-button w-full px-3 py-1.5 text-xs font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300';
        wateredButton.id = `watered-btn-${plantIdForElement}`;
        wateredButton.textContent = 'Regar';
        wateredButton.dataset.plantname = plant.name;



        // Hide button if watered today
        const wasWateredToday = storedDate ? isWateredToday(storedDate) : false;
        if (wasWateredToday) {
            wateredButton.style.display = 'none';
        }

        buttonContainer.appendChild(lastWateredDisplay);
        buttonContainer.appendChild(wateredButton);

        contentWrapper.appendChild(imageWrapper);
        contentWrapper.appendChild(info);
        contentWrapper.appendChild(buttonContainer);
        card.appendChild(contentWrapper);

        // Load and display stored date
        if (storedDate) {
            lastWateredDisplay.textContent = formatDateAsAgo(storedDate);
        } else {
            lastWateredDisplay.textContent = "Aún no se ha regado";
        }

        return card;
    }

    plantsData.forEach(plant => {
        const plantCard = createPlantCard(plant);
        allPlantsGrid.appendChild(plantCard); // Append to the single grid
    });

    // Event Delegation for "Regada hoy" buttons
    allPlantsGrid.addEventListener('click', function(event) {
        const targetButton = event.target.closest('.watered-button');

        if (targetButton) {
            const plantName = targetButton.dataset.plantname;
            if (plantName) {
                const plantIdForStorage = plantName.replace(/\s+/g, '-').toLowerCase();
                const storageKey = `plantCareApp_lastWatered_${plantIdForStorage}`;
                const nowDate = new Date();
                const nowDateString = nowDate.toISOString();

                localStorage.setItem(storageKey, nowDateString);

                const displayDate = formatDateAsAgo(nowDateString);

                const lastWateredDisplayElement = document.getElementById(`last-watered-${plantIdForStorage}`);
                if (lastWateredDisplayElement) {
                    lastWateredDisplayElement.textContent = displayDate;
                } else {
                    console.error(`Display element not found for ${plantName}`);
                }

                // Ocultar el botón después de regar
                targetButton.style.display = 'none';

                // Update status indicator
                const card = targetButton.closest('.plant-card');
                const statusIndicator = card.querySelector('.plant-status-indicator');
                if (statusIndicator) {
                    statusIndicator.style.backgroundColor = '#4ade80'; // green-400
                }
            }
        }
    });

    // Update status indicators on load
    document.querySelectorAll('.plant-card').forEach(card => {
        const plantName = card.querySelector('.plant-name').textContent;
        const plant = plantsData.find(p => p.name === plantName);
        if (plant) {
            const plantIdForElement = plant.name.replace(/\s+/g, '-').toLowerCase();
            const storageKey = `plantCareApp_lastWatered_${plantIdForElement}`;
            const storedDate = localStorage.getItem(storageKey);
            const statusIndicator = card.querySelector('.status-dot');

            if (storedDate) {
                const lastWateredDate = new Date(storedDate);
                const today = new Date();
                const daysSinceWatered = Math.floor((today.getTime() - lastWateredDate.getTime()) / (1000 * 60 * 60 * 24));

                const freqMatch = plant.checkFrequency.match(/(\d+)-(\d+)\s*días/);
                if (freqMatch) {
                    const minDays = parseInt(freqMatch[1], 10);
                    const maxDays = parseInt(freqMatch[2], 10);

                    if (daysSinceWatered < minDays) {
                        statusIndicator.style.backgroundColor = '#4ade80'; // green-400
                    } else if (daysSinceWatered >= minDays && daysSinceWatered <= maxDays) {
                        statusIndicator.style.backgroundColor = '#facc15'; // yellow-400
                    } else {
                        statusIndicator.style.backgroundColor = '#f87171'; // red-400
                    }
                }
            } else {
                statusIndicator.style.backgroundColor = '#9ca3af'; // gray-400 - No data
            }
        }
    });

    console.log('Plant cards generated and LocalStorage logic initiated.');
});
