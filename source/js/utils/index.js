
class EventEmmiter {
  constructor () {
    this._handlers = {};
  }

  on (event, hanler) {
    if (!Array.isArray(this._handlers[event])) {
      this._handlers[event] = [];
    }

    this._handlers[event].push(hanler);
  }

  off (event, hanler) {
    if (hanler && Array.isArray(this._handlers[event])) {
      this._handlers[event] = this._handlers[event].filter(h => h !== hanler);
      return;
    }

    this._handlers[event] = [];
  }

  emit (event, options = {}) {
    if (!Array.isArray(this._handlers[event])) {
      return;
    }

    this._handlers[event].forEach(h => h(options));
  }
}

export class WorkerManager extends EventEmmiter {
  constructor (entry, options = {}) {
    super();
    this._entry = entry;
    this._options = options;
    this._updateStatus = this._updateStatus.bind(this);

    window.addEventListener('online', this._updateStatus);
    window.addEventListener('offline', this._updateStatus);
  }

  register () {
    navigator.serviceWorker
      .register(this._entry)
      .then(result => {
        if (result.installing !== null) {
          result.installing.postMessage(this._options);
        }

        this._updateStatus();
      });
  }

  get status () {
    return this._status;
  }

  _updateStatus () {
    this._status = navigator.onLine;
    this.emit('status', { status: this._status });
  }
}
