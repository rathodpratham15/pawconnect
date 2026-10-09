import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';  // Import i18n for translations

const BluetoothHandler: React.FC = () => {
  const { t } = useTranslation();  // Initialize translation hook
  const [deviceName, setDeviceName] = useState<string>('');
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  const connectBluetooth = async (): Promise<void> => {
    try {
      // Web Bluetooth isn't in the default TypeScript DOM typings
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bluetooth = (navigator as any).bluetooth;
      if (!bluetooth) {
        console.error(t('bluetoothHandler.error'), 'Web Bluetooth is not supported in this browser');
        return;
      }
      const device = await bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service']
      });
      setDeviceName(device.name ?? '');

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('battery_service');
      const characteristic = await service.getCharacteristic('battery_level');
      const battery = await characteristic.readValue();

      setBatteryLevel(battery.getUint8(0));
      console.log('Battery level:', battery.getUint8(0), '%');
    } catch (err) {
      console.error(t('bluetoothHandler.error'), err);
    }
  };

  return (
    <div>
      <h3>{t('bluetoothHandler.header')}</h3>
      <button onClick={connectBluetooth}>{t('bluetoothHandler.connectButton')}</button>
      {deviceName && <p>{t('bluetoothHandler.connected', { deviceName })}</p>}
      {batteryLevel !== null && <p>{t('bluetoothHandler.batteryLevel', { batteryLevel })}</p>}
    </div>
  );
};

export default BluetoothHandler;