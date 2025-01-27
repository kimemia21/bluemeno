// class BluetoothDeviceConnector {
//     constructor() {
//         this.device = null;
//         this.characteristic = null;
//     }

//     // Method to connect using just device name
   
// }

// // Create global instance
// window.bluetoothConnector = new BluetoothDeviceConnector();
//  let UUID ="00001101-0000-1000-8000-00805F9B34FB";
async function connectByName() {
    try {
        console.log('Starting device discovery...');
        
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['generic_access']
        });

        console.log('Device found:', {
            name: device.name,
            id: device.id,
            uuids: device.uuids
        });

        // Check if it's the MP300
        if (device.name === "MP300") {
            console.log("MP300 found");
        } else {
            console.log("Device found but it's not MP300:", device.name);
        }

        // Connect to GATT server
        console.log('Attempting to connect to GATT server...');
        const server = await device.gatt.connect();
        console.log('Successfully connected to GATT server');

        // Get the Generic Access service
        const service = await server.getPrimaryService('generic_access');
        console.log('Accessed Generic Access service');

        return {
            device: device,
            server: server,
            connected: true
        };

    } catch (error) {
        console.error('Bluetooth Connection Error:', error.message);
        throw error; // Re-throw to handle in the calling code
    }
}

// If you need to expose this to the window object:
window.BluetoothConnector = {
    connectByName: connectByName
};
    
    function displayDeviceDetails(device) {
      // Displaying the device name and ID
      console.log('Device Name:', device.name);
      console.log('Device ID:', device.id);
      
      // You can show this info in HTML as well
    //   const deviceInfoDiv = document.getElementById('device-info');
    //   const deviceDetail = document.createElement('p');
    //   deviceDetail.textContent = `Device Name: ${device.name}, Device ID: ${device.id}`;
    //   deviceInfoDiv.appendChild(deviceDetail);
    }

  // Method to connect using both name and service UUID
  async function connectByNameAndService(deviceName, serviceUuid) {
      try {
          this.device = await navigator.bluetooth.requestDevice({
              filters: [
                  { 
                      name: deviceName,
                      services: [serviceUuid]
                  }
              ]
          });

          console.log('Device found:', this.device.name);
          
          const server = await this.device.gatt.connect();
          console.log('Connected to GATT server');

          // Get the specific service
          const service = await server.getPrimaryService(serviceUuid);
          console.log('Service found:', serviceUuid);

          // Get all characteristics
          const characteristics = await service.getCharacteristics();
          console.log('Available characteristics:', characteristics.map(char => char.uuid));

          // Store the first characteristic for communication
          if (characteristics.length > 0) {
              this.characteristic = characteristics[0];
          }

          this.device.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));

          return this.device;
      } catch (error) {
          console.error('Error connecting to device:', error);
          throw error;
      }
  }

  async function sendData(data) {
      if (!this.characteristic) {
          throw new Error('No characteristic available. Please connect first.');
      }

      try {
          const encoder = new TextEncoder();
          const dataArray = encoder.encode(data);
          await this.characteristic.writeValue(dataArray);
          console.log('Data sent successfully');
      } catch (error) {
          console.error('Error sending data:', error);
          throw error;
      }
  }



//   onDisconnected() {
//       console.log('Device disconnected');
//       this.characteristic = null;
//   }

//   async disconnect() {
//       if (this.device && this.device.gatt.connected) {
//           await this.device.gatt.disconnect();
//       }
//   }



const connectButton = document.getElementById('clickMe');
const myList = document.getElementById("myList");
const errorElement = document.getElementById('errorMessage'); 
let uuid ="00001101-0000-1000-8000-00805F9B34FB";

connectButton.addEventListener('click', async () => {
    
  
    errorElement.textContent = '';

    try {
        let isAvailable = await navigator.bluetooth.getAvailability();
        if (isAvailable) {
            try {
                // Request a Bluetooth device
                const device = await navigator.bluetooth.requestDevice({
                    acceptAllDevices: true,  // Accept all devices (you can specify more filters)
                    optionalServices: ['generic_access']  // Add the required services
                });
        
                // Connect to the device's GATT server
                const server = await device.gatt.connect();
                console.log('Connected to GATT server');
        
                // Get primary services from the GATT server
                const services = await server.getPrimaryServices();
                console.log('Available services:', services);
        
                // You can now interact with the services and characteristics
                for (let service of services) {
                    console.log('Service:', service.uuid);
        
                    // Get characteristics for each service
                    const characteristics = await service.getCharacteristics();
                    console.log('Characteristics:', characteristics);
        
                    // For example, you can read a characteristic
                    for (let characteristic of characteristics) {
                        const value = await characteristic.readValue();
                        console.log(`Characteristic value: ${value}`);
                    }
                }
        
                console.log('Connected to device:', device.id);
                console.log('Device information:', device);
        
            } catch (error) {
                console.error('Bluetooth Connection Error:', error);
                errorElement.textContent = 'Failed to connect to the device.';
            }
        } else {
            errorElement.textContent = 'Bluetooth is not available on this device.';
            console.log('Bluetooth is not available on this device.');
        }
        

        



    

    } catch (error) {
        console.error('Bluetooth Connection Error:', error.message);
      
   
        errorElement.textContent = "Error connecting to Bluetooth device: " + error.message;

    }
});