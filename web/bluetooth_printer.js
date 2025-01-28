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
            filters: [{ name: 'BT5.2 Mouse' }],
            // acceptAllDevices: true,
            optionalServices: ['generic_access']
        });

        console.log('Device found:', {
            name: device.name,
            id: device.id,
            uuids: device.uuids
        });


        // Connect to GATT server
        console.log('Attempting to connect to GATT server...');
        const server = await device.gatt.connect();
        console.log('Successfully connected to GATT server');

        // Get the Generic Access service
        const service = await server.getPrimaryService('generic_access');
        const characteristic = service.getCharacteristic('generic_access');
        const value = await characteristic.readValue();
        print('Generic Access Service Value:', value.getUint8(0));
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