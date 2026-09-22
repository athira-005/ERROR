import type { Device } from './types';
import { patientMonitoringDevices } from './devices/patientMonitoring';
import { lifeSupportDevices } from './devices/lifeSupport';
import { medicalImagingDevices } from './devices/medicalImaging';
import { therapeuticDevices } from './devices/therapeutic';
import { laboratoryDevices } from './devices/laboratory';
import { surgicalDevices } from './devices/surgical';
import { rehabilitationDevices } from './devices/rehabilitation';
import { dentalDevices } from './devices/dental';
import { ophthalmologyDevices } from './devices/ophthalmology';
import { neonatalDevices } from './devices/neonatal';

export const allDevices: Device[] = [
  ...patientMonitoringDevices,
  ...lifeSupportDevices,
  ...medicalImagingDevices,
  ...therapeuticDevices,
  ...laboratoryDevices,
  ...surgicalDevices,
  ...rehabilitationDevices,
  ...dentalDevices,
  ...ophthalmologyDevices,
  ...neonatalDevices,
];

export function getDeviceById(id: string): Device | undefined {
  return allDevices.find((d) => d.id === id);
}

export function getDevicesByCategory(categoryId: string): Device[] {
  return allDevices.filter((d) => d.categoryId === categoryId);
}
