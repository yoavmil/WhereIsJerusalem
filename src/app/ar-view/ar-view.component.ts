import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AmbientLight, BoxBufferGeometry, Color, DirectionalLight, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, sRGBEncoding, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

@Component({
  selector: 'app-ar-view',
  templateUrl: './ar-view.component.html',
  styleUrls: ['./ar-view.component.css']
})
export class ArViewComponent implements AfterViewInit {

  @ViewChild('viewerWrapper', { static: false })
  viewerWrapperRef: ElementRef;
  private get canvas(): HTMLDivElement {
    return this.viewerWrapperRef.nativeElement as HTMLDivElement;
  }

  renderer: WebGLRenderer;

  fps: number = 60;
  camera: PerspectiveCamera;
  cameraControls: any;
  scene: Scene;
  ambientLight: AmbientLight;
  light: DirectionalLight;

  constructor() { }

  ngAfterViewInit(): void {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createStubCube();
    this.createVRButton();
  }

  createVRButton() {
    let vrButton = VRButton.createButton(this.renderer);
    document.body.appendChild(vrButton);
  }

  createStubCube() {
    var geometry = new BoxBufferGeometry(1, 1, 2);
    var material = new MeshStandardMaterial({ color: 0x123456 });

    let mesh = new Mesh(geometry, material);
    this.scene.add(mesh);
  }

  createRenderer() {
    this.renderer = new WebGLRenderer({ antialias: true });
    this.resizeRenderer();
    this.renderer.xr.enabled = true;
    this.renderer.outputEncoding = sRGBEncoding;
    this.viewerWrapperRef.nativeElement.appendChild(this.renderer.domElement);
    this.renderer.setClearColor(0x543210);
    this.renderer.setAnimationLoop(() => this.render());
  }

  private resizeRenderer() {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    let canvasWidth = this.canvas.clientWidth;
    let canvasHeight = this.canvas.clientHeight;
    this.renderer.setSize(canvasWidth, canvasHeight);
  }

  createCamera() {
    let ratio = window.innerWidth / window.innerHeight;
    this.camera = new PerspectiveCamera(45, ratio, 0.1, 800);
    this.camera.position.set(-1, 5, 10);
    this.scene.add(this.camera);
    this.cameraControls = new OrbitControls(
      this.camera,
      this.canvas
    );
  }

  createScene() {
    this.scene = new Scene();
    this.scene.background = new Color(0xaaaaaa);
    this.ambientLight = new AmbientLight(0x333333); // 0.2

    this.light = new DirectionalLight(0xffffff, 1.0);
    this.scene.add(this.ambientLight);
    this.scene.add(this.light);
  }

  render() {
    this.renderer.render(this.scene, this.camera);

    setTimeout(() => {
      requestAnimationFrame(() => this.render());
    }, 1000 / this.fps);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resizeRenderer();
  }
}
