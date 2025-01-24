import 'package:flutter/material.dart';
import 'package:universal_ble/universal_ble.dart';

class MyWidget extends StatefulWidget {
  const MyWidget({super.key});

  @override
  State<MyWidget> createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
 List<BleDevice> discoveredDevices = [];
  bool isScanning = false;

  @override
  void initState() {
    super.initState();
    _setupBluetoothListeners();
  }

  void _setupBluetoothListeners() {
    UniversalBle.onAvailabilityChange = (state) {
      switch (state) {
        case AvailabilityState.poweredOn:
          _startScan();
          break;
        case AvailabilityState.poweredOff:
          _stopScan();
          break;
        default:
          break;
      }
    };

    UniversalBle.onScanResult = (device) {
      setState(() {
        // Prevent duplicate devices
        if (!discoveredDevices.any((d) => d.name == device.name)) {
          discoveredDevices.add(device);
        }
      });
    };
  }

  void _startScan() {
    if (!isScanning) {
      setState(() => isScanning = true);
      UniversalBle.startScan(
        platformConfig: PlatformConfig(web: WebOptions()),
        
      );
    }
  }

  void _stopScan() {
    UniversalBle.stopScan();
    setState(() => isScanning = false);
  }

  void _connectToDevice(BleDevice device) {
    UniversalBle.connect(device.deviceId);
    // Implement device connection logic
    print('Connecting to device: ${device.name}');
  }

  @override
  void dispose() {
    _stopScan();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('BLE Device Scanner'),
        
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
           Container(
             child: IconButton(
              icon: Icon(isScanning ? Icons.stadium_sharp : Icons.bluetooth_searching, color: Colors.blue,size: 100,),
              onPressed: isScanning ? _stopScan : _startScan,
                       ),
           ),
          isScanning
              ? Center(child: CircularProgressIndicator())
              : Container(
                height: MediaQuery.of(context).size.height*0.7,
                width: MediaQuery.of(context).size.width,
                child: ListView.builder(
                    itemCount: discoveredDevices.length,
                    itemBuilder: (context, index) {
                      final device = discoveredDevices[index];
                      return ListTile(
                        title: Text(device.name ?? 'Unknown Device'),
                        subtitle: Text('RSSI: ${device.rssi}'),
                        trailing: ElevatedButton(
                          onPressed: () => _connectToDevice(device),
                          child: Text('Connect'),
                        ),
                      );
                    },
                  ),
              ),
        ],
      ),
    );
  }
}