export const parseJwt = () => {
    if (localStorage.getItem('usuario-petfood') !== null) {
        var token = localStorage.getItem("usuario-petfood").split('.');
        var base64Url = token[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    }
}