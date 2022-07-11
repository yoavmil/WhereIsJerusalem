import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AmbientLight, BoxBufferGeometry, Color, DirectionalLight, HemisphereLight, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, SphereBufferGeometry, sRGBEncoding, WebGLRenderer } from 'three';
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
    this.createSpheresAroundMe();
    this.createARButton();
  }

  createARButton() {
    let vrButton = ARButton.createButton(this.renderer);
    document.body.appendChild(vrButton);
  }

  private createSpheresAroundMe() {
    let radius = 5;
    let count = 10;
    for (let i = 0; i < count; i++) {
      const geom = new SphereBufferGeometry(0.2);
      const mat = new MeshStandardMaterial({
        color: Math.random() * 0xffffff,
        roughness: 0.7,
        metalness: 0
      });
      let sphere = new Mesh(geom, mat);
      let radian = Math.PI * 2 * i / count
      sphere.position.setX(radius * Math.cos(radian));
      sphere.position.setZ(radius * Math.sin(radian)); // it's a Y up world
      this.scene.add(sphere);
    }
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
    this.scene.add(new HemisphereLight(0x808080, 0x606060));
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
