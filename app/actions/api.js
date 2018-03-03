const formsUrl = '/data/forms.json';

export const fetchForms = () => fetch(formsUrl)
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
    });
