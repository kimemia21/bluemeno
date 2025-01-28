//  let UUID ="00001101-0000-1000-8000-00805F9B34FB";

const connectButton = document.getElementById("clickMe");
const myList = document.getElementById("myList");
const errorElement = document.getElementById("errorMessage");
let uuid = "00001101-0000-1000-8000-00805F9B34FB";

connectButton.addEventListener("click", async () => {
  errorElement.textContent = "";

  try {
    let isAvailable = await navigator.bluetooth.getAvailability();
    if (isAvailable) {
      try {
        const device = await navigator.bluetooth.requestDevice({
          filters: [{ name: "BT5.2 Mouse" }],
          // a,cceptAllDevices: true,
          optionalServices: ["battery_service"], // Add the required services
        });
        if (device.gatt) {
          const server = await device.gatt.connect();

          console.log("Connected to GATT server");
          const services = await server.getPrimaryService("battery_service");
          const characteristic = await services.getCharacteristic(
            "battery_level"
          );
          const value = await characteristic.readValue();
          console.log("Battery level:", value.getUint8(0));
        } else {
          console.log("Device is not connected");
          errorElement.textContent = "Device is Lacks gatt";

          return;
        }

        // Connect to the device's GATT server
      } catch (error) {
        console.error("Bluetooth Connection Error:", error);
        errorElement.textContent = `Failed to connect to the device.${error}`;
      }
    } else {
      errorElement.textContent = "Bluetooth is not available on this device.";
      console.log("Bluetooth is not available on this device.");
    }
  } catch (error) {
    console.error("Bluetooth Connection Error:", error.message);

    errorElement.textContent =
      "Error connecting to Bluetooth device: " + error.message;
  }
});
