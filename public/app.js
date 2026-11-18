const createForm = document.querySelector("#create-form");
const errorBox = document.querySelector("#error");
const statusBox = document.querySelector("#status");
const profilesList = document.querySelector("#profiles-list");
const playersHeading = document.querySelector("#players-heading");

const announce = (message) => {
    statusBox.textContent = '';
    setTimeout(() => { statusBox.textContent = message; }, 50);
};

const countPlayers = () => profilesList.querySelectorAll('li[data-profile-id]').length;

let isFirstLoad = true;
let pendingMessage = null;

document.body.addEventListener('htmx:afterSwap', (event) => {
    if (event.detail.target !== profilesList) return;
    if (isFirstLoad) {
        isFirstLoad = false;
        return;
    }
    const count = countPlayers();
    const countMessage = count === 0 ? 'No players found.' : `${count} player${count === 1 ? '' : 's'} found.`;
    announce(pendingMessage ? `${pendingMessage} ${countMessage}` : countMessage);
    pendingMessage = null;
});

document.body.addEventListener('htmx:beforeSwap', (event) => {
    const card = event.detail.target;
    if (event.detail.isError || !card.matches('li[data-profile-id]')) return;

    const neighbour = card.nextElementSibling || card.previousElementSibling;
    const name = card.querySelector('h3')?.textContent.trim() || 'Player';

    setTimeout(() => {
        const nextButton = neighbour?.isConnected ? neighbour.querySelector('.delete-btn') : null;
        if (nextButton) {
            nextButton.focus();
        } else {
            playersHeading.focus();
        }
        const remaining = countPlayers();
        announce(`${name} deleted.${remaining === 0 ? ' No players left.' : ''}`);
    }, 0);
});

document.body.addEventListener('htmx:responseError', (event) => {
    const card = event.detail.target;
    if (!card.matches?.('li[data-profile-id]')) return;
    const name = card.querySelector('h3')?.textContent.trim() || 'this player';
    announce(`Could not delete ${name}. Please try again.`);
});

createForm.addEventListener("submit", async (event) => { 
    event.preventDefault();
    const data = Object.fromEntries(new FormData(createForm)); 
    const button = createForm.querySelector("button");
    
    errorBox.textContent = '';
    button.disabled = true;
    try {
        const response = await fetch('/api/profiles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if(!response.ok) {
            const { error } = await response.json();
            errorBox.textContent = error;
            return;
        }
        
        createForm.reset();
        pendingMessage = `Profile created for ${data.name}.`;
    
        
        htmx.ajax('GET', '/api/profiles/search', { target: '#profiles-list', swap: 'innerHTML' });
        
    } catch(error) {
        alert(`Profile was not saved. ${error.message}`);
    } finally {
        button.disabled = false;

        if (document.activeElement === document.body) button.focus();
    }
});