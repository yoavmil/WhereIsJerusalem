import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AmbientLight, BoxBufferGeometry, Color, DirectionalLight, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, sRGBEncoding, WebGLRenderer } from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

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
    this.createARButton();
  }

  createARButton() {
    let vrButton = ARButton.createButton(this.renderer);
    document.body.appendChild(vrButton);
  }

  createStubCube() {
    var geometry = new BoxBufferGeometry(0.25, 0.35, 0.1);
    var material = new MeshStandardMaterial({ color: 0x123456 });

    let mesh = new Mesh(geometry, material);
    this.scene.add(mesh);
  }

  createRenderer() {
    this.renderer = new WebGLRenderer(
      { antialias: true, alpha: false }
    );
    this.resizeRenderer();
    this.renderer.xr.enabled = true;
    this.renderer.outputEncoding = sRGBEncoding;
    this.viewerWrapperRef.nativeElement.appendChild(this.renderer.domElement);
    this.renderer.setClearColor(new Color('lightgrey'), 0);
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
  }

  createScene() {
    this.scene = new Scene();
    this.ambientLight = new AmbientLight(0xcccccc, 1.00);

    this.light = new DirectionalLight(0xffffff, 1.0);
    this.scene.add(this.ambientLight);
    this.scene.add(this.light);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
