import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren, OnDestroy } from '@angular/core';
import { ZXingScannerComponent } from "@zxing/ngx-scanner";
import { MxScanner } from '../mx-scanner.service';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { QrScannerComponent } from 'angular2-qrscanner';

@Component({
  selector: 'mx-scanner',
  templateUrl: './mx-scanner.component.html',
  styleUrls: ['./mx-scanner.component.scss']
})
export class MxScannerComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() scanned: EventEmitter<any> = new EventEmitter();
  @ViewChild('scanner') private scanner: ZXingScannerComponent = new ZXingScannerComponent();
  @ViewChild('bluetooth') private bluetooth?: ElementRef
  @Input() enabled: boolean = false;
  @Input() title: boolean = true;
  @Input() vwsmallSize: number = 75
  @Input() vwlargeSize: number = 33
  @Input() smallBreakpoint: number = 414
  @Input() showToggleButtons: boolean = true
  @Input() preventShadow: boolean = false
  @ViewChild( 'ngScanner' ) public qrScanner!: QrScannerComponent;
  videoDevices:MediaDeviceInfo[] = []
  selectedDevice: any
  turned: boolean = false

  private startSubscription?: Subscription


  constructor(
    private _scanner: MxScanner,
  ) {

    // this.codeForm.valueChanges.subscribe((result) => {

    //       this._scanner.scannedSuccess(result)
    //       this.bluetooth?.nativeElement.focus()

    // })

    // Listen for scanAgain
    this.startSubscription =
    this._scanner.startScan$
      .pipe(debounceTime(1000))
      .subscribe( () => {
        console.log( 'start' )
      this.startZxingScan()
    })

  }



  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // this.startNgScanner()
    this.startZxingScan()
  }

  startNgScanner(): void {
    this.qrScanner.getMediaDevices().then((devices) => {
      for (const device of devices) {
        if (device.kind.toString() === 'videoinput') {
          this.videoDevices.push(device);
        }
      }
      if (this.videoDevices.length > 0) {
        let choosenDev;
        for (const dev of this.videoDevices) {
          if (dev.label.includes('back')) {
            choosenDev = dev;
            break;
          }
        }
        if ( choosenDev ) {
          this.qrScanner.chooseCamera.next(choosenDev);
          this.selectedDevice = choosenDev;
        } else {
          this.qrScanner.chooseCamera.next(this.videoDevices[0]);
          this.selectedDevice = this.videoDevices[0];
        }
        // console.log( this.selectedDevice )
      }
    });

    this.qrScanner.QrDecodeCallback('')
    this.qrScanner.capturedQr.subscribe((result) => {
      console.log( result );
      this.scanned.emit(result)
    } );
  }


  async startZxingScan() {
    this.enabled = true
    await this.waitFor( 300 )
    this.scanner.updateVideoInputDevices().then(devices => {
      console.log( devices )
      // this.scanner.device = devices[ 0 ];

      for (const device of devices) {
        if (device.kind.toString() === 'videoinput') {
          this.videoDevices.push(device);
        }
      }
      console.log( this.videoDevices )
      if (this.videoDevices.length > 0) {
        let choosenDev;
        for (const dev of this.videoDevices) {
          if (dev.label.includes('back')) {
            choosenDev = dev;
            break;
          }
        }
        console.log( choosenDev )
        this.scanner.scanStop()
        if ( choosenDev ) {
          console.log()
          // this.scanner.deviceChange.emit(choosenDev)
          this.scanner.device = choosenDev
          this.selectedDevice = choosenDev;
        } else {
          // this.scanner.deviceChange.emit(this.videoDevices[0])
          this.scanner.device = this.videoDevices[0]
          this.selectedDevice = this.videoDevices[0];
        }
      }
    });
    this.scanner.tryHarder = true;
    this.scanner.askForPermission().then( permission => {
      console.log('Permissions response: ' + permission);
    });

  }

  turnCamera() {
    let selected = this.videoDevices.findIndex( v => v.deviceId === this.selectedDevice.deviceId );
    console.log( selected )

    if ( selected === 1 ) {
      // this.scanner.deviceChange.emit(this.videoDevices[1])
      this.scanner.device = this.videoDevices[0]
      this.selectedDevice = this.videoDevices[0];
    } else {
      // this.scanner.deviceChange.emit(this.videoDevices[0])
      this.scanner.device = this.videoDevices[1]
      this.selectedDevice = this.videoDevices[1];
    }
    this.turned = !this.turned
    // console.log( this.selectedDevice )
  }


  scanSuccessHandler(result: any) {
    // console.log( this.scanner )
    if (this.scanner) this.scanner.scanStop()
    this.enabled = false
    this._scanner.scannedSuccess(result)
    this.scanned.emit(result)
    // this.scannerSound()
  }

  scannerSound() {
    let audio = new Audio();
    audio.src = "/assets/audio/scanned.mp3";
    audio.load();
    audio.play();
  }

  turnOff() {
    this.enabled = false
    if (this.scanner) this.scanner.scanStop()
  }

  /** Create a delay in promises
   * @param {number} ms Miliseconds to waitFor
   */
  private waitFor = ( ms: number ) => new Promise( ( r ) => setTimeout( r, ms ) );
  
  /** Boolean that defines is small width device. Based in smallWidth property. DEFAULT: 414px */
  get small() {
    return window.screen.width < this.smallBreakpoint ? true : false
  }

  ngOnDestroy() {
    if (this.startSubscription) this.startSubscription.unsubscribe()
  }

}
