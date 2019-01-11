// OctoDB
let fs = require('fs');

class OctoDB {
	constructor(fileName) {
		this.fileName = fileName;
		this.store = {};
		this.timeout = {};
		this.restore();
	}

	backup() {
		let data = {
			store: this.store,
			timeout: this.timeout,
		}
		let json = JSON.stringify(data);
		fs.writeFileSync(this.fileName, json, 'utf8');
	}

	restore() {
		try {
			let json = JSON.parse(fs.readFileSync('./' + this.fileName));
			this.store = json.store;
			this.timeout = json.timeout;
		} catch(err) {
			console.log(err);
		}
	}

	timedOut(key) {
		if (key in this.timeout) {
			if (Date.now() >= this.timeout[key]) {
				return true;
			}
			return false;
		} else {
			return false;
		}
	}

	set(key, value) {
		this.store[key] = value;
		this.backup();
	}

	get(key) {
		if (key in this.store) {
			if (this.timedOut(key) == true) {
				return null;
			}
			return this.store[key];
		}

		return null;
	}

	del(key) {
		if (key in this.store) {
			delete this.store[key];
			this.backup();
		}
	}

	expire(key, time) {
		this.timeout[key] = new Date(Date.now() + time * 1000);
	}

	// This will never be called on a raw value
	rpush(key, value) {
		if (key in this.store) {
			this.store[key].push(value);
			this.backup();
		} else {
			this.set(key, [value]);
		}
	}

	lpush(key, value) {
		if (key in this.store) {
			this.store[key].unshift(value);
			this.backup();
		} else {
			this.set(key, [value]);
		}
	}

	llen(key) {
		if (this.timedOut(key) == true) {
			return null;
		}
		return this.store[key].length;
	}

	// begin will always be provided and valid and end is always if provided >= 0
	lrange(key, begin, end=-1) {
		if (this.timedOut(key) == true) {
			return null;
		}

		if (begin > end && end != -1) {
			console.log("Error: begin is greater than end");
		}

		if (!key in this.store) {
			return null;
		}

		// Makes sure we get no OOB error
		if (end > this.store[key].length - 1) {
			end = this.store[key].length;
		}

		if (end == -1) {
			let temp = [];
			for (let i = begin; i < this.store[key].length; ++i) {
				temp.push(this.store[key][i]);
			}
			return temp;

		} else {
			let temp = [];
			for (let i = begin; i < end; ++i) {
				temp.push(this.store[key][i]);
			}
			return temp;
		}
	}

	rpop(key) {
		if (this.timedOut(key) == true) {
			return null;
		}
		if (key in this.store) {
			return this.store[key].pop();
			this.backup();
		}
	}

	lpop(key) {
		if (this.timedOut(key) == true) {
			return null;
		}
		if (key in this.store) {
			return this.store[key].shift();
			this.backup();
		}
	}
}

module.exports = OctoDB;
