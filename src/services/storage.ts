// Retrieve the application name from the environment variable VITE_APP_NAME
export const APP_NAME = import.meta.env.VITE_APP_NAME;

// Class for interacting with local storage
class LocalStorage {
  public get(key: string) {
    return localStorage.getItem(`${APP_NAME}:${key}`); // Retrieve item from local storage with a key prefixed by the application name
  }

  public set(key: string, value: string) {
    return localStorage.setItem(`${APP_NAME}:${key}`, value); // Set item in local storage with a key prefixed by the application name
  }

  public clear() {
    return localStorage.clear(); // Clear all items from local storage
  }
}

// Class for interacting with session storage
class SessionStorage {
  public get(key: string) {
    return sessionStorage.getItem(`${APP_NAME}:${key}`); // Retrieve item from session storage with a key prefixed by the application name
  }

  public set(key: string, value: string) {
    return sessionStorage.setItem(`${APP_NAME}:${key}`, value); // Set item in session storage with a key prefixed by the application name
  }

  public clear() {
    return sessionStorage.clear(); // Clear all items from session storage
  }
}

// Create instances of the storage classes
const local = new LocalStorage(); // Instance for local storage
const session = new SessionStorage(); // Instance for session storage

// Export the instances and classes
export { local, session, LocalStorage, SessionStorage };

