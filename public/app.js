const searchForm = document.querySelector("#search-form");
const createForm = document.querySelector("#create-form");
const profilesList = document.querySelector("#profiles-list");

const loadProfiles = async (queryString) => {
    const response = await fetch('/api/profiles' + queryString);
    if(!response.ok) {
        const { error } = await response.json();
        alert(error);
        return;
    }
    for(profile in response) { // loop through array of profiles
        const saved = await response.json();
        const profile = document.createElement('li');
        if(saved.ustaRating == null) saved.ustaRating == "Unrated";
        if(saved.ustaRanking == null) saved.ustaRanking == "Unranked";
        profile.textContent = `${saved.name} ${saved.age} ${saved.yearsPlayed} ${saved.ustaRating} ${saved.ustaRanking} ${saved.availability}`;
        profilesList.append(profile);
    }
};

searchForm.addEventListener("submit", async (event) => { // submit listener for searching
    event.preventDefault();
    const data = Object.fromEntries(new FormData(searchForm));
    const queryString = null; 

    if(data.ustaRating == null) data.ustaRating == "Unrated";
    if(data.ustaRanking == null) data.ustaRanking == "Unranked";

    queryString = "?name=" + data.name + "&age=" + data.age + "&yearsPlayed=" + data.yearsPlayed + "&ustaRating=" + data.ustaRating + "&ustaRanking=" + data.ustaRanking + "&availability=" + data.availability;
    loadProfiles(queryString); // use queryString to load profile
});

createForm.addEventListener("submit", async (event) => { // submit listener for creating profile
    event.preventDefault();
    const data = Object.fromEntries(new FormData(createForm)); // convert to plain object
    const button = form.querySelector("button");
    
    button.disabled = true; // prevent double-clicking
    try {
        const saved = await fetch('/api/profiles', {
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
    } catch(error) {
        alert(`Profile was not saved. ${error.message}`);
    } finally {
        button.disabled = false;
    }
});