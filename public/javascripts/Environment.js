/**
 *
 * @author Jasmine
 */

function Environment() {

	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.y = 90;
	camera.position.z = 90;
	camera.rotation.x = -5/16 * Math.PI;

	var scene = new THREE.Scene();

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	var listeners = [];
	this.selectedObject = null;// the last clicked object
	var floor = addFloor();
	animate();

	this.getScene = function () {
		return scene;
	};

	function addFloor() {
		var planeGeo = new THREE.PlaneGeometry(500, 500, 20, 20);
		var floor = new THREE.Mesh(planeGeo, Textures.floor);
		floor.rotation.x = - Math.PI / 2;
		scene.add(floor);
		return floor;
	};

	this.addRobot = function (position, team) {
		var sphereGeo = new THREE.SphereGeometry(4, 20, 20);
		var sphereMat = (team == "civ1") ? Textures.eskie : Textures.beagle;
		var sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
		scene.add(sphereMesh);

		sphereMesh.position.set(position.x, 4, position.z);
		return sphereMesh;
	}

	this.addBase = function (position, team) {
		var geometry = new THREE.BoxGeometry( 20, 10, 10 );
		var material = (team == "civ1") ? Textures.base1 : Textures.base2;
		var cube = new THREE.Mesh(geometry, material);
		cube.position.set(position.x, 10, position.z);
		scene.add(cube);

		return cube;
	}

	this.addMine = function (position, num) {
		// var geo = new THREE.BoxGeometry(5, 5, 5);
		var geo = new THREE.SphereGeometry(3, 32, 32, 0, Math.PI);
		var mesh = new THREE.Mesh(geo, Textures.mine);
		mesh.material.color = {r: 0.96, g: 0.58, b: 0.26};// strong orange
		mesh.rotation.x = -Math.PI / 2;
		num /= 30;
		mesh.scale.set(num, num, num);

		var mine = new THREE.Mesh();
		mine.add(mesh);
		mine.position.set(position.x, -1, position.z);

		scene.add(mine);

		return mine;
	};

	this.addFactory = function (position) {
		var geo = new THREE.BoxGeometry(20, 10, 10);
		var factory = new THREE.Mesh(geo, Textures.factory);
		factory.position.set(position.x, 10, position.z);
		scene.add(factory);
		
		return factory;
	};

	this.addTurretCannon = function () {
		var geometry2 = new THREE.BoxGeometry(8,1,1);
		var material2 = new THREE.MeshBasicMaterial( {color: 0xffffff});
		var turretCannon = new THREE.Mesh(geometry2, material2);
		turretCannon.position.y = 5;

		return turretCannon;
	};

	this.addTurret = function (position) {
		var geo = new THREE.BoxGeometry(14, 7, 7);
		var turret = new THREE.Mesh(geo, Textures.turret);
		scene.add(turret);

		turret.position.set(position.x, 3.5, position.z);
		return turret;
	};

	this.addMissile = function (position) {
		var geometry = new THREE.SphereGeometry(1.5, 20, 20);
		var material = new THREE.MeshBasicMaterial({color: 0x000000});
		var missile = new THREE.Mesh(geometry,material);
		scene.add(missile);

		missile.position.x = position.x;
		missile.position.z = position.z;
		return missile;
	};

	this.addHealthBar = function (num) {
		var geo = new THREE.PlaneGeometry(num / 5, 2);
		var mat = new THREE.MeshBasicMaterial({color: 0x0088ff});
		var mesh = new THREE.Mesh(geo, mat);
		mesh.position.y = 5;

		return mesh;
	};


	var raycaster = new THREE.Raycaster();// create once
	var mouse = new THREE.Vector2();// create once

	// 2D point to mesh
	this.unproject = function (x, y) {
		mouse.x = ( x / renderer.domElement.clientWidth ) * 2 - 1;
		mouse.y = - ( y / renderer.domElement.clientHeight ) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);

		var intersects = raycaster.intersectObjects(getMeshes());
		if (intersects.length == 0) {
			return null;
		}
		return intersects[0];
	};

	// 2D to 3D point on plane
	this.project = function (x, y) {
		mouse.x = ( x / renderer.domElement.clientWidth ) * 2 - 1;
		mouse.y = - ( y / renderer.domElement.clientHeight ) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);

		return raycaster.intersectObject(floor)[0].point;
	};

	this.isFloor = function (mesh) {
		return mesh == floor;
	};

	this.remove = function (mesh) {
		scene.remove(mesh);
	};

	// start an event listener
	this.listen = function (eventType, eventHandler) {
		listeners.push([eventType, eventHandler]);
		renderer.domElement.addEventListener(eventType, eventHandler);
	};

	// kill all event listeners of some type
	this.disable = function (eventType) {
		listeners.forEach(function (data) {
			if (data[0] == eventType) {
				renderer.domElement.removeEventListener(data[0], data[1]);
			}
		});
	};

	this.inBounds = function (mesh) {
		return Math.abs(mesh.position.x) < 300 && Math.abs(mesh.position.z) < 300;
	}

	function getMeshes() {
		var meshes = [];
		scene.traverse(function (mesh) {
			if (mesh instanceof THREE.Mesh) {
				meshes.push(mesh);
			}
		});
		return meshes;
	}

	function animate() {
		renderer.render(scene, camera);
		// camera.rotation.y = Date.now() * 0.00005;
		requestAnimationFrame(animate);
	};
}

