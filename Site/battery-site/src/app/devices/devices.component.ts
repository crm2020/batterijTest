import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { SharedService } from "../services/shared.service";
import { NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import { Clipboard } from "@angular/cdk/clipboard";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Device } from "../models/device.model";
import { ApiService } from "../services/api.service";
import { Measurements } from "../models/measurments.model";
import forge from "node-forge";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

declare var bootstrap: any;

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [
    NavbarComponent,
    NgForOf,
    NgOptimizedImage,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {
  testDevices = [
    { name: "test", description: "A test battery", status: "Online", voltage: 23, amperage: 123, temperature: 23, motor_1_speed: 100, motor_2_speed: 45 },
    { name: "test2", description: "A second test battery", status: "Online", voltage: "N/A", amperage: "N/A", temperature: "N/A", motor_1_speed: 29, motor_2_speed: 12 },
    { name: "test2", description: "A second test battery", status: "Online", voltage: "N/A", amperage: "N/A", temperature: "N/A", motor_1_speed: 29, motor_2_speed: 12 },
  ];

  deviceForm!: FormGroup;

  devices: Device[] = [];
  measurements: Measurements[] = [];

  deviceName: string = "Test";
  latestKey: string = "";
  newAPIKey: boolean = false;
  showInfo: boolean = false;

  isExpanded: boolean = true;
  deviceData: any;

  isLoadingDevices: boolean = true;
  isLoadingMeasurements: boolean = true;
  error: string | null = null;

  updateToast: HTMLElement | null = null;

  constructor(private shared: SharedService, private clipboard: Clipboard, private modalService: NgbModal, private api: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    const toastTrigger = document.getElementById("reset-device-btn") as HTMLElement;
    const toastLive = document.getElementById("liveToast");
    this.updateToast = document.getElementById("updateToast") as HTMLElement;
    console.log(toastTrigger);
    if (toastTrigger) {
      toastTrigger.addEventListener('click', () => {
        const toast = new bootstrap.Toast(toastLive);
        console.log("Show Toast")
        toast.show();
      })
    }
    this.shared.sidebarExpanded$.subscribe(expanded => {
      this.isExpanded = expanded
    });

    const nonCopyableField = document.getElementById('button-addon1');
    if (nonCopyableField) {
      nonCopyableField.addEventListener('copy', (event) => {
        event.preventDefault();
      });
    }

    this.fetchDevices();
    this.fetchMeasurements();

    this.deviceForm = new FormGroup({
      deviceName: new FormControl('', [Validators.required]),
      deviceDescription: new FormControl('')
    })
  }

  fetchDevices() {
    this.api.getAllDevices().subscribe({
      next: devices => {
        this.devices = devices;
        console.log(devices);
        this.isLoadingDevices = false;
        this.cdr.detectChanges(); // Force change detection
      },
      error: err => {
        this.error = 'Failed to load devices';
        this.isLoadingDevices = false;
        this.cdr.detectChanges(); // Force change detection
      }
    });
  }

  fetchMeasurements() {
    this.api.getAllMeasurements().subscribe({
      next: measurements => {
        this.measurements = measurements;
        this.isLoadingMeasurements = false;
        this.cdr.detectChanges(); // Force change detection
      },
      error: err => {
        this.error = 'Failed to load measurements';
        this.isLoadingMeasurements = false;
        this.cdr.detectChanges(); // Force change detection
      }
    });
  }

  triggerUpdateToast() {
    const toast = new bootstrap.Toast(this.updateToast);
    toast.show();
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.shared.setSidebarExpanded(this.isExpanded);
  }

  updateMotor1(index: number, event: Event, device: Device) {
    device.motor1 = (event.target as HTMLInputElement).valueAsNumber;
  }

  updateMotor2(index: number, event: Event, device: Device) {
    device.motor2 = (event.target as HTMLInputElement).valueAsNumber;
  }

  copyToClipboard(event: Event): void {
    event.preventDefault();
    this.clipboard.copy(this.latestKey);
  }

  openModal(content: any, device: any) {
    this.deviceData = device;
    this.modalService.open(content);
  }

  saveDevice() {
    const imageButtons = document.querySelectorAll('input[name="image-choice"]') as NodeListOf<HTMLInputElement>;
    let selectedImgFilename: string | null = null;

    imageButtons.forEach(imageButton => {
      if (imageButton.checked) {
        const imgElement = imageButton.nextElementSibling as HTMLImageElement;
        if (imgElement) {
          const src = imgElement.src;
          selectedImgFilename = src.substring(src.lastIndexOf('/') + 1);
        }
      }
    });

    const newDevice: Device = {
      display_name: this.deviceForm.value.deviceName,
      api_key: this.generateAPIKey(-1, false),
      description: this.deviceForm.value.deviceDescription,
      motor1: 0,
      motor2: 0,
      online: false,
      image: selectedImgFilename || ""
    }

    this.api.createNewDevice(newDevice).subscribe({
      next: () => {
        this.fetchDevices();
        this.cdr.detectChanges(); // Force change detection
      },
      error: () => {
        this.fetchDevices();
        this.cdr.detectChanges(); // Force change detection
      }
    });
  }

  updateMotor(device: Device, index: number) {
    this.triggerUpdateToast();
    this.api.updateDevice(device).subscribe({
      next: () => this.fetchDevices(),
      error: () => this.fetchDevices()
    });
  }

  deleteDevice(device_id: number) {
    this.api.deleteDevice(device_id).subscribe({
      next: () => {
        this.fetchDevices();
        this.cdr.detectChanges(); // Force change detection
      },
      error: () => {
        this.fetchDevices();
        this.cdr.detectChanges(); // Force change detection
      }
    });
  }

  updateDevice(device: Device, motor1?: number, motor2?: number) {
    const deviceNameRef = document.getElementById("edit-device-name") as HTMLInputElement;
    const deviceDescriptionRef = document.getElementById("edit-device-description") as HTMLInputElement;
    const imageButtons = document.querySelectorAll('input[name="image-choice"]') as NodeListOf<HTMLInputElement>;
    let selectedImgFilename: string | null = null;

    const updatedDevice: Device = {
      device_id: device.device_id,
      display_name: deviceNameRef.value,
      api_key: device.api_key,
      description: deviceDescriptionRef.value,
      motor1: device.motor1,
      motor2: device.motor2,
      online: false,
      image: device.image
    }

    imageButtons.forEach(imageButton => {
      if (imageButton.checked) {
        const imgElement = imageButton.nextElementSibling as HTMLImageElement;
        if (imgElement) {
          const src = imgElement.src;
          selectedImgFilename = src.substring(src.lastIndexOf('/') + 1);
          updatedDevice.image = selectedImgFilename;
        }
      }
    });

    this.triggerUpdateToast();
    this.api.updateDevice(updatedDevice).subscribe({
      next: () => {
        this.fetchDevices();
        if (this.newAPIKey) {
          this.showInfo = true;
          this.deviceName = device.display_name;
        }
        this.cdr.detectChanges(); // Force change detection
      },
      error: () => {
        this.fetchDevices();
        this.cdr.detectChanges(); // Force change detection
      }
    });
  }

  generateAPIKey(device_id: number, save: boolean = true): string {
    const apiKeyField = document.getElementById("api-key-field") as HTMLInputElement;
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = characters.length;

    let key: string = "";
    for (let i = 0; i < 10; i++) {
      key += characters[Math.floor(Math.random() * length)];
    }

    const md = forge.md.sha256.create();
    md.update(key);
    key = md.digest().toHex()
    if(save) {
      this.devices.find(obj => obj.device_id === device_id)!.api_key = key;
      apiKeyField.value = key;
    }
    this.latestKey = key;
    this.newAPIKey = true;
    return key;
  }

  resetAlert() {
    this.newAPIKey = false;
    this.showInfo = false;
  }
}
