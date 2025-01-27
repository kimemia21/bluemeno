import 'package:flutter/foundation.dart';
import 'dart:js' as js;

import 'package:flutter/services.dart';
import 'dart:async';
import 'dart:js_util';

import 'package:flutter_web_bluetooth/web/js/js.dart';

class BluetoothConnectorService {
  static final BluetoothConnectorService _instance =
      BluetoothConnectorService._internal();
  factory BluetoothConnectorService() => _instance;
  BluetoothConnectorService._internal();

  final jsConnector = js.context['BluetoothDeviceConnector'];

 Future<Map<String, dynamic>> connectToDeviceByName(String deviceName) async {
  try {
    if (kIsWeb) {
      // Ensure connectByName is defined in the JS context
      if (js.context['connectByName'] == null) {
        print('connectByName not found in JavaScript context');
        throw PlatformException(
          code: 'JS_ERROR',
          message: 'connectByName function not found',
        );
      }

      // Call the JS function and await the promise
      final jsPromise = js.context.callMethod('connectByName', [deviceName]);

      // Check if jsPromise is null
      if (jsPromise == null) {
        throw PlatformException(
          code: 'JS_ERROR',
          message: 'connectByName did not return a promise',
        );
      }

      // Convert the JS promise to a Dart future
      final result = await promiseToFuture(jsPromise);

      // Extract the name property from the JS object
      final name = js.JsObject.fromBrowserObject(result)['name'];

      return {
        'name': name ?? deviceName,
        'connected': true,
      };
    }

    throw PlatformException(
      code: 'UNSUPPORTED_OPERATION',
      message: 'Bluetooth connection is only supported on web',
    );
  } catch (e) {
    throw PlatformException(
      code: 'CONNECTION_FAILED',
      message: e.toString(),
    );
  }
}
  Future<Map<String, dynamic>> connectToDeviceByNameAndService(
      String deviceName, String serviceUuid) async {
    try {
      if (kIsWeb) {
        if (jsConnector == null) {
          throw PlatformException(
            code: 'JS_ERROR',
            message: 'Bluetooth connector not found in JavaScript context',
          );
        }

        final result = await promiseToFuture(callMethod(
            jsConnector, 'connectByNameAndService', [deviceName, serviceUuid]));

        final name = js.JsObject.fromBrowserObject(result)['name'];

        return {
          'name': name ?? deviceName,
          'connected': true,
        };
      }
      throw PlatformException(
        code: 'UNSUPPORTED_OPERATION',
        message: 'Bluetooth connection is only supported on web',
      );
    } catch (e) {
      throw PlatformException(
        code: 'CONNECTION_FAILED',
        message: e.toString(),
      );
    }
  }

  Future<bool> sendData(String data) async {
    try {
      if (kIsWeb) {
        if (jsConnector == null) {
          throw PlatformException(
            code: 'JS_ERROR',
            message: 'Bluetooth connector not found in JavaScript context',
          );
        }

        await promiseToFuture(callMethod(jsConnector, 'sendData', [data]));
        return true;
      }
      throw PlatformException(
        code: 'UNSUPPORTED_OPERATION',
        message: 'Bluetooth communication is only supported on web',
      );
    } catch (e) {
      throw PlatformException(
        code: 'SEND_FAILED',
        message: e.toString(),
      );
    }
  }
}
