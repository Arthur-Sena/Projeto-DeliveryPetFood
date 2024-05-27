self.addEventListener("install", function (event) {
    console.log("WORKER: install event in progress.");
    self.skipWaiting();
});
self.addEventListener("activate", event => {
    console.log('WORKER: activate event in progress.');
    });

const broadcast = new BroadcastChannel('count-channel');
broadcast.onmessage = (event) => {
    if (event.data && event.data.type === 'INCREASE_COUNT') {
        idMotoboy = event.data.idMotoboy;
        broadcast.postMessage({ payload: ++count });
    }
};
var idMotoboy;

setTimeout(() =>  { Notificar()}, 10000);
setInterval(() => { Notificar()}, 60000);

function Notificar() {
    fetch('https://env-9048989.jelastic.saveincloud.net/api/Notify/' + idMotoboy)
    .then(response => response.json())
    .then(data => {
        if (data == true) {

            var options = {
                body: "Recebemos um novo pedido próximo a sua localização, entre no app para aceitar a entrega",
                icon: "icone_logotipo.png",
                vibrate: [100, 50, 100],
                data: {
                    dateOfArrival: Date.now()
                },
                tag: "message Novo Pedido",
                renotify: true,
                requireInteraction: true,
            };
            self.registration.showNotification("Novo Pedido!!", options);
        }
    })
}