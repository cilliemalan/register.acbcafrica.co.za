
function handleError(e) {
    if(typeof e == "string") {
        throw e;
    }

    throw e.message || "an error has occurred.";
}

export const fetchForms = () => fetch('/data/forms.json')
    .then(response => response.json())
    .then(forms => {
        Object.values(forms).forEach(form => {
            form.from = form.from && new Date(form.from);
            form.to = form.to && new Date(form.to);
        
            Object.values(form.options).forEach(option => {
                option.from = option.from && new Date(option.from);
                option.to = option.to && new Date(option.to);
            });
        });

        return forms;
    }).catch(handleError);

export const submitRegistration = (registration) => fetch('/api/submit', {
    method: 'POST',
    body: JSON.stringify(registration),
    headers: {
        'Content-Type': 'application/json'
    }
}).then(res => {
    if (!res.ok) {
        return res.text().then(msg => { throw msg || res.statusText || "an error has occurred"; });
    }
}).catch(handleError);