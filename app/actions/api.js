

const recaptchaResolves = [];

window.logRecaptchaReady(() => {

    let _invisibleDiv;


    const renderReCaptcha = () => {
        if (_invisibleDiv) _invisibleDiv.remove();
        _invisibleDiv = document.createElement("div");
        document.body.appendChild(_invisibleDiv);

        grecaptcha.render(_invisibleDiv, {
            sitekey: recaptchaKey,
            callback: '__onRecaptchaSubmit',
            size: 'invisible'
        });
    }

    renderReCaptcha();

    window.__onRecaptchaSubmit = (token) => {
        const numResolves = recaptchaResolves.length;
        if (numResolves) {
            recaptchaResolves.forEach((rsv) => {
                try {
                    rsv.apply(this, [token]);
                } catch (e) {
                    console.error(e);
                }
            });

            recaptchaResolves.splice(0, numResolves);
        }

        renderReCaptcha();
    };

});

function getReCaptchaToken() {

    return new Promise((resolve, reject) => {

        recaptchaResolves.push(resolve);
        grecaptcha.execute();
    });

}




function handleError(e) {
    if (typeof e == "string") {
        throw e;
    }

    throw e.message || "an error has occurred.";
}


let tokenValidated = null;
const validateToken = () => tokenValidated
    ? tokenValidated
    : tokenValidated = getReCaptchaToken()
        .then(token => fetch('/api/validate', {
            method: 'POST',
            body: JSON.stringify({ token }),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })).catch(handleError)
        .then(r => r.text())
        .then(r => r == '👍');


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

export const submitRegistration = (registration) =>
    validateToken().then(() => fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(registration),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })).then(res => {
        if (!res.ok) {
            return res.text().then(msg => { throw msg || res.statusText || "an error has occurred"; });
        }
    }).catch(handleError);
