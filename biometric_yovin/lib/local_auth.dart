import 'package:local_auth/local_auth.dart';

class LocalAuth {
  static final _auth = LocalAuthentication();
  static Future<bool> _canAuth() async =>
      await _auth.canCheckBiometrics || await _auth.isDeviceSupported();

  static Future<bool> authenticate() async {
    try {
      if (!await _canAuth()) return false;
      print(_auth.canCheckBiometrics);

      print(_auth.getAvailableBiometrics());
      return await _auth.authenticate(
          localizedReason: 'Necesito tu confirmacion');
    } catch (e) {
      print(e);
      return false;
    }
  }
}
