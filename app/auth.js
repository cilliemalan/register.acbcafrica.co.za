
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^| )' + name + '=([^;]+)'));
    if (match) {
        const decoded = decodeURIComponent(match[1]);
        try {
            return JSON.parse(decoded);
        } catch (e) {
            console.error(e);
            return null;
        }
    }
}

export const user = getCookie('user');
