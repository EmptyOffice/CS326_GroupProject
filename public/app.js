const searchForm = document.querySelector("#search-form");
const createForm = document.querySelector("#create-form");
const profilesList = document.querySelector("#profiles-list");

const loadProfiles = async (queryString = '') => {
    const response = await fetch('/api/profiles' + queryString);
    
    if(!response.ok) {
        const { error } = await response.json();
        alert(error);
        return;
    }
    
    const profiles = await response.json();
    
    profilesList.innerHTML = '';
    
    for(const saved of profiles) { 
        const profile = document.createElement('li');
        
        const rating = saved.ustaRating || "Unrated";
        const ranking = saved.ustaRanking || "Unranked";
        
        //Fixed: every information shows on new line
        profile.innerText = `${saved.name}
        Age: ${saved.age}
        Years Played: ${saved.yearsPlayed}
        Rating: ${rating}
        Ranking: ${ranking}
        Availability: ${saved.availability}`; 

        profilesList.append(profile);
    }
};

searchForm.addEventListener("submit", async (event) => { 
    event.preventDefault();
    const data = Object.fromEntries(new FormData(searchForm));
    
    const params = new URLSearchParams();
    for (const key in data) {
        if (data[key]) params.append(key, data[key]);
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    loadProfiles(queryString); 
});

createForm.addEventListener("submit", async (event) => { 
    event.preventDefault();
    const data = Object.fromEntries(new FormData(createForm)); 
    const button = createForm.querySelector("button"); // Fixed 'form' to 'createForm'
    
    button.disabled = true; 
    try {
        const response = await fetch('/api/profiles', { // Fixed 'saved' to 'response'
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if(!response.ok) {
            const { error } = await response.json();
            alert(error);
            return;
        }
        
        createForm.reset();
        loadProfiles(); // Reload the list automatically so the new player appears
        
    } catch(error) {
        alert(`Profile was not saved. ${error.message}`);
    } finally {
        button.disabled = false;
    }
});

loadProfiles();