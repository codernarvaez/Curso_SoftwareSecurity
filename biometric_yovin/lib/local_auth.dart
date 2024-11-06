import 'package:local_auth/local_auth.dart';
import 'package:did_change_authlocal/did_change_authlocal.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class LocalAuth {
  static final _auth = LocalAuthentication();
  static String _tokenBiometric = "";

  static Future<bool> _canAuth() async =>
      await _auth.canCheckBiometrics || await _auth.isDeviceSupported();

  static Future<bool> authenticate(BuildContext context) async {
    try {
      if (!await _canAuth()) return false;

      print(_auth.canCheckBiometrics);
      print(await _auth.getAvailableBiometrics());

      bool isAuthenticated = await _auth.authenticate(
          localizedReason: 'Necesito tu confirmación');

      if (isAuthenticated) {
        await _onResumeUpdateBiometric(context);
      }

      return isAuthenticated;
    } catch (e) {
      print(e);
      return false;
    }
  }

  static Future<void> _onResumeUpdateBiometric(BuildContext context) async {
    try {
      // Comparamos el token actual con el guardado previamente
      await DidChangeAuthLocal.instance
          .onCheckBiometric(token: _tokenBiometric)
          .then((value) {
        if (value == AuthLocalStatus.changed) {
          _showBiometricChangedDialog(context);
        }
      });
    } catch (e) {
      print(e);
    }
  }

  static Future<void> onGetTokenBiometric() async {
    try {
      final tokenBiometric =
          await DidChangeAuthLocal.instance.getTokenBiometric();
      _tokenBiometric = tokenBiometric;
    } on PlatformException catch (_) {
      print("Error obteniendo el token biométrico");
    }
  }

  static void _showBiometricChangedDialog(BuildContext context) {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return const AlertDialog(
            title: Text('Alerta'),
            content: Text('Los datos biométricos han sido cambiados'),
          );
        });
  }
}
