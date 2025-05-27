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

const plantsData = [
    {
        name: "Potho Neón",
        scientificName: "Epipremnum aureum 'Neon'",
        emoji: "🪴",
        imagePlaceholder: "Imagen de Potho Neón", // Retained for consistency, though imageUrl is primary
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD69R8CyZPxc_TVEjSxc5sPzc2b6Kj_Uwvk2IPuzn4ERxRFUepVxaXC1FnR2ZG1_Qnq0eFPEBV4C-UCHz3gjlPgbY9rZKDelDshFoiq9XN5d3DGSbhi9_MbkDyzvz5oTiJoaX3fFBLyL_S_AT9T3y1hqJdqkgEjPZi0gUU-sHgu_XtwboKbLLGSM1g4fvcRKO5E53aj_AIfMriMXRVtlHLyxKxUu60xhkjh4PSWNxH07Qo60cA13HbWCIry4dAu79xmu5y2HyFOkdZv",
        watering: "Cuando los 2-5 cm superiores del sustrato estén secos.",
        checkFrequency: "3-5 días (con 25.7°C).",
        tip: "Prefiere quedarse un poco corto de agua que pasarse. Hojas lacias pueden ser señal de sed."
    },
    {
        name: "Palmera de Salón",
        scientificName: "Chamaedorea elegans",
        emoji: "🌴",
        imagePlaceholder: "Imagen de Palmera de Salón",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxF6ufV57JxhMcMD8Yg-_ZNKEjkVF0pCFWws-QzxKnf-fwUC2PqMl1BOgjlvJFQpUXH1TVUBGf6yfwQrY2Botxzs1MP7gkyttLgMbqULNS7rYoTIaDY3QnQStjCAo3ierfX6iqJ8Q9hPtqIs_LDjd5bRvxFiI4PWFbHAnaHT3qHi9loeW1-kn2cM2egsy-FvqzZ1r9itY1_dB4kt3p-0iQ31dSmOXk-qsjKNM9-fphaNFnOvvwnWDiMEhcUyU0cCL5PcxHn1v5RbWh",
        watering: "Cuando los 2-3 cm superiores del sustrato estén secos.",
        checkFrequency: "4-7 días (más cerca de 4-5 días con calor).",
        tip: "Sensible al exceso de agua. La humedad ambiental actual le gusta."
    },
    {
        name: "Dracaena",
        scientificName: "Dracaena fragrans - Tronco de Brasil",
        emoji: "🌱",
        imagePlaceholder: "Imagen de Dracaena",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAS9iJ1nZhy7AK0D9Y12Q-j73OlCy1pqJH9B0PnSNEyO-CCk3FbpuCuinvzpwHh6Xa2mqjiBBlKj-N5xWF2B7BNyEFE6AUOrPnD7aMjHXbz5wkbYe1OALf8wmh6Wjvhm2Z-ORJ4Kxq_JcqgiFIQIz-nD8_x6-edFLvjYUHFHHiDJv8s1KcQAuUnUISJx01yEjcI6XWQvyXL3wmIjOQ7irovALqVKdftuV5ZfHltV7LaCmmEyI38TIzhjJ60h73lRpM3MwYVWIBVONiL",
        watering: "Cuando los primeros 5 cm (o 1/3 de la maceta) estén bien secos.",
        checkFrequency: "7-14 días (más cerca de 7-10 días con calor).",
        tip: "Muy tolerante a la sequía. ¡No la ahogues! Agua reposada o filtrada es mejor."
    },
    {,
        name: "Calathea zebrina",
        scientificName: "Goeppertia zebrina",
        emoji: "🦓",
        imagePlaceholder: "Imagen de Calathea zebrina",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzn0mrozxgKJQd6S4nMgvtGBtzAsCwAbefAB_xpAnKJTOsSrHcMk-rDQC0RojFhk1yFTl4es0mcDh2OdoMc99rqGAQTK-ODt_2jqzLLolALZpfTvSdfDpX8wGm65TpDgf8_okWJhJ-Si9Gj_AqdwACcl-Hg2QvWRMte90T6PFm3hPmr1h12pt4TfOLkn8-0zvS_OhWvXUweXcb2fBFoVtmldJ0K6kLPfDERO2P00BhUiQI84wHLcUNmuGK6mzwjDx72PuR9iyYyNNo",
        watering: "Cuando el centímetro superior del sustrato comience a secarse. Mantener húmedo, no empapado.",
        checkFrequency: "2-4 días (necesita atención frecuente con calor).",
        tip: "¡Ama la humedad! El 66.8% es genial. Agua filtrada o de lluvia es ideal."
    },
    {
        name: "Yuca",
        scientificName: "Yucca elephantipes",
        emoji: "🌵",
        imagePlaceholder: "Imagen de Yuca",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2Q7G_qv47fu0C4PtOlRxvNM8TXKw859bZefl3wvvR9XXNWGzxSjk58t3rVpxxHEVNG8f1KmGxQe4WOpQJa3cWTUp_e0kv0QMS69LxoethGRBS-dAIBGHMC70vOs4PJ1szqgwyTltIJkANJVVsZBOHff7h-hYSD8p5eQPC6N7O8Hmnou2ntauGihlyjfgX-Vob7BAkZwWgd-dje1lMRXjBm5VEONuMAb8oAyXSjvb23eDdBrpDMPCZ0oL-yhZ8xGTpxssb96sQFdSG",
        watering: "Cuando la mayor parte del sustrato esté seco. Muy tolerante a la sequía.",
        checkFrequency: "10-20 días (o más si está a pleno sol).",
        tip: "El exceso de riego es su enemigo. Drenaje excelente es crucial."
    },
    {
        name: "Palmera Areca",
        scientificName: "Chrysalidocarpus lutescens",
        emoji: "🌞",
        imagePlaceholder: "Imagen de Palmera Areca",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgxccFaX5vR_X2obcvrNf2q4nUY2UqWj2ME_NyBMsCjvvsqcFCBwfVAkCSujl6770eLOgqpRIJJrQJQVufEKfaOmQHYl30YOq-wchTufkYXy5uHH65e67yv4rBreFolNtCRYJ20mC3qkenVFQZq-bNX0GB6A_cfaw_Hz5pJxffqCO2GP0nwTXRE6jD-J7m9rWoquPZsPls1jEzYti7CK8DSmyuTjuktWlctt8aGiP3g3DRYutPzrMdg0MeFAn3UEjVaNlxW_emzMzI",
        watering: "Cuando los 2-4 cm superiores del sustrato estén secos.",
        checkFrequency: "4-7 días.",
        tip: "Le gusta la humedad ambiental. Evita que se seque por completo."
    },
    {
        name: "Poto Dorado Colgante",
        scientificName: "Epipremnum aureum",
        emoji: "✨",
        imagePlaceholder: "Imagen de Poto Dorado Colgante",
        imageUrl: "https://placehold.co/600x400/A7F3D0/166534?text=Poto+Colgante", // Original placeholder
        watering: "Cuando los 2-5 cm superiores del sustrato estén secos.",
        checkFrequency: "5-10 días.",
        tip: "Muy resistente. Similar al Potho Neón, mejor pecar de seco que de húmedo."
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

        const nameP = document.createElement('p');
        nameP.className = 'plant-name';
        nameP.textContent = plant.name;

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

        info.appendChild(nameP);
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
        wateredButton.textContent = 'Regada hoy';
        wateredButton.dataset.plantname = plant.name;

        buttonContainer.appendChild(lastWateredDisplay);
        buttonContainer.appendChild(wateredButton);

        contentWrapper.appendChild(imageWrapper);
        contentWrapper.appendChild(info);
        contentWrapper.appendChild(buttonContainer);
        card.appendChild(contentWrapper);

        // Load and display stored date
        const storageKey = `plantCareApp_lastWatered_${plantIdForElement}`;
        const storedDate = localStorage.getItem(storageKey);
        if (storedDate) {
            lastWateredDisplay.textContent = formatDateAsAgo(storedDate);
        } else {
            lastWateredDisplay.textContent = "";
        }

        return card;
    }

    plantsData.forEach(plant => {
        const plantCard = createPlantCard(plant);
        allPlantsGrid.appendChild(plantCard); // Append to the single grid
    });

    // Event Delegation for "Regada hoy" buttons
    allPlantsGrid.addEventListener('click', function(event) {
        const targetButton = event.target.closest('.watered-button'); // Handles clicks on button or its children
        
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
            }
        }
    });

    console.log('Plant cards generated and LocalStorage logic initiated.');
});
