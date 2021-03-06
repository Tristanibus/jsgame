/**
 * Buildings will start at 0% health and finish at 100% health.
 * By default, they have 100 health points.
 */
class Building extends Attackable {

	constructor(team, position, initialHealth) {
		super(team);
		this.initialHealth = initialHealth || 100;
		this.status = "incomplete";
	}

	shadow() {
		this.view.material = this.view.material.shadow;
	}

	start(soft) {
		this.addHealthBar(this.initialHealth);
		this.isAlive = false;// don't die in the next step
		this.applyHealth(- this.initialHealth, true);// set health to 0
		this.isAlive = true;

		if (!soft) {
			socket.emit('start construction', serializeStatus(this._id));
		}
	}

	build(deltaProgress, soft) {
		if (!soft) {
			socket.emit('build', serializeBuild(this._id, deltaProgress));
		}

		this.health = Math.min(this.health + deltaProgress, this.initialHealth);
		if (this.health == this.initialHealth && this.status == "incomplete") {
			this.status = "complete";
			this.finish();
		}

		this.updateHealthBar();
	}

	finish() {
		this.view.material = this.view.material.shadow;
		if (this == env.selectedObject) {
			$("#other").text("complete");
		}
	}

	isFinished() {
		return this.health >= this.initialHealth;
	}

	display() {
		super.display();
		$("#other").text(this.status);
	}
}
