// class BluetoothDeviceConnector {
//     constructor() {
//         this.device = null;
//         this.characteristic = null;
//     }

//     // Method to connect using just device name
   
// }

// // Create global instance
// window.bluetoothConnector = new BluetoothDeviceConnector();

async function connectByName(deviceName) {
    console.log("##################3333Called###############")
      try {
          // Request device with specific name
          this.device = await navigator.bluetooth.requestDevice({
              filters: [
                  { name: deviceName }  // Exact name match
              ],
              // Request all services to ensure we can interact with the device
            //  optionalServices: ['generic_access', '00001101-0000-1000-8000-00805F9B34FB']
          });

          console.log('Device found:', this.device.name);
          
          // Connect to the device
          const server = await this.device.gatt.connect();
          console.log('Connected to GATT server');

          // Get all available services
          const services = await server.getPrimaryServices();
          console.log('Available services:', services.map(service => service.uuid));

          // Add disconnection listener
          this.device.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));

          return this.device;
      } catch (error) {
          console.error('Error connecting to device:', error);
          throw error;
      }
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