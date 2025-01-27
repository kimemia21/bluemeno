import 'package:bluemeno/BlueToothService.dart';
import 'package:flutter/material.dart';
import 'dart:js' as js;
import 'dart:async';
import 'dart:js_util' show promiseToFuture;

import 'package:flutter_web_bluetooth/flutter_web_bluetooth.dart';

class MyWidget extends StatefulWidget {
  const MyWidget({super.key});

  @override
  State<MyWidget> createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
 final BluetoothConnectorService _bluetoothService = BluetoothConnectorService();
  final String deviceName = 'MP300';
   String? serviceUuid;
  String _status = 'Not connected';
  bool _isConnected = false;

  Future<void> _connect() async {
    try {
      setState(() => _status = 'Connecting...');
      
      Map<String, dynamic> result;
      if (serviceUuid != null) {
        result = await _bluetoothService.connectToDeviceByNameAndService(
        deviceName,
        serviceUuid!,
        );
      } else {
        result = await _bluetoothService.connectToDeviceByName(deviceName);
      }
      
      setState(() {
        _isConnected = result['connected'];
        _status = _isConnected ? 'Connected to ${result['name']}' : 'Connection failed';
      });
    } catch (e) {
      setState(() => _status = 'Error: ${e.toString()}');
    }
  }

  Future<void> _sendTestData() async {
    if (!_isConnected) {
      setState(() => _status = 'Please connect first');
      return;
    }

    try {
      setState(() => _status = 'Sending data...');
      await _bluetoothService.sendData('Test data');
      setState(() => _status = 'Data sent successfully');
    } catch (e) {
      setState(() => _status = 'Send error: ${e.toString()}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(_status),
        const SizedBox(height: 20),
        ElevatedButton(
          onPressed: _connect,
          child: Text('Connect to $deviceName'),
        ),
        const SizedBox(height: 10),
        ElevatedButton(
          onPressed: _isConnected ? _sendTestData : null,
          child: const Text('Send Test Data'),
        ),
      ],
    );
  }
}
