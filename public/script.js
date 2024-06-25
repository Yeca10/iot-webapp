document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    const dataDiv = document.getElementById("data");

    socket.on('newData', (data) => {
        const parsedData = JSON.parse(data);
        dataDiv.innerHTML = `<p>${JSON.stringify(parsedData, null, 2)}</p>`;
    });
});
