document.addEventListener('DOMContentLoaded', function() {
    const connectButton = document.getElementById('connectButton');
    const dataValue = document.getElementById('dataValue');
    let device = null; // Store the connected device

    // Function to handle connecting to the BLE device
    function connectToDevice() {
        navigator.bluetooth.requestDevice({ filters: [{ services: ['0000dfb0-0000-1000-8000-00805f9b34fb'] }] })
            .then(selectedDevice => {
                device = selectedDevice; // Store the connected device
                return device.gatt.connect();
            })
            .then(server => {
                return server.getPrimaryService('0000dfb0-0000-1000-8000-00805f9b34fb');
            })
            .then(service => service.getCharacteristic('0000dfb1-0000-1000-8000-00805f9b34fb'))
            .then(characteristic => {
                return characteristic.readValue();
            })
            .then(value => {
                dataValue.textContent = 'Received Data: ' + new TextDecoder().decode(value);
                // Change the button text and functionality
                connectButton.textContent = 'Disconnect';
                connectButton.removeEventListener('click', connectToDevice);
                connectButton.addEventListener('click', disconnectFromDevice);
            })
            .catch(error => {
                console.error("BLE device interaction error: " + error);
            });
    }

    // Function to handle disconnecting from the BLE device
    function disconnectFromDevice() {
        if (device) {
            device.gatt.disconnect();
            device = null; // Clear the connected device
        }
        // Reset the button text and functionality
        connectButton.textContent = 'Connect to BLE Device';
        connectButton.removeEventListener('click', disconnectFromDevice);
        connectButton.addEventListener('click', connectToDevice);
    }

    connectButton.addEventListener('click', connectToDevice);
});
