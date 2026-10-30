const createForm = document.querySelector("#create-form");

createForm.addEventListener("submit", async (event) => { 
    event.preventDefault();
    const data = Object.fromEntries(new FormData(createForm)); 
    const button = createForm.querySelector("button");
    
    button.disabled = true; 
    try {
        const response = await fetch('/api/profiles', {
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
        
        htmx.ajax('GET', '/api/profiles/search', { target: '#profiles-list', swap: 'innerHTML' });
        
    } catch(error) {
        alert(`Profile was not saved. ${error.message}`);
    } finally {
        button.disabled = false;
    }
});