class EventBusClass {
  private events: Record<string, Array<(data: unknown) => void>> = {}

  // Use EventBus.on('event-name', callback) to listen to an event
  on(event: string, callback: (data: unknown) => void): void {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  // Use EventBus.off('event-name', callback) to remove a listener
  off(event: string, callback?: (data: unknown) => void): void {
    if (!this.events[event]) return

    if (!callback) {
      delete this.events[event]
    } else {
      this.events[event] = this.events[event].filter((cb) => cb !== callback)
    }
  }

  // Use EventBus.emit('event-name', data) to trigger an event
  emit(event: string, data: unknown): void {
    if (!this.events[event]) return

    this.events[event].forEach((callback) => callback(data))
  }
}

const EventBus = new EventBusClass()

export default EventBus
